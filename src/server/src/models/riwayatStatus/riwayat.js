/**
 * Model RiwayatStatus (C09) — membaca riwayat perubahan status.
 * Menulis riwayat dilakukan oleh ubahStatus()/catatRiwayat() di models/laporan/status.js.
 * Pemilik: P3 (getRiwayatStatus untuk UC05). P5 membaca riwayat per fasilitas di models/fasilitas/riwayat.js.
 */
import { belumDiimplementasi } from '../../utils/http.js';

/** Laporan.getRiwayatStatus(): semua riwayat satu laporan, urut tanggal_perubahan naik. */
export async function getRiwayatStatus(db, idLaporan) {
  throw belumDiimplementasi('P3', 'getRiwayatStatus (KF24)');
}

/** Algo-010 / Q-011 getPerubahan(): satu entri riwayat, null jika tidak ada. */
export async function getPerubahan(db, idRiwayat) {
  throw belumDiimplementasi('P3', 'Algo-010 / Q-011 getPerubahan');
}
