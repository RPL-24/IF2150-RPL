import { supabase } from '../services/supabase';
import { RiwayatHargaJual } from '../models/RiwayatHargaJual';
import { ValidationError } from './AuthController';

export type ChartDataPoint = {
  waktu: Date;
  harga: number;
};

export class PriceHistoryController {
  private idProduk: string;
  private currentHargaJual: number;

  constructor(idProduk: string, currentHargaJual: number) {
    this.idProduk = idProduk;
    this.currentHargaJual = currentHargaJual;
  }

  async getRiwayatHarga(): Promise<RiwayatHargaJual[]> {
    const { data, error } = await supabase
      .from('tbl_riwayat_harga_jual')
      .select('harga_jual_lama, harga_baru, waktu_perubahan')
      .eq('id_produk', this.idProduk)
      .order('waktu_perubahan', { ascending: true });

    if (error) {
      throw new Error(`Gagal mengambil riwayat harga jual: ${error.message}`);
    }

    const daftar: RiwayatHargaJual[] = [];
    for (const row of data || []) {
      const riwayat = new RiwayatHargaJual(Number(row.harga_baru));
      riwayat.setHargaJualLama(Number(row.harga_jual_lama));
      riwayat.setWaktuPerubahan(new Date(row.waktu_perubahan));
      daftar.push(riwayat);
    }
    
    return daftar;
  }

  filterDataByDate(
    daftarRiwayat: RiwayatHargaJual[],
    tanggalMulai: Date,
    tanggalAkhir: Date
  ): RiwayatHargaJual[] {
    return daftarRiwayat.filter((riwayat) => {
      const waktu = riwayat.getWaktuPerubahan().getTime();
      return waktu >= tanggalMulai.getTime() && waktu <= tanggalAkhir.getTime();
    });
  }

  async generateChartData(rentangHari: number): Promise<ChartDataPoint[]> {
    const tanggalAkhir = new Date();
    const tanggalMulai = new Date();
    tanggalMulai.setDate(tanggalAkhir.getDate() - rentangHari);

    const semuaRiwayat = await this.getRiwayatHarga();
    const terfilter = this.filterDataByDate(semuaRiwayat, tanggalMulai, tanggalAkhir);

    if (terfilter.length === 0) {
      throw new ValidationError("Belum ada riwayat harga pada rentang waktu ini");
    }

    const dataGrafik: ChartDataPoint[] = terfilter.map((riwayat) => ({
      waktu: riwayat.getWaktuPerubahan(),
      harga: riwayat.getHargaJualLama(),
    }));

    dataGrafik.push({
      waktu: tanggalAkhir,
      harga: this.currentHargaJual,
    });

    return dataGrafik;
  }
}