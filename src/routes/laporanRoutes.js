// Pemetaan HTTP /api/laporan/* ke LaporanController
const express = require('express');
const multer = require('multer');
const LaporanController = require('../controllers/LaporanController');
const Otorisasi = require('../pendukung/Otorisasi');

const router = express.Router();

// Konfigurasi multer menggunakan penyimpanan memori agar berkas dapat divalidasi dan disimpan via PenyimpananBerkas
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per berkas (KF44)
    files: 5,
  },
});

const STATUS_HTTP = {
  TIDAK_TEROTENTIKASI: 401,
  DATA_TIDAK_LENGKAP: 400,
  BUKTI_TIDAK_VALID: 400,
  GALAT_SERVER: 500,
};

// POST /api/laporan - Membuat laporan pelanggaran baru (KF37, KF43, KF44, KF48)
router.post(
  '/',
  Otorisasi.wajibLogin,
  upload.fields([
    { name: 'bukti', maxCount: 5 },
    { name: 'berkasBukti', maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const filesMap = req.files || {};
      const berkasBukti = [...(filesMap.bukti || []), ...(filesMap.berkasBukti || [])];

      const data = {
        objekDilaporkan: req.body.objekDilaporkan,
        jenisPelanggaran: req.body.jenisPelanggaran,
        teksAlasan: req.body.teksAlasan,
        jenisObjek: req.body.jenisObjek,
      };

      const hasil = await LaporanController.buatLaporan(req.token, data, berkasBukti);

      if (!hasil.berhasil) {
        const status = STATUS_HTTP[hasil.kodePesan] || 400;
        return res.status(status).json({
          sukses: false,
          kode: hasil.kodePesan,
          pesan: hasil.pesan,
        });
      }

      res.status(201).json({
        sukses: true,
        data: hasil.data,
      });
    } catch (galat) {
      if (galat instanceof multer.MulterError && galat.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          sukses: false,
          kode: 'UKURAN_BERKAS_LEBIH',
          pesan: 'Ukuran berkas melebihi batas maksimum 5 MB.',
        });
      }
      console.error('Galat route /api/laporan:', galat);
      res.status(500).json({
        sukses: false,
        pesan: 'Terjadi galat pada server saat mengirim laporan.',
      });
    }
  },
);

module.exports = router;
