const express = require('express');
const {
  daftar,
  dataKonfirmasi,
  setujuiRegistrasi,
  tolakRegistrasi,
} = require('../controllers/authController');
const { tanganiAsync } = require('../utils/respon');

const router = express.Router();

// UC01
router.post('/register', tanganiAsync(daftar));

// UC02
router.get('/confirm/:token', tanganiAsync(dataKonfirmasi));
router.post('/confirm/:token', tanganiAsync(setujuiRegistrasi));
router.post('/reject/:token', tanganiAsync(tolakRegistrasi));

module.exports = router;
