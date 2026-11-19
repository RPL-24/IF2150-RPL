// src/tests/unit/KatalogController.test.js
// Pengujian unit C15 KatalogController (Modul C, UC13, UC14, UC15).
// Barang (C29) diganti tiruan; C16 dan C17 dipakai apa adanya.
jest.mock('../../models/Barang', () => ({
  getKatalog: jest.fn(),
  getDetailKatalog: jest.fn(),
}));

const Barang = require('../../models/Barang');
const KatalogController = require('../../controllers/KatalogController');

function buatRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

const ID_PENJUAL = '11111111-1111-1111-1111-111111111111';
const ID_PEMBELI = '22222222-2222-2222-2222-222222222222';

describe('C15 KatalogController.getProduk', () => {
  beforeEach(() => jest.clearAllMocks());

  test('C15-UT01 katalog tanpa kriteria memakai urutan terbaru dan halaman 1 (UC13)', async () => {
    Barang.getKatalog.mockResolvedValue({ daftar: [{ idBarang: 'a' }], total: 1 });
    const res = buatRes();

    await KatalogController.getProduk({ query: {} }, res);

    expect(Barang.getKatalog).toHaveBeenCalledWith({
      daftarKata: [],
      kategori: null,
      lokasi: null,
      hargaMin: null,
      hargaMaks: null,
      urut: 'terbaru',
      batas: 20,
      offset: 0,
    });
    const isi = res.json.mock.calls[0][0];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(isi.pesan).toBeUndefined();
    expect(isi.data.paginasi).toEqual({ halaman: 1, totalHalaman: 1, totalItem: 1, ukuranHalaman: 20 });
  });

  test('C15-UT02 meneruskan kata kunci, filter, urutan, dan halaman ke Barang.getKatalog (UC14)', async () => {
    Barang.getKatalog.mockResolvedValue({ daftar: [{ idBarang: 'x' }], total: 45 });
    const res = buatRes();

    await KatalogController.getProduk(
      {
        query: {
          q: '  Jas PRAKTIKUM ',
          kategori: 'Jas praktikum',
          hargaMin: '50000',
          hargaMaks: '150000',
          lokasi: 'Labtek V',
          urut: 'termurah',
          halaman: '2',
        },
      },
      res,
    );

    expect(Barang.getKatalog).toHaveBeenCalledWith({
      daftarKata: ['jas', 'praktikum'],
      kategori: 'Jas praktikum',
      lokasi: 'Labtek V',
      hargaMin: 50000,
      hargaMaks: 150000,
      urut: 'termurah',
      batas: 20,
      offset: 20,
    });
    const isi = res.json.mock.calls[0][0];
    expect(isi.sukses).toBe(true);
    expect(isi.data.paginasi).toEqual({ halaman: 2, totalHalaman: 3, totalItem: 45, ukuranHalaman: 20 });
    expect(isi.data.kriteria).toMatchObject({ kataKunci: 'jas praktikum', urut: 'termurah', halaman: 2 });
  });

  test.each([
    [0, 1],
    [20, 1],
    [21, 2],
    [40, 2],
    [41, 3],
  ])('C15-UT03 total %i listing menghasilkan %i halaman (batas 20 per halaman, KF28)', async (total, totalHalaman) => {
    Barang.getKatalog.mockResolvedValue({ daftar: total ? [{ idBarang: 'x' }] : [], total });
    const res = buatRes();

    await KatalogController.getProduk({ query: {} }, res);

    expect(res.json.mock.calls[0][0].data.paginasi.totalHalaman).toBe(totalHalaman);
  });

  test('C15-UT04 memberi pesan "Barang tidak ditemukan." saat hasil kosong (KF29)', async () => {
    Barang.getKatalog.mockResolvedValue({ daftar: [], total: 0 });
    const res = buatRes();

    await KatalogController.getProduk({ query: { q: 'tidakada' } }, res);

    const isi = res.json.mock.calls[0][0];
    expect(isi.data.daftar).toEqual([]);
    expect(isi.data.paginasi.totalHalaman).toBe(1);
    expect(isi.pesan).toBe('Barang tidak ditemukan.');
  });

  test('C15-UT05 halaman melewati halaman terakhir mengembalikan daftar kosong, bukan galat', async () => {
    Barang.getKatalog.mockResolvedValue({ daftar: [], total: 21 });
    const res = buatRes();

    await KatalogController.getProduk({ query: { halaman: '5' } }, res);

    expect(Barang.getKatalog).toHaveBeenCalledWith(expect.objectContaining({ offset: 80 }));
    const isi = res.json.mock.calls[0][0];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(isi.data.paginasi).toMatchObject({ halaman: 5, totalHalaman: 2 });
    expect(isi.pesan).toBe('Barang tidak ditemukan.');
  });

  test('C15-UT06 tidak memanggil basis data jika filter tidak valid (UC14 Alternatif 2)', async () => {
    await expect(
      KatalogController.getProduk({ query: { hargaMin: '200000', hargaMaks: '50000' } }, buatRes()),
    ).rejects.toMatchObject({ status: 400 });
    expect(Barang.getKatalog).not.toHaveBeenCalled();
  });

  test('C15-UT07 galat basis data diteruskan ke penangan galat', async () => {
    Barang.getKatalog.mockRejectedValue(new Error('koneksi putus'));
    await expect(KatalogController.getProduk({ query: {} }, buatRes())).rejects.toThrow('koneksi putus');
  });
});

describe('C15 KatalogController.getDetailProduk', () => {
  beforeEach(() => jest.clearAllMocks());

  test('C15-UT08 mengembalikan detail listing untuk pembeli (UC15)', async () => {
    const barang = { idBarang: 'x', idPenjual: ID_PENJUAL, judul: 'Kalkulator Casio', daftarFoto: [] };
    Barang.getDetailKatalog.mockResolvedValue(barang);
    const res = buatRes();

    await KatalogController.getDetailProduk({ params: { id: 'x' }, akun: { idAkun: ID_PEMBELI } }, res);

    expect(Barang.getDetailKatalog).toHaveBeenCalledWith('x');
    const isi = res.json.mock.calls[0][0];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(isi.data).toMatchObject({ judul: 'Kalkulator Casio', milikSendiri: false });
  });

  test('C15-UT09 menandai milikSendiri bila pembuka adalah pemilik listing (UC15 Alternatif 1)', async () => {
    Barang.getDetailKatalog.mockResolvedValue({ idBarang: 'x', idPenjual: ID_PENJUAL });
    const res = buatRes();

    await KatalogController.getDetailProduk({ params: { id: 'x' }, akun: { idAkun: ID_PENJUAL } }, res);

    expect(res.json.mock.calls[0][0].data.milikSendiri).toBe(true);
  });

  test('C15-UT10 tanpa data akun pada permintaan, milikSendiri bernilai false', async () => {
    Barang.getDetailKatalog.mockResolvedValue({ idBarang: 'x', idPenjual: ID_PENJUAL });
    const res = buatRes();

    await KatalogController.getDetailProduk({ params: { id: 'x' } }, res);

    expect(res.json.mock.calls[0][0].data.milikSendiri).toBe(false);
  });

  test('C15-UT11 mengembalikan galat 404 jika listing tidak tersedia (UC15 Alternatif 2)', async () => {
    Barang.getDetailKatalog.mockResolvedValue(null);
    await expect(
      KatalogController.getDetailProduk({ params: { id: 'x' }, akun: { idAkun: ID_PEMBELI } }, buatRes()),
    ).rejects.toMatchObject({ status: 404, message: 'Listing tidak ditemukan atau sudah tidak tersedia.' });
  });
});
