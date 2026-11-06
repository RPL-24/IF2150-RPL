/**
 * FasilitasController (DPPL Tabel 2.3): fasilitas kerusakan berulang (UC06), pencarian & riwayat (UC08).
 * Pemilik: P5. Kontrak: src/docs/API.md#uc06
 */
import { belumDiimplementasi } from '../utils/http.js';

/** GET /api/fasilitas?q=&berulang=true -> { data: Fasilitas[] } ; data kosong + pesan bila tidak ditemukan */
export async function daftarFasilitas() {
  throw belumDiimplementasi('P5', 'GET /api/fasilitas (cariFasilitas)');
}

/** GET /api/fasilitas/berulang?limit= -> { data: Fasilitas[] } */
export async function fasilitasBerulang() {
  throw belumDiimplementasi('P5', 'GET /api/fasilitas/berulang (KF14)');
}

/** GET /api/fasilitas/:id -> { fasilitas, laporan: LaporanPrioritas[], riwayat: Riwayat[] } */
export async function detailFasilitas() {
  throw belumDiimplementasi('P5', 'GET /api/fasilitas/:id (KF23)');
}
