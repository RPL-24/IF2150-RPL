// Uji integrasi /api/percakapan (UC16, UC17, UC18) lewat supertest.
// Route + Otorisasi + PercakapanController berjalan nyata; Model di-mock dengan penyimpanan di memori.
const crypto = require('crypto');
const request = require('supertest');
const app = require('../../app');
const Otorisasi = require('../../pendukung/Otorisasi');
const Kriptografi = require('../../pendukung/Kriptografi');
const NotifikasiController = require('../../controllers/NotifikasiController');
const Percakapan = require('../../models/Percakapan');
const Pesan = require('../../models/Pesan');
const Barang = require('../../models/Barang');
const FotoBarang = require('../../models/FotoBarang');
const Akun = require('../../models/Akun');

const ID_PEMBELI = '11111111-1111-4111-8111-111111111111';
const ID_PENJUAL = '22222222-2222-4222-8222-222222222222';
const ID_ADMIN = '33333333-3333-4333-8333-333333333333';
const ID_BARANG = '44444444-4444-4444-8444-444444444444';
const ID_PERCAKAPAN = '55555555-5555-4555-8555-555555555555';
const NAMA = { [ID_PEMBELI]: 'Ani', [ID_PENJUAL]: 'Budi', [ID_ADMIN]: 'Admin' };
const TOKEN = { 'token-pembeli': ID_PEMBELI, 'token-penjual': ID_PENJUAL, 'token-admin': ID_ADMIN };

let daftarPercakapan;
let daftarPesan;

beforeAll(() => {
  Kriptografi.kunciEnkripsi = crypto.randomBytes(32).toString('hex');
});

beforeEach(() => {
  daftarPercakapan = [];
  daftarPesan = [];

  jest.spyOn(Otorisasi, 'verifikasiToken').mockImplementation(async (token) =>
    TOKEN[token] ? { getIdAkun: () => TOKEN[token] } : null,
  );
  jest.spyOn(Barang, 'cariById').mockImplementation(async (id) =>
    id === ID_BARANG ? new Barang({ idBarang: ID_BARANG, idPenjual: ID_PENJUAL, judul: 'Jas Lab', harga: 50000 }) : null,
  );
  jest.spyOn(FotoBarang, 'getGaleri').mockResolvedValue([]);
  jest.spyOn(Akun, 'getStatusBlokir').mockResolvedValue(false);

  jest.spyOn(Percakapan, 'cariByKombinasi').mockImplementation(async (idBarang, idPembeli, idPenjual) =>
    daftarPercakapan.find((p) => p.idBarang === idBarang && p.idPembeli === idPembeli && p.idPenjual === idPenjual) ||
    null,
  );
  jest.spyOn(Percakapan, 'simpan').mockImplementation(async (idBarang, idPembeli, idPenjual) => {
    const p = new Percakapan({ idPercakapan: ID_PERCAKAPAN, idBarang, idPembeli, idPenjual, waktuPembaruanTerakhir: new Date() });
    daftarPercakapan.push(p);
    return p;
  });
  jest.spyOn(Percakapan, 'cariById').mockImplementation(async (id) =>
    daftarPercakapan.find((p) => p.idPercakapan === id) || null,
  );
  jest.spyOn(Percakapan, 'getDaftarPercakapanByPengguna').mockImplementation(async (idAkun) =>
    daftarPercakapan.filter((p) => p.cekPeserta(idAkun)),
  );
  jest.spyOn(Percakapan.prototype, 'addPesan').mockImplementation(async function (idPengirim, isiPesanTerenkripsi) {
    const pesan = new Pesan({
      idPesan: `pesan-${daftarPesan.length + 1}`,
      idPercakapan: this.idPercakapan,
      idPengirim,
      isiPesanTerenkripsi,
      waktuKirim: new Date(),
      statusBaca: false,
    });
    daftarPesan.push(pesan);
    return pesan;
  });
  jest.spyOn(Percakapan.prototype, 'perbaruiWaktuTerakhir').mockImplementation(async function (waktu) {
    this.waktuPembaruanTerakhir = waktu;
  });
  jest.spyOn(Percakapan.prototype, 'getLawanBicara').mockImplementation(async function (idAkun) {
    const idLawan = idAkun === this.idPembeli ? this.idPenjual : this.idPembeli;
    return { idAkun: idLawan, nama: NAMA[idLawan] };
  });

  const pesanDi = (idPercakapan) => daftarPesan.filter((m) => m.idPercakapan === idPercakapan);
  jest.spyOn(Pesan, 'getDaftarPesan').mockImplementation(async (id) => pesanDi(id));
  jest.spyOn(Pesan, 'getCuplikanPesanTerakhir').mockImplementation(async (id) => pesanDi(id).at(-1) || null);
  jest.spyOn(Pesan, 'hitungPesanBelumDibaca').mockImplementation(async (id, idAkun) =>
    pesanDi(id).filter((m) => m.idPengirim !== idAkun && !m.statusBaca).length,
  );
  jest.spyOn(Pesan, 'tandaiDibaca').mockImplementation(async (id, idAkun) => {
    pesanDi(id).filter((m) => m.idPengirim !== idAkun).forEach((m) => (m.statusBaca = true));
  });

  jest.spyOn(NotifikasiController, 'kirimNotifikasi').mockResolvedValue({});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const sebagai = (token) => ({ Authorization: `Bearer ${token}` });

describe('API /api/percakapan (UC16, UC17, UC18)', () => {
  test.each([
    ['post', '/api/percakapan'],
    ['get', '/api/percakapan'],
    ['get', `/api/percakapan/${ID_PERCAKAPAN}`],
    ['post', `/api/percakapan/${ID_PERCAKAPAN}/pesan`],
  ])('%s %s tanpa token ditolak 401', async (metode, url) => {
    const res = await request(app)[metode](url);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ sukses: false, pesan: 'Silakan masuk terlebih dahulu.' });
  });

  test('alur mulai → kirim → daftar → buka', async () => {
    // UC16: percakapan baru 201, permintaan kedua memakai ruang lama 200
    const mulai = await request(app).post('/api/percakapan').set(sebagai('token-pembeli')).send({ idBarang: ID_BARANG });
    expect(mulai.status).toBe(201);
    expect(mulai.body).toEqual({ sukses: true, data: { idPercakapan: ID_PERCAKAPAN } });

    const ulang = await request(app).post('/api/percakapan').set(sebagai('token-pembeli')).send({ idBarang: ID_BARANG });
    expect(ulang.status).toBe(200);
    expect(daftarPercakapan).toHaveLength(1);

    // UC17: pesan tersimpan terenkripsi, penerima dinotifikasi
    const kirim = await request(app)
      .post(`/api/percakapan/${ID_PERCAKAPAN}/pesan`)
      .set(sebagai('token-pembeli'))
      .send({ isi: 'Jas labnya masih ada?' });
    expect(kirim.status).toBe(201);
    expect(kirim.body.data).toMatchObject({ idPengirim: ID_PEMBELI, isi: 'Jas labnya masih ada?', dariSaya: true });
    expect(daftarPesan[0].isiPesanTerenkripsi).not.toContain('Jas labnya');
    expect(NotifikasiController.kirimNotifikasi).toHaveBeenCalledWith(ID_PENJUAL, 'pesan', 'Pesan baru dari Ani');

    // UC18: penjual melihat cuplikan dan 1 pesan belum dibaca
    const daftar = await request(app).get('/api/percakapan').set(sebagai('token-penjual'));
    expect(daftar.status).toBe(200);
    expect(daftar.body.data).toHaveLength(1);
    expect(daftar.body.data[0]).toMatchObject({
      idPercakapan: ID_PERCAKAPAN,
      idBarang: ID_BARANG,
      judulBarang: 'Jas Lab',
      lawanBicara: { idAkun: ID_PEMBELI, nama: 'Ani' },
      cuplikan: { isi: 'Jas labnya masih ada?', dariSaya: false },
      belumDibaca: 1,
    });

    // Membuka ruang menandai pesan lawan sudah dibaca
    const buka = await request(app).get(`/api/percakapan/${ID_PERCAKAPAN}`).set(sebagai('token-penjual'));
    expect(buka.status).toBe(200);
    expect(buka.body.data).toMatchObject({
      idPercakapan: ID_PERCAKAPAN,
      idAkunSaya: ID_PENJUAL,
      lawanBicara: { idAkun: ID_PEMBELI, nama: 'Ani' },
      barang: { idBarang: ID_BARANG, judul: 'Jas Lab', fotoUtama: null },
      pesan: [{ idPengirim: ID_PEMBELI, isi: 'Jas labnya masih ada?', dariSaya: false }],
      tautanKebijakanPrivasi: '/legal?jenis=kebijakan-privasi',
    });
    const daftarLagi = await request(app).get('/api/percakapan').set(sebagai('token-penjual'));
    expect(daftarLagi.body.data[0].belumDibaca).toBe(0);
  });

  test('non-peserta (admin) ditolak 403 saat membuka maupun mengirim', async () => {
    await request(app).post('/api/percakapan').set(sebagai('token-pembeli')).send({ idBarang: ID_BARANG });

    const buka = await request(app).get(`/api/percakapan/${ID_PERCAKAPAN}`).set(sebagai('token-admin'));
    expect(buka.status).toBe(403);
    expect(buka.body.sukses).toBe(false);
    expect(buka.body.data).toBeUndefined();

    const kirim = await request(app)
      .post(`/api/percakapan/${ID_PERCAKAPAN}/pesan`)
      .set(sebagai('token-admin'))
      .send({ isi: 'Halo' });
    expect(kirim.status).toBe(403);
    expect(daftarPesan).toHaveLength(0);
  });

  test('validasi: listing sendiri 400, barang tidak ada 404, penjual diblokir 403, isi kosong 400', async () => {
    const sendiri = await request(app).post('/api/percakapan').set(sebagai('token-penjual')).send({ idBarang: ID_BARANG });
    expect(sendiri.status).toBe(400);

    const takAda = await request(app).post('/api/percakapan').set(sebagai('token-pembeli')).send({});
    expect(takAda.status).toBe(404);

    Akun.getStatusBlokir.mockResolvedValue(true);
    const diblokir = await request(app).post('/api/percakapan').set(sebagai('token-pembeli')).send({ idBarang: ID_BARANG });
    expect(diblokir.status).toBe(403);

    Akun.getStatusBlokir.mockResolvedValue(false);
    await request(app).post('/api/percakapan').set(sebagai('token-pembeli')).send({ idBarang: ID_BARANG });
    const kosong = await request(app)
      .post(`/api/percakapan/${ID_PERCAKAPAN}/pesan`)
      .set(sebagai('token-pembeli'))
      .send({ isi: '   ' });
    expect(kosong.status).toBe(400);
    expect(kosong.body).toEqual({ sukses: false, pesan: 'Isi pesan tidak boleh kosong.' });
  });

  test('galat model dibalas 500 dengan format seragam', async () => {
    Percakapan.getDaftarPercakapanByPengguna.mockRejectedValue(new Error('db mati'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const res = await request(app).get('/api/percakapan').set(sebagai('token-pembeli'));

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ sukses: false, pesan: 'Terjadi galat pada server.' });
  });
});
