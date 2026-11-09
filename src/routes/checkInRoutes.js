const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');
const {authenticate} = require('../middleware/authMiddleware');

router.post('/', authenticate, checkInController.submitCheckIn);
router.get('/history', authenticate, checkInController.getHistory);
router.get('/today', authenticate, checkInController.getTodayStatus);

module.exports = router;