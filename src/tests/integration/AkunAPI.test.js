// src/tests/integration/AkunAPI.test.js
const request = require('supertest');
const app = require('../../app');
const AkunController = require('../../controllers/AkunController');
const DokumenLegal = require('../../models/DokumenLegal');
const Otorisasi = require('../../pendukung/Otorisasi');

const gagal = (kodePesan, pesan = 'pesan uji') => ({ berhasil: false, kodePesan, pesan });

describe('API Modul A Integration Test (/api/akun, /api/dokumen-legal)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/akun/login (UC03)', () => {
    test.each([
      ['ISIAN_KOSONG', 400],
      ['KREDENSIAL_SALAH', 401],
      ['BELUM_TERVERIFIKASI', 403],
      ['AKUN_DIBLOKIR', 403],
    ])('%s → HTTP %i', async (kode, status) => {
      jest.spyOn(AkunController, 'login').mockResolvedValue(gagal(kode));
      const res = await request(app).post('/api/akun/login').send({ email: 'uji@itb.ac.id', kataSandi: 'x' });
      expect(res.status).toBe(status);
      expect(res.body).toEqual({ sukses: false, kode, pesan: 'pesan uji' });
    });

    test('berhasil → 200 dengan token dan peran', async () => {
      const login = jest.spyOn(AkunController, 'login').mockResolvedValue({ berhasil: true, token: 'tkn', peran: 'Pengguna' });
      const res = await request(app).post('/api/akun/login').send({ email: 'uji@itb.ac.id', kataSandi: 'rahasia123' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ sukses: true, data: { token: 'tkn', peran: 'Pengguna' } });
      expect(login).toHaveBeenCalledWith('uji@itb.ac.id', 'rahasia123');
    });

    test('body JSON rusak → 400 tanpa membuat server galat', async () => {
      const res = await request(app).post('/api/akun/login').set('Content-Type', 'application/json').send('{email');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ sukses: false, pesan: 'Format data tidak valid.' });
    });
  });

  describe('POST /api/akun/daftar (UC01)', () => {
    test.each([
      ['KEBIJAKAN_BELUM_DISETUJUI', 400],
      ['DOMAIN_TIDAK_VALID', 400],
      ['KATA_SANDI_LEMAH', 400],
      ['SUREL_TERDAFTAR', 409],
    ])('%s → HTTP %i', async (kode, status) => {
      jest.spyOn(AkunController, 'daftarAkun').mockResolvedValue(gagal(kode));
      const res = await request(app).post('/api/akun/daftar').send({});
      expect(res.status).toBe(status);
      expect(res.body.kode).toBe(kode);
    });

    test('berhasil → 201 dengan durasi kode dalam detik', async () => {
      const daftar = jest.spyOn(AkunController, 'daftarAkun')
        .mockResolvedValue({ berhasil: true, email: 'uji@itb.ac.id', surelTerkirim: true });
      const body = { nama: 'A', nim: '1', email: 'uji@itb.ac.id', kataSandi: 'rahasia123', setujuKebijakan: true };
      const res = await request(app).post('/api/akun/daftar').send(body);
      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({ email: 'uji@itb.ac.id', surelTerkirim: true });
      expect(res.body.data.durasiKodeDetik).toBeGreaterThan(0);
      expect(daftar).toHaveBeenCalledWith('A', '1', 'uji@itb.ac.id', 'rahasia123', true);
    });
  });

  describe('POST /api/akun/verifikasi dan /kirim-ulang (UC02)', () => {
    test.each([
      ['KODE_SALAH', 400],
      ['KODE_KEDALUWARSA', 400],
      ['AKUN_TIDAK_DITEMUKAN', 404],
      ['SUDAH_TERVERIFIKASI', 409],
    ])('verifikasi %s → HTTP %i', async (kode, status) => {
      jest.spyOn(AkunController, 'verifikasiAkun').mockResolvedValue(gagal(kode));
      const res = await request(app).post('/api/akun/verifikasi').send({ email: 'uji@itb.ac.id', kode: '000000' });
      expect(res.status).toBe(status);
    });

    test('verifikasi berhasil langsung membuat sesi login', async () => {
      jest.spyOn(AkunController, 'verifikasiAkun').mockResolvedValue({ berhasil: true, idAkun: 'akun-1', peran: 'Pengguna' });
      const buatSesi = jest.spyOn(AkunController, 'buatSesiLogin').mockResolvedValue({ token: 'tkn-baru' });
      const res = await request(app).post('/api/akun/verifikasi').send({ email: 'uji@itb.ac.id', kode: '123456' });
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({ token: 'tkn-baru', peran: 'Pengguna' });
      expect(buatSesi).toHaveBeenCalledWith('akun-1');
    });

    test('kirim ulang gagal karena SMTP → HTTP 502', async () => {
      jest.spyOn(AkunController, 'kirimUlangKode').mockResolvedValue(gagal('GAGAL_KIRIM_SUREL'));
      const res = await request(app).post('/api/akun/kirim-ulang').send({ email: 'uji@itb.ac.id' });
      expect(res.status).toBe(502);
    });
  });

  describe('POST /api/akun/logout (UC04)', () => {
    test('meneruskan token dari header Authorization', async () => {
      const logout = jest.spyOn(AkunController, 'logout').mockResolvedValue(true);
      const res = await request(app).post('/api/akun/logout').set('Authorization', 'Bearer tkn');
      expect(res.status).toBe(200);
      expect(logout).toHaveBeenCalledWith('tkn');
    });

    test('sesi tidak valid → 401', async () => {
      jest.spyOn(AkunController, 'logout').mockResolvedValue(false);
      const res = await request(app).post('/api/akun/logout');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/akun/profil (UC05)', () => {
    test('tanpa token → 401', async () => {
      const res = await request(app).get('/api/akun/profil');
      expect(res.status).toBe(401);
    });

    test('dengan token → identitas dan daftar listing dalam bentuk ringkas', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({ getIdAkun: () => 'akun-1' });
      jest.spyOn(AkunController, 'getProfil').mockResolvedValue({
        nama: 'A', email: 'a@itb.ac.id', nim: '1', statusAkun: 'Terverifikasi', statusBlokir: false, peran: 'Pengguna',
        daftarBarang: [{
          idBarang: 'b1', judul: 'Jas', harga: 120000, idKategori: 'jas', idLokasi: 'labtek', fotoUtama: null,
          deskripsiKondisi: 'tidak ikut dikirim', getStatus: () => 'Tersedia',
        }],
      });
      const res = await request(app).get('/api/akun/profil').set('Authorization', 'Bearer tkn');
      expect(res.status).toBe(200);
      expect(res.body.data.daftarBarang).toEqual([
        { idBarang: 'b1', judul: 'Jas', harga: 120000, status: 'Tersedia', fotoUtama: null, idKategori: 'jas', idLokasi: 'labtek' },
      ]);
    });
  });

  describe('GET /api/dokumen-legal/:jenis (UC06) dan /api/akun/tautan-kebijakan', () => {
    const kebijakan = new DokumenLegal({
      jenisDokumen: 'kebijakan-privasi',
      judul: 'Kebijakan Privasi',
      isi: '## 1. Data\nisi',
      klausaPrivasiPesan: 'Isi percakapan tidak dapat diakses admin maupun pengembang.',
      versi: '1.0',
      tanggalBerlaku: '2026-11-01',
      tautan: '/legal?jenis=kebijakan-privasi',
    });

    test('dokumen yang berlaku → 200 beserta klausul privasi (KF38)', async () => {
      jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(kebijakan);
      const res = await request(app).get('/api/dokumen-legal/kebijakan-privasi');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({
        jenis: 'kebijakan-privasi',
        judul: 'Kebijakan Privasi',
        isi: '## 1. Data\nisi',
        versi: '1.0',
        tanggalBerlaku: '2026-11-01',
        tautan: '/legal?jenis=kebijakan-privasi',
        klausaPrivasiPesan: 'Isi percakapan tidak dapat diakses admin maupun pengembang.',
      });
    });

    test('jenis tidak dikenal → 404', async () => {
      const res = await request(app).get('/api/dokumen-legal/rahasia');
      expect(res.status).toBe(404);
      expect(res.body.sukses).toBe(false);
    });

    test('tautan-kebijakan untuk formulir pendaftaran (KF13)', async () => {
      jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(kebijakan);
      const res = await request(app).get('/api/akun/tautan-kebijakan');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({ tautan: '/legal?jenis=kebijakan-privasi' });
    });
  });
});
