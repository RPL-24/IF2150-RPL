// src/tests/unit/BarangModel.test.js
const Barang = require('../../models/Barang');
const FotoBarang = require('../../models/FotoBarang');
const db = require('../../config/db');

describe('Barang & FotoBarang Model Unit Test (C29, C30 - UC22, UC23, UC24)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Barang Model', () => {
    test('C29-UT05 [Normal] konstruktor dan dariBaris: data dan baris basis data → objek Barang dengan harga numerik', () => {
      const dataBaris = {
        id_barang: 'b-01',
        id_penjual: 'p-01',
        judul: 'Buku Kalkulus',
        harga: '150000',
        deskripsi_kondisi: 'Masih mulus tanpa coretan',
        id_kategori: 'buku',
        id_lokasi: 'gku-1',
        status: 'Tersedia',
        waktu_unggah: new Date(),
        waktu_ubah: new Date(),
      };

      const b = Barang.dariBaris(dataBaris);
      expect(b).not.toBeNull();
      expect(b.idBarang).toBe('b-01');
      expect(b.harga).toBe(150000);
      expect(b.getStatus()).toBe('Tersedia');

      expect(Barang.dariBaris(null)).toBeNull();
    });

    test('C29-UT06 [Normal] simpan: data listing → INSERT dan mengembalikan idBarang', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rows: [{ id_barang: 'b-999' }] }),
      };

      const id = await Barang.simpan(
        {
          idPenjual: 'p-01',
          judul: 'Jas Lab',
          harga: 50000,
          deskripsiKondisi: 'Ukuran L',
        },
        new Date(),
        mockClient,
      );

      expect(id).toBe('b-999');
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO barang'),
        expect.any(Array),
      );
    });

    test('C29-UT07 [Normal] cariById: id barang yang ada → objek Barang', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({
        rows: [
          {
            id_barang: 'b-01',
            id_penjual: 'p-01',
            judul: 'Kalkulator Casio',
            harga: '500000',
            deskripsi_kondisi: 'Bagus',
            status: 'Tersedia',
          },
        ],
      });

      const res = await Barang.cariById('b-01');
      expect(res).not.toBeNull();
      expect(res.judul).toBe('Kalkulator Casio');
      expect(res.harga).toBe(500000);
    });

    test('C29-UT08 [Normal] hapus: id barang yang ada → DELETE, true', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 1 }),
      };

      const sukses = await Barang.hapus('b-123', mockClient);
      expect(sukses).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM barang WHERE id_barang = $1',
        ['b-123'],
      );
    });

    test('C29-UT09 [Normal] nonaktifkanByPemilik: listing Tersedia milik akun → Dinonaktifkan (KF54)', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 3 }),
      };

      const sukses = await Barang.nonaktifkanByPemilik('penjual-123', mockClient);
      expect(sukses).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE id_penjual = $2 AND status = $3'),
        [Barang.STATUS.DINONAKTIFKAN, 'penjual-123', Barang.STATUS.TERSEDIA],
      );
    });

    test('C29-UT10 [Normal] pulihkanKatalog: listing Dinonaktifkan milik akun → Tersedia (UC24)', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 3 }),
      };

      const sukses = await Barang.pulihkanKatalog('penjual-123', mockClient);
      expect(sukses).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE id_penjual = $2 AND status = $3'),
        [Barang.STATUS.TERSEDIA, 'penjual-123', Barang.STATUS.DINONAKTIFKAN],
      );
    });
  });

  describe('FotoBarang Model', () => {
    test('C30-UT04 [Normal] validasiFormat: jpg, .JPEG, png, pdf, exe, kosong → hanya jpg, jpeg, dan png yang true', () => {
      expect(FotoBarang.validasiFormat('jpg')).toBe(true);
      expect(FotoBarang.validasiFormat('.JPEG')).toBe(true);
      expect(FotoBarang.validasiFormat('png')).toBe(true);
      expect(FotoBarang.validasiFormat('pdf')).toBe(false);
      expect(FotoBarang.validasiFormat('exe')).toBe(false);
      expect(FotoBarang.validasiFormat('')).toBe(false);
    });

    test('C30-UT05 [Batas] validasiUkuran: 1 KB, tepat 5 MB, 5 MB + 1 byte, 0, negatif → hanya 1 KB dan tepat 5 MB yang true', () => {
      expect(FotoBarang.validasiUkuran(1024)).toBe(true);
      expect(FotoBarang.validasiUkuran(5 * 1024 * 1024)).toBe(true);
      expect(FotoBarang.validasiUkuran(5 * 1024 * 1024 + 1)).toBe(false);
      expect(FotoBarang.validasiUkuran(0)).toBe(false);
      expect(FotoBarang.validasiUkuran(-10)).toBe(false);
    });

    test('C30-UT06 [Normal] simpan: metadata foto → INSERT ke foto_barang, true', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 1 }),
      };

      const res = await FotoBarang.simpan(
        'b-01',
        'depan.jpg',
        'jpg',
        100000,
        1,
        '/uploads/b-01/foto1.jpg',
        mockClient,
      );

      expect(res).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO foto_barang'),
        expect.any(Array),
      );
    });

    test('C30-UT07 [Normal] getGaleri: id barang → daftar foto urut menurut kolom urutan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({
        rows: [
          {
            id_foto: 'f-1',
            id_barang: 'b-01',
            nama_berkas: 'foto1.jpg',
            format: 'jpg',
            ukuran: 50000,
            urutan: 1,
            path_berkas: '/uploads/b-01/f1.jpg',
          },
        ],
      });

      const daftar = await FotoBarang.getGaleri('b-01');
      expect(daftar).toHaveLength(1);
      expect(daftar[0].idFoto).toBe('f-1');
      expect(daftar[0].pathBerkas).toBe('/uploads/b-01/f1.jpg');
    });

    test('C30-UT08 [Normal] hapus: id barang → DELETE seluruh metadata foto', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 2 }),
      };

      const res = await FotoBarang.hapus('b-01', mockClient);
      expect(res).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM foto_barang WHERE id_barang = $1',
        ['b-01'],
      );
    });
  });
});

// Tambahan HIUPL (M10): operasi C29 dan C30 milik Modul E yang belum diuji.
// Operasi katalog C29 (getKatalog, getDetailKatalog) diuji Modul C.
describe('Barang dan FotoBarang lanjutan HIUPL (C29, C30)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('C29-UT11 [Normal] getStatus: objek Barang berstatus Terjual → "Terjual"', () => {
    expect(new Barang({ status: 'Terjual' }).getStatus()).toBe('Terjual');
  });

  test('C29-UT12 [Batas] konstruktor: data tanpa status dan tanpa harga → status Tersedia dan harga 0', () => {
    const barang = new Barang({ idBarang: 'brg-1' });
    expect(barang.getStatus()).toBe('Tersedia');
    expect(barang.harga).toBe(0);
  });

  test('C29-UT13 [Negatif] cariById: id barang tidak ada → null', async () => {
    jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
    await expect(Barang.cariById('brg-hilang')).resolves.toBeNull();
  });

  test('C29-UT14 [Negatif] hapus: id barang tidak ada (0 baris terhapus) → false', async () => {
    jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
    await expect(Barang.hapus('brg-hilang')).resolves.toBe(false);
  });

  test('C29-UT15 [Normal] getListingPenjual: listing Tersedia dan Terjual milik penjual → objek Barang beserta fotoUtama', async () => {
    const kueri = jest.spyOn(db, 'query').mockResolvedValue({
      rows: [
        { id_barang: 'brg-2', id_penjual: 'akun-1', judul: 'Kalkulator', harga: '150000', status: 'Terjual', foto_utama: '/uploads/brg-2/a.png' },
        { id_barang: 'brg-1', id_penjual: 'akun-1', judul: 'Jas lab', harga: '80000', status: 'Tersedia', foto_utama: null },
      ],
    });

    const hasil = await Barang.getListingPenjual('akun-1');

    expect(hasil.map((b) => [b.idBarang, b.getStatus(), b.harga, b.fotoUtama])).toEqual([
      ['brg-2', 'Terjual', 150000, '/uploads/brg-2/a.png'],
      ['brg-1', 'Tersedia', 80000, null],
    ]);
    expect(kueri.mock.calls[0][1]).toEqual(['akun-1', 'Tersedia', 'Terjual']);
  });

  test('C29-UT16 [Batas] nonaktifkanByPemilik: penjual tanpa listing Tersedia (0 baris berubah) → tetap true', async () => {
    jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
    await expect(Barang.nonaktifkanByPemilik('akun-tanpa-listing')).resolves.toBe(true);
  });

  test('C30-UT09 [Negatif] validasiFormat: null atau "gif" → false (".PNG" tetap diterima)', () => {
    expect(FotoBarang.validasiFormat('.PNG')).toBe(true);
    expect(FotoBarang.validasiFormat(null)).toBe(false);
    expect(FotoBarang.validasiFormat('gif')).toBe(false);
  });

  test('C30-UT10 [Negatif] validasiUkuran: ukuran berupa teks "100" atau undefined → false', () => {
    expect(FotoBarang.validasiUkuran('100')).toBe(false);
    expect(FotoBarang.validasiUkuran(undefined)).toBe(false);
  });
});
