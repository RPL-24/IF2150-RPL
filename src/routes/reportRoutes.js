const express = require('express');
const router = express.Router();
const laporan = require('../controllers/ReportController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/summary', authenticate, authorizeRoles('Pelajar', 'OrangTuaWali'), laporan.summary);
router.get('/riwayat', authenticate, authorizeRoles('Pelajar'), laporan.riwayat);

module.exports = router;
