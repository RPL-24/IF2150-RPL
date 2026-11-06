/**
 * ReferensiController — data referensi untuk dropdown/filter (wilayah, kategori, status).
 * Pemilik: P1 (sudah jadi di starter).
 */
import { SEMUA_KATEGORI, SEMUA_STATUS } from '@silembur/shared';
import { SEMUA_WILAYAH } from '../adapters/wilayahBandung.js';

/** GET /api/referensi -> { wilayah: string[], kategori: string[], status: string[] } */
export function referensi(_req, res) {
  res.json({ wilayah: SEMUA_WILAYAH, kategori: SEMUA_KATEGORI, status: SEMUA_STATUS });
}
