/**
 * Model Verifikasi (C07) — simpanVerifikasi, tahanLaporan, teruskanKePemerintah (Algo-002, Algo-008, Q-003).
 * Pemilik: P4.
 */
import { KEPUTUSAN, KEPUTUSAN_KE_STATUS, STATUS } from '@silembur/shared';
import { HttpError } from '../../utils/http.js';
import { ubahStatus } from '../laporan/status.js';
import { kirimNotifikasi } from '../notifikasi/kirim.js';
import { buatSkorAwal, hitungSkor } from '../skorPrioritas/skor.js';


/** Q-003: catat keputusan admin. @returns {Promise<number>} id_verifikasi */
export async function simpanVerifikasi(db, { idLaporan, idAdmin, keputusan, catatan }) {
  const { rows } = await db.query(
    `INSERT INTO verifikasi (id_laporan, id_admin, keputusan, catatan_alasan)
     VALUES ($1, $2, $3, $4) RETURNING id_verifikasi`,
    [idLaporan, idAdmin, keputusan, catatan],
  );
  return rows[0].id_verifikasi;
}

/**
 * Algo-002 tetapkanKeputusan + Algo-008 teruskanKePemerintah, dalam satu transaksi:
 *   1. simpanVerifikasi
 *   2. ubahStatus sesuai KEPUTUSAN_KE_STATUS (Disetujui -> Terverifikasi, Ditolak, Revisi -> Perlu Revisi)
 *   3. jika Disetujui: buatSkorAwal (Q-008) lalu hitungSkor
 *   4. kirimNotifikasi ke pelapor berisi keputusan + catatan (KF07)
 * Laporan yang belum Terverifikasi otomatis "tertahan" karena tidak masuk STATUS_PRIORITAS (KF08).
 */
export async function tetapkanKeputusan(db, { idLaporan, idAdmin, keputusan, catatan }) {
  const { rows } = await db.query(
    'SELECT id_pelapor, status_laporan FROM laporan WHERE id_laporan = $1 FOR UPDATE',
    [idLaporan],
  );
  if (rows.length === 0) throw new HttpError(404, `Laporan #${idLaporan} tidak ditemukan`);
  if (rows[0].status_laporan !== STATUS.MENUNGGU_VERIFIKASI) {
    throw new HttpError(409, `Laporan #${idLaporan} berstatus "${rows[0].status_laporan}"; hanya laporan Menunggu Verifikasi yang bisa diverifikasi`);
  }

  const catatanBersih = (catatan ?? '').trim();
  await simpanVerifikasi(db, { idLaporan, idAdmin, keputusan, catatan: catatanBersih });       // Q-003
  await ubahStatus(db, {                                                                        // Algo-002 / Q-002
    idLaporan,
    statusBaru: KEPUTUSAN_KE_STATUS[keputusan],
    deskripsi: catatanBersih ? `${keputusan}. Catatan: ${catatanBersih}` : `${keputusan}.`,
    idPengguna: idAdmin,
  });

  let skor = null;
  if (keputusan === KEPUTUSAN.DISETUJUI) {                                                      // Algo-008
    await buatSkorAwal(db, idLaporan);
    skor = await hitungSkor(db, idLaporan);
  }

  await kirimNotifikasi(db, {                                                                   // KF07
    idLaporan,
    idPelapor: rows[0].id_pelapor,
    isiPesan: `Laporan #${idLaporan}: ${keputusan}.${catatanBersih ? ` ${catatanBersih}` : ''}`,
  });
  return { skor };
}