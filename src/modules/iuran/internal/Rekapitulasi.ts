// src/modules/iuran/internal/Rekapitulasi.ts
import { RincianTagihan } from './KalkulatorIuran';

export interface DataRekapitulasi {
  idPeriode: string;
  namaPeriode: string;
  tanggalDibuat: string;
  totalPendapatan: number;
  jumlahTagihan: number;
  daftarTagihan: RincianTagihan[];
}

export class Rekapitulasi {
  /**
   * Algo-022: Generate rekapitulasi dari daftar tagihan FINAL
   */
  static generate(
    idPeriode: string,
    namaPeriode: string,
    daftarTagihan: RincianTagihan[]
  ): DataRekapitulasi {
    const semuaFinal = daftarTagihan.every(
      (t) => t.status === 'FINAL' || t.status === 'LUNAS'
    );
    if (!semuaFinal || daftarTagihan.length === 0) {
      throw new Error('REKAP_HANYA_UNTUK_DATA_FINAL');
    }

    const totalPendapatan = daftarTagihan.reduce(
      (acc, curr) => acc + curr.totalTagihan,
      0
    );

    return {
      idPeriode,
      namaPeriode,
      tanggalDibuat: new Date().toISOString(),
      totalPendapatan,
      jumlahTagihan: daftarTagihan.length,
      daftarTagihan,
    };
  }

  static toCSV(rekap: DataRekapitulasi): string {
    const header = [
      'ID Warga',
      'ID Periode',
      'Air (m3)',
      'Listrik (kWh)',
      'Biaya Air (Rp)',
      'Biaya Listrik (Rp)',
      'Biaya Beban (Rp)',
      'Total Tagihan (Rp)',
      'Status',
    ].join(',');

    const rows = rekap.daftarTagihan.map((t) =>
      [
        t.idWarga,
        t.idPeriode,
        t.volumeAirM3,
        t.energiListrikKwh,
        t.biayaAir,
        t.biayaListrik,
        t.biayaBeban,
        t.totalTagihan,
        t.status,
      ].join(',')
    );

    return [header, ...rows].join('\n');
  }
}