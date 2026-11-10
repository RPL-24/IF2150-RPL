const express = require('express');
const NotifikasiDaruratController = require('../controllers/NotifikasiDaruratController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const { kirim, tanganiAsync } = require('../utils/respon');

const router = express.Router();

router.use(authenticate, authorizeRoles('OrangTuaWali'));

router.get(
  '/wali',
  tanganiAsync(async (req, res) => {
    const daftar = await NotifikasiDaruratController.loadEmergencyDetail(req.user.idPengguna);
    kirim(res, 200, 'Notifikasi darurat aktif.', daftar);
  })
);

router.put(
  '/:id/confirm',
  tanganiAsync(async (req, res) => {
    await NotifikasiDaruratController.confirmReceived(req.user.idPengguna, req.params.id);
    kirim(res, 200, 'Notifikasi dikonfirmasi diterima.');
  })
);

router.put(
  '/:id/follow-up',
  tanganiAsync(async (req, res) => {
    await NotifikasiDaruratController.markFollowUp(req.user.idPengguna, req.params.id);
    kirim(res, 200, 'Tindak lanjut dicatat.');
  })
);

module.exports = router;
