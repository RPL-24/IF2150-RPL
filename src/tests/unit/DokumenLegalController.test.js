// src/tests/unit/DokumenLegalController.test.js
const DokumenLegalController = require('../../controllers/DokumenLegalController');
const DokumenLegal = require('../../models/DokumenLegal');

describe('DokumenLegalController Unit Test (UC06)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getDokumen (KF13, KF38)', () => {
    test.each(['kebijakan-privasi', 'ketentuan-penggunaan'])('jenis %p diteruskan ke getVersiTerbaru', async (jenis) => {
      const dokumen = new DokumenLegal({ jenisDokumen: jenis, versi: '1.0' });
      const ambil = jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(dokumen);
      expect(await DokumenLegalController.getDokumen(jenis)).toBe(dokumen);
      expect(ambil).toHaveBeenCalledWith(jenis);
    });

    test.each(['kebijakan-rahasia', '../../etc', '', undefined, "kebijakan-privasi' OR '1'='1"])(
      'jenis tidak dikenal %p ditolak tanpa query ke basis data',
      async (jenis) => {
        const ambil = jest.spyOn(DokumenLegal, 'getVersiTerbaru');
        expect(await DokumenLegalController.getDokumen(jenis)).toBeNull();
        expect(ambil).not.toHaveBeenCalled();
      },
    );

    test('null bila belum ada versi yang berlaku', async () => {
      jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(null);
      expect(await DokumenLegalController.getDokumen('kebijakan-privasi')).toBeNull();
    });
  });

  describe('getKlausaPrivasi (KF38)', () => {
    test('mengambil klausul dari Kebijakan Privasi yang berlaku', async () => {
      const ambil = jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(
        new DokumenLegal({ klausaPrivasiPesan: 'Isi percakapan tidak dapat diakses admin maupun pengembang.' }),
      );
      expect(await DokumenLegalController.getKlausaPrivasi()).toBe('Isi percakapan tidak dapat diakses admin maupun pengembang.');
      expect(ambil).toHaveBeenCalledWith('kebijakan-privasi');
    });

    test('null bila Kebijakan Privasi belum tersedia', async () => {
      jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(null);
      expect(await DokumenLegalController.getKlausaPrivasi()).toBeNull();
    });
  });
});
