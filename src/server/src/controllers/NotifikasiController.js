/**
 * NotifikasiController — kotak masuk notifikasi pelapor (I-02 O-0201, KF07 sisi penerima).
 * Pendukung LaporanController/VerifikasiController. Pemilik: P3. Kontrak: src/docs/API.md#notifikasi
 */
import { pool } from '../db/pool.js';
import { Notifikasi } from '../models/index.js';
import { HttpError } from '../utils/http.js';

/** GET /api/notifikasi -> { data: Notifikasi[], belumDibaca } */
export async function daftarNotifikasi(req, res) {
  const data = await Notifikasi.getNotifikasiPelapor(pool, req.pengguna.id);
  const belumDibaca = data.filter((n) => !n.dibaca).length;
  res.json({ data, belumDibaca });
}

/** PATCH /api/notifikasi/:id/dibaca -> 204 */
export async function tandaiDibaca(req, res) {
  const ok = await Notifikasi.tandaiDibaca(pool, {
    idNotifikasi: Number(req.params.id),
    idPelapor: req.pengguna.id,
  });
  if (!ok) throw new HttpError(404, 'Notifikasi tidak ditemukan atau bukan milik Anda');
  res.status(204).send();
}
