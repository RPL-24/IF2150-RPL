// src/tests/unit/Otorisasi.test.js
const Otorisasi = require('../../pendukung/Otorisasi');
const SesiLogin = require('../../models/SesiLogin');
const Admin = require('../../models/Admin');

function reqDenganHeader(nilai) {
  return { get: (nama) => (nama === 'Authorization' ? nilai : undefined) };
}

function resPalsu() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

const sesiAktif = (idAkun = 'akun-1') => new SesiLogin({ idAkun, token: 'tkn', statusAktif: true });

describe('Otorisasi Unit Test (C41)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ambilToken', () => {
    test.each([
      ['Bearer abc123', 'abc123'],
      ['bearer abc123', null],
      ['Basic abc123', null],
      ['Bearer', null],
      ['', null],
      [undefined, null],
    ])('header %p → %p', (header, hasil) => {
      expect(Otorisasi.ambilToken(reqDenganHeader(header))).toBe(hasil);
    });
  });

  describe('verifikasiToken (Algo-064)', () => {
    test.each([null, undefined, '', '   '])('token %p ditolak tanpa query ke basis data', async (token) => {
      const cari = jest.spyOn(SesiLogin, 'cariSesiAktif');
      expect(await Otorisasi.verifikasiToken(token)).toBeNull();
      expect(cari).not.toHaveBeenCalled();
    });

    test('token tidak dikenal, nonaktif, atau kedaluwarsa → null (KF11)', async () => {
      // cariSesiAktif hanya mengembalikan sesi aktif yang belum kedaluwarsa (Algo-030)
      jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(null);
      expect(await Otorisasi.verifikasiToken('token-basi')).toBeNull();
    });

    test('token valid → objek SesiLogin', async () => {
      const sesi = sesiAktif();
      const cari = jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(sesi);
      expect(await Otorisasi.verifikasiToken('tkn')).toBe(sesi);
      expect(cari).toHaveBeenCalledWith('tkn');
    });
  });

  describe('verifikasiAdmin (Algo-065, KF56)', () => {
    test('sesi tidak valid → null tanpa memeriksa peran', async () => {
      jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(null);
      const peran = jest.spyOn(Admin, 'verifikasiPeran');
      expect(await Otorisasi.verifikasiAdmin('tkn')).toBeNull();
      expect(peran).not.toHaveBeenCalled();
    });

    test('akun bukan admin → null', async () => {
      jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(sesiAktif('akun-pengguna'));
      const peran = jest.spyOn(Admin, 'verifikasiPeran').mockResolvedValue(false);
      expect(await Otorisasi.verifikasiAdmin('tkn')).toBeNull();
      expect(peran).toHaveBeenCalledWith('akun-pengguna');
    });

    test('akun admin → sesi', async () => {
      const sesi = sesiAktif('akun-admin');
      jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(sesi);
      jest.spyOn(Admin, 'verifikasiPeran').mockResolvedValue(true);
      expect(await Otorisasi.verifikasiAdmin('tkn')).toBe(sesi);
    });
  });

  describe('middleware wajibLogin', () => {
    test('tanpa token → 401 dan handler tidak dijalankan', async () => {
      const res = resPalsu();
      const next = jest.fn();
      await Otorisasi.wajibLogin(reqDenganHeader(undefined), res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ sukses: false, pesan: 'Silakan masuk terlebih dahulu.' });
      expect(next).not.toHaveBeenCalled();
    });

    test('token valid → req.akun dan req.token terisi, lalu next()', async () => {
      jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(sesiAktif('akun-7'));
      const req = reqDenganHeader('Bearer tkn');
      const res = resPalsu();
      const next = jest.fn();
      await Otorisasi.wajibLogin(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.akun).toEqual({ idAkun: 'akun-7' });
      expect(req.token).toBe('tkn');
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('middleware wajibAdmin', () => {
    test('belum masuk → 401', async () => {
      jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(null);
      const res = resPalsu();
      const next = jest.fn();
      await Otorisasi.wajibAdmin(reqDenganHeader('Bearer tkn'), res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('masuk tetapi bukan admin → 403', async () => {
      jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(sesiAktif());
      jest.spyOn(Admin, 'verifikasiPeran').mockResolvedValue(false);
      const res = resPalsu();
      const next = jest.fn();
      await Otorisasi.wajibAdmin(reqDenganHeader('Bearer tkn'), res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ sukses: false, pesan: 'Akses hanya untuk admin.' });
      expect(next).not.toHaveBeenCalled();
    });

    test('admin → next() dengan req.akun terisi', async () => {
      jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(sesiAktif('akun-admin'));
      jest.spyOn(Admin, 'verifikasiPeran').mockResolvedValue(true);
      const req = reqDenganHeader('Bearer tkn');
      const next = jest.fn();
      await Otorisasi.wajibAdmin(req, resPalsu(), next);
      expect(next).toHaveBeenCalled();
      expect(req.akun).toEqual({ idAkun: 'akun-admin' });
    });

    test('admin → sesi hanya dicari satu kali ke basis data', async () => {
      const cariSesi = jest.spyOn(SesiLogin, 'cariSesiAktif').mockResolvedValue(sesiAktif('akun-admin'));
      jest.spyOn(Admin, 'verifikasiPeran').mockResolvedValue(true);
      const next = jest.fn();
      await Otorisasi.wajibAdmin(reqDenganHeader('Bearer tkn'), resPalsu(), next);
      expect(next).toHaveBeenCalled();
      expect(cariSesi).toHaveBeenCalledTimes(1);
    });
  });
});
