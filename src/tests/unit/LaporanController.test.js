// src/tests/unit/LaporanController.test.js
const LaporanController = require('../../controllers/LaporanController');
const Otorisasi = require('../../pendukung/Otorisasi');
const db = require('../../config/db');

describe('LaporanController Unit Test (UC19)', () => {
  describe('validasiDataLaporan', () => {
    test('berhasil memvalidasi data lengkap dengan kategori valid', () => {
      const data = {
        objekDilaporkan: 'Barang #123 (Jas Lab)',
        jenisPelanggaran: 'Penipuan',
        teksAlasan: 'Penjual meminta transfer uang sebelum COD.',
      };
      expect(LaporanController.validasiDataLaporan(data)).toBe(true);
    });

    test('gagal jika objek yang dilaporkan kosong', () => {
      const data = {
        objekDilaporkan: '   ',
        jenisPelanggaran: 'Penipuan',
        teksAlasan: 'Alasan ada',
      };
      expect(LaporanController.validasiDataLaporan(data)).toBe(false);
    });

    test('gagal jika kategori pelanggaran tidak terdaftar', () => {
      const data = {
        objekDilaporkan: 'Akun #456',
        jenisPelanggaran: 'Kategori Sembarangan',
        teksAlasan: 'Alasan ada',
      };
      expect(LaporanController.validasiDataLaporan(data)).toBe(false);
    });

    test('gagal jika teks alasan kosong atau hanya spasi', () => {
      const data = {
        objekDilaporkan: 'Akun #456',
        jenisPelanggaran: 'Konten tidak pantas',
        teksAlasan: '    ',
      };
      expect(LaporanController.validasiDataLaporan(data)).toBe(false);
    });
  });

  describe('validasiBukti (KF44)', () => {
    test('gagal jika tidak ada berkas bukti yang dilampirkan', () => {
      expect(LaporanController.validasiBukti([])).toBe(false);
      expect(LaporanController.validasiBukti(null)).toBe(false);
    });

    test('gagal jika salah satu berkas melebihi batas 5 MB', () => {
      const berkas = [
        {
          originalname: 'bukti1.png',
          mimetype: 'image/png',
          size: 6 * 1024 * 1024, // 6 MB
        },
      ];
      expect(LaporanController.validasiBukti(berkas)).toBe(false);
    });

    test('gagal jika format berkas bukan JPG atau PNG', () => {
      const berkas = [
        {
          originalname: 'bukti.pdf',
          mimetype: 'application/pdf',
          size: 1024,
        },
      ];
      expect(LaporanController.validasiBukti(berkas)).toBe(false);
    });

    test('berhasil jika berkas berupa JPG/PNG dan ukuran <= 5 MB', () => {
      const berkas = [
        {
          originalname: 'bukti1.jpg',
          mimetype: 'image/jpeg',
          size: 2 * 1024 * 1024,
        },
        {
          originalname: 'bukti2.png',
          mimetype: 'image/png',
          size: 1024 * 500,
        },
      ];
      expect(LaporanController.validasiBukti(berkas)).toBe(true);
    });
  });

  describe('susunMetadataPercakapan (KF37 Privasi Percakapan)', () => {
    test('hanya memuat ID percakapan, pelapor, dan waktu, tanpa isi pesan teks', () => {
      const idChat = 'chat-uuid-123';
      const idPelapor = 'user-uuid-456';
      const metadata = LaporanController.susunMetadataPercakapan(idChat, idPelapor);

      expect(metadata.idPercakapan).toBe(idChat);
      expect(metadata.idPelapor).toBe(idPelapor);
      expect(metadata.waktu).toBeDefined();
      expect(metadata.catatanPrivasi).toBeDefined();
      expect(metadata.isiPesan).toBeUndefined();
      expect(metadata.daftarPesan).toBeUndefined();
    });
  });

  describe('buatLaporan (Algo-021)', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('menolak jika pengguna belum terotentikasi', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);
      const hasil = await LaporanController.buatLaporan('token-palsu', {}, []);

      expect(hasil.berhasil).toBe(false);
      expect(hasil.kodePesan).toBe('TIDAK_TEROTENTIKASI');
    });

    test('menolak jika data formulir tidak lengkap', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'user-1',
      });

      const hasil = await LaporanController.buatLaporan('token-valid', { objekDilaporkan: '' }, []);
      expect(hasil.berhasil).toBe(false);
      expect(hasil.kodePesan).toBe('DATA_TIDAK_LENGKAP');
    });

    test('menolak jika bukti tidak valid', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'user-1',
      });

      const data = {
        objekDilaporkan: 'Barang #1',
        jenisPelanggaran: 'Penipuan',
        teksAlasan: 'Penipuan',
      };
      const hasil = await LaporanController.buatLaporan('token-valid', data, []);
      expect(hasil.berhasil).toBe(false);
      expect(hasil.kodePesan).toBe('BUKTI_TIDAK_VALID');
    });
  });
});
