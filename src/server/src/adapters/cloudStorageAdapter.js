/**
 * CloudStorageAdapter (DPPL Tabel 2.3, integrasi eksternal): menyimpan foto laporan.
 * Pemilik: P1.
 *
 * Driver dipilih lewat STORAGE_DRIVER:
 *   - "local" (default): file ditulis ke UPLOAD_DIR, dilayani di /uploads/<kunci>. Tidak butuh akun.
 *   - "gcs": Google Cloud Storage (SKPL 2.4 butir 5). Wajib GCS_BUCKET + kredensial
 *     (GOOGLE_APPLICATION_CREDENTIALS = path file service account JSON, di luar repo).
 *     Bucket harus bisa dibaca publik (uniform access + allUsers: Storage Object Viewer)
 *     agar URL foto bisa dibuka aplikasi.
 *
 * Kontrak (dipakai P2):
 *   simpanFoto({ buffer, mimetype, originalname }) -> Promise<string>  // kunci/URL untuk kolom laporan.foto_laporan
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';

const EKSTENSI = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/heic': '.heic' };

export function buatKunci(mimetype) {
  const tanggal = new Date().toISOString().slice(0, 10);
  return `laporan/${tanggal}/${crypto.randomUUID()}${EKSTENSI[mimetype] ?? '.jpg'}`;
}

export function buatDriverLokal(uploadDir = config.uploadDir) {
  return {
    nama: 'local',
    async simpanFoto(file) {
      const kunci = buatKunci(file.mimetype);
      const tujuan = path.join(uploadDir, kunci);
      await fs.mkdir(path.dirname(tujuan), { recursive: true });
      await fs.writeFile(tujuan, file.buffer);
      return kunci;
    },
  };
}

/**
 * @param {{ bucket: string, storage?: object }} opsi  `storage` bisa disuntikkan untuk pengujian.
 */
export function buatDriverGcs({ bucket, storage } = {}) {
  if (!bucket) throw new Error('STORAGE_DRIVER=gcs membutuhkan GCS_BUCKET');
  let klien = storage;
  async function ambilBucket() {
    if (!klien) {
      const { Storage } = await import('@google-cloud/storage');
      klien = new Storage();
    }
    return klien.bucket(bucket);
  }
  return {
    nama: 'gcs',
    async simpanFoto(file) {
      const kunci = buatKunci(file.mimetype);
      const b = await ambilBucket();
      await b.file(kunci).save(file.buffer, {
        resumable: false,
        contentType: file.mimetype,
        metadata: { cacheControl: 'public, max-age=86400' },
      });
      return `https://storage.googleapis.com/${bucket}/${kunci}`;
    },
  };
}

export const cloudStorageAdapter =
  config.storageDriver === 'gcs' ? buatDriverGcs({ bucket: config.gcsBucket }) : buatDriverLokal();
