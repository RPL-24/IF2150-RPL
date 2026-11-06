/**
 * Model Laporan — daftar terverifikasi berdasarkan prioritas (UC03, KF18, KF19, Algo-003, Algo-005, Q-004).
 * Pemilik: P5.
 * KNF02: Pemda TIDAK melihat identitas pelapor (gap G9).
 */
import { belumDiimplementasi } from '../../utils/http.js';

/**
 * getLaporanTerverifikasi() + filterLaporan(kategori, wilayah) + urutkanBerdasarkanPrioritas().
 * Status yang diambil: STATUS_PRIORITAS (Terverifikasi + Diproses, gap G10). Urut skor DESC.
 * @param {{ kategori?: string, wilayah?: string, status?: string }} filter
 */
export async function getLaporanTerverifikasi(db, filter) {
  throw belumDiimplementasi('P5', 'Algo-003 / Q-004 getLaporanTerverifikasi');
}
