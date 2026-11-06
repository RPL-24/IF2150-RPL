/**
 * Model Fasilitas — pencarian & riwayat per fasilitas (UC08, KF22, KF23).
 * Pemilik: P5.
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** cariFasilitas(keyword): cari berdasarkan nama/lokasi/wilayah. Tanpa keyword = semua yang punya riwayat. */
export async function cariFasilitas(db, { keyword, hanyaBerulang }) {
  throw belumDiimplementasi('P5', 'cariFasilitas(keyword)');
}

/**
 * getDetailFasilitas() + getLaporan() + riwayat semua laporan pada fasilitas (urut terbaru).
 * Tanpa identitas pelapor (gap G9). null jika tidak ada.
 */
export async function getDetailFasilitas(db, idFasilitas) {
  throw belumDiimplementasi('P5', 'getDetailFasilitas + riwayat (KF23)');
}
