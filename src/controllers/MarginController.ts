import { supabase } from '../services/supabase';
import { BahanBaku } from '../models/BahanBaku';
import { Produk } from '../models/Produk';
import { ResepBahan } from '../models/ResepBahan';
import {
  PESAN_HASIL_RESEP_TIDAK_VALID,
  PESAN_INPUT_TIDAK_VALID,
  PESAN_NAMA_BAHAN_WAJIB,
  PESAN_NAMA_PRODUK_WAJIB,
  PESAN_SATUAN_WAJIB,
  PESAN_TAKARAN_TIDAK_VALID,
  isAngkaPositif,
  isBilanganBulatPositif,
} from '../models/pesan';
import { ValidationError } from './AuthController';
import {
  BahanInput,
  escapeLike,
  hitungHpp,
  hitungMargin,
  hitungPersenMargin,
  hitungTotalBiaya,
  kunciNama,
} from './margin';

export type { BahanInput } from './margin';

export type BahanTersimpan = {
  idBahan: string;
  namaBahan: string;
  hargaBeli: number;
  satuan: string;
};

export type ProdukInput = {
  namaProduk: string;
  tag: string[];
  hargaJual: number;
  hasilResep: number;
  bahan: BahanInput[];
};

export type PreviewMargin = {
  namaProduk: string;
  hasilResep: number;
  totalBiaya: number;
  hpp: number;
  hargaJual: number;
  margin: number;
  persenMargin: number;
};

export class MarginController {
  private currentProduk: Produk | null = null;
  private currentResep: ResepBahan[] = [];
  private idProduk: string | null = null;
  private bahanPemilik: Map<string, BahanTersimpan> = new Map();

  getCurrentProduk(): Produk | null {
    return this.currentProduk;
  }

  async getDaftarBahan(): Promise<BahanTersimpan[]> {
    const peta = await this.muatBahanPemilik();
    return [...peta.values()].sort((a, b) =>
      a.namaBahan.localeCompare(b.namaBahan),
    );
  }

  async validasiNamaProduk(namaProduk: string, tag: string[]): Promise<boolean> {
    const nama = namaProduk.trim();
    if (nama === '') {
      throw new ValidationError(PESAN_NAMA_PRODUK_WAJIB);
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

  async validasiInput(input: ProdukInput): Promise<PreviewMargin> {
    await this.validasiNamaProduk(input.namaProduk, input.tag);
    const produk = this.currentProduk as Produk;

    if (!isAngkaPositif(input.hargaJual)) {
      throw new ValidationError(PESAN_INPUT_TIDAK_VALID);
    }
    if (!isBilanganBulatPositif(input.hasilResep)) {
      throw new ValidationError(PESAN_HASIL_RESEP_TIDAK_VALID);
    }
    if (input.bahan.length === 0) {
      throw new ValidationError('Minimal satu bahan baku harus diisi');
    }

    this.bahanPemilik = await this.muatBahanPemilik();
    const semuaBahan = [...this.bahanPemilik.values()];
    const sudahDipakai = new Set<string>();
    const resep: ResepBahan[] = [];

    for (const item of input.bahan) {
      if (!isAngkaPositif(item.takaran)) {
        throw new ValidationError(PESAN_TAKARAN_TIDAK_VALID);
      }

      let bahan: BahanBaku;

      if (item.idBahan) {
        const ada = semuaBahan.find((b) => b.idBahan === item.idBahan);
        if (!ada) {
          throw new ValidationError('Bahan baku tidak ditemukan');
        }
        bahan = new BahanBaku(ada.namaBahan, ada.hargaBeli, ada.satuan);
      } else {
        if (item.namaBahan.trim() === '') {
          throw new ValidationError(PESAN_NAMA_BAHAN_WAJIB);
        }
        if (this.bahanPemilik.has(kunciNama(item.namaBahan))) {
          throw new ValidationError(
            `Bahan baku "${item.namaBahan.trim()}" sudah ada, pilih dari daftar`,
          );
        }
        if (!isAngkaPositif(item.hargaBeli)) {
          throw new ValidationError(PESAN_INPUT_TIDAK_VALID);
        }
        if (item.satuan.trim() === '') {
          throw new ValidationError(PESAN_SATUAN_WAJIB);
        }
        bahan = new BahanBaku(item.namaBahan, item.hargaBeli, item.satuan);
      }

      const kunci = kunciNama(bahan.getNamaBahan());
      if (sudahDipakai.has(kunci)) {
        throw new ValidationError('Bahan baku tidak boleh duplikat dalam satu resep');
      }
      sudahDipakai.add(kunci);
      resep.push(new ResepBahan(bahan, item.takaran));
    }

    const dataBiaya = resep.map((r) => ({
      hargaBeli: r.getBahan().getHargaBeli(),
      takaran: r.getTakaran(),
    }));
    const totalBiaya = hitungTotalBiaya(dataBiaya);
    const hpp = hitungHpp(dataBiaya, input.hasilResep);
    const margin = hitungMargin(input.hargaJual, hpp);

    produk.setHargaJual(input.hargaJual);
    produk.setHasilResep(input.hasilResep);
    produk.setMargin(margin);
    this.currentResep = resep;

    return {
      namaProduk: produk.getNamaProduk(),
      hasilResep: input.hasilResep,
      totalBiaya,
      hpp,
      hargaJual: input.hargaJual,
      margin,
      persenMargin: hitungPersenMargin(input.hargaJual, margin),
    };
  }

  async simpanProduk(): Promise<void> {
    if (this.currentProduk === null || this.currentResep.length === 0) {
      throw new ValidationError('Hitung preview margin terlebih dahulu');
    }
    await this.simpanProdukBaru();
    try {
      await this.simpanResep();
    } catch (e) {
      await this.batalkanProduk();
      throw e;
    }
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
        hasil_resep: this.currentProduk.getHasilResep(),
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
            satuan: bahan.getSatuan(),
          })
          .select('id_bahan')
          .single();

        if (error) {
          throw new Error(error.message);
        }
        idBahan = data.id_bahan as string;
        this.bahanPemilik.set(kunci, {
          idBahan,
          namaBahan: bahan.getNamaBahan(),
          hargaBeli: bahan.getHargaBeli(),
          satuan: bahan.getSatuan(),
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
      .select('id_bahan, nama_bahan, harga_beli, satuan');

    if (error) {
      throw new Error(error.message);
    }

    const peta = new Map<string, BahanTersimpan>();
    for (const baris of data ?? []) {
      peta.set(kunciNama(baris.nama_bahan as string), {
        idBahan: baris.id_bahan as string,
        namaBahan: baris.nama_bahan as string,
        hargaBeli: Number(baris.harga_beli),
        satuan: baris.satuan as string,
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
