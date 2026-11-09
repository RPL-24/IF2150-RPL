const PencarianController = require('../../controllers/PencarianController');

describe('PencarianController', () => {
  describe('normalisasiKataKunci', () => {
    test('mengubah ke huruf kecil dan merapikan spasi', () => {
      expect(PencarianController.normalisasiKataKunci('  Meja   BELAJAR  ')).toBe('meja belajar');
    });

    test('mengembalikan string kosong untuk masukan kosong', () => {
      expect(PencarianController.normalisasiKataKunci(undefined)).toBe('');
      expect(PencarianController.normalisasiKataKunci(null)).toBe('');
      expect(PencarianController.normalisasiKataKunci('   ')).toBe('');
    });

    test('memotong kata kunci yang terlalu panjang', () => {
      const panjang = 'a'.repeat(500);
      expect(PencarianController.normalisasiKataKunci(panjang)).toHaveLength(
        PencarianController.PANJANG_MAKS_KATA_KUNCI,
      );
    });
  });

  describe('pecahKataKunci', () => {
    test('memecah menjadi kata unik', () => {
      expect(PencarianController.pecahKataKunci('meja meja belajar')).toEqual(['meja', 'belajar']);
    });

    test('membatasi jumlah kata', () => {
      const hasil = PencarianController.pecahKataKunci('a b c d e f g');
      expect(hasil).toHaveLength(PencarianController.JUMLAH_MAKS_KATA);
    });

    test('kata kunci kosong menghasilkan daftar kosong', () => {
      expect(PencarianController.pecahKataKunci('')).toEqual([]);
    });
  });

  test('siapkanPencarian menggabungkan normalisasi dan pemecahan', () => {
    expect(PencarianController.siapkanPencarian(' Kalkulator  Casio ')).toEqual({
      kataKunci: 'kalkulator casio',
      daftarKata: ['kalkulator', 'casio'],
    });
  });
});
