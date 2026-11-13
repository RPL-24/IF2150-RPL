// Bagian kelas Validasi untuk laporan (periksaLaporan, DPPL 5.38).
import type { FormLaporan, GalatKolom, HasilValidasi } from "@/contracts";

// Daftar jenis gangguan komunitas. Menjadi satu sumber untuk server dan pilihan di formulir I-05.
export const JENIS_GANGGUAN = [
  "Air tidak mengalir",
  "Kebocoran pipa",
  "Kualitas air",
  "Listrik padam",
  "Baterai atau panel surya",
  "Lainnya",
] as const;

const DESKRIPSI_MAKS = 1000;

export function periksaLaporan(data: unknown): HasilValidasi {
  const galat: GalatKolom[] = [];
  const isi = (typeof data === "object" && data !== null ? data : {}) as Partial<Record<keyof FormLaporan, unknown>>;

  const jenis = typeof isi.jenisGangguan === "string" ? isi.jenisGangguan.trim() : "";
  if (!jenis) galat.push({ kolom: "jenisGangguan", pesan: "Pilih jenis gangguan" });
  else if (!(JENIS_GANGGUAN as readonly string[]).includes(jenis)) {
    galat.push({ kolom: "jenisGangguan", pesan: "Jenis gangguan tidak dikenal" });
  }

  const deskripsi = typeof isi.deskripsi === "string" ? isi.deskripsi.trim() : "";
  if (!deskripsi) galat.push({ kolom: "deskripsi", pesan: "Deskripsi wajib diisi" });
  else if (deskripsi.length > DESKRIPSI_MAKS) {
    galat.push({ kolom: "deskripsi", pesan: `Deskripsi maksimal ${DESKRIPSI_MAKS} karakter` });
  }

  // Unggah foto belum tersedia, jadi URI dari klien ditolak agar tidak ada lokasi sembarang yang tersimpan.
  const foto = isi.fotoPendukung;
  if (foto !== undefined && !(Array.isArray(foto) && foto.length === 0)) {
    galat.push({ kolom: "fotoPendukung", pesan: "Unggah foto belum tersedia" });
  }

  return { valid: galat.length === 0, galat };
}
