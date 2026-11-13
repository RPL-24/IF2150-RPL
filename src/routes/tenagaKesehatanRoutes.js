const express = require('express');
const router = express.Router();
const nakesController = require('../controllers/TenagaKesehatanController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, nakesController.loadTenagaKesehatan);
router.put('/lokasi-pelajar', authenticate, nakesController.processLocationPermission);
router.patch('/me/tarif', authenticate, nakesController.updateTarif);
router.get('/:id', authenticate, nakesController.selectTenagaKesehatan);

module.exports = router;