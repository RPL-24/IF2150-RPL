const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');

router.use(wajibLogin, wajibPeran('masyarakat'));
router.get('/', (req, res) => res.send('Dashboard masyarakat (placeholder)'));

module.exports = router;