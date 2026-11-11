// Pemetaan HTTP /api/akun/* ke AkunController
const express = require('express');
const config = require('../config/env');
const AkunController = require('../controllers/AkunController');
const Otorisasi = require('../pendukung/Otorisasi');

const router = express.Router();

// Kode hasil AkunController → status HTTP
const STATUS_HTTP = {
  ISIAN_KOSONG: 400,
  FORMULIR_TIDAK_LENGKAP: 400,
  KEBIJAKAN_BELUM_DISETUJUI: 400,
  DOMAIN_TIDAK_VALID: 400,
  NIM_TIDAK_VALID: 400,
  KATA_SANDI_LEMAH: 400,
  KODE_KOSONG: 400,
  KODE_TIDAK_ADA: 400,
  KODE_SALAH: 400,
  KODE_KEDALUWARSA: 400,
  KREDENSIAL_SALAH: 401,
  BELUM_TERVERIFIKASI: 403,
  AKUN_DIBLOKIR: 403,
  AKUN_TIDAK_DITEMUKAN: 404,
  SUREL_TERDAFTAR: 409,
  SUDAH_TERVERIFIKASI: 409,
  GAGAL_KIRIM_SUREL: 502,
};

function kirimGagal(res, hasil) {
  res.status(STATUS_HTTP[hasil.kodePesan] ?? 400).json({ sukses: false, kode: hasil.kodePesan, pesan: hasil.pesan });
}

const DURASI_KODE_DETIK = config.durasiKodeMenit * 60;

router.post('/daftar', async (req, res) => {
  const { nama, nim, email, kataSandi, setujuKebijakan } = req.body ?? {};
  const hasil = await AkunController.daftarAkun(nama, nim, email, kataSandi, setujuKebijakan);
  if (!hasil.berhasil) return kirimGagal(res, hasil);
  res.status(201).json({
    sukses: true,
    data: { email: hasil.email, surelTerkirim: hasil.surelTerkirim, durasiKodeDetik: DURASI_KODE_DETIK },
  });
});

// Verifikasi berhasil langsung membuat sesi, supaya I-03 dapat menuju beranda tanpa login ulang.
router.get('/tautan-kebijakan', async (req, res) => {
  const tautan = await AkunController.getTautanDokumenLegal();
  if (tautan === null) {
    return res.status(404).json({ sukses: false, pesan: 'Kebijakan Privasi belum tersedia.' });
  }
  res.json({ sukses: true, data: { tautan } });
});

router.post('/verifikasi', async (req, res) => {
  const { email, kode } = req.body ?? {};
  const hasil = await AkunController.verifikasiAkun(email, kode);
  if (!hasil.berhasil) return kirimGagal(res, hasil);
  const sesi = await AkunController.buatSesiLogin(hasil.idAkun);
  res.json({ sukses: true, data: { token: sesi.token, peran: hasil.peran } });
});

router.post('/kirim-ulang', async (req, res) => {
  const { email } = req.body ?? {};
  const hasil = await AkunController.kirimUlangKode(email);
  if (!hasil.berhasil) return kirimGagal(res, hasil);
  res.json({ sukses: true, data: { durasiKodeDetik: DURASI_KODE_DETIK } });
});

router.post('/login', async (req, res) => {
  const { email, kataSandi } = req.body ?? {};
  const hasil = await AkunController.login(email, kataSandi);
  if (!hasil.berhasil) return kirimGagal(res, hasil);
  res.json({ sukses: true, data: { token: hasil.token, peran: hasil.peran } });
});

router.get('/profil', Otorisasi.wajibLogin, async (req, res) => {
  const profil = await AkunController.getProfil(req.token);
  if (profil === null) {
    return res.status(401).json({ sukses: false, pesan: 'Silakan masuk terlebih dahulu.' });
  }
  res.json({
    sukses: true,
    data: {
      ...profil,
      daftarBarang: profil.daftarBarang.map((b) => ({
        idBarang: b.idBarang,
        judul: b.judul,
        harga: b.harga,
        status: b.getStatus(),
        fotoUtama: b.fotoUtama,
        idKategori: b.idKategori,
        idLokasi: b.idLokasi,
      })),
    },
  });
});

router.post('/logout', async (req, res) => {
  const berhasil = await AkunController.logout(Otorisasi.ambilToken(req));
  if (!berhasil) {
    return res.status(401).json({ sukses: false, pesan: 'Sesi tidak valid atau sudah berakhir.' });
  }
  res.json({ sukses: true, data: null });
});

module.exports = router;
