// Format tampilan dan berkas untuk modul iuran (rupiah, nama periode, angka desimal).
import type { PeriodeDTO } from "@/contracts";

const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const labelPeriode = (p: Pick<PeriodeDTO, "bulan" | "tahun">): string =>
  `${NAMA_BULAN[p.bulan - 1] ?? `Bulan ${p.bulan}`} ${p.tahun}`;

// 48000 -> "Rp48.000". Intl.NumberFormat dihindari karena spasi non-pecah dan ICU berbeda antarmesin.
export function formatRupiah(n: number): string {
  const bulat = Math.round(n);
  const teks = Math.abs(bulat)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${bulat < 0 ? "-" : ""}Rp${teks}`;
}

// 84 -> "84", 12.5 -> "12,5", maksimal dua desimal.
export function formatAngka(n: number): string {
  const r = Math.round(n * 100) / 100;
  return r.toString().replace(".", ",");
}

export const bulatkan2 = (n: number): number => Math.round(n * 100) / 100;

export const kodePeriodeBerkas = (p: Pick<PeriodeDTO, "bulan" | "tahun">): string =>
  `${p.tahun}-${String(p.bulan).padStart(2, "0")}`;
