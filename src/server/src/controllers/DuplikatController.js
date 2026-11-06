/**
 * DuplikatController (DPPL Tabel 2.3): kandidat duplikat & penggabungan setelah dikonfirmasi admin (UC07).
 * Pemilik: P1. Kontrak: src/docs/API.md#uc07
 */
import { z } from 'zod';
import { pool, withTransaction } from '../db/pool.js';
import { KonfirmasiDuplikat } from '../models/index.js';

export const skemaGabung = z.object({
  idLaporan: z.array(z.number().int().positive()).min(2, 'Pilih minimal dua laporan untuk digabung'),
});

/** GET /api/admin/duplikat/kandidat -> { data: [{ fasilitas, kandidat, laporan: LaporanAdmin[] }] } */
export async function kandidatDuplikat(_req, res) {
  const data = await KonfirmasiDuplikat.getKandidatDuplikat(pool);
  res.json({ data });
}

/** POST /api/admin/duplikat/gabung  body: { idLaporan: number[] } -> { idLaporanInduk, digabung, skor } */
export async function gabungDuplikat(req, res) {
  const hasil = await withTransaction((db) =>
    KonfirmasiDuplikat.gabungLaporan(db, { idLaporanList: req.valid.body.idLaporan, idAdmin: req.pengguna.id }),
  );
  res.json(hasil);
}
