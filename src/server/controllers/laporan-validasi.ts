// Validasi input UC01 untuk LaporanController
// Dipisah dari LaporanController.ts karena file 'use server' hanya boleh mengekspor fungsi async.
// berisi aturan untuk menilai apakah data laporan sah. Semua fungsinya murni: hanya menerima input tanpa supabase
// lalu mengembalikan null kalau valid atau pesan error kalau tidak valid

import { KATEGORI } from "@/lib/constants";
import { PESAN_BERKAS_TIDAK_VALID } from "@/lib/media";
import { formatDariNama, isFotoValid, type MediaTerunggah } from "@/server/entities/Foto";
import { dalamWilayah } from "@/server/entities/Lokasi";
import { isVideoValid } from "@/server/entities/Video";

export const PESAN_FORM_TIDAK_LENGKAP = "Lengkapi kategori, deskripsi, lokasi, dan berkas bukti";
export const PESAN_ANTIBOT_BELUM = "Selesaikan verifikasi keamanan terlebih dahulu";
export const PESAN_ANTIBOT_GAGAL = "Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.";
export const PESAN_DI_LUAR_WILAYAH = "Lokasi di luar daerah penanganan. Pilih titik di dalam batas kota.";

/** validasiForm: kategori harus salah satu nilai enum, deskripsi tidak boleh kosong. */
export function validasiForm(kategori: string, deskripsi: string): string | null {
  if (!Object.hasOwn(KATEGORI, kategori)) return PESAN_FORM_TIDAK_LENGKAP;
  if (typeof deskripsi !== "string" || deskripsi.trim() === "") return PESAN_FORM_TIDAK_LENGKAP;
  return null;
}

/** validasiLokasi (Algo-020): koordinat harus angka dan berada di dalam batas kota. */
export function validasiLokasi(latitude: number, longitude: number): string | null {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return PESAN_FORM_TIDAK_LENGKAP;
  if (!dalamWilayah({ latitude, longitude })) return PESAN_DI_LUAR_WILAYAH;
  return null;
}

/**
 * validasiBerkas (Algo-019), dicek ulang di server karena data dari client bisa dimanipulasi:
 * minimal satu berkas, format & ukuran sesuai tipe, dan path harus di folder milik pelapor sendiri.
 */
export function validasiBerkas(media: MediaTerunggah[], idUser: string): string | null {
  if (!Array.isArray(media) || media.length === 0) return PESAN_FORM_TIDAK_LENGKAP;
  const semuaValid = media.every((m) => {
    const berkas = { name: m.path, size: m.ukuran };
    const sesuaiTipe = m.tipe === "foto" ? isFotoValid(berkas) : m.tipe === "video" && isVideoValid(berkas);
    const formatCocok = formatDariNama(m.path) === m.format;
    const milikSendiri = m.path.startsWith(`laporan/${idUser}/`);
    return sesuaiTipe && formatCocok && milikSendiri;
  });
  return semuaValid ? null : PESAN_BERKAS_TIDAK_VALID;
}