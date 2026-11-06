// Validasi.periksaPemeliharaan (Tabel 5.39.1) untuk formulir UC08.
// Masukan berasal dari body JSON, jadi tipe setiap kolom diperiksa saat runtime.
import type { GalatKolom, HasilValidasi } from "@/contracts";

const POLA_WAKTU_ISO = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

const KOLOM_TEKS = [
  ["idPerangkat", "Pilih perangkat"],
  ["tindakan", "Isi tindakan"],
  ["catatanHasil", "Isi hasil pemeliharaan"],
] as const;

function teksTerisi(nilai: unknown): boolean {
  return typeof nilai === "string" && nilai.trim() !== "";
}

// Menolak waktu tanpa zona dan tanggal mustahil seperti 31 Februari.
export function waktuIsoValid(nilai: unknown): boolean {
  if (typeof nilai !== "string") return false;
  const cocok = POLA_WAKTU_ISO.exec(nilai);
  if (!cocok || Number.isNaN(Date.parse(nilai))) return false;
  const [tahun, bulan, hari] = cocok.slice(1, 4).map(Number);
  const tanggal = new Date(Date.UTC(tahun, bulan - 1, hari));
  return tanggal.getUTCMonth() === bulan - 1 && tanggal.getUTCDate() === hari;
}

export function periksaPemeliharaan(data: unknown): HasilValidasi {
  const isian = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;
  const galat: GalatKolom[] = [];

  for (const [kolom, pesan] of KOLOM_TEKS) {
    if (!teksTerisi(isian[kolom])) galat.push({ kolom, pesan });
  }
  if (!waktuIsoValid(isian.waktuPelaksanaan)) {
    galat.push({ kolom: "waktuPelaksanaan", pesan: "Isi waktu pemeliharaan yang valid" });
  }

  return { valid: galat.length === 0, galat };
}
