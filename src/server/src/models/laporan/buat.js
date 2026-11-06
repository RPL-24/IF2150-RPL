/**
 * Model Laporan — pembuatan & revisi laporan (UC01, KF01-KF04, gap G7).
 * Pemilik: P2.
 */
import { belumDiimplementasi } from '../../utils/http.js';

/**
 * Algo-004 validasiIsianFormulir(foto, deskripsi, koordinat) -> Boolean.
 * Fungsi murni (tanpa DB) agar mudah diuji dan bisa dipakai juga di mobile.
 */
export function validasiIsianFormulir({ foto, deskripsi, koordinat, kategori }) {
  throw belumDiimplementasi('P2', 'Algo-004 validasiIsianFormulir');
}

/**
 * Algo-001 + Q-001: simpan laporan baru berstatus "Menunggu Verifikasi"
 * dan tambah pengguna.jumlah_laporan. Panggil di dalam transaksi.
 * @returns {Promise<number>} id_laporan baru
 */
export async function simpanLaporan(db, { idPelapor, idFasilitas, foto, deskripsi, kategori }) {
  throw belumDiimplementasi('P2', 'Algo-001 / Q-001 simpanLaporan');
}

/**
 * Revisi laporan berstatus "Perlu Revisi" milik pelapor, lalu kembalikan ke
 * "Menunggu Verifikasi" lewat ubahStatus().
 */
export async function revisiLaporan(db, { idLaporan, idPelapor, perubahan }) {
  throw belumDiimplementasi('P2', 'revisiLaporan (gap G7)');
}
