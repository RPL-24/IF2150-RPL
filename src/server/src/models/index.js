/**
 * Peta kelas perancangan DPPL -> fungsi model. Inilah wujud implementasi lapisan Model (MVC)
 * dan dasar tabel traceability M9 B.5. Controller cukup:  import { Laporan } from '../models/index.js'
 *
 * Pemilik file ini: P1. Pemilik tiap fungsi = pemilik file sumbernya (lihat header masing-masing).
 * Menambah fungsi baru di file milikmu otomatis ikut ter-ekspor (spread di bawah); tidak perlu edit file ini,
 * kecuali menambah FILE model baru.
 */
import * as penggunaAuth from './pengguna/auth.js';
import * as laporanStatus from './laporan/status.js';
import * as laporanBuat from './laporan/buat.js';
import * as laporanPublik from './laporan/publik.js';
import * as laporanSaya from './laporan/saya.js';
import * as laporanVerifikasi from './laporan/verifikasi.js';
import * as laporanPrioritas from './laporan/prioritas.js';
import * as lokasi from './lokasi/lokasi.js';
import * as fasilitasCocokkan from './fasilitas/cocokkan.js';
import * as fasilitasBerulang from './fasilitas/berulang.js';
import * as fasilitasRiwayat from './fasilitas/riwayat.js';
import * as verifikasi from './verifikasi/verifikasi.js';
import * as skor from './skorPrioritas/skor.js';
import * as riwayat from './riwayatStatus/riwayat.js';
import * as notifikasiKirim from './notifikasi/kirim.js';
import * as notifikasiInbox from './notifikasi/inbox.js';
import * as duplikat from './konfirmasiDuplikat/duplikat.js';

/** C01 Pelapor, C02 Admin, C03 PemerintahDaerah (model Pengguna) */
export const Pengguna = { ...penggunaAuth };
/** C04 */
export const Laporan = {
  ...laporanStatus,
  ...laporanBuat,
  ...laporanPublik,
  ...laporanSaya,
  ...laporanVerifikasi,
  ...laporanPrioritas,
};
/** C05 */
export const Lokasi = { ...lokasi };
/** C06 */
export const Fasilitas = { ...fasilitasCocokkan, ...fasilitasBerulang, ...fasilitasRiwayat };
/** C07 */
export const Verifikasi = { ...verifikasi };
/** C08 */
export const SkorPrioritas = { ...skor };
/** C09 */
export const RiwayatStatus = { ...riwayat };
/** C10 */
export const Notifikasi = { ...notifikasiKirim, ...notifikasiInbox };
/** C11 */
export const KonfirmasiDuplikat = { ...duplikat };
