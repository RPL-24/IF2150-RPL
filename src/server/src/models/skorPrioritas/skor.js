/**
 * Model SkorPrioritas (C08) — Algo-009 hitungSkor, Q-008, Q-009, Q-010 (KF16, KF17).
 * Pemilik: P4.
 *
 * Kontrak untuk pemanggil lain (P1 setelah gabung duplikat, P5 saat refresh daftar prioritas):
 *   await hitungSkor(db, idLaporan)  -> Promise<number|null>   (null jika laporan belum punya skor)
 * Stub di bawah TIDAK melempar error agar alur P1/P5 tetap bisa dites sebelum P4 selesai.
 */
import { belumDiimplementasi } from '../../utils/http.js';

/**
 * Bagian murni Algo-009 (tanpa DB), mudah diuji:
 *   skor = bobotKategori + 5*jumlahPelapor + 2*lamaMenunggu + 10*frekuensiBerulang
 */
export function hitungNilaiSkor({ kategori, jumlahPelapor, lamaMenunggu, frekuensiBerulang }) {
  throw belumDiimplementasi('P4', 'Algo-009 hitungNilaiSkor');
}

/** Q-008: buat baris skor awal saat laporan disetujui. */
export async function buatSkorAwal(db, idLaporan) {
  throw belumDiimplementasi('P4', 'Q-008 buatSkorAwal');
}

/**
 * Algo-009 lengkap: jumlahPelapor = 1 + laporan tergabung (Q-009), lamaMenunggu = hari sejak tanggal_laporan,
 * frekuensiBerulang = getJumlahLaporan(fasilitas) (models/fasilitas/berulang.js), simpan (Q-010).
 */
export async function hitungSkor(db, idLaporan) {
  // TODO(P4): ganti stub ini dengan implementasi Algo-009.
  return null;
}

/** getSkor(): baca skor tersimpan. */
export async function getSkor(db, idLaporan) {
  const { rows } = await db.query('SELECT skor FROM skor_prioritas WHERE id_laporan = $1', [idLaporan]);
  return rows[0]?.skor ?? null;
}
