/**
 * VerifikasiController (DPPL Tabel 2.3): keputusan verifikasi admin, notifikasi, pemicu skor prioritas.
 * Pemilik: P4. Kontrak: src/docs/API.md#uc02
 */
import { z } from 'zod';
import { KEPUTUSAN } from '@silembur/shared';
import { belumDiimplementasi } from '../utils/http.js';

/** Skema body POST /verifikasi. Catatan wajib untuk Ditolak & Revisi (KF05, gap G3). */
export const skemaKeputusan = z
  .object({
    keputusan: z.enum(Object.values(KEPUTUSAN)),
    catatan: z.string().trim().max(500).default(''),
  })
  .refine((v) => v.keputusan === KEPUTUSAN.DISETUJUI || v.catatan.length > 0, {
    message: 'Catatan alasan wajib diisi untuk keputusan Ditolak atau Revisi',
    path: ['catatan'],
  });

/** GET /api/admin/laporan?status=&q= -> { data: LaporanAdmin[] } */
export async function daftarLaporanAdmin() {
  throw belumDiimplementasi('P4', 'GET /api/admin/laporan (KF06)');
}

/** GET /api/admin/laporan/jumlah-baru -> { jumlah } */
export async function jumlahLaporanBaru() {
  throw belumDiimplementasi('P4', 'GET /api/admin/laporan/jumlah-baru');
}

/** GET /api/admin/laporan/:id -> { laporan: LaporanAdmin & { pratinjauSkor, riwayat } } */
export async function detailLaporanAdmin() {
  throw belumDiimplementasi('P4', 'GET /api/admin/laporan/:id (I-06)');
}

/** POST /api/admin/laporan/:id/verifikasi  body: { keputusan, catatan } -> { laporan, skor } */
export async function tetapkanKeputusan() {
  throw belumDiimplementasi('P4', 'POST /api/admin/laporan/:id/verifikasi (KF05, KF07, KF09, KF16)');
}
