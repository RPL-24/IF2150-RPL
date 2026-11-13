// src/tests/integration/AlurModulA.test.js
// Alur end-to-end Modul A lewat HTTP. Route, Controller, Otorisasi, dan logika Model berjalan apa adanya;
// hanya akses basis data, SMTP, dan bcrypt yang diganti penyimpanan di memori.
const request = require('supertest');
const app = require('../../app');
const NotifikasiController = require('../../controllers/NotifikasiController');
const Akun = require('../../models/Akun');
const Barang = require('../../models/Barang');
const SesiLogin = require('../../models/SesiLogin');
const TokenVerifikasi = require('../../models/TokenVerifikasi');
const Kriptografi = require('../../pendukung/Kriptografi');

function pasangBasisDataPalsu() {
  const akun = new Map();
  const token = [];
  const sesi = new Map();
  const surel = [];

  jest.spyOn(Akun, 'simpan').mockImplementation(async (nama, nim, email, kataSandiHash, statusAkun, setujuKebijakan) => {
    const idAkun = `akun-${akun.size + 1}`;
    akun.set(idAkun, {
      idAkun, nama, nim, email: email.trim().toLowerCase(), kataSandiHash,
      statusAkun, statusBlokir: false, peran: 'Pengguna', setujuKebijakan,
    });
    return idAkun;
  });
  jest.spyOn(Akun, 'cariByEmail').mockImplementation(async (email) => {
    const data = [...akun.values()].find((a) => a.email === email.trim().toLowerCase());
    return data ? new Akun({ ...data }) : null;
  });
  jest.spyOn(Akun, 'cariById').mockImplementation(async (idAkun) => (akun.has(idAkun) ? new Akun({ ...akun.get(idAkun) }) : null));
  jest.spyOn(Akun.prototype, 'perbaruiStatusAkun').mockImplementation(async function perbarui(status) {
    akun.get(this.idAkun).statusAkun = status;
    this.statusAkun = status;
    return true;
  });

  jest.spyOn(TokenVerifikasi, 'simpan').mockImplementation(async (idAkun, kode, waktuBuat, waktuKedaluwarsa, statusPakai) => {
    token.push({ idToken: `tok-${token.length + 1}`, idAkun, kode, waktuBuat, waktuKedaluwarsa, statusPakai });
    return true;
  });
  jest.spyOn(TokenVerifikasi, 'cariTokenAktif').mockImplementation(async (idAkun) => {
    const data = [...token].reverse().find((t) => t.idAkun === idAkun && t.statusPakai === 'Aktif');
    return data ? new TokenVerifikasi({ ...data }) : null;
  });
  const ubahStatusToken = (status) => async function ubah() {
    token.find((t) => t.idToken === this.idToken).statusPakai = status;
  };
  jest.spyOn(TokenVerifikasi.prototype, 'tandaiTerpakai').mockImplementation(ubahStatusToken('Terpakai'));
  jest.spyOn(TokenVerifikasi.prototype, 'tandaiHangus').mockImplementation(ubahStatusToken('Hangus'));

  jest.spyOn(SesiLogin, 'simpan').mockImplementation(async (idAkun, nilaiToken, waktuMulai, waktuKedaluwarsa) => {
    sesi.set(nilaiToken, { idAkun, token: nilaiToken, waktuMulai, waktuKedaluwarsa, statusAktif: true });
    return true;
  });
  jest.spyOn(SesiLogin, 'cariSesiAktif').mockImplementation(async (nilaiToken) => {
    const data = sesi.get(nilaiToken);
    return data && data.statusAktif && data.waktuKedaluwarsa > new Date() ? new SesiLogin({ ...data }) : null;
  });
  jest.spyOn(SesiLogin, 'nonaktifkan').mockImplementation(async (nilaiToken) => {
    if (sesi.has(nilaiToken)) sesi.get(nilaiToken).statusAktif = false;
  });

  jest.spyOn(NotifikasiController, 'kirimEmailVerifikasi').mockImplementation(async (email, kode) => {
    surel.push({ email, kode });
    return true;
  });
  jest.spyOn(Kriptografi, 'hash').mockImplementation(async (teks) => `hash(${teks})`);
  jest.spyOn(Kriptografi, 'cocokkanHash').mockImplementation(async (teks, hash) => hash === `hash(${teks})`);
  jest.spyOn(Barang, 'getListingPenjual').mockResolvedValue([]);

  return { akun, token, sesi, surel };
}

const PENDAFTAR = {
  nama: 'Mahasiswa Baru',
  nim: '13599990',
  email: 'baru@itb.ac.id',
  kataSandi: 'rahasia123',
  setujuKebijakan: true,
};

describe('Pengujian Integrasi Alur End-to-End Modul A: Akun & Otentikasi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Skenario 1: daftar → kirim ulang kode → verifikasi → profil → logout → login ulang', async () => {
    const bd = pasangBasisDataPalsu();

    // UC01: pendaftaran membuat akun "Belum Terverifikasi" dan mengirim kode
    const daftar = await request(app).post('/api/akun/daftar').send(PENDAFTAR);
    expect(daftar.status).toBe(201);
    expect(bd.akun.get('akun-1').statusAkun).toBe('Belum Terverifikasi');
    expect(bd.akun.get('akun-1').kataSandiHash).not.toBe(PENDAFTAR.kataSandi);
    expect(bd.surel).toHaveLength(1);
    expect(bd.surel[0].kode).toMatch(/^\d{6}$/);

    // UC03: login sebelum verifikasi ditolak (KF08)
    const loginAwal = await request(app).post('/api/akun/login')
      .send({ email: PENDAFTAR.email, kataSandi: PENDAFTAR.kataSandi });
    expect(loginAwal.status).toBe(403);
    expect(loginAwal.body.kode).toBe('BELUM_TERVERIFIKASI');

    // UC02: kirim ulang menghanguskan kode lama
    const kirimUlang = await request(app).post('/api/akun/kirim-ulang').send({ email: PENDAFTAR.email });
    expect(kirimUlang.status).toBe(200);
    expect(bd.surel).toHaveLength(2);
    expect(bd.token.map((t) => t.statusPakai)).toEqual(['Hangus', 'Aktif']);

    const [kodeLama, kodeBaru] = bd.surel.map((s) => s.kode);
    if (kodeLama !== kodeBaru) {
      const pakaiKodeLama = await request(app).post('/api/akun/verifikasi').send({ email: PENDAFTAR.email, kode: kodeLama });
      expect(pakaiKodeLama.status).toBe(400);
      expect(pakaiKodeLama.body.kode).toBe('KODE_SALAH');
    }

    // UC02: kode baru memverifikasi akun dan langsung membuat sesi
    const verifikasi = await request(app).post('/api/akun/verifikasi')
      .send({ email: 'BARU@itb.ac.id', kode: kodeBaru });
    expect(verifikasi.status).toBe(200);
    expect(bd.akun.get('akun-1').statusAkun).toBe('Terverifikasi');
    expect(bd.token[1].statusPakai).toBe('Terpakai');
    const { token } = verifikasi.body.data;

    // Kode yang sama tidak dapat dipakai dua kali
    const verifikasiUlang = await request(app).post('/api/akun/verifikasi').send({ email: PENDAFTAR.email, kode: kodeBaru });
    expect(verifikasiUlang.body.kode).toBe('SUDAH_TERVERIFIKASI');

    // UC05: profil dengan token sesi
    const profil = await request(app).get('/api/akun/profil').set('Authorization', `Bearer ${token}`);
    expect(profil.status).toBe(200);
    expect(profil.body.data).toMatchObject({
      nama: 'Mahasiswa Baru', nim: '13599990', email: 'baru@itb.ac.id', statusAkun: 'Terverifikasi', daftarBarang: [],
    });
    expect(JSON.stringify(profil.body)).not.toContain('hash(');

    // UC04: logout mencabut sesi, token lama tidak berlaku lagi
    const logout = await request(app).post('/api/akun/logout').set('Authorization', `Bearer ${token}`);
    expect(logout.status).toBe(200);
    const profilSetelahLogout = await request(app).get('/api/akun/profil').set('Authorization', `Bearer ${token}`);
    expect(profilSetelahLogout.status).toBe(401);

    // UC03: login ulang dengan kata sandi yang benar membuat sesi baru
    const salah = await request(app).post('/api/akun/login').send({ email: PENDAFTAR.email, kataSandi: 'salah1234' });
    expect(salah.status).toBe(401);
    const login = await request(app).post('/api/akun/login').send({ email: PENDAFTAR.email, kataSandi: PENDAFTAR.kataSandi });
    expect(login.status).toBe(200);
    expect(login.body.data.token).not.toBe(token);
  });

  test('Skenario 2: kode yang sudah lewat 15 menit ditolak, kode baru dari kirim ulang diterima', async () => {
    const bd = pasangBasisDataPalsu();
    await request(app).post('/api/akun/daftar').send(PENDAFTAR);
    bd.token[0].waktuKedaluwarsa = new Date(Date.now() - 1000);

    const basi = await request(app).post('/api/akun/verifikasi').send({ email: PENDAFTAR.email, kode: bd.surel[0].kode });
    expect(basi.status).toBe(400);
    expect(basi.body.kode).toBe('KODE_KEDALUWARSA');

    await request(app).post('/api/akun/kirim-ulang').send({ email: PENDAFTAR.email });
    const baru = await request(app).post('/api/akun/verifikasi').send({ email: PENDAFTAR.email, kode: bd.surel[1].kode });
    expect(baru.status).toBe(200);
  });

  test('Skenario 3: akun yang diblokir admin tidak bisa login dan sesi lamanya tidak berlaku', async () => {
    const bd = pasangBasisDataPalsu();
    await request(app).post('/api/akun/daftar').send(PENDAFTAR);
    const verifikasi = await request(app).post('/api/akun/verifikasi').send({ email: PENDAFTAR.email, kode: bd.surel[0].kode });
    const { token } = verifikasi.body.data;

    // Admin memblokir (UC23): status akun diubah dan seluruh sesi dicabut (SesiLogin.nonaktifkanByAkun)
    Object.assign(bd.akun.get('akun-1'), { statusAkun: 'Diblokir', statusBlokir: true });
    bd.sesi.forEach((s) => { if (s.idAkun === 'akun-1') s.statusAktif = false; });

    const profil = await request(app).get('/api/akun/profil').set('Authorization', `Bearer ${token}`);
    expect(profil.status).toBe(401);
    const login = await request(app).post('/api/akun/login').send({ email: PENDAFTAR.email, kataSandi: PENDAFTAR.kataSandi });
    expect(login.status).toBe(403);
    expect(login.body.kode).toBe('AKUN_DIBLOKIR');
  });
});
