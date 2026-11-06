/**
 * DuplikatController (DPPL Tabel 2.3): kandidat duplikat & penggabungan setelah dikonfirmasi admin (UC07).
 * Pemilik: P1. Kontrak: src/docs/API.md#uc07
 */
import { z } from 'zod';
import { belumDiimplementasi } from '../utils/http.js';

export const skemaGabung = z.object({
  idLaporan: z.array(z.number().int().positive()).min(2, 'Pilih minimal dua laporan untuk digabung'),
});

/** GET /api/admin/duplikat/kandidat -> { data: [{ fasilitas, laporan: LaporanAdmin[] }] } */
export async function kandidatDuplikat() {
  throw belumDiimplementasi('P1', 'GET /api/admin/duplikat/kandidat (KF20, KF21)');
}

/** POST /api/admin/duplikat/gabung  body: { idLaporan: number[] } -> { idLaporanInduk, digabung, skor } */
export async function gabungDuplikat() {
  throw belumDiimplementasi('P1', 'POST /api/admin/duplikat/gabung (KF15, KF17)');
}
