// Pemetaan HTTP /api/percakapan/* ke PercakapanController
const express = require('express');
const PercakapanController = require('../controllers/PercakapanController');
const Otorisasi = require('../pendukung/Otorisasi');

const router = express.Router();

// Ubah hasil controller { berhasil, status, data | pesan } menjadi respons seragam modul D
const tangani = (aksi) => async (req, res) => {
  try {
    const hasil = await aksi(req);
    if (hasil.berhasil) return res.status(hasil.status).json({ sukses: true, data: hasil.data });
    res.status(hasil.status).json({ sukses: false, pesan: hasil.pesan });
  } catch (galat) {
    console.error(`Galat route ${req.method} /api/percakapan${req.path}:`, galat);
    res.status(500).json({ sukses: false, pesan: 'Terjadi galat pada server.' });
  }
};

// UC16 (KF31)
router.post(
  '/',
  Otorisasi.wajibLogin,
  tangani((req) => PercakapanController.mulaiPercakapan(req.akun.idAkun, req.body?.idBarang)),
);

// UC16, UC17 (KF32, KF35, KF36)
router.get(
  '/:id',
  Otorisasi.wajibLogin,
  tangani((req) => PercakapanController.bukaPercakapan(req.akun.idAkun, req.params.id)),
);

module.exports = router;
