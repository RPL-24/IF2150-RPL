// Uji pembacaan variabel lingkungan bernilai angka pada config/env.js.
const VARIABEL = ['PORT', 'DURASI_SESI_JAM', 'DURASI_KODE_MENIT', 'BCRYPT_SALT_ROUNDS'];

function muatKonfigurasi(nilai) {
  Object.assign(process.env, nilai);
  let konfigurasi;
  jest.isolateModules(() => {
    konfigurasi = require('../../config/env');
  });
  return konfigurasi;
}

describe('config/env: variabel lingkungan bernilai angka', () => {
  const awal = {};

  beforeEach(() => {
    VARIABEL.forEach((nama) => {
      awal[nama] = process.env[nama];
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    VARIABEL.forEach((nama) => {
      if (awal[nama] === undefined) delete process.env[nama];
      else process.env[nama] = awal[nama];
    });
    jest.restoreAllMocks();
  });

  test('nilai angka dipakai apa adanya', () => {
    const konfigurasi = muatKonfigurasi({ DURASI_SESI_JAM: '12', DURASI_KODE_MENIT: '5' });
    expect(konfigurasi.durasiSesiJam).toBe(12);
    expect(konfigurasi.durasiKodeMenit).toBe(5);
  });

  test('nilai kosong memakai bawaan tanpa peringatan', () => {
    const konfigurasi = muatKonfigurasi({ DURASI_SESI_JAM: '', DURASI_KODE_MENIT: '   ' });
    expect(konfigurasi.durasiSesiJam).toBe(24);
    expect(konfigurasi.durasiKodeMenit).toBe(15);
    expect(console.warn).not.toHaveBeenCalled();
  });

  test('nilai bukan angka memakai bawaan dan memberi peringatan, bukan NaN', () => {
    const konfigurasi = muatKonfigurasi({ DURASI_SESI_JAM: 'sehari', PORT: 'tiga-ribu' });
    expect(konfigurasi.durasiSesiJam).toBe(24);
    expect(konfigurasi.port).toBe(3000);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('DURASI_SESI_JAM'));
  });

  test('masa berlaku sesi tetap berupa tanggal yang sah walau DURASI_SESI_JAM salah isi', () => {
    const konfigurasi = muatKonfigurasi({ DURASI_SESI_JAM: 'abc' });
    const kedaluwarsa = new Date(Date.now() + konfigurasi.durasiSesiJam * 60 * 60 * 1000);
    expect(Number.isNaN(kedaluwarsa.getTime())).toBe(false);
  });
});
