/**
 * Model Verifikasi (C07) — simpanVerifikasi, tahanLaporan, teruskanKePemerintah (Algo-002, Algo-008, Q-003).
 * Pemilik: P4.
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** Q-003: catat keputusan admin. @returns {Promise<number>} id_verifikasi */
export async function simpanVerifikasi(db, { idLaporan, idAdmin, keputusan, catatan }) {
  throw belumDiimplementasi('P4', 'Q-003 simpanVerifikasi');
}

/**
 * Algo-002 tetapkanKeputusan + Algo-008 teruskanKePemerintah, dalam satu transaksi:
 *   1. simpanVerifikasi
 *   2. ubahStatus sesuai KEPUTUSAN_KE_STATUS (Disetujui -> Terverifikasi, Ditolak, Revisi -> Perlu Revisi)
 *   3. jika Disetujui: buatSkorAwal (Q-008) lalu hitungSkor
 *   4. kirimNotifikasi ke pelapor berisi keputusan + catatan (KF07)
 * Laporan yang belum Terverifikasi otomatis "tertahan" karena tidak masuk STATUS_PRIORITAS (KF08).
 */
export async function tetapkanKeputusan(db, { idLaporan, idAdmin, keputusan, catatan }) {
  throw belumDiimplementasi('P4', 'Algo-002 / Algo-008 tetapkanKeputusan');
}
