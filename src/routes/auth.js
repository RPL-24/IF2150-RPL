const router = require('express').Router();
const c = require('../controllers/AuthController');

router.get('/', (req, res) => res.redirect('/login'));
router.get('/login', c.tampilLogin);
router.post('/login', c.prosesLogin);
router.get('/logout', c.logout);

module.exports = router;