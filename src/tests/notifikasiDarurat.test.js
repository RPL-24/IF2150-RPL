// UC08 Menerima dan Menindaklanjuti Notifikasi Darurat.
// Test pengiriman ulang berjalan tanpa basis data; test alur lengkap berjalan bila TEST_DATABASE_URL diisi
// (isi basis data tersebut akan dihapus).
jest.mock('../utils/kirimEmail', () => ({
  kirimEmail: jest.fn().mockResolvedValue(undefined),
  urlAplikasi: () => 'http://localhost:3000',
}));

const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const mailer = require('../utils/kirimEmail');
const { generateToken } = require('../middleware/authMiddleware');
const NotifikasiDaruratController = require('../controllers/NotifikasiDaruratController');
const NotifikasiDarurat = require('../models/NotifikasiDarurat');
const Pelajar = require('../models/Pelajar');

const adaDatabase = Boolean(process.env.TEST_DATABASE_URL);

beforeEach(() => {
  mailer.kirimEmail.mockReset();
  mailer.kirimEmail.mockResolvedValue(undefined);
});

afterEach(() => jest.restoreAllMocks());

describe('Pengiriman ulang notifikasi darurat (KNF06)', () => {
  function notifikasiPalsu(emailTujuan = 'wali@contoh.test') {
    return {
      emailTujuan,
      namaPelajar: 'Citra',
      ringkasanKondisi: 'Rata-rata mood 1,7 dari 5.',
      catatPengiriman: jest.fn().mockResolvedValue(undefined),
    };
  }

  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));

  test('berhasil pada percobaan ketiga dan mencatat jumlah percobaan', async () => {
    mailer.kirimEmail
      .mockRejectedValueOnce(new Error('koneksi putus'))
      .mockRejectedValueOnce(new Error('koneksi putus'));
    const notifikasi = notifikasiPalsu();

    expect(await NotifikasiDaruratController.sendEmergencyNotification(notifikasi)).toBe(true);
    expect(mailer.kirimEmail).toHaveBeenCalledTimes(3);
    expect(notifikasi.catatPengiriman).toHaveBeenCalledWith(true, 3);
  });

  test('berhenti setelah pengiriman awal ditambah tiga kali ulang', async () => {
    mailer.kirimEmail.mockRejectedValue(new Error('server mati'));
    const notifikasi = notifikasiPalsu();

    expect(await NotifikasiDaruratController.sendEmergencyNotification(notifikasi)).toBe(false);
    expect(mailer.kirimEmail).toHaveBeenCalledTimes(4);
    expect(notifikasi.catatPengiriman).toHaveBeenCalledWith(false, 4);
  });

  test('tanpa alamat tujuan tidak mencoba mengirim', async () => {
    const notifikasi = notifikasiPalsu(null);

    expect(await NotifikasiDaruratController.sendEmergencyNotification(notifikasi)).toBe(false);
    expect(mailer.kirimEmail).not.toHaveBeenCalled();
  });

  test('isi e-mail tidak memuat teks jurnal pelajar (KNF02)', async () => {
    await NotifikasiDaruratController.sendEmergencyNotification(notifikasiPalsu());
    const { text } = mailer.kirimEmail.mock.calls[0][0];
    expect(text).toContain('Rata-rata mood');
    expect(text).not.toMatch(/catatan|jurnal|refleksi/i);
  });
});

(adaDatabase ? describe : describe.skip)('API notifikasi darurat (UC08)', () => {
  // Akun seed: Ratna (id_pengguna 8, WALI-002) wali Citra (PLJ-003); Santoso (3, WALI-001); Budi (1, PLJ-001)
  const tokenRatna = () =>
    generateToken({ idPengguna: 8, role: 'OrangTuaWali', idProfil: 'WALI-002', versiToken: 0 });
  const tokenSantoso = () =>
    generateToken({ idPengguna: 3, role: 'OrangTuaWali', idProfil: 'WALI-001', versiToken: 0 });
  const tokenBudi = () => generateToken({ idPengguna: 1, role: 'Pelajar', idProfil: 'PLJ-001', versiToken: 0 });
  const pakai = (token) => ({ Authorization: `Bearer ${token}` });
  const statusDarurat = async (idPelajar) =>
    (await db.query('SELECT status_darurat FROM pelajar WHERE id_pelajar = $1;', [idPelajar])).rows[0]
      .status_darurat;
  const barisNotifikasi = async (id) =>
    (await db.query('SELECT * FROM notifikasi_darurat WHERE id = $1;', [id])).rows[0];
  let idNotifikasi;

  beforeAll(async () => {
    const baca = (nama) => fs.readFileSync(path.join(__dirname, '../config', nama), 'utf8');
    await db.query(baca('schema.sql'));
    await db.query(baca('seed.sql'));
  });

  afterAll(() => db.pool.end());

  test('job menandai pelajar yang berhenti check-in setelah kondisinya memburuk', async () => {
    const hasil = await NotifikasiDaruratController.jalankanEvaluasiHarian();

    expect(hasil.jumlahDarurat).toBe(1);
    expect(await statusDarurat('PLJ-003')).toBe(true);
    expect(mailer.kirimEmail.mock.calls[0][0].to).toBe('ratna.wali@mahasehat.id');
  });

  test('pelajar yang aktif check-in tidak dianggap darurat', async () => {
    expect(await statusDarurat('PLJ-001')).toBe(false);
  });

  test('pelajar yang berhenti lebih dari 7 hari tetap terdeteksi walau wali belum punya akun', async () => {
    await db.query(
      `INSERT INTO pengguna (id_pengguna, username, email, password_hash, role, status_akun)
       VALUES (90, 'lama@contoh.test', 'lama@contoh.test', 'h', 'Pelajar', 'Aktif');`
    );
    await db.query(
      `INSERT INTO pelajar (id_pelajar, id_pengguna, nama, tanggal_lahir, nomor_telepon, email_wali)
       VALUES ('PLJ-LAMA', 90, 'Pelajar Lama', '2002-01-01', '0810', 'wali.lama@contoh.test');`
    );
    for (const hari of [20, 21, 22]) {
      await db.query(
        `INSERT INTO check_in (id_check_in, id_pelajar, tanggal_check_in, skala_mood, jam_tidur, jam_bangun, pola_makan)
         VALUES ($1, 'PLJ-LAMA', CURRENT_DATE - $2::int, 1, '02:00', '06:00', 'Kurang');`,
        [`LAMA-${hari}`, hari]
      );
    }

    await NotifikasiDaruratController.jalankanEvaluasiHarian();
    const { rows } = await db.query(
      "SELECT id_wali, email_tujuan FROM notifikasi_darurat WHERE id_pelajar = 'PLJ-LAMA';"
    );
    expect(rows).toEqual([{ id_wali: null, email_tujuan: 'wali.lama@contoh.test' }]);
  });

  test('job berikutnya tidak membuat notifikasi ganda', async () => {
    const hasil = await NotifikasiDaruratController.jalankanEvaluasiHarian();
    expect(hasil.jumlahDarurat).toBe(0);
  });

  test('tanggal check-in terakhir diambil dari yang terbaru walau urutan riwayat acak', async () => {
    const pelajar = await Pelajar.findById('PLJ-003');
    const riwayat = await pelajar.getCheckInHistory(7);
    const terbaru = riwayat[0].tanggalCheckIn;
    const cek = jest.spyOn(NotifikasiDarurat, 'sudahDilaporkanSejak');

    await NotifikasiDaruratController.evaluasiPelajar(pelajar, [...riwayat].reverse());
    expect(cek).toHaveBeenCalledWith('PLJ-003', terbaru);
  });

  test('evaluasi yang berjalan bersamaan tidak membuat galat atau notifikasi ganda', async () => {
    jest.spyOn(NotifikasiDarurat, 'sudahDilaporkanSejak').mockResolvedValue(false);
    const pelajar = await Pelajar.findById('PLJ-003');
    const riwayat = await pelajar.getCheckInHistory(7);

    expect(await NotifikasiDaruratController.evaluasiPelajar(pelajar, riwayat)).toBeNull();
    const { rows } = await db.query(
      "SELECT COUNT(*)::int AS n FROM notifikasi_darurat WHERE id_pelajar = 'PLJ-003';"
    );
    expect(rows[0].n).toBe(1);
  });

  test('wali melihat notifikasi aktif pelajarnya', async () => {
    const res = await request(app).get('/api/emergency/wali').set(pakai(tokenRatna()));

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].nama_pelajar).toBe('Citra Lestari');
    expect(res.body.data[0].ringkasan_kondisi).toContain('Rata-rata mood');
    idNotifikasi = res.body.data[0].id;
  });

  test('wali lain, pelajar, dan tanpa login tidak bisa mengonfirmasi', async () => {
    await request(app).put(`/api/emergency/${idNotifikasi}/confirm`).set(pakai(tokenSantoso())).expect(403);
    await request(app).put(`/api/emergency/${idNotifikasi}/confirm`).set(pakai(tokenBudi())).expect(403);
    await request(app).put(`/api/emergency/${idNotifikasi}/confirm`).expect(401);
    await request(app).put('/api/emergency/TIDAK-ADA/confirm').set(pakai(tokenRatna())).expect(404);
  });

  test('konfirmasi kedua tidak menimpa waktu konfirmasi pertama', async () => {
    await request(app).put(`/api/emergency/${idNotifikasi}/confirm`).set(pakai(tokenRatna())).expect(200);
    const pertama = (await barisNotifikasi(idNotifikasi)).waktu_konfirmasi;
    await request(app).put(`/api/emergency/${idNotifikasi}/confirm`).set(pakai(tokenRatna())).expect(200);

    const baris = await barisNotifikasi(idNotifikasi);
    expect(baris.status).toBe('Diterima');
    expect(baris.waktu_konfirmasi).toEqual(pertama);
  });

  test('tindak lanjut tercatat dan status darurat kembali normal', async () => {
    await request(app).put(`/api/emergency/${idNotifikasi}/follow-up`).set(pakai(tokenRatna())).expect(200);

    const baris = await barisNotifikasi(idNotifikasi);
    expect(baris.status_tindak_lanjut).toBe('Sudah Ditindaklanjuti');
    expect(baris.waktu_tindak_lanjut).not.toBeNull();
    expect(await statusDarurat('PLJ-003')).toBe(false);

    const sisa = await request(app).get('/api/emergency/wali').set(pakai(tokenRatna()));
    expect(sisa.body.data).toHaveLength(0);
  });

  test('kasus yang sudah ditindaklanjuti tidak dilaporkan ulang sebelum ada check-in baru', async () => {
    const hasil = await NotifikasiDaruratController.jalankanEvaluasiHarian();
    expect(hasil.jumlahDarurat).toBe(0);
    expect(await statusDarurat('PLJ-003')).toBe(false);
  });

  test('tindak lanjut tanpa menekan "Diterima" juga mencatat konfirmasi', async () => {
    await db.query("UPDATE pelajar SET id_wali = 'WALI-002' WHERE id_pelajar = 'PLJ-LAMA';");
    await db.query("UPDATE notifikasi_darurat SET id_wali = 'WALI-002' WHERE id_pelajar = 'PLJ-LAMA';");
    const { rows } = await db.query("SELECT id FROM notifikasi_darurat WHERE id_pelajar = 'PLJ-LAMA';");

    await request(app).put(`/api/emergency/${rows[0].id}/follow-up`).set(pakai(tokenRatna())).expect(200);
    const baris = await barisNotifikasi(rows[0].id);
    expect(baris.status).toBe('Diterima');
    expect(baris.waktu_konfirmasi).not.toBeNull();
    expect(baris.status_tindak_lanjut).toBe('Sudah Ditindaklanjuti');
  });

  test('menindaklanjuti ulang notifikasi lama tidak menghapus status darurat notifikasi yang masih aktif', async () => {
    await db.query("UPDATE pelajar SET status_darurat = TRUE WHERE id_pelajar = 'PLJ-003';");
    await NotifikasiDarurat.tambah(db, {
      idPelajar: 'PLJ-003',
      idWali: 'WALI-002',
      emailTujuan: 'ratna.wali@mahasehat.id',
      ringkasanKondisi: 'Kasus baru',
    });

    await request(app).put(`/api/emergency/${idNotifikasi}/follow-up`).set(pakai(tokenRatna())).expect(200);
    expect(await statusDarurat('PLJ-003')).toBe(true);
  });

  test('notifikasi yang belum direspons lebih dari 24 jam dikirim ulang', async () => {
    await db.query(
      `UPDATE notifikasi_darurat SET status = 'Terkirim', waktu_kirim = NOW() - INTERVAL '25 hours'
       WHERE id_pelajar = 'PLJ-003' AND status_tindak_lanjut = 'Belum Ditindaklanjuti';`
    );

    const hasil = await NotifikasiDaruratController.jalankanEvaluasiHarian();
    expect(hasil.jumlahDikirimUlang).toBe(1);
    expect(mailer.kirimEmail.mock.calls.some(([isi]) => isi.text.includes('Kasus baru'))).toBe(true);
  });

  test('kegagalan saat mengirim ulang satu notifikasi tidak menghentikan job', async () => {
    await db.query(
      `UPDATE notifikasi_darurat SET waktu_kirim = NOW() - INTERVAL '25 hours'
       WHERE id_pelajar = 'PLJ-003' AND status_tindak_lanjut = 'Belum Ditindaklanjuti';`
    );
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(NotifikasiDarurat.prototype, 'catatPengiriman').mockRejectedValue(new Error('basis data sibuk'));

    const hasil = await NotifikasiDaruratController.jalankanEvaluasiHarian();
    expect(hasil.jumlahDikirimUlang).toBe(0);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Gagal mengirim ulang'), 'basis data sibuk');
  });
});
