/**
 * Memvalidasi dan mem-parsing string koordinat "lat,lng" atau objek { lat, lng }.
 * Sesuai Algo-C02-03: lat berada pada [-90, 90] dan lng berada pada [-180, 180].
 * @param {string|{lat: number, lng: number}|null} loc
 * @returns {{lat: number, lng: number}|null}
 */
function parseCoordinates(loc) {
  if (!loc) return null;

  let lat;
  let lng;

  if (typeof loc === 'string') {
    const parts = loc.split(',').map((s) => s.trim());
    if (parts.length !== 2) return null;
    lat = Number(parts[0]);
    lng = Number(parts[1]);
  } else if (typeof loc === 'object' && loc.lat !== undefined && loc.lng !== undefined) {
    lat = Number(loc.lat);
    lng = Number(loc.lng);
  } else {
    return null;
  }

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
}

/**
 * Menghitung jarak antara lokasi pengguna dan fasilitas kesehatan dalam kilometer (km)
 * menggunakan Haversine Formula (Algo-C20-03).
 * Mengembalikan -1.0 jika salah satu koordinat tidak valid / NULL.
 * @param {string|{lat: number, lng: number}|null} userLoc
 * @param {string|{lat: number, lng: number}|null} faskesLoc
 * @returns {number}
 */
function calculateDistanceKm(userLoc, faskesLoc) {
  const coord1 = parseCoordinates(userLoc);
  const coord2 = parseCoordinates(faskesLoc);

  if (!coord1 || !coord2) {
    return -1.0;
  }

  const R = 6371; // Radius bumi dalam kilometer
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Bulatkan 2 angka di belakang koma
}

module.exports = {
  parseCoordinates,
  calculateDistanceKm,
};

