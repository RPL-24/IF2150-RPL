/**
 * Model Notifikasi (C10) — kotak masuk pelapor: terimaNotifikasi() (I-02 O-0201).
 * Pemilik: P3.
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** Daftar notifikasi milik pelapor, terbaru dulu, beserta jumlah belum dibaca. */
export async function getNotifikasiPelapor(db, idPelapor) {
  throw belumDiimplementasi('P3', 'terimaNotifikasi / daftar notifikasi');
}

/** Tandai satu notifikasi milik pelapor sebagai dibaca. false jika bukan miliknya. */
export async function tandaiDibaca(db, { idNotifikasi, idPelapor }) {
  throw belumDiimplementasi('P3', 'tandaiDibaca notifikasi');
}
