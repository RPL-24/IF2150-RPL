// Perilaku fondasi basis data. Berjalan bila TEST_DATABASE_URL diisi; isi basis data tersebut akan dihapus.
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { aturPasswordAkunUji, HASH_PENANDA_SEED } = require('../config/initDb');
const Pelajar = require('../models/Pelajar');
const CheckIn = require('../models/CheckIn');

const adaDatabase = Boolean(process.env.TEST_DATABASE_URL);

(adaDatabase ? describe : describe.skip)('Fondasi basis data', () => {
  beforeAll(async () => {
    const baca = (nama) => fs.readFileSync(path.join(__dirname, '../config', nama), 'utf8');
    await db.query(baca('schema.sql'));
    await db.query(baca('seed.sql'));
  });

  afterAll(() => db.pool.end());

  describe('Pelajar.setCheckIn', () => {
    const isi = { skalaMood: 3, jamTidur: '22:00', jamBangun: '06:00', polaMakan: 'Teratur' };

    test('check-in pertama hari ini tersimpan', async () => {
      const citra = await Pelajar.findById('PLJ-003');
      await citra.setCheckIn(CheckIn.createCheckIn(isi));
      const [terbaru] = await citra.getCheckInHistory(1);
      expect(terbaru.skalaMood).toBe(3);
    });

    test('check-in kedua di hari yang sama ditolak dengan 409, bukan galat 500', async () => {
      const citra = await Pelajar.findById('PLJ-003');
      await expect(citra.setCheckIn(CheckIn.createCheckIn(isi))).rejects.toMatchObject({
        status: 409,
        message: 'Anda sudah melakukan check-in hari ini.',
      });
    });

    test('galat lain tetap diteruskan apa adanya', async () => {
      const tanpaProfil = new Pelajar({ id_pelajar: 'TIDAK-ADA' });
      await expect(tanpaProfil.setCheckIn(CheckIn.createCheckIn(isi))).rejects.toMatchObject({
        code: '23503',
      });
    });
  });

  describe('aturPasswordAkunUji (initDb --seed)', () => {
    test('hanya mengganti akun uji yang masih memakai penanda seed', async () => {
      const hashLain = await bcrypt.hash('PasswordAsli1', 4);
      await db.query(
        `INSERT INTO pengguna (username, email, password_hash, role, status_akun)
         VALUES ('asli@contoh.test', 'asli@contoh.test', $1, 'OrangTuaWali', 'Aktif');`,
        [hashLain]
      );
      const jumlahSeed = Number(
        (await db.query('SELECT COUNT(*) AS n FROM pengguna WHERE password_hash = $1;', [HASH_PENANDA_SEED]))
          .rows[0].n
      );

      expect(await aturPasswordAkunUji()).toBe(jumlahSeed);

      const { rows } = await db.query(
        "SELECT email, password_hash FROM pengguna WHERE email IN ('asli@contoh.test', 'budi.pelajar@mahasehat.id');"
      );
      const hash = Object.fromEntries(rows.map((baris) => [baris.email, baris.password_hash]));
      expect(hash['asli@contoh.test']).toBe(hashLain);
      expect(await bcrypt.compare('Password123!', hash['budi.pelajar@mahasehat.id'])).toBe(true);
    });

    test('dijalankan ulang tidak mengubah apa pun karena penanda sudah diganti', async () => {
      expect(await aturPasswordAkunUji()).toBe(0);
    });
  });
});
