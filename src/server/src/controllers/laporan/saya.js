/**
 * LaporanController (bagian UC05) — laporan milik pelapor + riwayat penanganan.
 * Pemilik: P3. Kontrak: src/docs/API.md#uc05
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** GET /api/laporan/saya -> { data: LaporanSaya[] } */
export async function daftarSaya() {
  throw belumDiimplementasi('P3', 'GET /api/laporan/saya (UC05)');
}

/** GET /api/laporan/saya/:id -> { laporan: LaporanSaya & { riwayat, catatanVerifikasi } } ; 404 bila bukan miliknya */
export async function detailSaya() {
  throw belumDiimplementasi('P3', 'GET /api/laporan/saya/:id (KF13, KF24)');
}
