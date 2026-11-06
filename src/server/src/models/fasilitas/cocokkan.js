/**
 * Model Fasilitas — menautkan laporan baru ke fasilitas (gap G1).
 * Pemilik: P2.
 *
 * Aturan: cari fasilitas dengan kategori yang sama dalam radius ATURAN.RADIUS_FASILITAS_METER
 * dari titik laporan. Jika ada, pakai yang terdekat. Jika tidak ada, buat fasilitas baru
 * (nama = "<kategori> - <alamat>").
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** @returns {Promise<{ idFasilitas: number, baru: boolean }>} */
export async function cariAtauBuatFasilitas(db, { kategori, latitude, longitude, wilayah, alamat }) {
  throw belumDiimplementasi('P2', 'cariAtauBuatFasilitas (gap G1)');
}
