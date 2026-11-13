// Pemetaan HTTP /api/akun/* ke AkunController
const express = require('express');
const config = require('../config/env');
const AkunController = require('../controllers/AkunController');
const SsoController = require('../controllers/SsoController');
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
  SSO_ADMIN_DILARANG: 403,
  AKUN_TIDAK_DITEMUKAN: 404,
  SUREL_TERDAFTAR: 409,
  SUDAH_TERVERIFIKASI: 409,
  PROFIL_SSO_TIDAK_VALID: 401,
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

// ───────────── Masuk dengan Google / Microsoft (SSO) ─────────────

const OPSI_COOKIE = { httpOnly: true, sameSite: 'lax', path: '/api/akun/sso', secure: config.sso.urlDasar.startsWith('https://') };
const penyediaTidakAda = (res) => res.status(404).json({ sukses: false, pesan: 'Penyedia masuk tidak tersedia.' });
const galatSso = (res, kode) => res.redirect(`/masuk?sso_galat=${encodeURIComponent(kode)}`);

router.get('/sso/penyedia', (req, res) => {
  res.json({ sukses: true, data: SsoController.penyediaAktif() });
});

router.get('/sso/profil-sementara', (req, res) => {
  const profil = SsoController.profilSementara(req.headers.cookie);
  if (profil === null) {
    return res.status(401).json({ sukses: false, pesan: 'Sesi pendaftaran SSO tidak valid atau sudah kedaluwarsa.' });
  }
  res.json({ sukses: true, data: profil });
});

router.post('/sso/lengkapi', async (req, res) => {
  const { nim, setujuKebijakan } = req.body ?? {};
  const hasil = await SsoController.lengkapi(req.headers.cookie, nim, setujuKebijakan);
  if (!hasil.berhasil) return kirimGagal(res, hasil);
  res.clearCookie(SsoController.COOKIE_PROFIL, OPSI_COOKIE);
  res.status(201).json({ sukses: true, data: { token: hasil.token, peran: hasil.peran } });
});

router.get('/sso/:penyedia/mulai', (req, res) => {
  const mulai = SsoController.mulai(req.params.penyedia);
  if (mulai === null) return penyediaTidakAda(res);
  res.cookie(SsoController.COOKIE_STATE, mulai.nilaiCookieState, { ...OPSI_COOKIE, maxAge: SsoController.UMUR_STATE_DETIK * 1000 });
  res.redirect(mulai.url);
});

router.get('/sso/:penyedia/kembali', async (req, res) => {
  if (SsoController.ambilKredensial(req.params.penyedia) === null) return penyediaTidakAda(res);
  const hasil = await SsoController.selesaikan(req.params.penyedia, req.query, req.headers.cookie);
  res.clearCookie(SsoController.COOKIE_STATE, OPSI_COOKIE); // state sekali pakai
  if (hasil.tipe === 'galat') return galatSso(res, hasil.kode);
  if (hasil.tipe === 'lengkapi') {
    res.cookie(SsoController.COOKIE_PROFIL, hasil.nilaiCookieProfil, { ...OPSI_COOKIE, maxAge: SsoController.UMUR_PROFIL_DETIK * 1000 });
    return res.redirect('/lengkapi-sso');
  }
  // Sesi disimpan View di localStorage seperti login biasa; api.js memindahkannya dari cookie singkat ini.
  res.cookie('itbeli_sso_sesi', JSON.stringify({ token: hasil.token, peran: hasil.peran, email: hasil.email }),
    { httpOnly: false, sameSite: 'lax', path: '/', secure: OPSI_COOKIE.secure, maxAge: 60 * 1000 });
  res.redirect('/katalog');
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
