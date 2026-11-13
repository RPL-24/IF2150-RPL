// src/tests/unit/BarangModel.test.js
const Barang = require('../../models/Barang');
const FotoBarang = require('../../models/FotoBarang');
const db = require('../../config/db');

describe('Barang & FotoBarang Model Unit Test (C29, C30 - UC22, UC23, UC24)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Barang Model', () => {
    test('berhasil membuat instance Barang dari objek data dan baris basis data', () => {
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

    test('simpan() mengeksekusi kueri INSERT dan mengembalikan idBarang', async () => {
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

    test('cariById() mengembalikan data model barang yang cocok', async () => {
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

    test('hapus() mengeksekusi DELETE pada tabel barang', async () => {
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

    test('nonaktifkanByPemilik() mengubah status seluruh barang Tersedia menjadi Dinonaktifkan (KF54)', async () => {
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

    test('pulihkanKatalog() memulihkan status barang Dinonaktifkan menjadi Tersedia (UC24)', async () => {
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
    test('validasiFormat() hanya menerima file berekstensi jpg, jpeg, png', () => {
      expect(FotoBarang.validasiFormat('jpg')).toBe(true);
      expect(FotoBarang.validasiFormat('.JPEG')).toBe(true);
      expect(FotoBarang.validasiFormat('png')).toBe(true);
      expect(FotoBarang.validasiFormat('pdf')).toBe(false);
      expect(FotoBarang.validasiFormat('exe')).toBe(false);
      expect(FotoBarang.validasiFormat('')).toBe(false);
    });

    test('validasiUkuran() memvalidasi batas maksimum 5MB', () => {
      expect(FotoBarang.validasiUkuran(1024)).toBe(true);
      expect(FotoBarang.validasiUkuran(5 * 1024 * 1024)).toBe(true);
      expect(FotoBarang.validasiUkuran(5 * 1024 * 1024 + 1)).toBe(false);
      expect(FotoBarang.validasiUkuran(0)).toBe(false);
      expect(FotoBarang.validasiUkuran(-10)).toBe(false);
    });

    test('simpan() menyimpan rekaman foto barang', async () => {
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

    test('getGaleri() mengambil daftar foto terurut', async () => {
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

    test('hapus() menghapus metadata foto barang', async () => {
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
