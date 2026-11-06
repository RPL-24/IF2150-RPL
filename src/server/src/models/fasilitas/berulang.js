/**
 * Model Fasilitas — kerusakan berulang (UC06, KF14, Algo-007, Q-006, Q-007).
 * Pemilik: P5.
 */
import { ATURAN } from '@silembur/shared';
import { belumDiimplementasi } from '../../utils/http.js';

/**
 * Algo-007 getJumlahLaporan(): jumlah laporan fasilitas dalam PERIODE_BERULANG_HARI terakhir
 * (tidak menghitung Ditolak/Digabung), lalu simpan ke fasilitas.jumlah_kerusakan_berulang
 * dan tandai kandidat_evaluasi bila >= AMBANG_BERULANG (KF14).
 *
 * Versi dasar dari starter (sesuai Q-006/Q-007) agar P4 bisa memakainya untuk hitungSkor().
 * P5 boleh memperbaiki/optimasi tanpa mengubah kontrak.
 * @returns {Promise<number>}
 */
export async function getJumlahLaporan(db, idFasilitas) {
  if (!idFasilitas) return 0;
  const { rows } = await db.query(
    `SELECT COUNT(*) AS jumlah FROM laporan
      WHERE id_fasilitas = $1
        AND tanggal_laporan >= NOW() - make_interval(days => $2)
        AND status_laporan NOT IN ('Ditolak', 'Digabung')`,
    [idFasilitas, ATURAN.PERIODE_BERULANG_HARI],
  );
  const jumlah = rows[0].jumlah;
  await db.query(
    `UPDATE fasilitas SET jumlah_kerusakan_berulang = $1, kandidat_evaluasi = $2 WHERE id_fasilitas = $3`,
    [jumlah, jumlah >= ATURAN.AMBANG_BERULANG, idFasilitas],
  );
  return jumlah;
}

/**
 * lihatFasilitasRusakBerulang(): fasilitas kandidat evaluasi, urut jumlah terbanyak.
 * @param {{ limit?: number }} opsi  limit kecil untuk preview dashboard (UC06 langkah 1)
 */
export async function getFasilitasBerulang(db, opsi) {
  throw belumDiimplementasi('P5', 'lihatFasilitasRusakBerulang (KF14)');
}
