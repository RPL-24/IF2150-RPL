// src/tests/integration/ModerasiAPI.test.js
const request = require('supertest');
const app = require('../../app');
const Otorisasi = require('../../pendukung/Otorisasi');
const ModerasiController = require('../../controllers/ModerasiController');
const Barang = require('../../models/Barang');
const Akun = require('../../models/Akun');
const Laporan = require('../../models/Laporan');

describe('API Moderasi Dasbor Admin Integration Test (UC20, UC21, UC22, UC23, UC24)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Otorisasi Admin (KF56)', () => {
    test('menolak akses ke /api/admin/laporan jika tanpa token (401)', async () => {
      const res = await request(app).get('/api/admin/laporan');
      expect(res.status).toBe(401);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/masuk/i);
    });

    test('menolak akses jika pengguna masuk bukan admin (403)', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'user-biasa-id',
      });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue(null);

      const res = await request(app)
        .get('/api/admin/laporan')
        .set('Authorization', 'Bearer token-user-bukan-admin');

      expect(res.status).toBe(403);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/admin/i);
    });

    test('seluruh endpoint /api/admin/* menolak akun non-admin dengan status 403 (KF56)', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'user-biasa-id',
      });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue(null);

      const endpoints = [
        { method: 'get', url: '/api/admin/laporan' },
        { method: 'get', url: '/api/admin/laporan/statistik' },
        { method: 'get', url: '/api/admin/laporan/lap-test' },
        { method: 'patch', url: '/api/admin/laporan/lap-test/status', body: { status: 'Diproses' } },
        { method: 'delete', url: '/api/admin/laporan/lap-test/barang/brg-test', body: { alasan: 'Pelanggaran' } },
        { method: 'post', url: '/api/admin/akun/usr-test/blokir', body: { alasan: 'Pelanggaran' } },
        { method: 'post', url: '/api/admin/akun/usr-test/buka-blokir', body: { alasan: 'Buka blokir' } },
      ];

      for (const ep of endpoints) {
        const req = request(app)[ep.method](ep.url).set('Authorization', 'Bearer token-user-bukan-admin');
        if (ep.body) req.send(ep.body);
        const res = await req;
        expect(res.status).toBe(403);
        expect(res.body.sukses).toBe(false);
      }
    });
  });

  describe('GET /api/admin/laporan & /api/admin/laporan/statistik (KF45, KF46)', () => {
    beforeEach(() => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
    });

    test('berhasil mengambil seluruh daftar laporan untuk admin (200)', async () => {
      const mockDaftar = [
        {
          idLaporan: 'lap-101',
          objekDilaporkan: 'Jas Lab Kimia',
          jenisPelanggaran: 'Penipuan',
          statusPenanganan: 'Baru',
        },
      ];
      jest.spyOn(ModerasiController, 'getAllLaporan').mockResolvedValue(mockDaftar);

      const res = await request(app)
        .get('/api/admin/laporan')
        .set('Authorization', 'Bearer token-admin-valid');

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].idLaporan).toBe('lap-101');
    });

    test('berhasil menyaring daftar laporan berdasarkan status (200)', async () => {
      const mockDaftarBaru = [
        {
          idLaporan: 'lap-102',
          objekDilaporkan: 'Buku Bekas',
          jenisPelanggaran: 'Konten tidak pantas',
          statusPenanganan: 'Baru',
        },
      ];
      jest.spyOn(ModerasiController, 'filterByStatus').mockResolvedValue(mockDaftarBaru);

      const res = await request(app)
        .get('/api/admin/laporan?status=Baru')
        .set('Authorization', 'Bearer token-admin-valid');

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(ModerasiController.filterByStatus).toHaveBeenCalledWith('token-admin-valid', 'Baru');
    });

    test('berhasil mengambil data statistik laporan (200)', async () => {
      jest.spyOn(ModerasiController, 'getStatistik').mockResolvedValue({
        Baru: 4,
        Diproses: 2,
        Selesai: 8,
        Total: 14,
      });

      const res = await request(app)
        .get('/api/admin/laporan/statistik')
        .set('Authorization', 'Bearer token-admin-valid');

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(res.body.data.Total).toBe(14);
    });
  });

  describe('GET /api/admin/laporan/:id (KF45)', () => {
    beforeEach(() => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
    });

    test('berhasil mengambil rincian detail laporan (200)', async () => {
      const mockDetail = {
        laporan: {
          idLaporan: 'lap-101',
          objekDilaporkan: 'Jas Lab Kimia',
          statusPenanganan: 'Baru',
        },
        pelapor: {
          nama: 'Budi',
          email: 'budi@std.stei.itb.ac.id',
        },
        daftarBukti: [{ idBukti: 'b-1', namaBerkas: 'bukti.png' }],
        riwayatAudit: [{ tindakan: 'Penerimaan laporan' }],
      };
      jest.spyOn(ModerasiController, 'getDetailLaporan').mockResolvedValue(mockDetail);

      const res = await request(app)
        .get('/api/admin/laporan/lap-101')
        .set('Authorization', 'Bearer token-admin-valid');

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(res.body.data.laporan.idLaporan).toBe('lap-101');
      expect(res.body.data.pelapor.nama).toBe('Budi');
      expect(res.body.data.daftarBukti).toHaveLength(1);
    });

    test('mengembalikan 404 jika id laporan tidak ditemukan', async () => {
      jest.spyOn(ModerasiController, 'getDetailLaporan').mockResolvedValue(null);

      const res = await request(app)
        .get('/api/admin/laporan/tidak-ada-id')
        .set('Authorization', 'Bearer token-admin-valid');

      expect(res.status).toBe(404);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/tidak ditemukan/i);
    });
  });

  describe('PATCH /api/admin/laporan/:id/status (KF47, KF48)', () => {
    beforeEach(() => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
    });


    test('berhasil mengubah status laporan menjadi Selesai (200)', async () => {
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-101', statusPenanganan: 'Diproses' }),
      );
      jest.spyOn(ModerasiController, 'ubahStatusLaporan').mockResolvedValue(true);

      const res = await request(app)
        .patch('/api/admin/laporan/lap-101/status')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({ status: 'Selesai' });

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(ModerasiController.ubahStatusLaporan).toHaveBeenCalledWith('token-admin-valid', 'lap-101', 'Selesai');
    });

    test('gagal 404 jika laporan tidak ditemukan', async () => {
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/admin/laporan/lap-tidak-ada/status')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({ status: 'Diproses' });

      expect(res.status).toBe(404);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/tidak ditemukan/i);
    });

    test('gagal 400 jika transisi status penanganan tidak valid (mundur)', async () => {
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-101', statusPenanganan: 'Selesai' }),
      );

      const res = await request(app)
        .patch('/api/admin/laporan/lap-101/status')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({ status: 'Diproses' });

      expect(res.status).toBe(400);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/transisi status.*tidak valid/i);
    });

    test('gagal 401 jika tanpa token otorisasi', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/admin/laporan/lap-101/status')
        .send({ status: 'Diproses' });

      expect(res.status).toBe(401);
      expect(res.body.sukses).toBe(false);
    });

    test('gagal 403 jika pengguna bukan admin', async () => {
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/admin/laporan/lap-101/status')
        .set('Authorization', 'Bearer token-bukan-admin')
        .send({ status: 'Diproses' });

      expect(res.status).toBe(403);
      expect(res.body.sukses).toBe(false);
    });

    test('gagal 400 jika status penanganan yang dikirim tidak sah', async () => {
      const res = await request(app)
        .patch('/api/admin/laporan/lap-101/status')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({ status: 'StatusNgawur' });

      expect(res.status).toBe(400);
      expect(res.body.sukses).toBe(false);
    });
  });

  describe('DELETE /api/admin/laporan/:id/barang/:idBarang (KF50, KF52, KF55, KF56)', () => {
    beforeEach(() => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
    });

    test('berhasil menghapus listing yang dilaporkan (200)', async () => {
      const mockBarang = new Barang({
        idBarang: 'brg-999',
        idPenjual: 'penjual-1',
        judul: 'Barang Pelanggaran',
      });
      jest.spyOn(Barang, 'cariById').mockResolvedValue(mockBarang);
      jest.spyOn(ModerasiController, 'hapusListingDilaporkan').mockResolvedValue(true);

      const res = await request(app)
        .delete('/api/admin/laporan/lap-101/barang/brg-999')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({ alasan: 'Terbukti melakukan penipuan pada pembeli' });

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(res.body.pesan).toMatch(/berhasil dihapus/i);
      expect(ModerasiController.hapusListingDilaporkan).toHaveBeenCalledWith(
        'token-admin-valid',
        'lap-101',
        'brg-999',
        'Terbukti melakukan penipuan pada pembeli',
      );
    });

    test('gagal 400 jika alasan penghapusan tidak diisi', async () => {
      const res = await request(app)
        .delete('/api/admin/laporan/lap-101/barang/brg-999')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({ alasan: '' });

      expect(res.status).toBe(400);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/alasan.*wajib diisi/i);
    });

    test('gagal 404 jika listing barang tidak ditemukan', async () => {
      jest.spyOn(Barang, 'cariById').mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/admin/laporan/lap-101/barang/brg-tidak-ada')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({ alasan: 'Alasan valid' });

      expect(res.status).toBe(404);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/tidak ditemukan/i);
    });

    test('gagal 401 jika tanpa token otorisasi', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/admin/laporan/lap-101/barang/brg-999')
        .send({ alasan: 'Alasan valid' });

      expect(res.status).toBe(401);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/masuk/i);
    });

    test('gagal 403 jika akun bukan admin', async () => {
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/admin/laporan/lap-101/barang/brg-999')
        .set('Authorization', 'Bearer token-user-bukan-admin')
        .send({ alasan: 'Alasan valid' });

      expect(res.status).toBe(403);
      expect(res.body.sukses).toBe(false);
    });
  });

  describe('POST /api/admin/akun/:idAkun/blokir (KF51, KF52, KF53, KF54, KF55, KF56, Algo-023)', () => {
    beforeEach(() => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
    });

    test('berhasil memblokir akun pengguna (200)', async () => {
      const mockAkun = new Akun({
        idAkun: 'akun-penipu-1',
        nama: 'Penipu',
        email: 'penipu@std.stei.itb.ac.id',
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(mockAkun);
      jest.spyOn(ModerasiController, 'blokirAkun').mockResolvedValue(true);

      const res = await request(app)
        .post('/api/admin/akun/akun-penipu-1/blokir')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({
          idLaporan: 'lap-101',
          alasan: 'Terbukti melakukan penipuan transaksi',
        });

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(res.body.pesan).toMatch(/berhasil diblokir/i);
      expect(ModerasiController.blokirAkun).toHaveBeenCalledWith(
        'token-admin-valid',
        'lap-101',
        'akun-penipu-1',
        'Terbukti melakukan penipuan transaksi',
      );
    });

    test('berhasil memblokir akun pengguna dari konteks laporan POST /api/admin/laporan/:id/akun/:idAkun/blokir (200)', async () => {
      const mockAkun = new Akun({
        idAkun: 'akun-penipu-2',
        nama: 'Penipu 2',
        email: 'penipu2@std.stei.itb.ac.id',
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(mockAkun);
      jest.spyOn(ModerasiController, 'blokirAkun').mockResolvedValue(true);

      const res = await request(app)
        .post('/api/admin/laporan/lap-102/akun/akun-penipu-2/blokir')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({
          alasan: 'Akun spamming berulang kali',
        });

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(res.body.pesan).toMatch(/berhasil diblokir/i);
      expect(ModerasiController.blokirAkun).toHaveBeenCalledWith(
        'token-admin-valid',
        'lap-102',
        'akun-penipu-2',
        'Akun spamming berulang kali',
      );
    });

    test('gagal 400 jika alasan pemblokiran tidak diisi', async () => {
      const res = await request(app)
        .post('/api/admin/akun/akun-penipu-1/blokir')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({
          alasan: '   ',
        });

      expect(res.status).toBe(400);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/alasan.*wajib diisi/i);
    });

    test('gagal 404 jika akun sasaran tidak ditemukan', async () => {
      jest.spyOn(Akun, 'cariById').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/admin/akun/akun-tidak-ada/blokir')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({
          alasan: 'Alasan pemblokiran valid',
        });

      expect(res.status).toBe(404);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/tidak ditemukan/i);
    });

    test('gagal 401 jika tanpa token otorisasi', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/admin/akun/akun-1/blokir')
        .send({ alasan: 'Alasan' });

      expect(res.status).toBe(401);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/masuk/i);
    });

    test('gagal 403 jika akun bukan admin', async () => {
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/admin/akun/akun-1/blokir')
        .set('Authorization', 'Bearer token-user-bukan-admin')
        .send({ alasan: 'Alasan' });

      expect(res.status).toBe(403);
      expect(res.body.sukses).toBe(false);
    });
  });

  describe('POST /api/admin/akun/:idAkun/buka-blokir (UC24, KF51, KF54, KF55, KF56)', () => {
    beforeEach(() => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });
    });

    test('berhasil membuka blokir akun pengguna via POST /api/admin/akun/:idAkun/buka-blokir (200)', async () => {
      const mockAkun = new Akun({
        idAkun: 'akun-terblokir-1',
        nama: 'Pengguna Insyaf',
        email: 'insyaf@std.stei.itb.ac.id',
        statusAkun: 'Dinonaktifkan',
        statusBlokir: true,
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(mockAkun);
      jest.spyOn(ModerasiController, 'bukaBlokirAkun').mockResolvedValue(true);

      const res = await request(app)
        .post('/api/admin/akun/akun-terblokir-1/buka-blokir')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({
          alasan: 'Banding diterima dan identitas telah diverifikasi',
        });

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(res.body.pesan).toMatch(/berhasil dibuka/i);
      expect(ModerasiController.bukaBlokirAkun).toHaveBeenCalledWith(
        'token-admin-valid',
        'akun-terblokir-1',
        'Banding diterima dan identitas telah diverifikasi',
      );
    });

    test('berhasil membuka blokir akun pengguna dari konteks laporan POST /api/admin/laporan/:id/akun/:idAkun/buka-blokir (200)', async () => {
      const mockAkun = new Akun({
        idAkun: 'akun-terblokir-2',
        nama: 'Pengguna Dua',
        email: 'dua@std.stei.itb.ac.id',
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(mockAkun);
      jest.spyOn(ModerasiController, 'bukaBlokirAkun').mockResolvedValue(true);

      const res = await request(app)
        .post('/api/admin/laporan/lap-102/akun/akun-terblokir-2/buka-blokir')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({
          alasan: 'Kesalahpahaman telah diselesaikan',
        });

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(res.body.pesan).toMatch(/berhasil dibuka/i);
      expect(ModerasiController.bukaBlokirAkun).toHaveBeenCalledWith(
        'token-admin-valid',
        'akun-terblokir-2',
        'Kesalahpahaman telah diselesaikan',
      );
    });

    test('gagal 404 jika akun sasaran tidak ditemukan', async () => {
      jest.spyOn(Akun, 'cariById').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/admin/akun/akun-tidak-ada/buka-blokir')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({
          alasan: 'Alasan pembukaan blokir',
        });

      expect(res.status).toBe(404);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/tidak ditemukan/i);
    });

    test('gagal 401 jika tanpa token otorisasi', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/admin/akun/akun-1/buka-blokir')
        .send({ alasan: 'Alasan' });

      expect(res.status).toBe(401);
      expect(res.body.sukses).toBe(false);
      expect(res.body.pesan).toMatch(/masuk/i);
    });

    test('gagal 403 jika akun bukan admin', async () => {
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/admin/akun/akun-1/buka-blokir')
        .set('Authorization', 'Bearer token-user-bukan-admin')
        .send({ alasan: 'Alasan' });

      expect(res.status).toBe(403);
      expect(res.body.sukses).toBe(false);
    });
  });

});
