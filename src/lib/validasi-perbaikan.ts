// DPPL C20 PerbaikanController.validasiForm (Algo-046), I06-04, I06-05, I06-08.
// Dipakai HasilPerbaikanForm (sebelum kirim) dan PerbaikanController (cek ulang di server).

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