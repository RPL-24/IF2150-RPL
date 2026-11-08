const router = require('express').Router();
const c = require('../controllers/AuthController');
const reg = require('../controllers/RegistrasiController');
const v = require('../middleware/validasi');

router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/' + req.session.user.peran);
  res.render('landing');
});

router.get('/registrasi-masyarakat', reg.tampilMasyarakat);
router.post('/registrasi-masyarakat', v.registrasiMasyarakat, reg.prosesMasyarakat)
router.get('/login', c.tampilLogin);
router.post('/login', c.prosesLogin);
router.get('/login-masyarakat', c.tampilLoginMasyarakat);
router.post('/login-masyarakat', c.prosesLogin);
router.get('/logout', c.logout);


module.exports = router;