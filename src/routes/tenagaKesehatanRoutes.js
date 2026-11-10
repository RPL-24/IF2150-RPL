const express = require('express');
const router = express.Router();
const nakesController = require('../controllers/TenagaKesehatanController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, (req, res) => nakesController.loadTenagaKesehatan(req, res));
router.post('/lokasi', authenticate, (req, res) => nakesController.processLocationPermission(req, res));
router.get('/:id', authenticate, (req, res) => nakesController.selectTenagaKesehatan(req, res));

module.exports = router;