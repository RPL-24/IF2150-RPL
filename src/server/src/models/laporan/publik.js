/**
 * Model Laporan — tampilan publik tanpa identitas pelapor (UC04, KF10, KF11, KNF02).
 * Pemilik: P3.
 *
 * ATURAN KNF02: query di file ini TIDAK BOLEH memilih kolom pengguna (nama/email/id_pelapor),
 * dan respons wajib lewat toLaporanPublik(). Ada test yang memeriksa ini.
 */
import { belumDiimplementasi } from '../../utils/http.js';

/**
 * Daftar laporan publik (status di STATUS_PUBLIK), terbaru dulu.
 * @param {{ status?: string, wilayah?: string, kategori?: string, limit?: number, offset?: number }} filter
 */
export async function getDaftarLaporanPublik(db, filter) {
  throw belumDiimplementasi('P3', 'getDaftarLaporanPublik (KF10)');
}

/** Detail satu laporan publik: foto, lokasi, deskripsi, status (KF11). null jika tidak ada/tidak publik. */
export async function getDetailLaporanPublik(db, idLaporan) {
  throw belumDiimplementasi('P3', 'getDetailLaporan publik (KF11)');
}

/** Ringkasan jumlah laporan per kelompok status untuk kartu I-02 (O-0202). */
export async function getRingkasanLaporan(db) {
  throw belumDiimplementasi('P3', 'getRingkasanLaporan (I-02 O-0202)');
}

/** DTO publik: hanya field yang aman ditampilkan. Bentuk lihat src/docs/API.md#laporanpublik */
export function toLaporanPublik(row) {
  throw belumDiimplementasi('P3', 'toLaporanPublik (KNF02)');
}
