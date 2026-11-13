/**
 * Model Lokasi (C05) — setLokasiLaporan(koordinat) & getWilayah() (Algo-006, Q-005, KF03).
 * Pemilik: P2.
 */
import { SUMBER_LOKASI } from '@silembur/shared';
import { getWilayahFromCoordinates } from '../../adapters/googleMapsAdapter.js';

/** Atribut `koordinat: String` DPPL C05, format "lat,lng". */
export function formatKoordinat(latitude, longitude) {
  return `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
}

/**
 * Simpan lokasi laporan. Wilayah & alamat diambil dari googleMapsAdapter.getWilayahFromCoordinates().
 * Bila pemanggil sudah memegang hasil geocoding (mis. controller yang juga butuh wilayah untuk
 * pencocokan fasilitas), kirim `wilayah` & `alamat` agar adapter tidak dipanggil dua kali.
 * Lokasi laporan 1:1, jadi pemanggilan ulang (revisi) memperbarui baris yang ada.
 * @param {{ idLaporan: number, latitude: number, longitude: number, sumber: 'GPS'|'MANUAL',
 *           wilayah?: string, alamat?: string }} data
 * @returns {Promise<{ koordinat: string, wilayah: string, alamat: string }>}
 */
export async function setLokasiLaporan(db, { idLaporan, latitude, longitude, sumber, wilayah, alamat }) {
  const koordinat = formatKoordinat(latitude, longitude);
  if (!wilayah) ({ wilayah, alamat } = await getWilayahFromCoordinates(latitude, longitude));

  // Q-005 (+ latitude/longitude/alamat/sumber untuk peta & KF03)
  await db.query(
    `INSERT INTO lokasi (id_laporan, koordinat, latitude, longitude, wilayah, alamat, sumber)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id_laporan) DO UPDATE
        SET koordinat = EXCLUDED.koordinat,
            latitude  = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            wilayah   = EXCLUDED.wilayah,
            alamat    = EXCLUDED.alamat,
            sumber    = EXCLUDED.sumber`,
    [idLaporan, koordinat, latitude, longitude, wilayah, alamat ?? null, sumber ?? SUMBER_LOKASI.GPS],
  );
  return { koordinat, wilayah, alamat: alamat ?? null };
}

/** getWilayah(): nama wilayah (kecamatan) lokasi laporan, null bila belum ada lokasi. */
export async function getWilayah(db, idLaporan) {
  const { rows } = await db.query('SELECT wilayah FROM lokasi WHERE id_laporan = $1', [idLaporan]);
  return rows[0]?.wilayah ?? null;
}
