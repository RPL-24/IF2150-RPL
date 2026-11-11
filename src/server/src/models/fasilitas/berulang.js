import { ATURAN } from '@silembur/shared';

export async function getJumlahLaporan(db, idFasilitas) {
  if (!idFasilitas) return 0;
  const { rows } = await db.query(
    `SELECT COUNT(*) AS jumlah FROM laporan
      WHERE id_fasilitas = $1
        AND tanggal_laporan >= NOW() - make_interval(days => $2)
        AND status_laporan NOT IN ('Ditolak', 'Digabung')`,
    [idFasilitas, ATURAN.PERIODE_BERULANG_HARI],
  );
  const jumlah = parseInt(rows[0].jumlah, 10);
  await db.query(
    `UPDATE fasilitas SET jumlah_kerusakan_berulang = $1, kandidat_evaluasi = $2 WHERE id_fasilitas = $3`,
    [jumlah, jumlah >= ATURAN.AMBANG_BERULANG, idFasilitas],
  );
  return jumlah;
}

/**
 * Mengambil fasilitas kandidat evaluasi (fasilitas berulang).
 */
export async function getFasilitasBerulang(db, opsi = {}) {
  const limit = opsi.limit ? parseInt(opsi.limit, 10) : null;
  const params = [];
  let limitClause = '';

  if (limit) {
    params.push(limit);
    limitClause = `LIMIT $1`;
  }

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
    WHERE kandidat_evaluasi = true
    ORDER BY jumlah_kerusakan_berulang DESC, id_fasilitas ASC
    ${limitClause};
  `;

  const { rows } = await db.query(query, params);
  return rows;
}