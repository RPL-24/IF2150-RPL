// C04 · Foto (kelas entity DPPL). Pemilik: Peran F.
// Nama fungsi mengikuti nama operasi di DPPL.
// Fungsi murni: JANGAN impor lib/supabase/* di file ini (dipakai juga di client).
// Baris foto/video disimpan oleh RPC kirim_laporan / kirim_hasil_perbaikan (satu transaksi dengan induknya).

import { FORMAT_FOTO, MAX_FILE_SIZE } from "@/lib/constants";

/** Cukup `File` dari input, atau objek {name, size}. MIME (`type`) sengaja tidak dipakai: sering kosong (mis. .mkv). */
export type Berkas = { name: string; size: number };

/** Media yang sudah ter-upload ke bucket `media`, siap disimpan sebagai baris `foto`/`video`. */
export type MediaTerunggah = { path: string; format: string; ukuran: number; tipe: "foto" | "video" };

/** Ekstensi huruf kecil tanpa titik; '.jpeg' dinormalkan ke 'jpg'. String kosong jika tanpa ekstensi. */
export function formatDariNama(nama: string): string {
  const titik = nama.lastIndexOf(".");
  const ext = titik < 0 ? "" : nama.slice(titik + 1).toLowerCase();
  return ext === "jpeg" ? "jpg" : ext;
}

/** URL publik berkas di bucket `media` (bucket public, lihat migration storage_media). */
export function urlMedia(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}

export function ukuranValid(ukuran: number): boolean {
  return ukuran > 0 && ukuran <= MAX_FILE_SIZE;
}

/** Algo-009: format JPG/PNG dan ukuran ≤ 10 MB. Ukuran 0 juga ditolak (CHECK ukuran > 0 di tabel). */
export function isFotoValid(berkas: Berkas): boolean {
  return Object.hasOwn(FORMAT_FOTO, formatDariNama(berkas.name)) && ukuranValid(berkas.size);
}
