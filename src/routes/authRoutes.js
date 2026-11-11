const express = require('express');
const {
  daftar,
  dataKonfirmasi,
  setujuiRegistrasi,
  tolakRegistrasi,
  masuk,
  profilSaya,
  keluar,
} = require('../controllers/authController');
const { lupaPassword, resetPassword } = require('../controllers/passwordController');
const { authenticate } = require('../middleware/authMiddleware');
const { tanganiAsync } = require('../utils/respon');

const router = express.Router();

// UC01
router.post('/register', tanganiAsync(daftar));

// UC02
router.get('/confirm/:token', tanganiAsync(dataKonfirmasi));
router.post('/confirm/:token', tanganiAsync(setujuiRegistrasi));
router.post('/reject/:token', tanganiAsync(tolakRegistrasi));

// UC09
router.post('/login', tanganiAsync(masuk));
router.get('/me', authenticate, tanganiAsync(profilSaya));
router.post('/forgot-password', tanganiAsync(lupaPassword));
router.post('/reset-password', tanganiAsync(resetPassword));

// UC10
router.post('/logout', authenticate, tanganiAsync(keluar));

module.exports = router;
