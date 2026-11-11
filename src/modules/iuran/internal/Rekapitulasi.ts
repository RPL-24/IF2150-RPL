// src/modules/iuran/internal/Rekapitulasi.ts
// Kelas Perancangan: C28 (Rekapitulasi) - Algo-022
import type { BarisRekap, PeriodeDTO, RekapitulasiDTO, TagihanDTO } from "@/contracts";
import { bangunCsv, bangunPdf } from "../ekspor";

export interface TagihanDenganNama extends TagihanDTO {
  namaWarga?: string;
}

export class Rekapitulasi {
  /**
   * Algo-022: Buat RekapitulasiDTO dari daftar tagihan FINAL
   */
  static generate(
    idPeriode: string,
    daftarTagihan: TagihanDenganNama[],
    idRekap?: string,
  ): RekapitulasiDTO {
    if (daftarTagihan.length === 0) {
      throw new Error("REKAP_HANYA_UNTUK_DATA_FINAL");
    }

    const semuaFinal = daftarTagihan.every((t) => t.status === "FINAL");
    if (!semuaFinal) {
      throw new Error("REKAP_HANYA_UNTUK_DATA_FINAL");
    }

    const baris: BarisRekap[] = daftarTagihan.map((t) => ({
      idWarga: t.idWarga,
      namaWarga: t.namaWarga ?? `Warga #${t.idWarga}`,
      volumeAirM3: Number(t.rincian.volumeAirM3.toFixed(2)),
      energiKWh: Number(t.rincian.energiKWh.toFixed(2)),
      jumlahIuran: t.jumlahIuran,
    }));

    const totalPemakaianAir = Number(
      baris.reduce((sum, b) => sum + b.volumeAirM3, 0).toFixed(2),
    );
    const totalPemakaianEnergi = Number(
      baris.reduce((sum, b) => sum + b.energiKWh, 0).toFixed(2),
    );
    const totalIuran = baris.reduce((sum, b) => sum + b.jumlahIuran, 0);

    return {
      idRekap: idRekap ?? `rekap-${idPeriode}`,
      idPeriode,
      totalPemakaianAir,
      totalPemakaianEnergi,
      totalIuran,
      baris,
    };
  }

  /** Ekspor ke CSV: lihat ekspor.ts (BOM UTF-8, tanda kutip, dan nama berawalan = + - @ dinetralkan). */
  static toCSV(rekap: RekapitulasiDTO): string {
    return bangunCsv(rekap);
  }

  /** Ekspor ke PDF (jsPDF): tabel rata kanan, dan halaman baru otomatis untuk banyak warga. */
  static toPDFBuffer(rekap: RekapitulasiDTO, periode?: PeriodeDTO): Buffer {
    return Buffer.from(bangunPdf(rekap, periode));
  }
}
