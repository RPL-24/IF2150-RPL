/**
 * Model Laporan — operasi inti perubahan status (DPPL C04 updateStatus(status), Q-002)
 * sekaligus pencatatan RiwayatStatus (KF12, KF22).
 * Pemilik: P1 (fungsi bersama; P2, P4, P5, P1 memanggilnya — jangan menulis UPDATE status sendiri).
 */
import { bolehTransisi } from '@silembur/shared';
import { HttpError } from '../../utils/http.js';

/**
 * Ubah status laporan + catat riwayat dalam transaksi yang sedang berjalan.
 * WAJIB dipanggil dengan `client` dari withTransaction() agar atomik.
 *
 * @param {import('pg').PoolClient} db
 * @param {{ idLaporan: number, statusBaru: string, deskripsi: string, idPengguna?: number|null,
 *           idLaporanInduk?: number|null }} data
 * @returns {Promise<{ idLaporan: number, statusLama: string, statusBaru: string }>}
 * @throws HttpError 404 jika laporan tidak ada, 409 jika transisi tidak sah (lihat TRANSISI_STATUS).
 */
export async function ubahStatus(db, { idLaporan, statusBaru, deskripsi, idPengguna = null, idLaporanInduk = null }) {
  const { rows } = await db.query('SELECT status_laporan FROM laporan WHERE id_laporan = $1 FOR UPDATE', [idLaporan]);
  if (rows.length === 0) throw new HttpError(404, `Laporan #${idLaporan} tidak ditemukan`);
  const statusLama = rows[0].status_laporan;
  if (!bolehTransisi(statusLama, statusBaru)) {
    throw new HttpError(409, `Status laporan tidak bisa diubah dari "${statusLama}" menjadi "${statusBaru}"`);
  }

  // Q-002 (+ Q-013 untuk penggabungan)
  await db.query(
    `UPDATE laporan
        SET status_laporan = $1,
            id_laporan_induk = COALESCE($2, id_laporan_induk),
            diperbarui_pada = NOW()
      WHERE id_laporan = $3`,
    [statusBaru, idLaporanInduk, idLaporan],
  );
  await db.query(
    `INSERT INTO riwayat_status (id_laporan, id_pengguna, status_lama, status_baru, deskripsi_perubahan)
     VALUES ($1, $2, $3, $4, $5)`,
    [idLaporan, idPengguna, statusLama, statusBaru, deskripsi],
  );
  return { idLaporan, statusLama, statusBaru };
}

/**
 * Catat riwayat tanpa mengubah status (mis. "Laporan berhasil diterima oleh sistem" saat UC01).
 */
export async function catatRiwayat(db, { idLaporan, status, deskripsi, idPengguna = null }) {
  await db.query(
    `INSERT INTO riwayat_status (id_laporan, id_pengguna, status_lama, status_baru, deskripsi_perubahan)
     VALUES ($1, $2, NULL, $3, $4)`,
    [idLaporan, idPengguna, status, deskripsi],
  );
}
