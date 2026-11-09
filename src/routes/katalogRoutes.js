// Pemetaan HTTP ke KatalogController (Modul C: UC13–UC15).
const router = require('express').Router();
const Otorisasi = require('../pendukung/Otorisasi');
const C = require('../controllers/KatalogController');

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.use(Otorisasi.wajibLogin);
router.param('id', (req, res, next, id) => {
  if (!POLA_UUID.test(id)) return res.status(400).json({ sukses: false, pesan: 'ID listing tidak valid.' });
  next();
});

router.get('/', C.getProduk);
router.get('/:id', C.getDetailProduk);

router.use((err, req, res, next) => {
  if (err.status) return res.status(err.status).json({ sukses: false, pesan: err.message });
  next(err);
});

module.exports = router;
