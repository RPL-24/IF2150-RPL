// Pemetaan HTTP /api/akun/* ke AkunController
const express = require('express');
const AkunController = require('../controllers/AkunController');
const Otorisasi = require('../pendukung/Otorisasi');

const router = express.Router();

const STATUS_HTTP_LOGIN = {
  ISIAN_KOSONG: 400,
  KREDENSIAL_SALAH: 401,
  BELUM_TERVERIFIKASI: 403,
  AKUN_DIBLOKIR: 403,
};

router.post('/login', async (req, res) => {
  const { email, kataSandi } = req.body ?? {};
  const hasil = await AkunController.login(email, kataSandi);
  if (!hasil.berhasil) {
    return res
      .status(STATUS_HTTP_LOGIN[hasil.kodePesan])
      .json({ sukses: false, kode: hasil.kodePesan, pesan: hasil.pesan });
  }
  res.json({ sukses: true, data: { token: hasil.token, peran: hasil.peran } });
});

router.post('/logout', async (req, res) => {
  const berhasil = await AkunController.logout(Otorisasi.ambilToken(req));
  if (!berhasil) {
    return res.status(401).json({ sukses: false, pesan: 'Sesi tidak valid atau sudah berakhir.' });
  }
  res.json({ sukses: true, data: null });
});

module.exports = router;
