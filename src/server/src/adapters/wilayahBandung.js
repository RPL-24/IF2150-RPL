/**
 * Data fallback offline: titik tengah perkiraan 30 kecamatan Kota Bandung.
 * Dipakai googleMapsAdapter bila GOOGLE_MAPS_API_KEY kosong. Koordinat bersifat perkiraan
 * dan cukup untuk menentukan "wilayah" (kecamatan terdekat) pada filter KF19/UC04.
 */
export const KECAMATAN_BANDUNG = Object.freeze([
  { nama: 'Andir', lat: -6.9128, lng: 107.5795 },
  { nama: 'Antapani', lat: -6.9152, lng: 107.6612 },
  { nama: 'Arcamanik', lat: -6.9142, lng: 107.6765 },
  { nama: 'Astanaanyar', lat: -6.9306, lng: 107.6011 },
  { nama: 'Babakan Ciparay', lat: -6.9405, lng: 107.5712 },
  { nama: 'Bandung Kidul', lat: -6.9576, lng: 107.6317 },
  { nama: 'Bandung Kulon', lat: -6.9283, lng: 107.5617 },
  { nama: 'Bandung Wetan', lat: -6.9024, lng: 107.6174 },
  { nama: 'Batununggal', lat: -6.9345, lng: 107.6352 },
  { nama: 'Bojongloa Kaler', lat: -6.9318, lng: 107.5878 },
  { nama: 'Bojongloa Kidul', lat: -6.9497, lng: 107.5946 },
  { nama: 'Buahbatu', lat: -6.9488, lng: 107.6558 },
  { nama: 'Cibeunying Kaler', lat: -6.8898, lng: 107.6349 },
  { nama: 'Cibeunying Kidul', lat: -6.9049, lng: 107.6453 },
  { nama: 'Cibiru', lat: -6.9205, lng: 107.7214 },
  { nama: 'Cicendo', lat: -6.9053, lng: 107.5852 },
  { nama: 'Cidadap', lat: -6.8652, lng: 107.6048 },
  { nama: 'Cinambo', lat: -6.9254, lng: 107.6893 },
  { nama: 'Coblong', lat: -6.8892, lng: 107.6146 },
  { nama: 'Gedebage', lat: -6.9446, lng: 107.6998 },
  { nama: 'Kiaracondong', lat: -6.9248, lng: 107.6497 },
  { nama: 'Lengkong', lat: -6.9302, lng: 107.6248 },
  { nama: 'Mandalajati', lat: -6.9003, lng: 107.6698 },
  { nama: 'Panyileukan', lat: -6.9301, lng: 107.7049 },
  { nama: 'Rancasari', lat: -6.9502, lng: 107.6801 },
  { nama: 'Regol', lat: -6.9398, lng: 107.6151 },
  { nama: 'Sukajadi', lat: -6.8881, lng: 107.5961 },
  { nama: 'Sukasari', lat: -6.8702, lng: 107.5849 },
  { nama: 'Sumur Bandung', lat: -6.9151, lng: 107.6152 },
  { nama: 'Ujungberung', lat: -6.9102, lng: 107.7002 },
]);

export const SEMUA_WILAYAH = Object.freeze(KECAMATAN_BANDUNG.map((k) => k.nama));
