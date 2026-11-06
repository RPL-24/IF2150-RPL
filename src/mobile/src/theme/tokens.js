/**
 * Token desain SILEMBUR, mengikuti gaya layar I-01 s.d. I-04 (gap G13: semua layar memakai gaya ini).
 * Pemilik: P3. Jangan menulis warna/ukuran mentah di layar; pakai token dari sini.
 */
import { STATUS } from '@silembur/shared';

export const warna = {
  primer: '#00703C',
  primerGelap: '#00552D',
  primerMuda: '#E6F4EA',
  latar: '#F6F7FB',
  permukaan: '#FFFFFF',
  permukaanLembut: '#EEF1FA',
  teks: '#1A1C1E',
  teksLembut: '#5F6672',
  garis: '#E3E6EE',
  bahaya: '#B3261E',
  bahayaMuda: '#FDECEA',
  peringatan: '#8A5300',
  peringatanMuda: '#FFF3D6',
  info: '#1D4ED8',
  infoMuda: '#E3ECFF',
  putih: '#FFFFFF',
};

export const jarak = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 };
export const radius = { s: 8, m: 12, l: 16, pil: 999 };
export const huruf = {
  judul: { fontSize: 22, fontWeight: '700', color: warna.teks },
  subjudul: { fontSize: 17, fontWeight: '700', color: warna.teks },
  isi: { fontSize: 15, color: warna.teks },
  kecil: { fontSize: 13, color: warna.teksLembut },
  label: { fontSize: 12, fontWeight: '600', color: warna.teksLembut },
};
export const bayangan = {
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

/** Warna lencana per status laporan (dipakai StatusBadge). */
export const warnaStatus = {
  [STATUS.MENUNGGU_VERIFIKASI]: { latar: warna.peringatanMuda, teks: warna.peringatan },
  [STATUS.PERLU_REVISI]: { latar: warna.bahayaMuda, teks: warna.bahaya },
  [STATUS.DITOLAK]: { latar: warna.bahayaMuda, teks: warna.bahaya },
  [STATUS.TERVERIFIKASI]: { latar: warna.primerMuda, teks: warna.primer },
  [STATUS.DIPROSES]: { latar: warna.infoMuda, teks: warna.info },
  [STATUS.SELESAI]: { latar: warna.primerMuda, teks: warna.primerGelap },
  [STATUS.DIGABUNG]: { latar: warna.permukaanLembut, teks: warna.teksLembut },
};
