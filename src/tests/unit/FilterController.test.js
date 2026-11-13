const FilterController = require('../../controllers/FilterController');

describe('FilterController', () => {
  describe('validasiFilter', () => {
    test('memberi nilai bawaan saat query kosong', () => {
      expect(FilterController.validasiFilter({})).toEqual({
        kategori: null,
        lokasi: null,
        hargaMin: null,
        hargaMaks: null,
        urut: 'terbaru',
        halaman: 1,
      });
    });

    test('membaca seluruh kriteria sekaligus', () => {
      const hasil = FilterController.validasiFilter({
        kategori: 'elektronik',
        lokasi: 'ganesha',
        hargaMin: '10000',
        hargaMaks: '50000',
        urut: 'TERMURAH',
        halaman: '3',
      });
      expect(hasil).toEqual({
        kategori: 'elektronik',
        lokasi: 'ganesha',
        hargaMin: 10000,
        hargaMaks: 50000,
        urut: 'termurah',
        halaman: 3,
      });
    });

    test('menolak harga minimum lebih besar dari maksimum', () => {
      expect(() => FilterController.validasiFilter({ hargaMin: '50000', hargaMaks: '10000' })).toThrow(
        /tidak boleh lebih besar/,
      );
    });

    test('menolak harga negatif atau bukan angka', () => {
      expect(() => FilterController.validasiFilter({ hargaMin: '-1' })).toThrow();
      expect(() => FilterController.validasiFilter({ hargaMaks: 'murah' })).toThrow();
    });

    test('menolak urutan yang tidak dikenal', () => {
      expect(() => FilterController.validasiFilter({ urut: 'acak' })).toThrow(/Urutan/);
    });

    test('menolak nomor halaman tidak valid', () => {
      expect(() => FilterController.validasiFilter({ halaman: '0' })).toThrow();
      expect(() => FilterController.validasiFilter({ halaman: '1.5' })).toThrow();
      expect(() => FilterController.validasiFilter({ halaman: 'dua' })).toThrow();
    });

    test('galat validasi berstatus HTTP 400', () => {
      try {
        FilterController.validasiFilter({ urut: 'acak' });
      } catch (galat) {
        expect(galat.status).toBe(400);
      }
      expect.assertions(1);
    });
  });

  describe('hitungPaginasi', () => {
    test('halaman 1 dimulai dari offset 0 dengan 20 item', () => {
      expect(FilterController.hitungPaginasi(1)).toEqual({ batas: 20, offset: 0 });
    });

    test('halaman 3 dimulai dari offset 40', () => {
      expect(FilterController.hitungPaginasi(3)).toEqual({ batas: 20, offset: 40 });
    });
  });
});
