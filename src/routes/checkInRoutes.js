const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');
const verifyToken = require('../src/authMiddleware');

router.post('/', verifyToken, checkInController.submitCheckIn);
router.get('/history', verifyToken, checkInController.getHistory);
router.get('/today', verifyToken, checkInController.getTodayStatus);

module.exports = router;