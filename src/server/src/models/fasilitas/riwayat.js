import { PESAN } from '@silembur/shared';

/**
 * Cari fasilitas berdasarkan nama, lokasi, atau wilayah (ILIKE).
 */
export async function cariFasilitas(db, { keyword, hanyaBerulang }) {
  const conditions = [];
  const params = [];

  if (keyword && keyword.trim() !== '') {
    params.push(`%${keyword.trim()}%`);
    const idx = params.length;
    conditions.push(`(nama_fasilitas ILIKE $${idx} OR lokasi_fasilitas ILIKE $${idx} OR wilayah ILIKE $${idx})`);
  }

  if (hanyaBerulang) {
    conditions.push(`kandidat_evaluasi = true`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT 
      id_fasilitas AS id,
      nama_fasilitas AS nama,
      kategori,
      lokasi_fasilitas AS lokasi,
      latitude,
      longitude,
      wilayah,
      jumlah_kerusakan_berulang AS "jumlahKerusakanBerulang",
      kandidat_evaluasi AS "kandidatEvaluasi"
    FROM fasilitas
    ${whereClause}
    ORDER BY nama_fasilitas ASC;
  `;

  const { rows } = await db.query(query, params);

  let pesan;
  if (keyword && rows.length === 0) {
    pesan = PESAN.FASILITAS_TIDAK_DITEMUKAN;
  }

  return { data: rows, pesan };
}

/**
 * Mengambil detail fasilitas, laporan terkait, dan riwayat status (terbaru dulu, tanpa pelapor).
 */
export async function getDetailFasilitas(db, idFasilitas) {
  // 1. Data fasilitas
  const resFas = await db.query(
    `SELECT 
      id_fasilitas AS id,
      nama_fasilitas AS nama,
      kategori,
      lokasi_fasilitas AS lokasi,
      latitude,
      longitude,
      wilayah,
      jumlah_kerusakan_berulang AS "jumlahKerusakanBerulang",
      kandidat_evaluasi AS "kandidatEvaluasi"
     FROM fasilitas WHERE id_fasilitas = $1`,
    [idFasilitas]
  );
  if (resFas.rows.length === 0) return null;

  // 2. Laporan terkait
  const resLap = await db.query(
    `SELECT 
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
     JOIN fasilitas f ON l.id_fasilitas = f.id_fasilitas
     LEFT JOIN skor_prioritas sp ON l.id_laporan = sp.id_laporan
     WHERE l.id_fasilitas = $1
     ORDER BY l.tanggal_laporan DESC`,
    [idFasilitas]
  );

  // 3. Riwayat status gabungan semua laporan di fasilitas ini (KF23)
  const resRiw = await db.query(
    `SELECT 
      rs.id_riwayat AS id,
      rs.id_laporan AS "idLaporan",
      rs.status_lama AS "statusLama",
      rs.status_baru AS "statusBaru",
      rs.deskripsi_perubahan AS deskripsi,
      rs.tanggal_perubahan AS tanggal
     FROM riwayat_status rs
     JOIN laporan l ON rs.id_laporan = l.id_laporan
     WHERE l.id_fasilitas = $1
     ORDER BY rs.tanggal_perubahan DESC`,
    [idFasilitas]
  );

  return {
    fasilitas: resFas.rows[0],
    laporan: resLap.rows,
    riwayat: resRiw.rows,
  };
}