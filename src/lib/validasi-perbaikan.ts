// DPPL C20 PerbaikanController.validasiForm (Algo-046), I06-04, I06-05, I06-08.
// Dipakai HasilPerbaikanForm (sebelum kirim) dan PerbaikanController (cek ulang di server).
import { formatDariNama, type MediaTerunggah } from "@/server/entities/Foto";

export const PESAN_TAK_LENGKAP = "Gagal terkirim: foto dan deskripsi wajib diisi.";

export type Kelengkapan = { catatanKosong: boolean; fotoKosong: boolean};

export function cekKelengkapan(catatan: string, foto: readonly unknown[]): Kelengkapan {
    return {catatanKosong: catatan.trim().length === 0, fotoKosong: foto.length === 0};
}

export function validasiForm(catatan: string, foto: readonly unknown[], video: readonly unknown[]): boolean {
  void video; 
  const { catatanKosong, fotoKosong } = cekKelengkapan(catatan, foto);
  return !catatanKosong && !fotoKosong;
}

// Pengecekan media yang diunggah
export function cekMediaTerunggah(
  foto: readonly MediaTerunggah[],
  video: readonly MediaTerunggah[],
  idUser: string,
): boolean {
  const sesuai = (m: MediaTerunggah, tipe: MediaTerunggah["tipe"]) =>
    m.tipe === tipe && formatDariNama(m.path) === m.format && m.path.startsWith(`hasil/${idUser}/`);
  return foto.every((m) => sesuai(m, "foto")) && video.every((m) => sesuai(m, "video"));
}