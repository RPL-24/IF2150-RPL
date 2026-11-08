const router = require('express').Router();
const c = require('../controllers/AuthController');

router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/' + req.session.user.peran);
  res.render('landing');
});
router.get('/login', c.tampilLogin);
router.post('/login', c.prosesLogin);
router.get('/logout', c.logout);

router.get('/registrasi/masyarakat', (req, res) => res.render('auth/registrasi-masyarakat'));

module.exports = router;