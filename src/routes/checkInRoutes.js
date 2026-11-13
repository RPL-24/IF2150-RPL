const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');
const {authenticate, authorizeRoles} = require('../middleware/authMiddleware');

router.use(authenticate, authorizeRoles('Pelajar'));
router.post('/', authenticate, checkInController.submitCheckIn);
router.get('/history', authenticate, checkInController.getHistory);
router.get('/status', authenticate, checkInController.getTodayStatus);

module.exports = router;
