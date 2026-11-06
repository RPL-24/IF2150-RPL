/**
 * GoogleMapsAdapter sisi server (DPPL Tabel 2.3): mengubah koordinat menjadi wilayah & alamat
 * (dipakai Lokasi.setLokasiLaporan, Algo-006). Peta interaktif ada di sisi mobile
 * (mobile/src/components/map).
 * Pemilik: P1.
 *
 * Mode:
 *   - GOOGLE_MAPS_API_KEY terisi -> Google Geocoding API (TODO P1).
 *   - kosong (default)          -> offline: kecamatan Bandung terdekat (wilayahBandung.js).
 *
 * Kontrak (dipakai P2, P5):
 *   getWilayahFromCoordinates(lat, lng) -> Promise<{ wilayah: string, alamat: string }>
 *   jarakMeter(a, b) -> number   // haversine, a/b = { lat, lng }
 */
import { config } from '../config.js';
import { KECAMATAN_BANDUNG } from './wilayahBandung.js';

const RADIUS_BUMI_M = 6_371_000;
const BATAS_KOTA_M = 12_000;

export function jarakMeter(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * RADIUS_BUMI_M * Math.asin(Math.sqrt(h));
}

function wilayahOffline(lat, lng) {
  let terdekat = KECAMATAN_BANDUNG[0];
  let min = Infinity;
  for (const k of KECAMATAN_BANDUNG) {
    const d = jarakMeter({ lat, lng }, k);
    if (d < min) {
      min = d;
      terdekat = k;
    }
  }
  if (min > BATAS_KOTA_M) return { wilayah: 'Luar Kota Bandung', alamat: `${lat.toFixed(5)}, ${lng.toFixed(5)}` };
  return { wilayah: terdekat.nama, alamat: `Kec. ${terdekat.nama}, Kota Bandung` };
}

// TODO(P1): panggil https://maps.googleapis.com/maps/api/geocode/json?latlng=..&key=..&language=id
// ambil administrative_area_level_3 (kecamatan) sebagai wilayah dan formatted_address sebagai alamat.
// Jika gagal / di luar kuota, jatuh kembali ke wilayahOffline().
async function wilayahGoogle(lat, lng) {
  return wilayahOffline(lat, lng);
}

export async function getWilayahFromCoordinates(lat, lng) {
  return config.googleMapsApiKey ? wilayahGoogle(lat, lng) : wilayahOffline(lat, lng);
}
