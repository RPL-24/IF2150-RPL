/**
 * Konstanta bersama SILEMBUR, dipakai server dan mobile.
 * Pemilik: P1. Perubahan nilai di sini WAJIB lewat PR, karena memengaruhi semua orang.
 *
 * Nilai string status/keputusan sama persis dengan yang dipakai query DPPL (Q-001 s.d. Q-013)
 * dan constraint CHECK di migrasi 001_init.sql.
 */

/** Status laporan (gap G2: satu enum untuk seluruh sistem). */
export const STATUS = Object.freeze({
  MENUNGGU_VERIFIKASI: 'Menunggu Verifikasi',
  PERLU_REVISI: 'Perlu Revisi',
  DITOLAK: 'Ditolak',
  TERVERIFIKASI: 'Terverifikasi',
  DIPROSES: 'Diproses',
  SELESAI: 'Selesai',
  DIGABUNG: 'Digabung',
});

export const SEMUA_STATUS = Object.freeze(Object.values(STATUS));

/** Laporan "aktif" untuk pemeriksaan duplikat (KF20). */
export const STATUS_AKTIF = Object.freeze([
  STATUS.MENUNGGU_VERIFIKASI,
  STATUS.PERLU_REVISI,
  STATUS.TERVERIFIKASI,
  STATUS.DIPROSES,
]);

/** Status yang boleh tampil di daftar laporan publik (UC04). */
export const STATUS_PUBLIK = Object.freeze([
  STATUS.MENUNGGU_VERIFIKASI,
  STATUS.TERVERIFIKASI,
  STATUS.DIPROSES,
  STATUS.SELESAI,
]);

/** Status yang sudah diteruskan ke pemerintah daerah (KF08, KF18, gap G10). */
export const STATUS_PRIORITAS = Object.freeze([STATUS.TERVERIFIKASI, STATUS.DIPROSES]);

/**
 * State machine status laporan. Kunci = status sekarang, nilai = status tujuan yang sah.
 * Dipakai ubahStatus() di server; transisi di luar tabel ini ditolak (HTTP 409).
 */
export const TRANSISI_STATUS = Object.freeze({
  [STATUS.MENUNGGU_VERIFIKASI]: [STATUS.TERVERIFIKASI, STATUS.DITOLAK, STATUS.PERLU_REVISI, STATUS.DIGABUNG],
  [STATUS.PERLU_REVISI]: [STATUS.MENUNGGU_VERIFIKASI, STATUS.DIGABUNG],
  [STATUS.TERVERIFIKASI]: [STATUS.DIPROSES, STATUS.DIGABUNG],
  [STATUS.DIPROSES]: [STATUS.SELESAI, STATUS.DIGABUNG],
  [STATUS.DITOLAK]: [],
  [STATUS.SELESAI]: [],
  [STATUS.DIGABUNG]: [],
});

export function bolehTransisi(dari, ke) {
  return (TRANSISI_STATUS[dari] ?? []).includes(ke);
}

/** Keputusan verifikasi admin (KF05). */
export const KEPUTUSAN = Object.freeze({
  DISETUJUI: 'Disetujui',
  DITOLAK: 'Ditolak',
  REVISI: 'Revisi',
});

export const KEPUTUSAN_KE_STATUS = Object.freeze({
  [KEPUTUSAN.DISETUJUI]: STATUS.TERVERIFIKASI,
  [KEPUTUSAN.DITOLAK]: STATUS.DITOLAK,
  [KEPUTUSAN.REVISI]: STATUS.PERLU_REVISI,
});

/** Kategori kerusakan (I-04 O-0402) beserta bobot skor (Algo-009). */
export const KATEGORI = Object.freeze({
  JALAN_BERLUBANG: 'Jalan Berlubang',
  LAMPU_JALAN_MATI: 'Lampu Jalan Mati',
  POHON_TUMBANG: 'Pohon Tumbang',
  LAINNYA: 'Lainnya',
});

export const SEMUA_KATEGORI = Object.freeze(Object.values(KATEGORI));

export const BOBOT_KATEGORI = Object.freeze({
  [KATEGORI.POHON_TUMBANG]: 30,
  [KATEGORI.JALAN_BERLUBANG]: 20,
  [KATEGORI.LAMPU_JALAN_MATI]: 10,
  [KATEGORI.LAINNYA]: 5,
});

/** Peran pengguna (model Pengguna = kelas C01 Pelapor, C02 Admin, C03 PemerintahDaerah). */
export const PERAN = Object.freeze({
  PELAPOR: 'PELAPOR',
  ADMIN: 'ADMIN',
  PEMDA: 'PEMDA',
});

export const SUMBER_LOKASI = Object.freeze({ GPS: 'GPS', MANUAL: 'MANUAL' });

/** Aturan bisnis yang angkanya tidak disebut di SKPL/DPPL (gap G1, G11). */
export const ATURAN = Object.freeze({
  AMBANG_BERULANG: 3, // KF14: jumlah laporan minimal agar fasilitas jadi kandidat evaluasi
  PERIODE_BERULANG_HARI: 90, // Algo-007
  RADIUS_FASILITAS_METER: 30, // pencocokan laporan ke fasilitas yang sama
  BATAS_DESKRIPSI: 300, // I-04 O-0404
  TIMEOUT_MS: 5000, // skenario alternatif UC04/UC05/UC06: gagal muat dalam 5 detik
});

export const PESAN = Object.freeze({
  BELUM_ADA_LAPORAN: 'Belum ada laporan',
  BELUM_ADA_FASILITAS_BERULANG: 'Belum ada fasilitas dengan kerusakan berulang',
  MUAT_ULANG: 'Tolong muat ulang halaman',
  FASILITAS_TIDAK_DITEMUKAN: 'Laporan perubahan fasilitas yang dicari tidak ada di dalam sistem',
});
