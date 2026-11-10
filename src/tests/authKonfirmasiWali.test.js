// UC02 Mengonfirmasi Registrasi Akun oleh orang tua/wali.
// Berjalan bila TEST_DATABASE_URL diisi; isi basis data tersebut akan dihapus.
jest.mock('../utils/mailer', () => ({
  kirimEmailKonfirmasiWali: jest.fn().mockResolvedValue(undefined),
}));

const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const mailer = require('../utils/mailer');

const PASSWORD = 'Password123!';
const TOKEN_ANDI = 'TOKEN-WALI-ANDI-2026';
const adaDatabase = Boolean(process.env.TEST_DATABASE_URL);

async function akun(email) {
  const { rows } = await db.query(
    `SELECT u.status_akun, u.token_konfirmasi, p.id_wali FROM pengguna u
     JOIN pelajar p USING (id_pengguna) WHERE u.email = $1;`,
    [email]
  );
  return rows[0];
}

async function daftarPelajarDiBawahUmur(email, emailWali) {
  await request(app)
    .post('/api/auth/register')
    .send({
      nama: 'Siswa Uji',
      email,
      telepon: '081200000099',
      role: 'pelajar',
      password: PASSWORD,
      confirm_password: PASSWORD,
      tanggal_lahir: '2012-05-05',
      email_orang_tua: emailWali,
      riwayat_kesehatan: 'Riwayat rahasia',
    })
    .expect(201);
  return mailer.kirimEmailKonfirmasiWali.mock.calls.at(-1)[0].token;
}

(adaDatabase ? describe : describe.skip)('UC02 konfirmasi registrasi oleh wali', () => {
  beforeAll(async () => {
    const baca = (nama) => fs.readFileSync(path.join(__dirname, '../config', nama), 'utf8');
    await db.query(baca('schema.sql'));
    await db.query(baca('seed.sql'));
  });

  beforeEach(() => jest.clearAllMocks());

  afterAll(() => db.pool.end());

  test('data pendaftaran untuk I-06 tanpa riwayat kesehatan', async () => {
    const res = await request(app).get(`/api/auth/confirm/${TOKEN_ANDI}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      nama: 'Andi Pratama',
      email: 'andi.siswa@mahasehat.id',
      nomor_telepon: '081298765433',
      tanggal_daftar: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
  });

  test('token yang tidak ada ditolak', async () => {
    await request(app).get('/api/auth/confirm/TIDAK-ADA').expect(404);
    await request(app).post('/api/auth/confirm/TIDAK-ADA').expect(404);
    await request(app).post('/api/auth/reject/TIDAK-ADA').expect(404);
  });

  test('setuju mengaktifkan akun dan menghubungkan pelajar ke akun wali', async () => {
    const res = await request(app).post(`/api/auth/confirm/${TOKEN_ANDI}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ status_akun: 'Aktif', terhubung_ke_wali: true });
    expect(await akun('andi.siswa@mahasehat.id')).toEqual({
      status_akun: 'Aktif',
      token_konfirmasi: null,
      id_wali: 'WALI-001',
    });
  });

  test('token hanya bisa dipakai sekali, setuju maupun tolak', async () => {
    await request(app).post(`/api/auth/confirm/${TOKEN_ANDI}`).expect(404);
    await request(app).post(`/api/auth/reject/${TOKEN_ANDI}`).expect(404);
    await request(app).get(`/api/auth/confirm/${TOKEN_ANDI}`).expect(404);
  });

  test('tidak setuju membuat akun Ditolak dan tidak terhubung ke wali', async () => {
    const token = await daftarPelajarDiBawahUmur('ditolak@contoh.test', 'santoso.wali@mahasehat.id');
    const res = await request(app).post(`/api/auth/reject/${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ status_akun: 'Ditolak', terhubung_ke_wali: false });
    expect(await akun('ditolak@contoh.test')).toEqual({
      status_akun: 'Ditolak',
      token_konfirmasi: null,
      id_wali: null,
    });
  });

  test('token milik akun yang sudah tidak menunggu konfirmasi ditolak', async () => {
    const token = await daftarPelajarDiBawahUmur('sudahaktif@contoh.test', 'wali.lain@contoh.test');
    await db.query("UPDATE pengguna SET status_akun = 'Aktif' WHERE email = 'sudahaktif@contoh.test';");
    await request(app).get(`/api/auth/confirm/${token}`).expect(404);
    await request(app).post(`/api/auth/reject/${token}`).expect(404);
    expect((await akun('sudahaktif@contoh.test')).status_akun).toBe('Aktif');
  });

  test('setuju tetap mengaktifkan akun walau wali belum punya akun', async () => {
    const token = await daftarPelajarDiBawahUmur('tanpawali@contoh.test', 'belum.daftar@contoh.test');
    const res = await request(app).post(`/api/auth/confirm/${token}`);
    expect(res.body.data).toEqual({ status_akun: 'Aktif', terhubung_ke_wali: false });
    expect((await akun('tanpawali@contoh.test')).id_wali).toBeNull();
  });
});
