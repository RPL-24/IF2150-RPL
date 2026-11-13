// Pemetaan HTTP /api/notifikasi/* ke NotifikasiController
const express = require('express');
const NotifikasiController = require('../controllers/NotifikasiController');
const Otorisasi = require('../pendukung/Otorisasi');

const router = express.Router();

const STATUS_HTTP = {
  DATA_TIDAK_VALID: 400,
  TIDAK_DITEMUKAN: 404,
};

function kirimHasil(res, hasil, statusSukses = 200) {
  if (!hasil.berhasil) {
    return res.status(STATUS_HTTP[hasil.kodePesan] || 400).json({ sukses: false, pesan: hasil.pesan });
  }
  return res.status(statusSukses).json({ sukses: true, data: hasil.data });
}

// GET /api/notifikasi - daftar notifikasi terbaru + jumlah belum dibaca (KF34)
router.get('/', Otorisasi.wajibLogin, async (req, res) => {
  kirimHasil(res, await NotifikasiController.getDaftarNotifikasi(req.akun.idAkun));
});

// Rute statis didaftarkan sebelum /:id/baca
// GET /api/notifikasi/kunci-publik - kunci publik VAPID untuk berlangganan Web Push
router.get('/kunci-publik', Otorisasi.wajibLogin, async (req, res) => {
  kirimHasil(res, NotifikasiController.getKunciPublik());
});

// PATCH /api/notifikasi/baca-semua
router.patch('/baca-semua', Otorisasi.wajibLogin, async (req, res) => {
  kirimHasil(res, await NotifikasiController.tandaiSemuaDibaca(req.akun.idAkun));
});

// POST /api/notifikasi/langganan-push - body PushSubscription.toJSON()
router.post('/langganan-push', Otorisasi.wajibLogin, async (req, res) => {
  kirimHasil(res, await NotifikasiController.simpanLanggananPush(req.akun.idAkun, req.body), 201);
});

// PATCH /api/notifikasi/:id/baca
router.patch('/:id/baca', Otorisasi.wajibLogin, async (req, res) => {
  kirimHasil(res, await NotifikasiController.tandaiDibaca(req.akun.idAkun, req.params.id));
});

module.exports = router;
