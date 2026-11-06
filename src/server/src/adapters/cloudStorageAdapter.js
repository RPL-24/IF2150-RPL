/**
 * CloudStorageAdapter (DPPL Tabel 2.3, integrasi eksternal): menyimpan foto laporan.
 * Pemilik: P1.
 *
 * Driver dipilih lewat STORAGE_DRIVER:
 *   - "local" (default): file ditulis ke UPLOAD_DIR, dilayani di /uploads/<kunci>. Tidak butuh akun.
 *   - "gcs": Google Cloud Storage (SKPL 2.4 butir 5). Wajib GCS_BUCKET + kredensial.
 *
 * Kontrak (dipakai P2):
 *   simpanFoto({ buffer, mimetype, originalname }) -> Promise<string>  // kunci/URL untuk kolom laporan.foto_laporan
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';
import { belumDiimplementasi } from '../utils/http.js';

const EKSTENSI = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/heic': '.heic' };

function buatKunci(mimetype) {
  const tanggal = new Date().toISOString().slice(0, 10);
  return `laporan/${tanggal}/${crypto.randomUUID()}${EKSTENSI[mimetype] ?? '.jpg'}`;
}

const lokal = {
  async simpanFoto(file) {
    const kunci = buatKunci(file.mimetype);
    const tujuan = path.join(config.uploadDir, kunci);
    await fs.mkdir(path.dirname(tujuan), { recursive: true });
    await fs.writeFile(tujuan, file.buffer);
    return kunci;
  },
};

const gcs = {
  // TODO(P1): implementasi dengan @google-cloud/storage (npm i -w server @google-cloud/storage),
  // unggah ke config.gcsBucket lalu kembalikan URL publik https://storage.googleapis.com/<bucket>/<kunci>.
  async simpanFoto() {
    throw belumDiimplementasi('P1', 'CloudStorageAdapter driver gcs');
  },
};

export const cloudStorageAdapter = config.storageDriver === 'gcs' ? gcs : lokal;
