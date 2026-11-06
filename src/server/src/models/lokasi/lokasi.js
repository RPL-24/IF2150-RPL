/**
 * Model Lokasi (C05) — setLokasiLaporan(koordinat) & getWilayah() (Algo-006, Q-005, KF03).
 * Pemilik: P2.
 */
import { belumDiimplementasi } from '../../utils/http.js';

/**
 * Simpan lokasi laporan. Wilayah & alamat diambil dari googleMapsAdapter.getWilayahFromCoordinates().
 * @param {{ idLaporan: number, latitude: number, longitude: number, sumber: 'GPS'|'MANUAL' }} data
 * @returns {Promise<{ koordinat: string, wilayah: string, alamat: string }>}
 */
export async function setLokasiLaporan(db, { idLaporan, latitude, longitude, sumber }) {
  throw belumDiimplementasi('P2', 'Algo-006 / Q-005 setLokasiLaporan');
}
