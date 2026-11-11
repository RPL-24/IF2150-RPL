import { pool } from '../db/pool.js';
import { getFasilitasBerulang } from '../models/fasilitas/berulang.js';
import { cariFasilitas } from '../models/fasilitas/riwayat.js';
import { HttpError } from '../utils/http.js';

/**
 * GET /api/fasilitas?q=&berulang=
 */
export async function daftarFasilitas(req, res, next) {
  try {
    const { q } = req.query;
    const fasilitas = await cariFasilitas(pool, { q });

    return res.json({
      status: 'ok',
      data: Array.isArray(fasilitas) ? fasilitas : (fasilitas?.rows || [])
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/fasilitas/berulang?limit=
 */
export async function fasilitasBerulang(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 5;
    const data = await getFasilitasBerulang(pool, { limit });
    res.json({ status: 'ok', data });
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