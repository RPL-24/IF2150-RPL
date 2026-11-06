/**
 * LaporanController (bagian UC04) — laporan publik tanpa identitas pelapor.
 * Pemilik: P3. Kontrak: src/docs/API.md#uc04
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** GET /api/laporan/publik?status=&wilayah=&kategori= -> { data: LaporanPublik[] } */
export async function daftarPublik() {
  throw belumDiimplementasi('P3', 'GET /api/laporan/publik (KF10)');
}

/** GET /api/laporan/publik/:id -> { laporan: LaporanPublik } ; 404 bila tidak ada */
export async function detailPublik() {
  throw belumDiimplementasi('P3', 'GET /api/laporan/publik/:id (KF11)');
}

/** GET /api/laporan/ringkasan -> { masuk, diproses, selesai } */
export async function ringkasan() {
  throw belumDiimplementasi('P3', 'GET /api/laporan/ringkasan');
}
