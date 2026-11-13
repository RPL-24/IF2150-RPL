/**
 * Model Laporan — laporan milik pelapor + riwayatnya (UC05, KF12, KF13, KF24).
 * Pemilik: P3.
 */
import { urlFoto } from '../../utils/http.js';

function toLaporanSaya(row) {
  return {
    id: row.id_laporan,
    kategori: row.kategori_kerusakan,
    deskripsi: row.deskripsi_laporan,
    foto: urlFoto(row.foto_laporan),
    status: row.status_laporan,
    tanggalLaporan: row.tanggal_laporan,
    lokasi: row.latitude == null ? null : {
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      wilayah: row.wilayah,
      alamat: row.alamat,
    },
    fasilitas: row.id_fasilitas ? { id: row.id_fasilitas, nama: row.nama_fasilitas } : null,
    diperbaruiPada: row.diperbarui_pada,
    catatanVerifikasi: row.keputusan
      ? { keputusan: row.keputusan, catatan: row.catatan_alasan, waktu: row.waktu_verifikasi }
      : null,
  };
}

/** Daftar laporan milik idPelapor (semua status), terbaru dulu. */
export async function getDaftarLaporanSaya(db, idPelapor) {
  const { rows } = await db.query(
    `SELECT l.id_laporan, l.foto_laporan, l.deskripsi_laporan, l.kategori_kerusakan, l.status_laporan,
            l.tanggal_laporan, l.diperbarui_pada, lo.latitude, lo.longitude, lo.wilayah, lo.alamat,
            f.id_fasilitas, f.nama_fasilitas,
            v.keputusan, v.catatan_alasan, v.waktu_verifikasi
     FROM laporan l
     LEFT JOIN lokasi lo ON lo.id_laporan = l.id_laporan
     LEFT JOIN fasilitas f ON f.id_fasilitas = l.id_fasilitas
     LEFT JOIN (
       SELECT DISTINCT ON (id_laporan) id_laporan, keputusan, catatan_alasan, waktu_verifikasi
       FROM verifikasi
       ORDER BY id_laporan, waktu_verifikasi DESC
     ) v ON v.id_laporan = l.id_laporan
     WHERE l.id_pelapor = $1
     ORDER BY l.tanggal_laporan DESC, l.id_laporan DESC`,
    [idPelapor],
  );

  return rows.map(toLaporanSaya);
}

/**
 * Detail laporan milik idPelapor + catatan verifikasi terakhir + riwayat (urut terawal -> terakhir).
 * null jika laporan bukan milik pelapor tersebut.
 */
export async function getDetailLaporanSaya(db, { idLaporan, idPelapor }) {
  const { rows } = await db.query(
    `SELECT l.id_laporan, l.foto_laporan, l.deskripsi_laporan, l.kategori_kerusakan, l.status_laporan,
            l.tanggal_laporan, l.diperbarui_pada, lo.latitude, lo.longitude, lo.wilayah, lo.alamat,
            f.id_fasilitas, f.nama_fasilitas,
            v.keputusan, v.catatan_alasan, v.waktu_verifikasi
     FROM laporan l
     LEFT JOIN lokasi lo ON lo.id_laporan = l.id_laporan
     LEFT JOIN fasilitas f ON f.id_fasilitas = l.id_fasilitas
     LEFT JOIN (
       SELECT DISTINCT ON (id_laporan) id_laporan, keputusan, catatan_alasan, waktu_verifikasi
       FROM verifikasi
       ORDER BY id_laporan, waktu_verifikasi DESC
     ) v ON v.id_laporan = l.id_laporan
     WHERE l.id_laporan = $1 AND l.id_pelapor = $2`,
    [idLaporan, idPelapor],
  );

  if (!rows[0]) return null;

  const riwayat = await db.query(
    `SELECT id_riwayat, status_lama, status_baru, deskripsi_perubahan, tanggal_perubahan
     FROM riwayat_status
     WHERE id_laporan = $1
     ORDER BY tanggal_perubahan ASC, id_riwayat ASC`,
    [idLaporan],
  );

  return {
    ...toLaporanSaya(rows[0]),
    riwayat: riwayat.rows.map((r) => ({
      id: r.id_riwayat,
      statusLama: r.status_lama,
      statusBaru: r.status_baru,
      deskripsi: r.deskripsi_perubahan,
      tanggal: r.tanggal_perubahan,
    })),
  };
}
