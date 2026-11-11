// UC10 Keluar Akun.
// Berjalan bila TEST_DATABASE_URL diisi; isi basis data tersebut akan dihapus.
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

const PASSWORD = 'Password123!';
const adaDatabase = Boolean(process.env.TEST_DATABASE_URL);
const pakai = (token) => ({ Authorization: `Bearer ${token}` });

async function login(email) {
  const res = await request(app).post('/api/auth/login').send({ email, password: PASSWORD });
  return res.body.data.token;
}

(adaDatabase ? describe : describe.skip)('UC10 keluar akun', () => {
  beforeAll(async () => {
    const baca = (nama) => fs.readFileSync(path.join(__dirname, '../config', nama), 'utf8');
    await db.query(baca('schema.sql'));
    await db.query(baca('seed.sql'));
    await db.query('UPDATE pengguna SET password_hash = $1;', [await bcrypt.hash(PASSWORD, 4)]);
  });

  afterAll(() => db.pool.end());

  test('token tidak berlaku lagi setelah logout, lalu bisa login ulang', async () => {
    const token = await login('hendra.psikiater@mahasehat.id');
    await request(app).get('/api/auth/me').set(pakai(token)).expect(200);
    await request(app).post('/api/auth/logout').set(pakai(token)).expect(200);
    await request(app).get('/api/auth/me').set(pakai(token)).expect(401);
    await request(app).post('/api/auth/logout').set(pakai(token)).expect(401);

    const ulang = await login('hendra.psikiater@mahasehat.id');
    await request(app).get('/api/auth/me').set(pakai(ulang)).expect(200);
  });

  test('logout mengakhiri semua sesi akun tersebut', async () => {
    const sesiA = await login('budi.pelajar@mahasehat.id');
    const sesiB = await login('budi.pelajar@mahasehat.id');
    await request(app).post('/api/auth/logout').set(pakai(sesiA)).expect(200);
    await request(app).get('/api/auth/me').set(pakai(sesiB)).expect(401);
  });

  test('logout akun lain tidak memengaruhi sesi pengguna lain', async () => {
    const wali = await login('santoso.wali@mahasehat.id');
    const nakes = await login('siti.psikolog@mahasehat.id');
    await request(app).post('/api/auth/logout').set(pakai(nakes)).expect(200);
    await request(app).get('/api/auth/me').set(pakai(wali)).expect(200);
  });

  test('logout tanpa token ditolak', async () => {
    await request(app).post('/api/auth/logout').expect(401);
  });
});
