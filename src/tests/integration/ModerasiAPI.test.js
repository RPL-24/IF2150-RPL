// src/tests/integration/ModerasiAPI.test.js
const request = require('supertest');
const app = require('../../app');
const Otorisasi = require('../../pendukung/Otorisasi');
const ModerasiController = require('../../controllers/ModerasiController');

describe('API Moderasi Dasbor Admin Integration Test (UC20)', () => {
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
      jest.spyOn(ModerasiController, 'ubahStatusLaporan').mockResolvedValue(true);

      const res = await request(app)
        .patch('/api/admin/laporan/lap-101/status')
        .set('Authorization', 'Bearer token-admin-valid')
        .send({ status: 'Selesai' });

      expect(res.status).toBe(200);
      expect(res.body.sukses).toBe(true);
      expect(ModerasiController.ubahStatusLaporan).toHaveBeenCalledWith('token-admin-valid', 'lap-101', 'Selesai');
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
});
