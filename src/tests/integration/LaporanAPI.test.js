// src/tests/integration/LaporanAPI.test.js
const request = require('supertest');
const app = require('../../app');
const Otorisasi = require('../../pendukung/Otorisasi');
const LaporanController = require('../../controllers/LaporanController');

describe('API POST /api/laporan Integration Test (UC19)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('menolak permintaan jika tanpa token otentikasi (401)', async () => {
    const res = await request(app).post('/api/laporan');
    expect(res.status).toBe(401);
    expect(res.body.sukses).toBe(false);
    expect(res.body.pesan).toBe('Silakan masuk terlebih dahulu.');
  });

  test('menolak permintaan jika token otentikasi tidak valid (401)', async () => {
    jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/laporan')
      .set('Authorization', 'Bearer token_salah');

    expect(res.status).toBe(401);
    expect(res.body.sukses).toBe(false);
  });

  test('menolak jika data formulir atau bukti kosong (400)', async () => {
    jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
      getIdAkun: () => 'user-uuid-123',
    });

    const res = await request(app)
      .post('/api/laporan')
      .set('Authorization', 'Bearer token_valid')
      .field('objekDilaporkan', '')
      .field('jenisPelanggaran', 'Penipuan');

    expect(res.status).toBe(400);
    expect(res.body.sukses).toBe(false);
    expect(res.body.kode).toBe('DATA_TIDAK_LENGKAP');
  });

  test('berhasil mengirimkan laporan dengan lampiran bukti tangkapan layar (201)', async () => {
    jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
      getIdAkun: () => 'user-uuid-123',
    });

    jest.spyOn(LaporanController, 'buatLaporan').mockResolvedValue({
      berhasil: true,
      data: {
        idLaporan: 'lap-test-uuid',
        statusPenanganan: 'Baru',
        pesan: 'Laporan berhasil dikirim dan akan segera ditinjau admin.',
      },
    });

    const res = await request(app)
      .post('/api/laporan')
      .set('Authorization', 'Bearer token_valid')
      .field('objekDilaporkan', 'Listing Jas Praktikum')
      .field('jenisPelanggaran', 'Penipuan')
      .field('teksAlasan', 'Penjual memaksa transfer langsung dan memblokir kontak.')
      .attach('bukti', Buffer.from('fake-png-content'), 'screenshot.png');

    expect(res.status).toBe(201);
    expect(res.body.sukses).toBe(true);
    expect(res.body.data.idLaporan).toBe('lap-test-uuid');
    expect(res.body.data.statusPenanganan).toBe('Baru');
  });
});
