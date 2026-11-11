import { z } from 'zod';
import { STATUS } from '@silembur/shared';
import { pool } from '../db/pool.js'; 
import { getLaporanTerverifikasi } from '../models/laporan/prioritas.js';
import { ubahStatus } from '../models/laporan/status.js';
import { hitungSkor } from '../models/skorPrioritas/skor.js';

export const skemaUbahStatus = z.object({
  status: z.enum([STATUS.DIPROSES, STATUS.SELESAI]),
  keterangan: z.string().trim().min(1, 'Keterangan penanganan wajib diisi').max(300),
});

/**
 * GET /api/prioritas?kategori=&wilayah=&status=
 */
export async function daftarPrioritas(req, res, next) {
  try {
    const { kategori, wilayah, status } = req.query;

    // Hitung ulang skor yang kadaluarsa (> 1 jam) - KF17
    const kadaluarsa = await pool.query(
      `SELECT id_laporan FROM skor_prioritas WHERE dihitung_pada < NOW() - INTERVAL '1 hour'`
    );
    for (const row of kadaluarsa.rows) {
      await hitungSkor(pool, row.id_laporan);
    }

    const data = await getLaporanTerverifikasi(pool, { kategori, wilayah, status });
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/laporan/:id/status
 */
export async function perbaruiStatus(req, res, next) {
  try {
    const idLaporan = parseInt(req.params.id, 10);
    const { status, keterangan } = skemaUbahStatus.parse(req.body);
    const idPengguna = req.pengguna.id;

    await withTransaction(async (db) => {
      await ubahStatus(db, {
        idLaporan,
        statusBaru: status,
        deskripsi: keterangan,
        idPengguna,
      });
    });

    // Ambil data laporan terbarui
    const laporanList = await getLaporanTerverifikasi(pool, { status });
    const laporan = laporanList.find((l) => l.id === idLaporan);

    res.json({ laporan });
  } catch (err) {
    next(err);
  }
}