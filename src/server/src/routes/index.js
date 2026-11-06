/**
 * Seluruh endpoint SILEMBUR, sudah terdaftar sejak starter (stub membalas 501 + nama pemilik).
 * Pemilik file: P1. Anggota lain TIDAK perlu mengubah file ini untuk mengerjakan fitur:
 * cukup isi fungsi controller miliknya. Butuh endpoint baru? Ajukan PR kecil ke P1.
 * Kontrak lengkap: src/docs/API.md
 */
import { Router } from 'express';
import { PERAN } from '@silembur/shared';
import { wajibLogin, wajibPeran } from '../middleware/autentikasi.js';
import { validasi } from '../middleware/validasi.js';
import { uploadFoto } from '../middleware/upload.js';
import * as Auth from '../controllers/AuthController.js';
import * as Laporan from '../controllers/LaporanController.js';
import * as Verifikasi from '../controllers/VerifikasiController.js';
import * as Prioritas from '../controllers/PrioritasController.js';
import * as Fasilitas from '../controllers/FasilitasController.js';
import * as Duplikat from '../controllers/DuplikatController.js';
import * as Notifikasi from '../controllers/NotifikasiController.js';
import { referensi } from '../controllers/ReferensiController.js';

const { PELAPOR, ADMIN, PEMDA } = PERAN;
const r = Router();

// ---- Umum ---------------------------------------------------------------- P1
r.get('/health', (_req, res) => res.json({ status: 'ok', waktu: new Date().toISOString() }));
r.post('/auth/login', validasi(Auth.skemaLogin), Auth.login);
r.post('/auth/google', Auth.loginGoogle);
r.get('/auth/me', wajibLogin, Auth.me);
r.get('/referensi', wajibLogin, referensi);

// ---- UC01 Membuat laporan (+ revisi) ------------------------------------- P2
r.post('/laporan', wajibLogin, wajibPeran(PELAPOR), uploadFoto, Laporan.buatLaporan);
r.put('/laporan/:id/revisi', wajibLogin, wajibPeran(PELAPOR), uploadFoto, Laporan.revisiLaporan);

// ---- UC04 Laporan publik, UC05 Laporan saya ------------------------------ P3
r.get('/laporan/ringkasan', wajibLogin, Laporan.ringkasan);
r.get('/laporan/publik', wajibLogin, Laporan.daftarPublik);
r.get('/laporan/publik/:id', wajibLogin, Laporan.detailPublik);
r.get('/laporan/saya', wajibLogin, wajibPeran(PELAPOR), Laporan.daftarSaya);
r.get('/laporan/saya/:id', wajibLogin, wajibPeran(PELAPOR), Laporan.detailSaya);
r.get('/notifikasi', wajibLogin, wajibPeran(PELAPOR), Notifikasi.daftarNotifikasi);
r.patch('/notifikasi/:id/dibaca', wajibLogin, wajibPeran(PELAPOR), Notifikasi.tandaiDibaca);

// ---- UC02 Verifikasi & skor prioritas ------------------------------------ P4
r.get('/admin/laporan', wajibLogin, wajibPeran(ADMIN), Verifikasi.daftarLaporanAdmin);
r.get('/admin/laporan/jumlah-baru', wajibLogin, wajibPeran(ADMIN), Verifikasi.jumlahLaporanBaru);
r.get('/admin/laporan/:id', wajibLogin, wajibPeran(ADMIN), Verifikasi.detailLaporanAdmin);
r.post(
  '/admin/laporan/:id/verifikasi',
  wajibLogin,
  wajibPeran(ADMIN),
  validasi(Verifikasi.skemaKeputusan),
  Verifikasi.tetapkanKeputusan,
);

// ---- UC07 Duplikat ------------------------------------------------------- P1
r.get('/admin/duplikat/kandidat', wajibLogin, wajibPeran(ADMIN), Duplikat.kandidatDuplikat);
r.post('/admin/duplikat/gabung', wajibLogin, wajibPeran(ADMIN), validasi(Duplikat.skemaGabung), Duplikat.gabungDuplikat);

// ---- UC03 Prioritas, UC06 Fasilitas berulang, UC08 Riwayat fasilitas ------ P5
r.get('/prioritas', wajibLogin, wajibPeran(PEMDA, ADMIN), Prioritas.daftarPrioritas);
r.patch('/laporan/:id/status', wajibLogin, wajibPeran(PEMDA), validasi(Prioritas.skemaUbahStatus), Prioritas.perbaruiStatus);
r.get('/fasilitas', wajibLogin, wajibPeran(PEMDA, ADMIN), Fasilitas.daftarFasilitas);
r.get('/fasilitas/berulang', wajibLogin, wajibPeran(PEMDA, ADMIN), Fasilitas.fasilitasBerulang);
r.get('/fasilitas/:id', wajibLogin, wajibPeran(PEMDA, ADMIN), Fasilitas.detailFasilitas);

export default r;
