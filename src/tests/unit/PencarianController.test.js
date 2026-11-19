// src/tests/unit/PencarianController.test.js
// Pengujian unit C16 PencarianController (Modul C, UC14, KF25).
const PencarianController = require('../../controllers/PencarianController');

describe('C16 PencarianController', () => {
  describe('normalisasiKataKunci', () => {
    test('C16-UT01 mengubah ke huruf kecil dan merapikan spasi', () => {
      expect(PencarianController.normalisasiKataKunci('  Meja   BELAJAR  ')).toBe('meja belajar');
    });

    test('C16-UT02 mengembalikan string kosong untuk masukan kosong', () => {
      expect(PencarianController.normalisasiKataKunci(undefined)).toBe('');
      expect(PencarianController.normalisasiKataKunci(null)).toBe('');
      expect(PencarianController.normalisasiKataKunci('   ')).toBe('');
    });

    test('C16-UT03 memotong kata kunci yang lebih dari 100 karakter', () => {
      const panjang = 'a'.repeat(500);
      expect(PencarianController.normalisasiKataKunci(panjang)).toHaveLength(
        PencarianController.PANJANG_MAKS_KATA_KUNCI,
      );
    });

    test('C16-UT04 kata kunci tepat 100 karakter tidak terpotong', () => {
      const tepat = 'b'.repeat(100);
      expect(PencarianController.normalisasiKataKunci(tepat)).toBe(tepat);
    });

    test('C16-UT05 huruf lebar penuh (fullwidth) dinormalisasi NFKC', () => {
      // "ＭＥＪＡ" dan spasi ideografis diketik dari papan ketik bahasa Asia
      expect(PencarianController.normalisasiKataKunci('ＭＥＪＡ　Belajar')).toBe('meja belajar');
    });

    test('C16-UT06 karakter khusus pola LIKE (% dan _) dipertahankan apa adanya', () => {
      expect(PencarianController.normalisasiKataKunci('Diskon 50%_baru')).toBe('diskon 50%_baru');
    });
  });

  describe('pecahKataKunci', () => {
    test('C16-UT07 memecah menjadi kata unik', () => {
      expect(PencarianController.pecahKataKunci('meja meja belajar')).toEqual(['meja', 'belajar']);
    });

    test('C16-UT08 membatasi jumlah kata menjadi 5', () => {
      const hasil = PencarianController.pecahKataKunci('a b c d e f g');
      expect(hasil).toEqual(['a', 'b', 'c', 'd', 'e']);
      expect(hasil).toHaveLength(PencarianController.JUMLAH_MAKS_KATA);
    });

    test('C16-UT09 kata kunci kosong menghasilkan daftar kosong', () => {
      expect(PencarianController.pecahKataKunci('')).toEqual([]);
    });
  });

  describe('siapkanPencarian', () => {
    test('C16-UT10 menggabungkan normalisasi dan pemecahan', () => {
      expect(PencarianController.siapkanPencarian(' Kalkulator  Casio ')).toEqual({
        kataKunci: 'kalkulator casio',
        daftarKata: ['kalkulator', 'casio'],
      });
    });

    test('C16-UT11 tanpa kata kunci (katalog biasa) menghasilkan kriteria kosong', () => {
      expect(PencarianController.siapkanPencarian(undefined)).toEqual({ kataKunci: '', daftarKata: [] });
    });
  });
});
