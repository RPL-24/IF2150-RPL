// src/tests/unit/NotifikasiController.test.js
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
  keys: { p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM', auth: 'tBHItJI5svbpez7KI4CCXg' },
};

describe('NotifikasiController (C19)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('kirimNotifikasi (Algo-020)', () => {
    test('menyimpan notifikasi, menghitung belum dibaca, dan memicu push dengan tautan /percakapan', async () => {
      const simpan = jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(true);
      const hitung = jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(3);
      const kirimPush = jest.spyOn(PushNotifikasiAdapter, 'kirimPush').mockResolvedValue(true);

      const hasil = await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Budi: Masih ada?');

      expect(hasil).toBe(true);
      expect(simpan).toHaveBeenCalledWith(ID_AKUN, 'pesan', 'Budi: Masih ada?', expect.any(Date), false);
      expect(hitung).toHaveBeenCalledWith(ID_AKUN);
      expect(kirimPush).toHaveBeenCalledWith(ID_AKUN, 'ITBELI', 'Budi: Masih ada?', '/percakapan');
    });

    test('push gagal (melempar galat) tetap mengembalikan true', async () => {
      jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(true);
      jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(1);
      jest.spyOn(PushNotifikasiAdapter, 'kirimPush').mockRejectedValue(new Error('push service mati'));
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Halo')).toBe(true);
    });

    test('push tidak terkirim (false) tetap mengembalikan true', async () => {
      jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(true);
      jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(1);
      jest.spyOn(PushNotifikasiAdapter, 'kirimPush').mockResolvedValue(false);

      expect(await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Halo')).toBe(true);
    });

    test('tidak menunggu push selesai: push service yang lambat tidak menahan pengirim pesan', async () => {
      jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(true);
      jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(1);
      // Janji yang tidak pernah selesai meniru push service yang tidak menjawab
      const kirimPush = jest.spyOn(PushNotifikasiAdapter, 'kirimPush').mockReturnValue(new Promise(() => {}));

      expect(await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Halo')).toBe(true);
      expect(kirimPush).toHaveBeenCalledWith(ID_AKUN, 'ITBELI', 'Halo', '/percakapan');
    });

    test('gagal menyimpan: mengembalikan false tanpa memicu push', async () => {
      jest.spyOn(Notifikasi, 'simpan').mockResolvedValue(false);
      const kirimPush = jest.spyOn(PushNotifikasiAdapter, 'kirimPush');

      expect(await NotifikasiController.kirimNotifikasi(ID_AKUN, 'pesan', 'Halo')).toBe(false);
      expect(kirimPush).not.toHaveBeenCalled();
    });
  });

  describe('simpanLanggananPush', () => {
    test('langganan valid disimpan', async () => {
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
      ['tanpa keys', { endpoint: LANGGANAN_VALID.endpoint }],
      ['p256dh kosong', { ...LANGGANAN_VALID, keys: { p256dh: '', auth: 'abc' } }],
      ['auth tidak ada', { ...LANGGANAN_VALID, keys: { p256dh: 'abc' } }],
    ])('langganan tidak valid ditolak (%s)', async (_, langganan) => {
      const simpan = jest.spyOn(LanggananPush, 'simpan');

      const hasil = await NotifikasiController.simpanLanggananPush(ID_AKUN, langganan);

      expect(hasil.berhasil).toBe(false);
      expect(hasil.kodePesan).toBe('DATA_TIDAK_VALID');
      expect(simpan).not.toHaveBeenCalled();
    });
  });

  describe('tandaiDibaca', () => {
    test('notifikasi bukan milik akun: gagal TIDAK_DITEMUKAN', async () => {
      jest.spyOn(Notifikasi, 'tandaiDibaca').mockResolvedValue(false);

      const hasil = await NotifikasiController.tandaiDibaca(ID_AKUN, ID_NOTIF);

      expect(hasil.berhasil).toBe(false);
      expect(hasil.kodePesan).toBe('TIDAK_DITEMUKAN');
    });

    test('id bukan UUID: gagal tanpa menyentuh basis data', async () => {
      const tandai = jest.spyOn(Notifikasi, 'tandaiDibaca');

      const hasil = await NotifikasiController.tandaiDibaca(ID_AKUN, 'bukan-uuid');

      expect(hasil.berhasil).toBe(false);
      expect(tandai).not.toHaveBeenCalled();
    });

    test('notifikasi milik akun: mengembalikan jumlah belum dibaca terbaru', async () => {
      const tandai = jest.spyOn(Notifikasi, 'tandaiDibaca').mockResolvedValue(true);
      jest.spyOn(Notifikasi, 'hitungBelumDibaca').mockResolvedValue(2);

      const hasil = await NotifikasiController.tandaiDibaca(ID_AKUN, ID_NOTIF);

      expect(tandai).toHaveBeenCalledWith(ID_NOTIF, ID_AKUN);
      expect(hasil).toEqual({ berhasil: true, data: { belumDibaca: 2 } });
    });
  });

  describe('getDaftarNotifikasi', () => {
    test('memetakan daftar (maks 50) dan jumlah belum dibaca', async () => {
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
  });

  describe('API /api/notifikasi', () => {
    beforeEach(() => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({ getIdAkun: () => ID_AKUN });
    });

    test('tanpa token: 401', async () => {
      Otorisasi.verifikasiToken.mockResolvedValue(null);
      const res = await request(app).get('/api/notifikasi');
      expect(res.status).toBe(401);
    });

    test('PATCH /:id/baca untuk notifikasi bukan milik akun: 404', async () => {
      jest.spyOn(Notifikasi, 'tandaiDibaca').mockResolvedValue(false);

      const res = await request(app).patch(`/api/notifikasi/${ID_NOTIF}/baca`).set('Authorization', 'Bearer t');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ sukses: false, pesan: 'Notifikasi tidak ditemukan.' });
    });

    test('PATCH /baca-semua: 200 belumDibaca 0', async () => {
      const tandaiSemua = jest.spyOn(Notifikasi, 'tandaiSemuaDibaca').mockResolvedValue(4);

      const res = await request(app).patch('/api/notifikasi/baca-semua').set('Authorization', 'Bearer t');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ sukses: true, data: { belumDibaca: 0 } });
      expect(tandaiSemua).toHaveBeenCalledWith(ID_AKUN);
    });

    test('GET /kunci-publik: 200 dengan kunciPublik (null bila VAPID belum diatur)', async () => {
      jest.spyOn(PushNotifikasiAdapter, 'getKunciPublik').mockReturnValue(null);

      const res = await request(app).get('/api/notifikasi/kunci-publik').set('Authorization', 'Bearer t');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ sukses: true, data: { kunciPublik: null } });
    });

    test('POST /langganan-push: 201 bila valid, 400 bila endpoint bukan https', async () => {
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
