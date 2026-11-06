/**
 * PrioritasController (DPPL Tabel 2.3): daftar laporan terverifikasi berdasarkan skor & filter (UC03),
 * plus pembaruan status penanganan oleh pemda (gap G8).
 * Pemilik: P5. Kontrak: src/docs/API.md#uc03
 */
import { z } from 'zod';
import { STATUS } from '@silembur/shared';
import { belumDiimplementasi } from '../utils/http.js';

export const skemaUbahStatus = z.object({
  status: z.enum([STATUS.DIPROSES, STATUS.SELESAI]),
  keterangan: z.string().trim().min(1, 'Keterangan penanganan wajib diisi').max(300),
});

/** GET /api/prioritas?kategori=&wilayah=&status= -> { data: LaporanPrioritas[] } (urut skor DESC) */
export async function daftarPrioritas() {
  throw belumDiimplementasi('P5', 'GET /api/prioritas (KF18, KF19)');
}

/** PATCH /api/laporan/:id/status  body: { status: 'Diproses'|'Selesai', keterangan } -> { laporan } */
export async function perbaruiStatus() {
  throw belumDiimplementasi('P5', 'PATCH /api/laporan/:id/status (KF12, KF22)');
}
