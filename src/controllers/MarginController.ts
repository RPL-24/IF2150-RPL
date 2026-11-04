import { supabase } from '../services/supabase';
import { BahanBaku } from '../models/BahanBaku';
import { Produk } from '../models/Produk';
import { ResepBahan } from '../models/ResepBahan';
import { PESAN_INPUT_TIDAK_VALID, isAngkaPositif } from '../models/pesan';
import { ValidationError } from './AuthController';
import {
  BahanInput,
  escapeLike,
  hitungHpp,
  hitungMargin,
  kunciNama,
} from './margin';

export type { BahanInput } from './margin';

type BahanTersimpan = { idBahan: string; hargaBeli: number };

export class MarginController {
  private currentProduk: Produk | null = null;
  private currentResep: ResepBahan[] = [];

  private idProduk: string | null = null;
  private bahanPemilik: Map<string, BahanTersimpan> = new Map();

  getCurrentProduk(): Produk | null {
    return this.currentProduk;
  }

  async validasiNamaProduk(namaProduk: string, tag: string[]): Promise<boolean> {
    const nama = namaProduk.trim();
    if (nama === '') {
      throw new ValidationError('Nama produk tidak boleh kosong');
    }

    const idPemilik = await this.getIdPemilik();
    const { count, error } = await supabase
      .from('tbl_produk')
      .select('id_produk', { count: 'exact', head: true })
      .eq('id_pemilik', idPemilik)
      .ilike('nama_produk', escapeLike(nama));

    if (error) {
      throw new Error(error.message);
    }
    if ((count ?? 0) > 0) {
      throw new ValidationError('Nama Produk Sudah Pernah Dibuat');
    }

    const produk = new Produk();
    produk.setNamaProduk(nama);
    produk.setTag(tag);

    this.currentProduk = produk;
    this.currentResep = [];
    this.idProduk = null;
    return true;
  }

  async validasiInput(
    daftarBahan: BahanInput[],
    hargaJual: number,
  ): Promise<boolean> {
    if (this.currentProduk === null) {
      throw new ValidationError('Isi nama produk terlebih dahulu');
    }
    if (daftarBahan.length === 0) {
      throw new ValidationError('Minimal satu bahan baku harus diisi');
    }
    if (!isAngkaPositif(hargaJual)) {
      throw new ValidationError(PESAN_INPUT_TIDAK_VALID);
    }

    const sudahDipakai = new Set<string>();
    for (const bahan of daftarBahan) {
      if (bahan.namaBahan.trim() === '') {
        throw new ValidationError('Nama bahan baku tidak boleh kosong');
      }
      if (!isAngkaPositif(bahan.hargaBeli) || !isAngkaPositif(bahan.takaran)) {
        throw new ValidationError(PESAN_INPUT_TIDAK_VALID);
      }
      const kunci = kunciNama(bahan.namaBahan);
      if (sudahDipakai.has(kunci)) {
        throw new ValidationError('Bahan baku tidak boleh duplikat dalam satu resep');
      }
      sudahDipakai.add(kunci);
    }

    this.bahanPemilik = await this.muatBahanPemilik();

    const resep: ResepBahan[] = daftarBahan.map((bahan) => {
      const ada = this.bahanPemilik.get(kunciNama(bahan.namaBahan));
      const harga = ada ? ada.hargaBeli : bahan.hargaBeli;
      return new ResepBahan(new BahanBaku(bahan.namaBahan, harga), bahan.takaran);
    });

    const hpp = hitungHpp(
      resep.map((r) => ({
        hargaBeli: r.getBahan().getHargaBeli(),
        takaran: r.getTakaran(),
      })),
    );

    this.currentProduk.setHargaJual(hargaJual);
    this.currentProduk.setMargin(hitungMargin(hargaJual, hpp));
    this.currentResep = resep;

    await this.simpanProdukBaru();
    try {
      await this.simpanResep();
    } catch (e) {
      await this.batalkanProduk();
      throw e;
    }
    return true;
  }

  async simpanProdukBaru(): Promise<void> {
    if (this.currentProduk === null) {
      throw new ValidationError('Isi nama produk terlebih dahulu');
    }

    const { data, error } = await supabase
      .from('tbl_produk')
      .insert({
        nama_produk: this.currentProduk.getNamaProduk(),
        tag: this.currentProduk.getTag(),
        harga_jual: this.currentProduk.getHargaJual(),
        margin: this.currentProduk.getMargin(),
      })
      .select('id_produk')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ValidationError('Nama Produk Sudah Pernah Dibuat');
      }
      throw new Error(error.message);
    }
    this.idProduk = data.id_produk as string;
  }

  async simpanResep(): Promise<void> {
    if (this.idProduk === null) {
      throw new Error('Produk belum tersimpan');
    }

    const baris: { id_produk: string; id_bahan: string; takaran: number }[] = [];

    for (const resep of this.currentResep) {
      const bahan = resep.getBahan();
      const kunci = kunciNama(bahan.getNamaBahan());
      let idBahan = this.bahanPemilik.get(kunci)?.idBahan;

      if (idBahan === undefined) {
        const { data, error } = await supabase
          .from('tbl_bahan_baku')
          .insert({
            nama_bahan: bahan.getNamaBahan(),
            harga_beli: bahan.getHargaBeli(),
          })
          .select('id_bahan')
          .single();

        if (error) {
          throw new Error(error.message);
        }
        idBahan = data.id_bahan as string;
        this.bahanPemilik.set(kunci, {
          idBahan,
          hargaBeli: bahan.getHargaBeli(),
        });
      }

      baris.push({
        id_produk: this.idProduk,
        id_bahan: idBahan,
        takaran: resep.getTakaran(),
      });
    }

    const { error } = await supabase.from('tbl_resep_bahan').insert(baris);
    if (error) {
      throw new Error(error.message);
    }
  }

  private async getIdPemilik(): Promise<string> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw new ValidationError('Session pengguna tidak ditemukan');
    }
    return data.user.id;
  }

  private async muatBahanPemilik(): Promise<Map<string, BahanTersimpan>> {
    const { data, error } = await supabase
      .from('tbl_bahan_baku')
      .select('id_bahan, nama_bahan, harga_beli');

    if (error) {
      throw new Error(error.message);
    }

    const peta = new Map<string, BahanTersimpan>();
    for (const baris of data ?? []) {
      peta.set(kunciNama(baris.nama_bahan as string), {
        idBahan: baris.id_bahan as string,
        hargaBeli: Number(baris.harga_beli),
      });
    }
    return peta;
  }

  private async batalkanProduk(): Promise<void> {
    if (this.idProduk === null) return;
    await supabase.from('tbl_produk').delete().eq('id_produk', this.idProduk);
    this.idProduk = null;
  }
}
