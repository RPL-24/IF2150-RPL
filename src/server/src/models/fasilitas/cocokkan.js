/**
 * Model Fasilitas — menautkan laporan baru ke fasilitas (gap G1).
 * Pemilik: P2.
 *
 * Aturan: cari fasilitas dengan kategori yang sama dalam radius ATURAN.RADIUS_FASILITAS_METER
 * dari titik laporan. Jika ada, pakai yang terdekat. Jika tidak ada, buat fasilitas baru
 * (nama = "<kategori> - <alamat>").
 */
import { ATURAN } from '@silembur/shared';
import { jarakMeter } from '../../adapters/googleMapsAdapter.js';

/** Setengah sisi kotak pencarian kandidat (derajat). 0,0005° ≈ 55 m, cukup untuk radius 30 m. */
const KOTAK_DERAJAT = 0.0005;

/** @returns {Promise<{ idFasilitas: number, baru: boolean }>} */
export async function cariAtauBuatFasilitas(db, { kategori, latitude, longitude, wilayah, alamat }) {
  // Saring kasar dengan kotak koordinat di SQL, lalu jarak sebenarnya (haversine) di sini.
  const { rows: kandidat } = await db.query(
    `SELECT id_fasilitas, latitude, longitude
       FROM fasilitas
      WHERE kategori = $1
        AND latitude BETWEEN $2 AND $3
        AND longitude BETWEEN $4 AND $5`,
    [kategori, latitude - KOTAK_DERAJAT, latitude + KOTAK_DERAJAT, longitude - KOTAK_DERAJAT, longitude + KOTAK_DERAJAT],
  );

  const titik = { lat: latitude, lng: longitude };
  let terdekat = null;
  for (const f of kandidat) {
    const jarak = jarakMeter(titik, { lat: f.latitude, lng: f.longitude });
    if (jarak <= ATURAN.RADIUS_FASILITAS_METER && (!terdekat || jarak < terdekat.jarak)) {
      terdekat = { idFasilitas: f.id_fasilitas, jarak };
    }
  }
  if (terdekat) return { idFasilitas: terdekat.idFasilitas, baru: false };

  const lokasiFasilitas = alamat || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  const { rows } = await db.query(
    `INSERT INTO fasilitas (nama_fasilitas, kategori, lokasi_fasilitas, latitude, longitude, wilayah)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id_fasilitas`,
    [`${kategori} - ${lokasiFasilitas}`, kategori, lokasiFasilitas, latitude, longitude, wilayah],
  );
  return { idFasilitas: rows[0].id_fasilitas, baru: true };
}
