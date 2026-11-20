// src/tests/unit/NotifikasiController.test.js
// Uji C19 NotifikasiController bagian notifikasi in-app dan Web Push (Modul D, KF34, Algo-020).
const request = require('supertest');
const app = require('../../app');
const NotifikasiController = require('../../controllers/NotifikasiController');
const Notifikasi = require('../../models/Notifikasi');
const LanggananPush = require('../../models/LanggananPush');
const PushNotifikasiAdapter = require('../../integrasi/PushNotifikasiAdapter');
const Otorisasi = require('../../pendukung/Otorisasi');

const ID_AKUN = '11111111-1111-4111-8111-111111111111';
const ID_NOTIF = '22222222-2222-4222-8222-222222222222';

const LANGGANAN_VALID = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
  expirationTime: null,
  keys: {
    p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM',
    auth: 'tBHItJI5svbpez7KI4CCXg',
  },
};

describe('NotifikasiController (C19)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('kirimNotifikasi dan kirimPushNotifikasi (Algo-020)', () => {
    test('C19-UT01 [Normal] kirimNotifikasi: menyimpan notifikasi, menghitung belum dibaca, dan memicu push dengan tautan /percakapan', async () => {
      const simpan = jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(true);
      const hitung = jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(3);
      const kirimPush = jest.spyOn(PushNotifikasiAdapter, 'kirimPush').mockResolvedValue(true);

      const hasil = await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Pesan baru dari Budi');

      expect(hasil).toBe(true);
      expect(simpan).toHaveBeenCalledWith(ID_AKUN, 'pesan', 'Pesan baru dari Budi', expect.any(Date), false);
      expect(hitung).toHaveBeenCalledWith(ID_AKUN);
      expect(kirimPush).toHaveBeenCalledWith(ID_AKUN, 'ITBELI', 'Pesan baru dari Budi', '/percakapan');
    });

    test('C19-UT02 [Negatif] kirimNotifikasi: push gagal (melempar galat) tetap mengembalikan true', async () => {
      jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(true);
      jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(1);
      jest.spyOn(PushNotifikasiAdapter, 'kirimPush').mockRejectedValue(new Error('push service mati'));
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Halo')).toBe(true);
    });

    test('C19-UT03 [Batas] kirimNotifikasi: push tidak terkirim (false) tetap mengembalikan true', async () => {
      jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(true);
      jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(1);
      jest.spyOn(PushNotifikasiAdapter, 'kirimPush').mockResolvedValue(false);

      expect(await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Halo')).toBe(true);
    });

    test('C19-UT04 [Batas] kirimNotifikasi: tidak menunggu push selesai agar push service lambat tidak menahan pengirim pesan', async () => {
      jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(true);
      jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(1);
      // Janji yang tidak pernah selesai meniru push service yang tidak menjawab
      const kirimPush = jest.spyOn(PushNotifikasiAdapter, 'kirimPush').mockReturnValue(new Promise(() => {}));

      expect(await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Halo')).toBe(true);
      expect(kirimPush).toHaveBeenCalledWith(ID_AKUN, 'ITBELI', 'Halo', '/percakapan');
    });

    test('C19-UT05 [Negatif] kirimNotifikasi: gagal menyimpan mengembalikan false tanpa memicu push', async () => {
      jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(false);
      const kirimPush = jest.spyOn(PushNotifikasiAdapter, 'kirimPush');

      expect(await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Halo')).toBe(false);
      expect(kirimPush).not.toHaveBeenCalled();
    });

    test('C19-UT06 [Batas] kirimPushNotifikasi: jenis bawaan memakai /percakapan dan jenis lain memakai /', async () => {
      const kirimPush = jest.spyOn(PushNotifikasiAdapter, 'kirimPush').mockResolvedValue(true);

      await NotifikasiController.kirimPushNotifikasi(ID_AKUN, 'Pesan baru');
      expect(kirimPush).toHaveBeenLastCalledWith(ID_AKUN, 'ITBELI', 'Pesan baru', '/percakapan');

      await NotifikasiController.kirimPushNotifikasi(ID_AKUN, 'Info umum', 'sistem');
      expect(kirimPush).toHaveBeenLastCalledWith(ID_AKUN, 'ITBELI', 'Info umum', '/');
    });
  });

  describe('simpanLanggananPush dan validasiLanggananPush', () => {
    test('C19-UT07 [Normal] simpanLanggananPush: langganan valid disimpan', async () => {
      const simpan = jest.spyOn(LanggananPush, 'simpan').mockResolvedValue(true);

      const hasil = await NotifikasiController.simpanLanggananPush(ID_AKUN, LANGGANAN_VALID);

      expect(hasil.berhasil).toBe(true);
      expect(simpan).toHaveBeenCalledWith(
        ID_AKUN,
        LANGGANAN_VALID.endpoint,
        LANGGANAN_VALID.keys.p256dh,
        LANGGANAN_VALID.keys.auth,
      );
    });

    test.each([
      ['tanpa body', undefined],
      ['endpoint bukan https', { ...LANGGANAN_VALID, endpoint: 'http://push.contoh.test/1' }],
      ['endpoint bukan URL', { ...LANGGANAN_VALID, endpoint: 'bukan-url' }],
      ['endpoint > 500 karakter', { ...LANGGANAN_VALID, endpoint: `https://push.test/${'a'.repeat(490)}` }],
      ['tanpa keys', { endpoint: LANGGANAN_VALID.endpoint }],
      ['p256dh kosong', { ...LANGGANAN_VALID, keys: { p256dh: '', auth: 'abc' } }],
      ['p256dh > 200 karakter', { ...LANGGANAN_VALID, keys: { p256dh: 'p'.repeat(201), auth: 'abc' } }],
      ['auth tidak ada', { ...LANGGANAN_VALID, keys: { p256dh: 'abc' } }],
      ['auth hanya spasi', { ...LANGGANAN_VALID, keys: { p256dh: 'abc', auth: '   ' } }],
      ['auth > 100 karakter', { ...LANGGANAN_VALID, keys: { p256dh: 'abc', auth: 'k'.repeat(101) } }],
    ])('C19-UT08 [Negatif] simpanLanggananPush: langganan tidak valid ditolak (%s)', async (_, langganan) => {
      const simpan = jest.spyOn(LanggananPush, 'simpan');

      const hasil = await NotifikasiController.simpanLanggananPush(ID_AKUN, langganan);

      expect(hasil.berhasil).toBe(false);
      expect(hasil.kodePesan).toBe('DATA_TIDAK_VALID');
      expect(simpan).not.toHaveBeenCalled();
    });

    test('C19-UT09 [Batas] validasiLanggananPush: panjang tepat pada batas (endpoint 500, p256dh 200, auth 100) diterima', () => {
      const prefix = 'https://push.test/';
      const batas = {
        endpoint: prefix + 'x'.repeat(500 - prefix.length),
        keys: { p256dh: 'p'.repeat(200), auth: 'a'.repeat(100) },
      };
      expect(batas.endpoint).toHaveLength(500);
      expect(NotifikasiController.validasiLanggananPush(batas)).toBe(true);
    });
  });

  describe('tandaiDibaca, getDaftarNotifikasi, dan getKunciPublik', () => {
    test('C19-UT10 [Negatif] tandaiDibaca: notifikasi bukan milik akun gagal TIDAK_DITEMUKAN', async () => {
      jest.spyOn(Notifikasi, 'tandaiDibaca').mockResolvedValue(false);

      const hasil = await NotifikasiController.tandaiDibaca(ID_AKUN, ID_NOTIF);

      expect(hasil.berhasil).toBe(false);
      expect(hasil.kodePesan).toBe('TIDAK_DITEMUKAN');
    });

    test('C19-UT11 [Negatif] tandaiDibaca: id bukan UUID atau kosong gagal tanpa menyentuh basis data', async () => {
      const tandai = jest.spyOn(Notifikasi, 'tandaiDibaca');

      expect((await NotifikasiController.tandaiDibaca(ID_AKUN, 'bukan-uuid')).berhasil).toBe(false);
      expect((await NotifikasiController.tandaiDibaca(ID_AKUN, null)).berhasil).toBe(false);
      expect(tandai).not.toHaveBeenCalled();
    });

    test('C19-UT12 [Normal] tandaiDibaca: notifikasi milik akun mengembalikan jumlah belum dibaca terbaru', async () => {
      const tandai = jest.spyOn(Notifikasi, 'tandaiDibaca').mockResolvedValue(true);
      jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(2);

      const hasil = await NotifikasiController.tandaiDibaca(ID_AKUN, ID_NOTIF);

      expect(tandai).toHaveBeenCalledWith(ID_NOTIF, ID_AKUN);
      expect(hasil).toEqual({ berhasil: true, data: { belumDibaca: 2 } });
    });

    test('C19-UT13 [Normal] getDaftarNotifikasi: memetakan daftar (maks 50) dan jumlah belum dibaca', async () => {
      const waktu = new Date('2026-11-09T06:00:00Z');
      const getDaftar = jest.spyOn(Notifikasi, 'getDaftarByAkun').mockResolvedValue([
        new Notifikasi({ idNotifikasi: ID_NOTIF, idAkun: ID_AKUN, jenis: 'pesan', isi: 'Halo', waktuKirim: waktu, statusBaca: false }),
      ]);
      jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(1);

      const hasil = await NotifikasiController.getDaftarNotifikasi(ID_AKUN);

      expect(getDaftar).toHaveBeenCalledWith(ID_AKUN, 50);
      expect(hasil.data).toEqual({
        belumDibaca: 1,
        daftar: [{ idNotifikasi: ID_NOTIF, jenis: 'pesan', isi: 'Halo', waktuKirim: waktu, statusBaca: false }],
      });
    });

    test('C19-UT14 [Normal] getKunciPublik: mengembalikan kunci publik dari PushNotifikasiAdapter', () => {
      jest.spyOn(PushNotifikasiAdapter, 'getKunciPublik').mockReturnValue('kunci-publik-vapid');
      expect(NotifikasiController.getKunciPublik()).toEqual({
        berhasil: true,
        data: { kunciPublik: 'kunci-publik-vapid' },
      });
    });
  });

  describe('API /api/notifikasi', () => {
    beforeEach(() => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({ getIdAkun: () => ID_AKUN });
    });

    test('C19-UT15 [Negatif] API /api/notifikasi: tanpa token ditolak 401', async () => {
      Otorisasi.verifikasiToken.mockResolvedValue(null);
      const res = await request(app).get('/api/notifikasi');
      expect(res.status).toBe(401);
    });

    test('C19-UT16 [Negatif] API /api/notifikasi: PATCH /:id/baca bukan milik akun membalas 404', async () => {
      jest.spyOn(Notifikasi, 'tandaiDibaca').mockResolvedValue(false);

      const res = await request(app).patch(`/api/notifikasi/${ID_NOTIF}/baca`).set('Authorization', 'Bearer t');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ sukses: false, pesan: 'Notifikasi tidak ditemukan.' });
    });

    test('C19-UT17 [Normal] API /api/notifikasi: PATCH /baca-semua membalas 200 belumDibaca 0', async () => {
      const tandaiSemua = jest.spyOn(Notifikasi, 'tandaiSemuaDibaca').mockResolvedValue(4);

      const res = await request(app).patch('/api/notifikasi/baca-semua').set('Authorization', 'Bearer t');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ sukses: true, data: { belumDibaca: 0 } });
      expect(tandaiSemua).toHaveBeenCalledWith(ID_AKUN);
    });

    test('C19-UT18 [Normal] API /api/notifikasi: GET /kunci-publik membalas 200 (null bila VAPID belum diatur)', async () => {
      jest.spyOn(PushNotifikasiAdapter, 'getKunciPublik').mockReturnValue(null);

      const res = await request(app).get('/api/notifikasi/kunci-publik').set('Authorization', 'Bearer t');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ sukses: true, data: { kunciPublik: null } });
    });

    test('C19-UT19 [Normal] API /api/notifikasi: POST /langganan-push membalas 201 bila valid dan 400 bila endpoint bukan https', async () => {
      jest.spyOn(LanggananPush, 'simpan').mockResolvedValue(true);

      const ok = await request(app).post('/api/notifikasi/langganan-push')
        .set('Authorization', 'Bearer t').send(LANGGANAN_VALID);
      expect(ok.status).toBe(201);
      expect(ok.body.sukses).toBe(true);

      const tolak = await request(app).post('/api/notifikasi/langganan-push')
        .set('Authorization', 'Bearer t').send({ ...LANGGANAN_VALID, endpoint: 'http://x.test/1' });
      expect(tolak.status).toBe(400);
      expect(tolak.body.sukses).toBe(false);
    });
  });
});
