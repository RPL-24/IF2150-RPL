import pool from '../db/pool.js';
import { getFasilitasBerulang } from '../models/fasilitas/berulang.js';
import { cariFasilitas, getDetailFasilitas } from '../models/fasilitas/riwayat.js';
import { HttpError } from '../utils/http.js';

/**
 * GET /api/fasilitas?q=&berulang=
 */
export async function daftarFasilitas(req, res, next) {
  try {
    const { q, berulang } = req.query;
    const result = await cariFasilitas(pool, {
      keyword: q,
      hanyaBerulang: berulang === 'true',
    });

    const payload = { data: result.data };
    if (result.pesan) payload.pesan = result.pesan;

    res.json(payload);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/fasilitas/berulang?limit=
 */
export async function fasilitasBerulang(req, res, next) {
  try {
    const { limit } = req.query;
    const data = await getFasilitasBerulang(pool, { limit });
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/fasilitas/:id
 */
export async function detailFasilitas(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await getDetailFasilitas(pool, id);

    if (!result) {
      throw new HttpError(404, `Fasilitas #${id} tidak ditemukan`);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}