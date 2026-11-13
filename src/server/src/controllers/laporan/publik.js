/**
 * LaporanController (bagian UC04) — laporan publik tanpa identitas pelapor.
 * Pemilik: P3. Kontrak: src/docs/API.md#uc04
 */
import { pool } from '../../db/pool.js';
import { Laporan } from '../../models/index.js';
import { HttpError, paramId } from '../../utils/http.js';

/** GET /api/laporan/publik?status=&wilayah=&kategori= -> { data: LaporanPublik[] } */
export async function daftarPublik(req, res) {
  const data = await Laporan.getDaftarLaporanPublik(pool, {
    kelompok: req.query.kelompok ?? req.query.status,
    wilayah: req.query.wilayah,
    kategori: req.query.kategori,
    limit: req.query.limit,
    offset: req.query.offset,
  });
  res.json({ data });
}

/** GET /api/laporan/publik/:id -> { laporan: LaporanPublik } ; 404 bila tidak ada */
export async function detailPublik(req, res) {
  const id = paramId(req, 'id');
  const laporan = await Laporan.getDetailLaporanPublik(pool, id);
  if (!laporan) throw new HttpError(404, 'Laporan tidak ditemukan atau tidak dapat ditampilkan');
  res.json({ laporan });
}

/** GET /api/laporan/ringkasan -> { masuk, diproses, selesai } */
export async function ringkasan(_req, res) {
  const data = await Laporan.getRingkasanLaporan(pool);
  res.json(data);
}
