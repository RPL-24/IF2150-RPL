const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');

router.use(wajibLogin, wajibPeran('admin'));
router.get('/', (req, res) => res.send('Dashboard admin (placeholder)'));

module.exports = router;