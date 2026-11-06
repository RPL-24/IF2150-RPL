/**
 * Model Notifikasi (C10) — kirimNotifikasi (Algo-011, Q-012, KF07).
 * Pemilik: P4. (Membaca/menandai dibaca ada di notifikasi/inbox.js milik P3.)
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** Simpan notifikasi untuk pelapor. Tidak mengirim jika isiPesan kosong (Algo-011). */
export async function kirimNotifikasi(db, { idLaporan, idPelapor, isiPesan }) {
  throw belumDiimplementasi('P4', 'Algo-011 / Q-012 kirimNotifikasi');
}
