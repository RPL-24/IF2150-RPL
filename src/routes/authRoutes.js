const express = require('express');
const { daftar } = require('../controllers/authController');
const { tanganiAsync } = require('../utils/respon');

const router = express.Router();

router.post('/register', tanganiAsync(daftar));

module.exports = router;
