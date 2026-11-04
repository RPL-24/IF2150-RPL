const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');

router.use(wajibLogin, wajibPeran('mitra'));
router.get('/', (req, res) => res.send('Dashboard mitra (placeholder)'));

module.exports = router;