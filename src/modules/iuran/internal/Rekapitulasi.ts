// src/modules/iuran/internal/Rekapitulasi.ts
// Kelas Perancangan: C28 (Rekapitulasi) - Algo-022
import type { BarisRekap, PeriodeDTO, RekapitulasiDTO, TagihanDTO } from "@/contracts";

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

  /**
   * Ekspor ke format CSV
   */
  static toCSV(rekap: RekapitulasiDTO): string {
    const header = [
      "ID Warga",
      "Nama Warga",
      "Volume Air (m3)",
      "Energi (kWh)",
      "Jumlah Iuran (Rp)",
    ].join(",");

    const rows = rekap.baris.map((b) =>
      [
        b.idWarga,
        `"${b.namaWarga.replace(/"/g, '""')}"`,
        b.volumeAirM3,
        b.energiKWh,
        b.jumlahIuran,
      ].join(","),
    );

    const footer = [
      "TOTAL",
      '""',
      rekap.totalPemakaianAir,
      rekap.totalPemakaianEnergi,
      rekap.totalIuran,
    ].join(",");

    return [header, ...rows, footer].join("\n");
  }

  /**
   * Ekspor ke PDF sederhana (valid PDF-1.4 buffer tanpa library eksternal berisiko)
   */
  static toPDFBuffer(rekap: RekapitulasiDTO, periode?: PeriodeDTO): Buffer {
    const judulPeriode = periode
      ? `Periode ${periode.bulan}/${periode.tahun}`
      : `Periode ${rekap.idPeriode}`;

    const lines = [
      `REKAPITULASI IURAN KOMUNAL - FAJAR TECH`,
      `${judulPeriode} (ID Rekap: ${rekap.idRekap})`,
      `----------------------------------------------------------------`,
      `ID Warga | Nama Warga           | Air (m3) | Energi (kWh) | Iuran (Rp)`,
      `----------------------------------------------------------------`,
      ...rekap.baris.map(
        (b) =>
          `${String(b.idWarga).padEnd(8)} | ${b.namaWarga.slice(0, 20).padEnd(20)} | ${String(b.volumeAirM3).padEnd(8)} | ${String(b.energiKWh).padEnd(12)} | Rp ${b.jumlahIuran.toLocaleString("id-ID")}`,
      ),
      `----------------------------------------------------------------`,
      `TOTAL AIR   : ${rekap.totalPemakaianAir} m3`,
      `TOTAL ENERGI: ${rekap.totalPemakaianEnergi} kWh`,
      `TOTAL IURAN : Rp ${rekap.totalIuran.toLocaleString("id-ID")}`,
    ];

    const escapePdf = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const textCommands = lines
      .map((line, idx) => `1 0 0 1 40 ${780 - idx * 16} Tm (${escapePdf(line)}) Tj`)
      .join("\n");

    const streamContent = `BT\n/F1 10 Tf\n${textCommands}\nET`;
    const pdf = [
      "%PDF-1.4",
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
      `4 0 obj << /Length ${streamContent.length} >> stream\n${streamContent}\nendstream endobj`,
      "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj",
      "xref",
      "0 6",
      "0000000000 65535 f ",
      "trailer << /Size 6 /Root 1 0 R >>",
      "startxref",
      "0",
      "%%EOF",
    ].join("\n");

    return Buffer.from(pdf, "utf-8");
  }
}