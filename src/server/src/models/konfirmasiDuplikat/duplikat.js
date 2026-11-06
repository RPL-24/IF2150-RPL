/**
 * Model KonfirmasiDuplikat (C11) — simpanKandidat, warning, gabungLaporan (UC07, KF15, KF17, KF20, KF21, Algo-012, Q-013).
 * Pemilik: P1.
 *
 * KonfirmasiDuplikat tidak punya tabel: daftar kandidat dihitung dari laporan aktif (STATUS_AKTIF)
 * yang berbagi fasilitas; jejak penggabungan tersimpan di laporan.id_laporan_induk.
 * simpanKandidat() & warning() terjadi di sisi mobile (state pilihan + dialog konfirmasi).
 */
import { belumDiimplementasi } from '../../utils/http.js';

/**
 * KF20/KF21: kelompok kandidat duplikat = fasilitas yang punya >= 2 laporan aktif.
 * @returns {Promise<Array<{ fasilitas: object, laporan: object[] }>>}
 */
export async function getKandidatDuplikat(db) {
  throw belumDiimplementasi('P1', 'getKandidatDuplikat (KF20, KF21)');
}

/**
 * Algo-012 gabungLaporan(): induk = laporan dengan tanggal_laporan paling awal,
 * lainnya -> ubahStatus(..., 'Digabung', idLaporanInduk = induk) (Q-013),
 * lalu hitungSkor(induk) (KF17). Jumlah pelapor tetap terhitung lewat id_laporan_induk (KF15).
 * Tolak jika < 2 laporan atau ada laporan yang tidak aktif.
 * @returns {Promise<{ idLaporanInduk: number, digabung: number[] }>}
 */
export async function gabungLaporan(db, { idLaporanList, idAdmin }) {
  throw belumDiimplementasi('P1', 'Algo-012 gabungLaporan');
}
