/**
 * Model RiwayatStatus (C09) — membaca riwayat perubahan status.
 * Menulis riwayat dilakukan oleh ubahStatus()/catatRiwayat() di models/laporan/status.js.
 * Pemilik: P3 (getRiwayatStatus untuk UC05). P5 membaca riwayat per fasilitas di models/fasilitas/riwayat.js.
 */

/** Laporan.getRiwayatStatus(): semua riwayat satu laporan, urut tanggal_perubahan naik. */
export async function getRiwayatStatus(db, idLaporan) {
  const { rows } = await db.query(
    `SELECT id_riwayat, status_lama, status_baru, deskripsi_perubahan, tanggal_perubahan
     FROM riwayat_status
     WHERE id_laporan = $1
     ORDER BY tanggal_perubahan ASC, id_riwayat ASC`,
    [idLaporan],
  );

  return rows.map((r) => ({
    id: r.id_riwayat,
    statusLama: r.status_lama,
    statusBaru: r.status_baru,
    deskripsi: r.deskripsi_perubahan,
    tanggal: r.tanggal_perubahan,
  }));
}

/** Algo-010 / Q-011 getPerubahan(): satu entri riwayat, null jika tidak ada. */
export async function getPerubahan(db, idRiwayat) {
  const { rows } = await db.query(
    `SELECT id_riwayat, id_laporan, status_lama, status_baru, deskripsi_perubahan, tanggal_perubahan
     FROM riwayat_status WHERE id_riwayat = $1`,
    [idRiwayat],
  );

  return rows[0] ?? null;
}
