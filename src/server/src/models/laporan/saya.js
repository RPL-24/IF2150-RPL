/**
 * Model Laporan — laporan milik pelapor + riwayatnya (UC05, KF12, KF13, KF24).
 * Pemilik: P3.
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** Daftar laporan milik idPelapor (semua status), terbaru dulu. */
export async function getDaftarLaporanSaya(db, idPelapor) {
  throw belumDiimplementasi('P3', 'getDaftarLaporanSaya (UC05)');
}

/**
 * Detail laporan milik idPelapor + catatan verifikasi terakhir + riwayat (urut terawal -> terakhir).
 * null jika laporan bukan milik pelapor tersebut.
 */
export async function getDetailLaporanSaya(db, { idLaporan, idPelapor }) {
  throw belumDiimplementasi('P3', 'getDetailLaporanSaya + getRiwayatStatus (KF24)');
}
