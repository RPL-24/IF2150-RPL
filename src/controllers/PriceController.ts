import { supabase } from '../services/supabase';
import { Produk } from '../models/Produk';
import { RiwayatHargaJual } from '../models/RiwayatHargaJual';
import { isAngkaPositif, PESAN_INPUT_TIDAK_VALID } from '../models/pesan';
import { hitungMargin } from './margin';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class PriceController {
  private currentProduk: Produk;
  private idProduk: string;

  constructor(currentProduk: Produk, idProduk: string) {
    this.currentProduk = currentProduk;
    this.idProduk = idProduk;
  }

  async validasiInput(hargaBaru: number): Promise<boolean> {
    if (!isAngkaPositif(hargaBaru)) {
      throw new ValidationError(PESAN_INPUT_TIDAK_VALID);
    }

    await this.updateHargaProduk(hargaBaru);
    return true;
  }

  async updateHargaProduk(hargaBaru: number): Promise<void> {
    const hargaLama = this.currentProduk.getHargaJual();

    const { data: resepData, error: resepError } = await supabase
      .from('tbl_resep_bahan')
      .select(`
        takaran,
        tbl_bahan_baku ( harga_beli )
      `)
      .eq('id_produk', this.idProduk);

    if (resepError) {
      throw new Error(`Gagal mengambil data resep: ${resepError.message}`);
    }

    let totalBiaya = 0;
    for (const item of (resepData || [])) {
      const bahan = Array.isArray(item.tbl_bahan_baku) ? item.tbl_bahan_baku[0] : item.tbl_bahan_baku;
      const hargaBeli = bahan?.harga_beli ?? 0;
      totalBiaya += Number(item.takaran) * Number(hargaBeli);
    }
    
    const hpp = totalBiaya / this.currentProduk.getHasilResep();
    const marginBaru = hitungMargin(hargaBaru, hpp);

    this.currentProduk.setHargaJual(hargaBaru);
    this.currentProduk.setMargin(marginBaru);

    const { error: updateError } = await supabase
      .from('tbl_produk')
      .update({
        harga_jual: hargaBaru,
        margin: marginBaru
      })
      .eq('id_produk', this.idProduk);

    if (updateError) {
      this.currentProduk.setHargaJual(hargaLama);
      throw new Error(`Gagal memperbarui harga jual: ${updateError.message}`);
    }

    await this.catatRiwayat(hargaLama, hargaBaru);
  }

  async catatRiwayat(hargaLama: number, hargaBaru: number): Promise<void> {
    const riwayat = new RiwayatHargaJual(hargaBaru);
    riwayat.setHargaJualLama(hargaLama);
    riwayat.setWaktuPerubahan(new Date());

    const { error } = await supabase
      .from('tbl_riwayat_harga_jual')
      .insert({
        id_produk: this.idProduk,
        harga_jual_lama: riwayat.getHargaJualLama(),
        harga_baru: riwayat.getHargaBaru(),
        waktu_perubahan: riwayat.getWaktuPerubahan().toISOString()
      });

    if (error) {
      throw new Error(`Gagal mencatat riwayat harga: ${error.message}`);
    }
  }
}