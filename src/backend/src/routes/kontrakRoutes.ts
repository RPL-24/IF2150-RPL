import { Router } from 'express';
import { kontrakPekerjaanController } from '../controllers/KontrakPekerjaanController.js';
import {
  authenticateJWT,
  authorizeRoles,
} from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * UC05 & KF10 (KNF17): Menampilkan template form pembuatan kontrak kesepakatan
 */
router.get(
  '/form',
  authenticateJWT,
  authorizeRoles('PELANGGAN'),
  kontrakPekerjaanController.handleShowKontrakForm
);

/**
 * Mengambil daftar riwayat kontrak pengguna yang sedang login (UI-10 & UI-12)
 */
router.get(
  '/',
  authenticateJWT,
  kontrakPekerjaanController.handleGetDaftarKontrak
);

/**
 * UC05 (KF02, KF10, KF11, KNF04, KNF18, KNF19 | ALGO-037, ALGO-038, ALGO-039, ALGO-043 | Q-017):
 * Pelanggan membuat kontrak kesepakatan pekerjaan & harga -> status 'Menunggu' + Optimistic Lock penyedia jasa
 */
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('PELANGGAN'),
  kontrakPekerjaanController.handleKirimInput
);

/**
 * ALGO-040 & ALGO-041 (Q-019): Mengambil detail kontrak pekerjaan berdasarkan ID
 */
router.get(
  '/:id',
  authenticateJWT,
  kontrakPekerjaanController.handleGetKontrakById
);

/**
 * UC04/UC05 (KF11, KNF04, KNF19, KNF22 | ALGO-036, ALGO-037 | Q-016, Q-018):
 * Penyedia jasa menerima atau menolak kontrak dengan Optimistic Locking (version check)
 */
router.patch(
  '/:id/persetujuan',
  authenticateJWT,
  authorizeRoles('PEMBERI_JASA'),
  kontrakPekerjaanController.handleKonfirmasiPersetujuan
);

router.post(
  '/:id/terima',
  authenticateJWT,
  authorizeRoles('PEMBERI_JASA'),
  kontrakPekerjaanController.handleTerimaKontrak
);

router.patch(
  '/:id/terima',
  authenticateJWT,
  authorizeRoles('PEMBERI_JASA'),
  kontrakPekerjaanController.handleTerimaKontrak
);

router.post(
  '/:id/tolak',
  authenticateJWT,
  authorizeRoles('PEMBERI_JASA'),
  kontrakPekerjaanController.handleTolakKontrak
);

router.patch(
  '/:id/tolak',
  authenticateJWT,
  authorizeRoles('PEMBERI_JASA'),
  kontrakPekerjaanController.handleTolakKontrak
);

/**
 * UC06 (KF12, KNF20, KNF22 | ALGO-036 | Q-016):
 * Penyedia jasa menyelesaikan pekerjaan -> status menjadi 'Menunggu Konfirmasi Pelanggan' + kirim notifikasi
 */
router.patch(
  '/:id/selesai',
  authenticateJWT,
  authorizeRoles('PEMBERI_JASA'),
  kontrakPekerjaanController.handleSelesaikanPekerjaan
);

router.post(
  '/:id/selesai',
  authenticateJWT,
  authorizeRoles('PEMBERI_JASA'),
  kontrakPekerjaanController.handleSelesaikanPekerjaan
);

/**
 * UC07 (KF13, KNF21, KNF22 | ALGO-042 | Q-016 | C01 Pengguna.konfirmasiPekerjaan):
 * Pelanggan mengonfirmasi penyelesaian & pembayaran -> status menjadi 'Done' + buka kunci penyedia jasa
 */
router.patch(
  '/:id/konfirmasi',
  authenticateJWT,
  authorizeRoles('PELANGGAN'),
  kontrakPekerjaanController.handleKonfirmasiPekerjaan
);

router.post(
  '/:id/konfirmasi',
  authenticateJWT,
  authorizeRoles('PELANGGAN'),
  kontrakPekerjaanController.handleKonfirmasiPekerjaan
);

export default router;
