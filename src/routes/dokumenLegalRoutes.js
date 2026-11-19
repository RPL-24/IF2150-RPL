// Pemetaan HTTP /api/dokumen-legal/* ke DokumenLegalController
const express = require('express');
const DokumenLegalController = require('../controllers/DokumenLegalController');

const router = express.Router();

router.get('/:jenis', async (req, res) => {
  const dokumen = await DokumenLegalController.getDokumen(req.params.jenis);
  if (dokumen === null) {
    return res.status(404).json({ sukses: false, pesan: 'Dokumen tidak ditemukan.' });
  }
  res.json({
    sukses: true,
    data: {
      jenis: dokumen.jenisDokumen,
      judul: dokumen.judul,
      isi: dokumen.getIsi(),
      versi: dokumen.versi,
      tanggalBerlaku: dokumen.tanggalBerlaku,
      tautan: dokumen.getTautan(),
      klausaPrivasiPesan: dokumen.klausaPrivasiPesan || (await DokumenLegalController.getKlausaPrivasi()),
    },
  });
});

module.exports = router;
