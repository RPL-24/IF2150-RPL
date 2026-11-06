/**
 * Komponen pendukung "Validasi" (DPPL Tabel 2.3): memeriksa kelengkapan & format input
 * sebelum diproses controller. Memakai skema zod.
 * Pemilik: P1.
 *
 *   import { z } from 'zod';
 *   const skema = z.object({ keputusan: z.enum([...]), catatan: z.string() });
 *   router.post('/x', validasi(skema), handler)          // body (default)
 *   router.get('/y', validasi(skemaQuery, 'query'), h)   // query string
 *
 * Hasil yang sudah dibersihkan disimpan ke req.valid[sumber], mis. req.valid.body.
 */
import { HttpError } from '../utils/http.js';

export function validasi(skema, sumber = 'body') {
  return (req, _res, next) => {
    try {
      req.valid = { ...(req.valid ?? {}), [sumber]: periksa(skema, req[sumber] ?? {}) };
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

/**
 * Versi fungsi biasa, untuk dipakai DI DALAM controller (mis. setelah multer membaca multipart)
 * sehingga pemilik fitur tidak perlu mengubah routes/index.js:
 *   const data = periksa(skemaBuatLaporan, req.body);
 */
export function periksa(skema, data) {
  const hasil = skema.safeParse(data);
  if (!hasil.success) {
    const details = hasil.error.issues.map((i) => ({ field: i.path.join('.'), pesan: i.message }));
    throw new HttpError(400, 'Data yang dikirim belum lengkap atau tidak valid', details);
  }
  return hasil.data;
}
