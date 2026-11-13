/**
 * Model Laporan — tampilan publik tanpa identitas pelapor (UC04, KF10, KF11, KNF02).
 * Pemilik: P3.
 *
 * ATURAN KNF02: query di file ini TIDAK BOLEH memilih kolom pengguna (nama/email/id_pelapor),
 * dan respons wajib lewat toLaporanPublik(). Ada test yang memeriksa ini.
 */
import { STATUS, STATUS_PUBLIK } from '@silembur/shared';
import { urlFoto } from '../../utils/http.js';

/**
 * Daftar laporan publik (status di STATUS_PUBLIK), terbaru dulu.
 * @param {{ status?: string, wilayah?: string, kategori?: string, limit?: number, offset?: number }} filter
 */
export async function getDaftarLaporanPublik(db, filter = {}) {
  const params = [];
  const clauses = [`l.status_laporan = ANY($${params.length + 1})`];
  params.push(STATUS_PUBLIK);

  const kelompok = filter.kelompok ?? filter.status;
  if (kelompok) {
    const mapped = {
      menunggu: [STATUS.MENUNGGU_VERIFIKASI],
      diproses: [STATUS.TERVERIFIKASI, STATUS.DIPROSES],
      selesai: [STATUS.SELESAI],
    }[String(kelompok).toLowerCase()];

    if (mapped) {
      clauses.push(`l.status_laporan = ANY($${params.length + 1})`);
      params.push(mapped);
    }
  }

  if (filter.wilayah) {
    clauses.push(`lo.wilayah = $${params.length + 1}`);
    params.push(filter.wilayah);
  }

  if (filter.kategori) {
    clauses.push(`l.kategori_kerusakan = $${params.length + 1}`);
    params.push(filter.kategori);
  }

  const limit = Number(filter.limit ?? 20);
  const offset = Number(filter.offset ?? 0);

  const { rows } = await db.query(
    `SELECT l.id_laporan, l.foto_laporan, l.deskripsi_laporan, l.kategori_kerusakan, l.status_laporan,
            l.tanggal_laporan, lo.latitude, lo.longitude, lo.wilayah, lo.alamat,
            f.id_fasilitas, f.nama_fasilitas
     FROM laporan l
     LEFT JOIN lokasi lo ON lo.id_laporan = l.id_laporan
     LEFT JOIN fasilitas f ON f.id_fasilitas = l.id_fasilitas
     WHERE ${clauses.join(' AND ')}
     ORDER BY l.tanggal_laporan DESC, l.id_laporan DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset],
  );

  return rows.map(toLaporanPublik);
}

/** Detail satu laporan publik: foto, lokasi, deskripsi, status (KF11). null jika tidak ada/tidak publik. */
export async function getDetailLaporanPublik(db, idLaporan) {
  const { rows } = await db.query(
    `SELECT l.id_laporan, l.foto_laporan, l.deskripsi_laporan, l.kategori_kerusakan, l.status_laporan,
            l.tanggal_laporan, lo.latitude, lo.longitude, lo.wilayah, lo.alamat,
            f.id_fasilitas, f.nama_fasilitas
     FROM laporan l
     LEFT JOIN lokasi lo ON lo.id_laporan = l.id_laporan
     LEFT JOIN fasilitas f ON f.id_fasilitas = l.id_fasilitas
     WHERE l.id_laporan = $1 AND l.status_laporan = ANY($2)`,
    [idLaporan, STATUS_PUBLIK],
  );

  return rows[0] ? toLaporanPublik(rows[0]) : null;
}

/** Ringkasan jumlah laporan per kelompok status untuk kartu I-02 (O-0202). */
export async function getRingkasanLaporan(db) {
  const { rows } = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE tanggal_laporan >= date_trunc('month', NOW())) AS masuk,
       COUNT(*) FILTER (WHERE status_laporan IN ('Terverifikasi', 'Diproses')) AS diproses,
       COUNT(*) FILTER (WHERE status_laporan = 'Selesai') AS selesai
     FROM laporan`,
  );

  const row = rows[0] ?? {};
  return {
    masuk: Number(row.masuk ?? 0),
    diproses: Number(row.diproses ?? 0),
    selesai: Number(row.selesai ?? 0),
  };
}

/** DTO publik: hanya field yang aman ditampilkan. Bentuk lihat src/docs/API.md#laporanpublik */
export function toLaporanPublik(row) {
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
  };
}
