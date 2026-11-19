// Uji enkripsi/dekripsi isi pesan C42 (Algo-068, Algo-069, KF36)
const crypto = require('crypto');
const { Kriptografi } = require('../../pendukung/Kriptografi');

const kunci = crypto.randomBytes(32).toString('hex');
const kripto = new Kriptografi(4, kunci);

describe('Kriptografi enkripsi/dekripsi (KF36)', () => {
  test('dekripsi(enkripsi(teks)) menghasilkan teks semula, termasuk emoji', () => {
    const teks = 'Halo kak, jas labnya masih ada? 🙏';
    const sandi = kripto.enkripsi(teks);
    expect(sandi).not.toContain(teks);
    expect(kripto.dekripsi(sandi)).toBe(teks);
  });

  test('IV acak: teks sama menghasilkan ciphertext berbeda', () => {
    expect(kripto.enkripsi('sama')).not.toBe(kripto.enkripsi('sama'));
  });

  test('ciphertext yang diubah ditolak (null)', () => {
    const data = Buffer.from(kripto.enkripsi('rahasia'), 'base64');
    data[data.length - 1] ^= 1;
    expect(kripto.dekripsi(data.toString('base64'))).toBeNull();
  });

  test('kunci lain tidak bisa membaca pesan (null)', () => {
    const lain = new Kriptografi(4, crypto.randomBytes(32).toString('hex'));
    expect(lain.dekripsi(kripto.enkripsi('rahasia'))).toBeNull();
  });

  test('kunci kosong atau bukan 32 byte memberi galat yang jelas', () => {
    expect(() => new Kriptografi(4, undefined).enkripsi('x')).toThrow('KUNCI_ENKRIPSI_PESAN');
    expect(() => new Kriptografi(4, 'abcd').enkripsi('x')).toThrow('KUNCI_ENKRIPSI_PESAN');
  });
});
