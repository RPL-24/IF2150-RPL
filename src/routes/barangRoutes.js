const router = require('express').Router();
const multer = require('multer');
const Otorisasi = require('../pendukung/Otorisasi');
const C = require('../controllers/BarangController');
const upload = multer({ storage: multer.memoryStorage(), limits: { files: 5, fileSize: 5 * 1024 * 1024, fields: 6, fieldSize: 16 * 1024 } }).array('foto', 5);
router.use(Otorisasi.wajibLogin);
router.param('id', (req, res, next, id) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return res.status(400).json({ sukses: false, pesan: 'ID listing tidak valid.' });
  next();
});
router.get('/formulir', C.getDataFormulir);
router.get('/saya', C.getListingSaya);
router.get('/:id', C.getBarang); // pemeriksaan kepemilikan sebelum membuka form/dialog
router.post('/', upload, C.buatBarang);
router.put('/:id', upload, C.updateBarang);
router.delete('/:id', C.deleteBarang);
router.patch('/:id/status', C.ubahStatusBarang);
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ sukses: false, pesan: 'Unggahan tidak valid: maksimum 5 foto JPG/PNG, masing-masing 5 MB.' });
  if (err.status) return res.status(err.status).json({ sukses: false, pesan: err.message });
  next(err);
});
module.exports = router;
