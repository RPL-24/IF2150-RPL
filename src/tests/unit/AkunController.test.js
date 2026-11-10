// src/tests/unit/AkunController.test.js
const config = require('../../config/env');
const AkunController = require('../../controllers/AkunController');
const NotifikasiController = require('../../controllers/NotifikasiController');
const Akun = require('../../models/Akun');
const Barang = require('../../models/Barang');
const DokumenLegal = require('../../models/DokumenLegal');
const SesiLogin = require('../../models/SesiLogin');
const TokenVerifikasi = require('../../models/TokenVerifikasi');
const Kriptografi = require('../../pendukung/Kriptografi');
const Otorisasi = require('../../pendukung/Otorisasi');

const MENIT = 60 * 1000;

function buatAkun(data = {}) {
  return new Akun({
    idAkun: 'akun-1',
    nama: 'Mahasiswa Uji',
    nim: '13599999',
    email: 'uji@itb.ac.id',
    kataSandiHash: '$2b$10$hashtersimpan',
    statusAkun: 'Terverifikasi',
    statusBlokir: false,
    peran: 'Pengguna',
    setujuKebijakan: true,
    ...data,
  });
}

function buatToken(data = {}) {
  return new TokenVerifikasi({
    idToken: 'token-1',
    idAkun: 'akun-1',
    kode: '123456',
    waktuBuat: new Date(),
    waktuKedaluwarsa: new Date(Date.now() + 15 * MENIT),
    statusPakai: 'Aktif',
    ...data,
  });
}

const FORMULIR = ['Mahasiswa Uji', '13599999', 'uji@itb.ac.id', 'rahasia123', true];

describe('AkunController Unit Test (Modul A)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validasiDomainEmail (KF05)', () => {
    test.each([
      ['uji@itb.ac.id', true],
      ['UJI@ITB.AC.ID', true],
      ['  uji@itb.ac.id  ', true],
      ['uji@gmail.com', false],
      ['uji@itb.ac.id.com', false],
      ['uji@mahasiswa.itb.ac.id', false],
      ['@itb.ac.id', false],
      ['', false],
      [null, false],
      [12345, false],
    ])('%p → %p', (email, hasil) => {
      expect(AkunController.validasiDomainEmail(email)).toBe(hasil);
    });
  });

  describe('validasiKelengkapanFormulir (KF14)', () => {
    test('lolos bila semua isian terisi dan kebijakan disetujui', () => {
      expect(AkunController.validasiKelengkapanFormulir(...FORMULIR)).toBe(true);
    });

    test('gagal bila ada isian kosong atau hanya spasi', () => {
      expect(AkunController.validasiKelengkapanFormulir('', '13599999', 'uji@itb.ac.id', 'rahasia123', true)).toBe(false);
      expect(AkunController.validasiKelengkapanFormulir('Nama', '   ', 'uji@itb.ac.id', 'rahasia123', true)).toBe(false);
      expect(AkunController.validasiKelengkapanFormulir('Nama', '13599999', 'uji@itb.ac.id', undefined, true)).toBe(false);
    });

    test('gagal bila kebijakan tidak disetujui', () => {
      expect(AkunController.validasiKelengkapanFormulir('Nama', '13599999', 'uji@itb.ac.id', 'rahasia123', false)).toBe(false);
    });
  });

  describe('daftarAkun (UC01, Algo-002)', () => {
    function siapkanPendaftaranSukses() {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(null);
      jest.spyOn(Kriptografi, 'hash').mockResolvedValue('$2b$10$hashbaru');
      const simpanAkun = jest.spyOn(Akun, 'simpan').mockResolvedValue('akun-baru');
      const simpanToken = jest.spyOn(TokenVerifikasi, 'simpan').mockResolvedValue(true);
      const kirimSurel = jest.spyOn(NotifikasiController, 'kirimEmailVerifikasi').mockResolvedValue(true);
      return { simpanAkun, simpanToken, kirimSurel };
    }

    test('menolak bila kebijakan privasi tidak disetujui (KF14)', async () => {
      const simpan = jest.spyOn(Akun, 'simpan');
      const hasil = await AkunController.daftarAkun('Nama', '13599999', 'uji@itb.ac.id', 'rahasia123', false);
      expect(hasil).toMatchObject({ berhasil: false, kodePesan: 'KEBIJAKAN_BELUM_DISETUJUI' });
      expect(simpan).not.toHaveBeenCalled();
    });

    test('menolak formulir yang tidak lengkap', async () => {
      const hasil = await AkunController.daftarAkun('  ', '13599999', 'uji@itb.ac.id', 'rahasia123', true);
      expect(hasil.kodePesan).toBe('FORMULIR_TIDAK_LENGKAP');
    });

    test('menolak surel di luar domain @itb.ac.id (KF05)', async () => {
      const hasil = await AkunController.daftarAkun('Nama', '13599999', 'uji@gmail.com', 'rahasia123', true);
      expect(hasil.kodePesan).toBe('DOMAIN_TIDAK_VALID');
    });

    test('menolak NIM yang memuat selain angka', async () => {
      const hasil = await AkunController.daftarAkun('Nama', '135ab', 'uji@itb.ac.id', 'rahasia123', true);
      expect(hasil.kodePesan).toBe('NIM_TIDAK_VALID');
    });

    test.each(['pendek1', 'hanyahuruf', '12345678'])('menolak kata sandi lemah %p', async (kataSandi) => {
      const hasil = await AkunController.daftarAkun('Nama', '13599999', 'uji@itb.ac.id', kataSandi, true);
      expect(hasil.kodePesan).toBe('KATA_SANDI_LEMAH');
    });

    test('menolak surel yang sudah terdaftar (KF05)', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(buatAkun());
      const simpan = jest.spyOn(Akun, 'simpan');
      const hasil = await AkunController.daftarAkun(...FORMULIR);
      expect(hasil.kodePesan).toBe('SUREL_TERDAFTAR');
      expect(simpan).not.toHaveBeenCalled();
    });

    test('menyimpan akun "Belum Terverifikasi" dengan hash, lalu mengirim kode 6 digit (KF02, KF06, KF09)', async () => {
      const { simpanAkun, simpanToken, kirimSurel } = siapkanPendaftaranSukses();

      const hasil = await AkunController.daftarAkun(' Mahasiswa Uji ', '13599999', 'Uji@ITB.ac.id', 'rahasia123', true);

      expect(hasil).toEqual({ berhasil: true, email: 'uji@itb.ac.id', surelTerkirim: true });
      expect(simpanAkun).toHaveBeenCalledWith('Mahasiswa Uji', '13599999', 'Uji@ITB.ac.id', '$2b$10$hashbaru', 'Belum Terverifikasi', true);
      // Kata sandi asli tidak pernah diteruskan ke Model
      expect(JSON.stringify(simpanAkun.mock.calls)).not.toContain('rahasia123');

      const [idAkun, kode, waktuBuat, waktuKedaluwarsa, status] = simpanToken.mock.calls[0];
      expect(idAkun).toBe('akun-baru');
      expect(kode).toMatch(/^\d{6}$/);
      expect(waktuKedaluwarsa - waktuBuat).toBe(config.durasiKodeMenit * MENIT);
      expect(status).toBe('Aktif');
      expect(kirimSurel).toHaveBeenCalledWith('Uji@ITB.ac.id', kode);
    });

    test('akun tetap dibuat walaupun surel gagal terkirim', async () => {
      const { kirimSurel } = siapkanPendaftaranSukses();
      kirimSurel.mockResolvedValue(false);
      const hasil = await AkunController.daftarAkun(...FORMULIR);
      expect(hasil).toMatchObject({ berhasil: true, surelTerkirim: false });
    });

    test('pendaftaran bersamaan dengan surel yang sama ditolak lewat indeks unik', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(null);
      jest.spyOn(Kriptografi, 'hash').mockResolvedValue('$2b$10$hashbaru');
      jest.spyOn(Akun, 'simpan').mockRejectedValue(Object.assign(new Error('duplikat'), { code: '23505' }));
      const hasil = await AkunController.daftarAkun(...FORMULIR);
      expect(hasil.kodePesan).toBe('SUREL_TERDAFTAR');
    });
  });

  describe('verifikasiAkun (UC02, Algo-004)', () => {
    test('menolak kode kosong', async () => {
      expect((await AkunController.verifikasiAkun('uji@itb.ac.id', '')).kodePesan).toBe('KODE_KOSONG');
    });

    test('menolak surel yang tidak terdaftar', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(null);
      expect((await AkunController.verifikasiAkun('x@itb.ac.id', '123456')).kodePesan).toBe('AKUN_TIDAK_DITEMUKAN');
    });

    test('menolak akun yang sudah terverifikasi', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(buatAkun());
      expect((await AkunController.verifikasiAkun('uji@itb.ac.id', '123456')).kodePesan).toBe('SUDAH_TERVERIFIKASI');
    });

    test('menolak akun yang diblokir', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(buatAkun({ statusAkun: 'Belum Terverifikasi', statusBlokir: true }));
      expect((await AkunController.verifikasiAkun('uji@itb.ac.id', '123456')).kodePesan).toBe('AKUN_DIBLOKIR');
    });

    test('menolak bila tidak ada kode aktif', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(buatAkun({ statusAkun: 'Belum Terverifikasi' }));
      jest.spyOn(TokenVerifikasi, 'cariTokenAktif').mockResolvedValue(null);
      expect((await AkunController.verifikasiAkun('uji@itb.ac.id', '123456')).kodePesan).toBe('KODE_TIDAK_ADA');
    });

    test('menolak kode yang salah tanpa mengubah status akun', async () => {
      const akun = buatAkun({ statusAkun: 'Belum Terverifikasi' });
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(akun);
      jest.spyOn(TokenVerifikasi, 'cariTokenAktif').mockResolvedValue(buatToken());
      const ubahStatus = jest.spyOn(akun, 'perbaruiStatusAkun');
      expect((await AkunController.verifikasiAkun('uji@itb.ac.id', '654321')).kodePesan).toBe('KODE_SALAH');
      expect(ubahStatus).not.toHaveBeenCalled();
    });

    test('menolak kode yang benar tetapi sudah lewat 15 menit (KF06)', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(buatAkun({ statusAkun: 'Belum Terverifikasi' }));
      jest.spyOn(TokenVerifikasi, 'cariTokenAktif').mockResolvedValue(
        buatToken({ waktuKedaluwarsa: new Date(Date.now() - MENIT) }),
      );
      expect((await AkunController.verifikasiAkun('uji@itb.ac.id', '123456')).kodePesan).toBe('KODE_KEDALUWARSA');
    });

    test('kode benar: token ditandai terpakai dan akun menjadi "Terverifikasi" (KF07)', async () => {
      const akun = buatAkun({ statusAkun: 'Belum Terverifikasi' });
      const token = buatToken();
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(akun);
      jest.spyOn(TokenVerifikasi, 'cariTokenAktif').mockResolvedValue(token);
      const terpakai = jest.spyOn(token, 'tandaiTerpakai').mockResolvedValue();
      const ubahStatus = jest.spyOn(akun, 'perbaruiStatusAkun').mockResolvedValue(true);

      const hasil = await AkunController.verifikasiAkun('uji@itb.ac.id', ' 123456 ');

      expect(hasil).toEqual({ berhasil: true, idAkun: 'akun-1', peran: 'Pengguna' });
      expect(terpakai).toHaveBeenCalled();
      expect(ubahStatus).toHaveBeenCalledWith('Terverifikasi');
    });
  });

  describe('kirimUlangKode (UC02, Algo-005)', () => {
    test('menolak surel yang tidak terdaftar', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(null);
      expect((await AkunController.kirimUlangKode('x@itb.ac.id')).kodePesan).toBe('AKUN_TIDAK_DITEMUKAN');
    });

    test('menolak akun yang sudah terverifikasi', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(buatAkun());
      expect((await AkunController.kirimUlangKode('uji@itb.ac.id')).kodePesan).toBe('SUDAH_TERVERIFIKASI');
    });

    test('menghanguskan semua kode lama sebelum mengirim kode baru', async () => {
      const lama1 = buatToken({ idToken: 'lama-1' });
      const lama2 = buatToken({ idToken: 'lama-2' });
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(buatAkun({ statusAkun: 'Belum Terverifikasi' }));
      jest.spyOn(TokenVerifikasi, 'cariTokenAktif')
        .mockResolvedValueOnce(lama1)
        .mockResolvedValueOnce(lama2)
        .mockResolvedValueOnce(null);
      const hangus1 = jest.spyOn(lama1, 'tandaiHangus').mockResolvedValue();
      const hangus2 = jest.spyOn(lama2, 'tandaiHangus').mockResolvedValue();
      const simpanToken = jest.spyOn(TokenVerifikasi, 'simpan').mockResolvedValue(true);
      const kirimSurel = jest.spyOn(NotifikasiController, 'kirimEmailVerifikasi').mockResolvedValue(true);

      expect(await AkunController.kirimUlangKode('uji@itb.ac.id')).toEqual({ berhasil: true });
      expect(hangus1).toHaveBeenCalled();
      expect(hangus2).toHaveBeenCalled();
      expect(simpanToken).toHaveBeenCalledTimes(1);
      expect(kirimSurel).toHaveBeenCalledWith('uji@itb.ac.id', simpanToken.mock.calls[0][1]);
    });

    test('melaporkan GAGAL_KIRIM_SUREL bila SMTP gagal', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(buatAkun({ statusAkun: 'Belum Terverifikasi' }));
      jest.spyOn(TokenVerifikasi, 'cariTokenAktif').mockResolvedValue(null);
      jest.spyOn(TokenVerifikasi, 'simpan').mockResolvedValue(true);
      jest.spyOn(NotifikasiController, 'kirimEmailVerifikasi').mockResolvedValue(false);
      expect((await AkunController.kirimUlangKode('uji@itb.ac.id')).kodePesan).toBe('GAGAL_KIRIM_SUREL');
    });
  });

  describe('login (UC03, Algo-006)', () => {
    test.each([
      ['', 'rahasia123'],
      ['uji@itb.ac.id', ''],
      [123, 'rahasia123'],
      [undefined, undefined],
    ])('isian kosong atau bukan teks (%p, %p) → ISIAN_KOSONG', async (email, kataSandi) => {
      expect((await AkunController.login(email, kataSandi)).kodePesan).toBe('ISIAN_KOSONG');
    });

    test('surel tidak terdaftar → KREDENSIAL_SALAH', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(null);
      expect((await AkunController.login('x@itb.ac.id', 'rahasia123')).kodePesan).toBe('KREDENSIAL_SALAH');
    });

    test('kata sandi salah → KREDENSIAL_SALAH dengan pesan yang sama (KF10)', async () => {
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(buatAkun());
      jest.spyOn(Kriptografi, 'cocokkanHash').mockResolvedValue(false);
      const hasil = await AkunController.login('uji@itb.ac.id', 'salah123');
      expect(hasil).toMatchObject({ berhasil: false, kodePesan: 'KREDENSIAL_SALAH', pesan: 'Surel atau kata sandi salah.' });
    });

    test('akun belum terverifikasi ditolak (KF08)', async () => {
      const akun = buatAkun({ statusAkun: 'Belum Terverifikasi' });
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(akun);
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akun);
      jest.spyOn(Kriptografi, 'cocokkanHash').mockResolvedValue(true);
      expect((await AkunController.login('uji@itb.ac.id', 'rahasia123')).kodePesan).toBe('BELUM_TERVERIFIKASI');
    });

    test('akun diblokir ditolak dan tidak dibuatkan sesi (KF53)', async () => {
      const akun = buatAkun({ statusAkun: 'Diblokir', statusBlokir: true });
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(akun);
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akun);
      jest.spyOn(Kriptografi, 'cocokkanHash').mockResolvedValue(true);
      const simpanSesi = jest.spyOn(SesiLogin, 'simpan');
      expect((await AkunController.login('uji@itb.ac.id', 'rahasia123')).kodePesan).toBe('AKUN_DIBLOKIR');
      expect(simpanSesi).not.toHaveBeenCalled();
    });

    test('kredensial benar: sesi bertoken dibuat dengan masa berlaku 24 jam (KF03, KF11)', async () => {
      const akun = buatAkun({ peran: 'Admin' });
      jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(akun);
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akun);
      jest.spyOn(Kriptografi, 'cocokkanHash').mockResolvedValue(true);
      const simpanSesi = jest.spyOn(SesiLogin, 'simpan').mockResolvedValue(true);

      const hasil = await AkunController.login('uji@itb.ac.id', 'rahasia123');

      expect(hasil.berhasil).toBe(true);
      expect(hasil.peran).toBe('Admin');
      expect(hasil.token).toMatch(/^[0-9a-f]{64}$/);
      const [idAkun, token, waktuMulai, waktuKedaluwarsa] = simpanSesi.mock.calls[0];
      expect(idAkun).toBe('akun-1');
      expect(token).toBe(hasil.token);
      expect(waktuKedaluwarsa - waktuMulai).toBe(config.durasiSesiJam * 60 * MENIT);
    });
  });

  describe('logout (UC04)', () => {
    test('token tidak valid ditolak tanpa mencabut sesi apa pun', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);
      const nonaktifkan = jest.spyOn(SesiLogin, 'nonaktifkan');
      expect(await AkunController.logout('token-asal')).toBe(false);
      expect(nonaktifkan).not.toHaveBeenCalled();
    });

    test('token valid: sesi dinonaktifkan (KF12)', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(new SesiLogin({ idAkun: 'akun-1', token: 'tkn' }));
      const nonaktifkan = jest.spyOn(SesiLogin, 'nonaktifkan').mockResolvedValue();
      expect(await AkunController.logout('tkn')).toBe(true);
      expect(nonaktifkan).toHaveBeenCalledWith('tkn');
    });
  });

  describe('getProfil (UC05)', () => {
    test('sesi tidak valid → null', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);
      expect(await AkunController.getProfil('token-asal')).toBeNull();
    });

    test('mengembalikan identitas dan listing milik akun tanpa hash kata sandi (KF04)', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(new SesiLogin({ idAkun: 'akun-1', token: 'tkn' }));
      jest.spyOn(Akun, 'cariById').mockResolvedValue(buatAkun());
      const daftar = [{ idBarang: 'b1', judul: 'Jas Lab' }];
      const ambilListing = jest.spyOn(Barang, 'getListingPenjual').mockResolvedValue(daftar);

      const profil = await AkunController.getProfil('tkn');

      expect(ambilListing).toHaveBeenCalledWith('akun-1');
      expect(profil).toEqual({
        nama: 'Mahasiswa Uji',
        email: 'uji@itb.ac.id',
        nim: '13599999',
        statusAkun: 'Terverifikasi',
        statusBlokir: false,
        peran: 'Pengguna',
        daftarBarang: daftar,
      });
      expect(profil).not.toHaveProperty('kataSandiHash');
    });
  });

  describe('getTautanDokumenLegal (KF13)', () => {
    test('mengembalikan tautan Kebijakan Privasi yang berlaku', async () => {
      const ambil = jest.spyOn(DokumenLegal, 'getVersiTerbaru')
        .mockResolvedValue(new DokumenLegal({ tautan: '/legal?jenis=kebijakan-privasi' }));
      expect(await AkunController.getTautanDokumenLegal()).toBe('/legal?jenis=kebijakan-privasi');
      expect(ambil).toHaveBeenCalledWith('kebijakan-privasi');
    });

    test('null bila belum ada dokumen yang berlaku', async () => {
      jest.spyOn(DokumenLegal, 'getVersiTerbaru').mockResolvedValue(null);
      expect(await AkunController.getTautanDokumenLegal()).toBeNull();
    });
  });
});
