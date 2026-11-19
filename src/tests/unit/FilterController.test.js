// src/tests/unit/FilterController.test.js
// Pengujian unit C17 FilterController (Modul C, UC14, KF26, KF27, KF28).
const FilterController = require('../../controllers/FilterController');

describe('C17 FilterController', () => {
  describe('validasiFilter', () => {
    test('C17-UT01 memberi nilai bawaan saat query kosong', () => {
      const bawaan = {
        kategori: null,
        lokasi: null,
        hargaMin: null,
        hargaMaks: null,
        urut: 'terbaru',
        halaman: 1,
      };
      expect(FilterController.validasiFilter({})).toEqual(bawaan);
      expect(FilterController.validasiFilter()).toEqual(bawaan);
    });

    test('C17-UT02 membaca seluruh kriteria sekaligus', () => {
      const hasil = FilterController.validasiFilter({
        kategori: 'Kalkulator',
        lokasi: 'Labtek V',
        hargaMin: '10000',
        hargaMaks: '50000',
        urut: 'TERMURAH',
        halaman: '3',
      });
      expect(hasil).toEqual({
        kategori: 'Kalkulator',
        lokasi: 'Labtek V',
        hargaMin: 10000,
        hargaMaks: 50000,
        urut: 'termurah',
        halaman: 3,
      });
    });

    test('C17-UT03 menolak harga minimum lebih besar dari maksimum (UC14 Alternatif 2)', () => {
      expect(() => FilterController.validasiFilter({ hargaMin: '200000', hargaMaks: '50000' })).toThrow(
        /tidak boleh lebih besar/,
      );
    });

    test('C17-UT04 harga minimum sama dengan maksimum, termasuk 0, diterima', () => {
      expect(FilterController.validasiFilter({ hargaMin: '50000', hargaMaks: '50000' })).toMatchObject({
        hargaMin: 50000,
        hargaMaks: 50000,
      });
      expect(FilterController.validasiFilter({ hargaMin: '0', hargaMaks: '0' })).toMatchObject({
        hargaMin: 0,
        hargaMaks: 0,
      });
    });

    test.each([
      ['hargaMin', '-1'],
      ['hargaMaks', 'murah'],
      ['hargaMaks', 'Infinity'],
    ])('C17-UT05 menolak %s = "%s" (negatif atau bukan angka)', (kolom, nilai) => {
      expect(() => FilterController.validasiFilter({ [kolom]: nilai })).toThrow(/angka tidak negatif/);
    });

    test('C17-UT06 menolak urutan yang tidak dikenal', () => {
      expect(() => FilterController.validasiFilter({ urut: 'acak' })).toThrow(/Urutan/);
      expect(() => FilterController.validasiFilter({ urut: 'harga; DROP TABLE barang' })).toThrow(/Urutan/);
    });

    test('C17-UT07 urutan tidak peka huruf besar dan spasi', () => {
      expect(FilterController.validasiFilter({ urut: ' Termahal ' }).urut).toBe('termahal');
    });

    test.each(['0', '-1', '1.5', 'dua'])('C17-UT08 menolak nomor halaman "%s"', (halaman) => {
      expect(() => FilterController.validasiFilter({ halaman })).toThrow(/Nomor halaman/);
    });

    test('C17-UT09 kategori dan lokasi tepat 50 karakter diterima', () => {
      const limaPuluh = 'x'.repeat(50);
      expect(FilterController.validasiFilter({ kategori: limaPuluh, lokasi: limaPuluh })).toMatchObject({
        kategori: limaPuluh,
        lokasi: limaPuluh,
      });
    });

    test('C17-UT10 kategori atau lokasi 51 karakter ditolak', () => {
      const terlaluPanjang = 'x'.repeat(51);
      expect(() => FilterController.validasiFilter({ kategori: terlaluPanjang })).toThrow(/Kategori tidak valid/);
      expect(() => FilterController.validasiFilter({ lokasi: terlaluPanjang })).toThrow(/Lokasi COD tidak valid/);
    });

    test('C17-UT11 galat validasi berstatus HTTP 400', () => {
      expect.assertions(1);
      try {
        FilterController.validasiFilter({ urut: 'acak' });
      } catch (galat) {
        expect(galat.status).toBe(400);
      }
    });
  });

  describe('hitungPaginasi', () => {
    test('C17-UT12 halaman 1 dimulai dari offset 0 dengan 20 item (KF28)', () => {
      expect(FilterController.hitungPaginasi(1)).toEqual({ batas: 20, offset: 0 });
    });

    test('C17-UT13 halaman 3 dimulai dari offset 40', () => {
      expect(FilterController.hitungPaginasi(3)).toEqual({ batas: 20, offset: 40 });
    });

    test('C17-UT14 ukuran halaman dapat diganti pemanggil', () => {
      expect(FilterController.hitungPaginasi(2, 5)).toEqual({ batas: 5, offset: 5 });
    });
  });
});
