/**
 * Format tampilan bersama. Pemilik: P3.
 */

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/** "24 Okt 2026, 14:32 WIB" */
export function formatTanggal(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const jam = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}, ${jam} WIB`;
}

/** "25 mnt lalu", "2 jam lalu", "Kemarin", "3 hari lalu" */
export function waktuRelatif(iso) {
  if (!iso) return '-';
  const detik = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (detik < 60) return 'Baru saja';
  if (detik < 3600) return `${Math.floor(detik / 60)} mnt lalu`;
  if (detik < 86400) return `${Math.floor(detik / 3600)} jam lalu`;
  const hari = Math.floor(detik / 86400);
  return hari === 1 ? 'Kemarin' : `${hari} hari lalu`;
}

/** Judul tampilan laporan (gap G12: tidak ada atribut judul, diturunkan dari kategori + alamat). */
export function judulLaporan({ kategori, alamat, wilayah }) {
  const tempat = alamat || (wilayah ? `Kec. ${wilayah}` : '');
  return tempat ? `${kategori} di ${tempat}` : kategori;
}

/** "#LPR-0012" */
export const kodeLaporan = (id) => `#LPR-${String(id).padStart(4, '0')}`;
