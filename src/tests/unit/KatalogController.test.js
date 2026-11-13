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

describe('KatalogController.getProduk', () => {
  beforeEach(() => jest.clearAllMocks());

  test('meneruskan kriteria tervalidasi dan paginasi ke Barang.getKatalog', async () => {
    Barang.getKatalog.mockResolvedValue({ daftar: [{ idBarang: 'x' }], total: 45 });
    const res = buatRes();

    await KatalogController.getProduk(
      { query: { q: '  Meja BELAJAR ', kategori: 'perabot', urut: 'termahal', halaman: '2' } },
      res,
    );

    expect(Barang.getKatalog).toHaveBeenCalledWith({
      daftarKata: ['meja', 'belajar'],
      kategori: 'perabot',
      lokasi: null,
      hargaMin: null,
      hargaMaks: null,
      urut: 'termahal',
      batas: 20,
      offset: 20,
    });
    const isi = res.json.mock.calls[0][0];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(isi.sukses).toBe(true);
    expect(isi.data.paginasi).toEqual({ halaman: 2, totalHalaman: 3, totalItem: 45, ukuranHalaman: 20 });
  });

  test('memberi pesan "Barang tidak ditemukan." saat hasil kosong', async () => {
    Barang.getKatalog.mockResolvedValue({ daftar: [], total: 0 });
    const res = buatRes();

    await KatalogController.getProduk({ query: { q: 'tidakada' } }, res);

    const isi = res.json.mock.calls[0][0];
    expect(isi.data.daftar).toEqual([]);
    expect(isi.data.paginasi.totalHalaman).toBe(1);
    expect(isi.pesan).toBe('Barang tidak ditemukan.');
  });

  test('tidak memanggil basis data jika filter tidak valid', async () => {
    await expect(
      KatalogController.getProduk({ query: { hargaMin: '9', hargaMaks: '1' } }, buatRes()),
    ).rejects.toMatchObject({ status: 400 });
    expect(Barang.getKatalog).not.toHaveBeenCalled();
  });
});

describe('KatalogController.getDetailProduk', () => {
  beforeEach(() => jest.clearAllMocks());

  test('mengembalikan 404 jika listing tidak tersedia', async () => {
    Barang.getDetailKatalog.mockResolvedValue(null);
    await expect(
      KatalogController.getDetailProduk({ params: { id: 'x' }, akun: { idAkun: ID_PEMBELI } }, buatRes()),
    ).rejects.toMatchObject({ status: 404 });
  });

  test('menandai milikSendiri sesuai akun yang membuka', async () => {
    Barang.getDetailKatalog.mockResolvedValue({ idBarang: 'x', idPenjual: ID_PENJUAL });
    const resPembeli = buatRes();
    await KatalogController.getDetailProduk({ params: { id: 'x' }, akun: { idAkun: ID_PEMBELI } }, resPembeli);
    expect(resPembeli.json.mock.calls[0][0].data.milikSendiri).toBe(false);

    Barang.getDetailKatalog.mockResolvedValue({ idBarang: 'x', idPenjual: ID_PENJUAL });
    const resPenjual = buatRes();
    await KatalogController.getDetailProduk({ params: { id: 'x' }, akun: { idAkun: ID_PENJUAL } }, resPenjual);
    expect(resPenjual.json.mock.calls[0][0].data.milikSendiri).toBe(true);
  });
});
