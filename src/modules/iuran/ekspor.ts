// Rekapitulasi.ekspor (DPPL 5.28): CSV (papaparse) dan PDF (jspdf) dari satu RekapitulasiDTO yang sama (KNF10).
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import type { FormatEkspor, PeriodeDTO, RekapitulasiDTO } from "@/contracts";
import { NAMA_KOMUNITAS } from "@/components/shell/menu";
import { formatAngka, formatRupiah, labelPeriode } from "./internal/format";

export const MIME: Record<FormatEkspor, string> = {
  CSV: "text/csv; charset=utf-8",
  PDF: "application/pdf",
};

// BOM supaya Excel membaca UTF-8; escapeFormulae mencegah nama warga seperti "=CMD()" dieksekusi sebagai rumus.
export function bangunCsv(rekap: RekapitulasiDTO): string {
  const baris = [
    ...rekap.baris.map((b) => [b.namaWarga, b.volumeAirM3, b.energiKWh, b.jumlahIuran]),
    ["Total", rekap.totalPemakaianAir, rekap.totalPemakaianEnergi, rekap.totalIuran],
  ];
  const teks = Papa.unparse(
    { fields: ["Warga", "Air (m3)", "Energi (kWh)", "Iuran (Rp)"], data: baris },
    { newline: "\r\n", escapeFormulae: true },
  );
  return `﻿${teks}`;
}


export function bangunPdf(rekap: RekapitulasiDTO, periode?: PeriodeDTO): Uint8Array {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const kiri = 20;
  const kanan = 190;
  const kolom = { air: 120, energi: 150, iuran: kanan };
  let y = 22;

  const judulTabel = () => {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("Warga", kiri, y);
    doc.text("Air (m3)", kolom.air, y, { align: "right" });
    doc.text("Energi (kWh)", kolom.energi, y, { align: "right" });
    doc.text("Iuran", kolom.iuran, y, { align: "right" });
    y += 2;
    doc.line(kiri, y, kanan, y);
    y += 6;
    doc.setFont("helvetica", "normal");
  };

  doc.setFont("helvetica", "bold").setFontSize(16).text("Rekap iuran komunitas", kiri, y);
  y += 8;
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text(`${NAMA_KOMUNITAS} - ${periode ? labelPeriode(periode) : `Periode ${rekap.idPeriode}`} - FINAL`, kiri, y);
  y += 12;
  judulTabel();

  doc.setFontSize(10);
  for (const b of rekap.baris) {
    if (y > 270) {
      doc.addPage();
      y = 22;
      judulTabel();
    }
    doc.text(b.namaWarga, kiri, y);
    doc.text(formatAngka(b.volumeAirM3), kolom.air, y, { align: "right" });
    doc.text(formatAngka(b.energiKWh), kolom.energi, y, { align: "right" });
    doc.text(formatRupiah(b.jumlahIuran), kolom.iuran, y, { align: "right" });
    y += 6;
  }

  if (y > 262) {
    doc.addPage();
    y = 22;
  }
  doc.line(kiri, y - 3, kanan, y - 3);
  doc.setFont("helvetica", "bold");
  doc.text(`Total (${rekap.baris.length} warga)`, kiri, y + 2);
  doc.text(formatAngka(rekap.totalPemakaianAir), kolom.air, y + 2, { align: "right" });
  doc.text(formatAngka(rekap.totalPemakaianEnergi), kolom.energi, y + 2, { align: "right" });
  doc.text(formatRupiah(rekap.totalIuran), kolom.iuran, y + 2, { align: "right" });

  return new Uint8Array(doc.output("arraybuffer"));
}
