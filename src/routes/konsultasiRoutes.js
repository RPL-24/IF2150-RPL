const express = require('express');
const router = express.Router();
const konsultasi = require('../controllers/KonsultasiController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// UC06 - sisi pelajar
router.post('/', authenticate, authorizeRoles('Pelajar'), konsultasi.ajukan);
router.get('/saya', authenticate, authorizeRoles('Pelajar'), konsultasi.daftarSaya);

// UC07 - sisi tenaga kesehatan
router.get('/masuk', authenticate, authorizeRoles('TenagaKesehatan'), konsultasi.daftarMasuk);
router.get('/jadwal', authenticate, authorizeRoles('TenagaKesehatan'), konsultasi.daftarJadwal);
router.put('/:id/status', authenticate, authorizeRoles('TenagaKesehatan'), konsultasi.ubahStatus);
router.put('/:id/jadwal', authenticate, authorizeRoles('TenagaKesehatan'), konsultasi.jadwalUlang);
router.post('/:id/tolak', authenticate, authorizeRoles('TenagaKesehatan'), konsultasi.tolakPengajuan);

module.exports = router;
