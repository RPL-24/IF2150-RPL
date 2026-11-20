// Uji enkripsi/dekripsi isi pesan C42 (Algo-068, Algo-069, KF36)
// ID dilanjutkan dari C42-UT05 (C42-UT01 s.d. C42-UT04 untuk hash/cocokkanHash berada di ModelAkun.test.js).
const crypto = require('crypto');
const { Kriptografi } = require('../../pendukung/Kriptografi');

const kunci = crypto.randomBytes(32).toString('hex');
const kripto = new Kriptografi(4, kunci);

describe('Kriptografi enkripsi/dekripsi (C42, KF36)', () => {
  test('C42-UT05 [Normal] dekripsi(enkripsi(teks)) menghasilkan teks semula, termasuk emoji, tanpa memuat teks asli', () => {
    const teks = 'Halo kak, jas labnya masih ada? 🙏';
    const sandi = kripto.enkripsi(teks);
    expect(sandi).not.toContain(teks);
    expect(Buffer.from(sandi, 'base64').toString('utf8')).not.toContain('jas labnya');
    expect(kripto.dekripsi(sandi)).toBe(teks);
  });

  test('C42-UT06 [Batas] IV acak: teks sama menghasilkan ciphertext berbeda setiap kali dienkripsi', () => {
    const a = kripto.enkripsi('sama');
    const b = kripto.enkripsi('sama');
    expect(a).not.toBe(b);
    expect(kripto.dekripsi(a)).toBe('sama');
    expect(kripto.dekripsi(b)).toBe('sama');
  });

  test('C42-UT07 [Batas] teks kosong, teks panjang 2000 karakter, dan karakter Unicode kembali utuh setelah dekripsi', () => {
    const kosong = kripto.enkripsi('');
    expect(kripto.dekripsi(kosong)).toBe('');

    const panjang = 'A'.repeat(2000);
    expect(kripto.dekripsi(kripto.enkripsi(panjang))).toBe(panjang);

    const unicode = 'Baris 1\nBaris 2 — café 日本語 🎓 Rp150.000';
    expect(kripto.dekripsi(kripto.enkripsi(unicode))).toBe(unicode);
  });

  test('C42-UT08 [Negatif] ciphertext yang diubah satu byte-nya ditolak (null)', () => {
    const data = Buffer.from(kripto.enkripsi('rahasia'), 'base64');
    data[data.length - 1] ^= 1;
    expect(kripto.dekripsi(data.toString('base64'))).toBeNull();
  });

  test('C42-UT09 [Negatif] auth tag yang dirusak ditolak (null)', () => {
    const data = Buffer.from(kripto.enkripsi('pesan penting'), 'base64');
    // Byte 12..27 adalah auth tag GCM 16 byte
    data[15] ^= 0xff;
    expect(kripto.dekripsi(data.toString('base64'))).toBeNull();
  });

  test('C42-UT10 [Negatif] kunci enkripsi lain tidak bisa membaca pesan (null)', () => {
    const lain = new Kriptografi(4, crypto.randomBytes(32).toString('hex'));
    expect(lain.dekripsi(kripto.enkripsi('rahasia'))).toBeNull();
  });

  test('C42-UT11 [Negatif] format ciphertext tidak sah, terlalu pendek, kosong, atau null mengembalikan null', () => {
    expect(kripto.dekripsi('bukan-ciphertext')).toBeNull();
    expect(kripto.dekripsi('')).toBeNull();
    expect(kripto.dekripsi(null)).toBeNull();
    expect(kripto.dekripsi(Buffer.alloc(10).toString('base64'))).toBeNull();
  });

  test('C42-UT12 [Negatif] kunci kosong, terlalu pendek, atau bukan 32 byte hex melempar galat KUNCI_ENKRIPSI_PESAN', () => {
    expect(() => new Kriptografi(4, undefined).enkripsi('x')).toThrow('KUNCI_ENKRIPSI_PESAN');
    expect(() => new Kriptografi(4, '').enkripsi('x')).toThrow('KUNCI_ENKRIPSI_PESAN');
    expect(() => new Kriptografi(4, 'abcd').enkripsi('x')).toThrow('KUNCI_ENKRIPSI_PESAN');
    expect(() => new Kriptografi(4, 'z'.repeat(64)).dekripsi('abc')).toThrow('KUNCI_ENKRIPSI_PESAN');
  });

  test('C42-UT13 [Batas] masukan bukan string (angka) dikonversi menjadi string dan dapat didekripsi', () => {
    const sandi = kripto.enkripsi(150000);
    expect(kripto.dekripsi(sandi)).toBe('150000');
  });
});
