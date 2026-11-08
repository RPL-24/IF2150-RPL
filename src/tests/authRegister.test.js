jest.mock('../config/db', () => ({
  query: jest.fn(),
  withTransaction: jest.fn(),
}));

jest.mock('../utils/mailer', () => ({
  kirimEmailKonfirmasiWali: jest.fn(),
}));

const request = require('supertest');
const db = require('../config/db');
const { kirimEmailKonfirmasiWali } = require('../utils/mailer');
const app = require('../app');
const { hariIni, tambahHari } = require('../utils/waktu');

function dataPelajar(ubahan = {}) {
  return {
    nama: 'Budi Pratama',
    email: 'budi@example.com',
    telepon: '081234567890',
    role: 'pelajar',
    password: 'Password123!',
    confirm_password: 'Password123!',
    tanggal_lahir: '2015-01-01',
    riwayat_kesehatan: 'Sering cemas saat ujian.',
    email_orang_tua: 'wali@example.com',
    ...ubahan,
  };
}

let client;

beforeEach(() => {
  jest.clearAllMocks();
  client = {
    query: jest.fn(async (sql) => {
      if (/INSERT INTO pengguna/i.test(sql)) {
        return { rows: [{ id_pengguna: 42 }], rowCount: 1 };
      }
      if (/UPDATE pelajar p SET id_wali/i.test(sql)) {
        return { rows: [{ id_pelajar: 'PLJ-1' }], rowCount: 1 };
      }
      return { rows: [], rowCount: 1 };
    }),
  };
  db.withTransaction.mockImplementation((fn) => fn(client));
  db.query.mockResolvedValue({ rows: [] });
  kirimEmailKonfirmasiWali.mockResolvedValue(undefined);
});

describe('POST /api/auth/register (UC01, Algo-C11-01, Algo-C11-02)', () => {
  test('menolak format email yang tidak valid tanpa menyentuh basis data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(dataPelajar({ email: 'bukan-email' }));

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email/i);
    expect(db.withTransaction).not.toHaveBeenCalled();
  });

  test('menolak kata sandi kurang dari 8 karakter', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(dataPelajar({ password: 'pendek', confirm_password: 'pendek' }));

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/kata sandi/i);
  });

  test('menolak pelajar di bawah 18 tahun tanpa email orang tua/wali', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(dataPelajar({ email_orang_tua: '' }));

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/orang tua\/wali/i);
  });

  test('menolak role yang tidak dikenal', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(dataPelajar({ role: 'admin' }));

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/role/i);
  });

  test('mengembalikan 409 bila email sudah terdaftar', async () => {
    db.query.mockResolvedValue({
      rows: [{ id_pengguna: 1, email: 'budi@example.com', role: 'Pelajar' }],
    });

    const res = await request(app).post('/api/auth/register').send(dataPelajar());

    expect(res.status).toBe(409);
    expect(db.withTransaction).not.toHaveBeenCalled();
  });

  test('pelajar di bawah umur disimpan sebagai Belum Terverifikasi dan wali dikirimi token', async () => {
    const res = await request(app).post('/api/auth/register').send(dataPelajar());

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('Pelajar');
    expect(res.body.data.status_akun).toBe('Belum Terverifikasi');

    const sql = client.query.mock.calls.map(([query]) => query).join('\n');
    expect(sql).toMatch(/INSERT INTO pelajar/);
    expect(sql).toMatch(/INSERT INTO riwayat_kesehatan/);

    const riwayat = client.query.mock.calls.find(([query]) =>
      /INSERT INTO riwayat_kesehatan/.test(query)
    );
    expect(riwayat[1][1]).not.toBe('Sering cemas saat ujian.');

    expect(kirimEmailKonfirmasiWali).toHaveBeenCalledTimes(1);
    const parameter = kirimEmailKonfirmasiWali.mock.calls[0][0];
    expect(parameter.emailWali).toBe('wali@example.com');
    expect(parameter.token).toMatch(/^[a-f0-9]{64}$/);
  });

  test('pelajar dewasa langsung aktif tanpa email konfirmasi', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(dataPelajar({ tanggal_lahir: '2000-01-01' }));

    expect(res.status).toBe(201);
    expect(res.body.data.status_akun).toBe('Aktif');
    expect(kirimEmailKonfirmasiWali).not.toHaveBeenCalled();
  });

  test('registrasi orang tua/wali langsung aktif dan menautkan pelajar', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nama: 'Santoso Pratama',
      email: 'wali@example.com',
      telepon: '081234567890',
      role: 'orangtuawali',
      password: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('OrangTuaWali');
    expect(res.body.data.status_akun).toBe('Aktif');

    const sql = client.query.mock.calls.map(([query]) => query).join('\n');
    expect(sql).toMatch(/INSERT INTO orang_tua_wali/);
    expect(sql).toMatch(/UPDATE pelajar p SET id_wali/);
  });

  test('registrasi tenaga kesehatan menyimpan profil praktik', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nama: 'Siti Rahmawati',
      email: 'siti@example.com',
      telepon: '081311112222',
      role: 'tenagakesehatan',
      password: 'Password123!',
      jenis_tenaga_kesehatan: 'Psikolog',
      lokasi: 'Klinik Sehat',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('TenagaKesehatan');

    const sql = client.query.mock.calls.map(([query]) => query).join('\n');
    expect(sql).toMatch(/INSERT INTO tenaga_kesehatan/);
  });

  test('mengembalikan 409 saat email bentrok di tengah transaksi', async () => {
    client.query.mockImplementation(async (sql) => {
      if (/INSERT INTO pengguna/i.test(sql)) {
        const err = new Error('duplicate key value violates unique constraint');
        err.code = '23505';
        throw err;
      }
      return { rows: [], rowCount: 1 };
    });

    const res = await request(app).post('/api/auth/register').send(dataPelajar());

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/sudah terdaftar/i);
  });
});

describe('Validasi nama, tanggal lahir, dan penautan wali', () => {
  function walinyaSudahPunyaAkun() {
    const asli = client.query.getMockImplementation();
    client.query.mockImplementation(async (sql, params) => {
      if (/SELECT id_wali FROM orang_tua_wali/i.test(sql)) {
        return { rows: [{ id_wali: 'WALI-9' }], rowCount: 1 };
      }
      return asli(sql, params);
    });
  }

  function idWaliYangDisimpan() {
    const insert = client.query.mock.calls.find(([sql]) => /INSERT INTO pelajar/.test(sql));
    return insert[1][2];
  }

  test.each(['dr. Andi Pratama, Sp.KJ', "Nur'aini", 'Siti Aisyah-Putri'])(
    'menerima nama bergelar atau berapostrof: %s',
    async (nama) => {
      const res = await request(app).post('/api/auth/register').send(dataPelajar({ nama }));
      expect(res.status).toBe(201);
    }
  );

  test.each(['Andi123', '.Andi', '<script>', 'Andi_Pratama'])('tetap menolak nama %s', async (nama) => {
    const res = await request(app).post('/api/auth/register').send(dataPelajar({ nama }));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/nama/i);
    expect(db.withTransaction).not.toHaveBeenCalled();
  });

  test('menolak tanggal lahir setelah hari ini', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(dataPelajar({ tanggal_lahir: tambahHari(hariIni(), 1) }));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/tanggal lahir/i);
    expect(db.withTransaction).not.toHaveBeenCalled();
  });

  test('pelajar dewasa langsung terhubung ke wali yang sudah punya akun', async () => {
    walinyaSudahPunyaAkun();
    const res = await request(app)
      .post('/api/auth/register')
      .send(dataPelajar({ tanggal_lahir: '2000-01-01', email_orang_tua: 'WALI@example.com' }));
    expect(res.status).toBe(201);
    expect(idWaliYangDisimpan()).toBe('WALI-9');
  });

  test('pelajar dewasa tanpa akun wali tetap tersimpan tanpa wali', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(dataPelajar({ tanggal_lahir: '2000-01-01' }));
    expect(res.status).toBe(201);
    expect(idWaliYangDisimpan()).toBeNull();
  });

  test('pelajar di bawah umur belum dihubungkan sebelum wali menyetujui', async () => {
    walinyaSudahPunyaAkun();
    const res = await request(app).post('/api/auth/register').send(dataPelajar());
    expect(res.status).toBe(201);
    expect(idWaliYangDisimpan()).toBeNull();
  });
});
