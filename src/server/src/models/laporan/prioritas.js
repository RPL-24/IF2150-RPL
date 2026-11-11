import { STATUS } from '@silembur/shared';

/**
 * Algo-003 / Q-004: Mengambil laporan terverifikasi & diproses urut skor DESC.
 * Tanpa identitas pelapor (KNF02 / gap G9).
 */
export async function getLaporanTerverifikasi(db, filter = {}) {
  const { kategori, wilayah, status } = filter;
  const params = [];
  const conditions = [];

  // Filter status: Terverifikasi / Diproses / Selesai (Default: Terverifikasi + Diproses)
  if (status) {
    params.push(status);
    conditions.push(`l.status_laporan = $${params.length}`);
  } else {
    conditions.push(`l.status_laporan IN ('${STATUS.TERVERIFIKASI}', '${STATUS.DIPROSES}')`);
  }

  if (kategori) {
    params.push(kategori);
    conditions.push(`l.kategori_kerusakan = $${params.length}`);
  }

  if (wilayah) {
    params.push(wilayah);
    conditions.push(`lok.wilayah = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT 
      l.id_laporan AS id,
      l.kategori_kerusakan AS kategori,
      l.deskripsi_laporan AS deskripsi,
      l.foto_laporan AS foto,
      l.status_laporan AS status,
      l.tanggal_laporan AS "tanggalLaporan",
      json_build_object(
        'latitude', lok.latitude,
        'longitude', lok.longitude,
        'wilayah', lok.wilayah,
        'alamat', lok.alamat
      ) AS lokasi,
      json_build_object(
        'id', f.id_fasilitas,
        'nama', f.nama_fasilitas
      ) AS fasilitas,
      CASE 
        WHEN sp.skor IS NOT NULL THEN json_build_object(
          'nilai', sp.skor,
          'jumlahPelapor', sp.jumlah_pelapor,
          'lamaMenunggu', sp.lama_menunggu,
          'frekuensiBerulang', sp.frekuensi_berulang
        )
        ELSE NULL
      END AS skor
    FROM laporan l
    JOIN lokasi lok ON l.id_laporan = lok.id_laporan
    LEFT JOIN fasilitas f ON l.id_fasilitas = f.id_fasilitas
    LEFT JOIN skor_prioritas sp ON l.id_laporan = sp.id_laporan
    ${whereClause}
    ORDER BY COALESCE(sp.skor, 0) DESC, l.tanggal_laporan ASC;
  `;

  const { rows } = await db.query(query, params);
  return rows;
}