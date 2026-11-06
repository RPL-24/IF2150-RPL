/**
 * NotifikasiController — kotak masuk notifikasi pelapor (I-02 O-0201, KF07 sisi penerima).
 * Pendukung LaporanController/VerifikasiController. Pemilik: P3. Kontrak: src/docs/API.md#notifikasi
 */
import { belumDiimplementasi } from '../utils/http.js';

/** GET /api/notifikasi -> { data: Notifikasi[], belumDibaca } */
export async function daftarNotifikasi() {
  throw belumDiimplementasi('P3', 'GET /api/notifikasi');
}

/** PATCH /api/notifikasi/:id/dibaca -> 204 */
export async function tandaiDibaca() {
  throw belumDiimplementasi('P3', 'PATCH /api/notifikasi/:id/dibaca');
}
