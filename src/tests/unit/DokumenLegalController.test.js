// src/tests/unit/DokumenLegalController.test.js
const DokumenLegalController = require('../../controllers/DokumenLegalController');
const DokumenLegal = require('../../models/DokumenLegal');

describe('DokumenLegalController Unit Test (UC06)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getDokumen (KF13, KF38)', () => {
    test.each(['kebijakan-privasi', 'ketentuan-penggunaan'])('C22-UT01 jenis %p diteruskan ke getVersiTerbaru', async (jenis) => {
      const dokumen = new DokumenLegal({ jenisDokumen: jenis, versi: '1.0' });
      const ambil = jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(dokumen);
      expect(await DokumenLegalController.getDokumen(jenis)).toBe(dokumen);
      expect(ambil).toHaveBeenCalledWith(jenis);
    });

    test.each(['kebijakan-rahasia', '../../etc', '', undefined, "kebijakan-privasi' OR '1'='1"])(
      'C22-UT02 jenis tidak dikenal %p ditolak tanpa query ke basis data',
      async (jenis) => {
        const ambil = jest.spyOn(DokumenLegal, 'getVersiTerbaru');
        expect(await DokumenLegalController.getDokumen(jenis)).toBeNull();
        expect(ambil).not.toHaveBeenCalled();
      },
    );

    test('C22-UT03 null bila belum ada versi yang berlaku', async () => {
      jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(null);
      expect(await DokumenLegalController.getDokumen('kebijakan-privasi')).toBeNull();
    });
  });

  describe('getKlausaPrivasi (KF38)', () => {
    test('C22-UT04 mengambil klausul dari Kebijakan Privasi yang berlaku', async () => {
      const ambil = jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(
        new DokumenLegal({ klausaPrivasiPesan: 'Isi percakapan tidak dapat diakses admin maupun pengembang.' }),
      );
      expect(await DokumenLegalController.getKlausaPrivasi()).toBe('Isi percakapan tidak dapat diakses admin maupun pengembang.');
      expect(ambil).toHaveBeenCalledWith('kebijakan-privasi');
    });

    test('C22-UT05 null bila Kebijakan Privasi belum tersedia', async () => {
      jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(null);
      expect(await DokumenLegalController.getKlausaPrivasi()).toBeNull();
    });
  });
});
