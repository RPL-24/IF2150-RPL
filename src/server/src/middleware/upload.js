/**
 * Penerima file foto (multipart/form-data, field "foto"). File disimpan di memori,
 * lalu controller meneruskannya ke cloudStorageAdapter.simpanFoto().
 * Pemilik: P1.
 */
import multer from 'multer';
import { HttpError } from '../utils/http.js';

export const uploadFoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new HttpError(400, 'File harus berupa gambar'));
  },
}).single('foto');
