/**
 * Model Laporan — sisi admin untuk verifikasi (UC02, KF06).
 * Pemilik: P4.
 * Admin BOLEH melihat identitas pelapor (dibutuhkan untuk verifikasi & notifikasi).
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** getLaporanMenungguVerifikasi(): daftar laporan per status (default "Menunggu Verifikasi"), terlama dulu. */
export async function getLaporanUntukAdmin(db, { status, keyword }) {
  throw belumDiimplementasi('P4', 'getLaporanMenungguVerifikasi (KF06)');
}

/** Detail lengkap untuk I-06, termasuk pratinjau skor (hitungNilaiSkor) dan riwayat verifikasi. */
export async function getDetailLaporanAdmin(db, idLaporan) {
  throw belumDiimplementasi('P4', 'getDetailLaporan admin (I-06)');
}

/** Jumlah laporan "Menunggu Verifikasi" untuk badge notifikasi admin (UC02 langkah 1). */
export async function hitungLaporanBaru(db) {
  throw belumDiimplementasi('P4', 'hitungLaporanBaru (badge admin)');
}
