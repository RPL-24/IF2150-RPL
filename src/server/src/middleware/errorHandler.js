/**
 * Penanganan error terpusat. Format respons error seragam (lihat src/docs/API.md):
 *   { "error": { "message": "...", "details": ... } }
 * Pemilik: P1.
 */
import multer from 'multer';
import { HttpError } from '../utils/http.js';

export function notFound(req, _res, next) {
  next(new HttpError(404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: { message: `Upload foto gagal: ${err.message}` } });
  }
  const status = err.status ?? 500;
  if (status >= 500 && status !== 501) console.error(err);
  return res.status(status).json({
    error: {
      message: status === 500 ? 'Terjadi kesalahan pada server' : err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    },
  });
}
