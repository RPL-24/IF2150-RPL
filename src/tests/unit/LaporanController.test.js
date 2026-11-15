// src/tests/unit/LaporanController.test.js
const LaporanController = require('../../controllers/LaporanController');
const Otorisasi = require('../../pendukung/Otorisasi');
const db = require('../../config/db');

describe('LaporanController Unit Test (UC19)', () => {
  describe('validasiDataLaporan', () => {
    test('C20-UT01 [Normal] validasiDataLaporan: objek, kategori Penipuan, dan alasan terisi → true', () => {
      const data = {
        objekDilaporkan: 'Barang #123 (Jas Lab)',
        jenisPelanggaran: 'Penipuan',
        teksAlasan: 'Penjual meminta transfer uang sebelum COD.',
      };
      expect(LaporanController.validasiDataLaporan(data)).toBe(true);
    });

    test('C20-UT02 [Negatif] validasiDataLaporan: objek yang dilaporkan kosong → false', () => {
      const data = {
        objekDilaporkan: '   ',
        jenisPelanggaran: 'Penipuan',
        teksAlasan: 'Alasan ada',
      };
      expect(LaporanController.validasiDataLaporan(data)).toBe(false);
    });

    test('C20-UT03 [Negatif] validasiDataLaporan: kategori di luar tiga pilihan → false', () => {
      const data = {
        objekDilaporkan: 'Akun #456',
        jenisPelanggaran: 'Kategori Sembarangan',
        teksAlasan: 'Alasan ada',
      };
      expect(LaporanController.validasiDataLaporan(data)).toBe(false);
    });

    test('C20-UT04 [Batas] validasiDataLaporan: alasan kosong atau hanya spasi → false', () => {
      const data = {
        objekDilaporkan: 'Akun #456',
        jenisPelanggaran: 'Konten tidak pantas',
        teksAlasan: '    ',
      };
      expect(LaporanController.validasiDataLaporan(data)).toBe(false);
    });
  });

  describe('validasiBukti (KF44)', () => {
    test('C20-UT05 [Negatif] validasiBukti: tanpa berkas bukti → false', () => {
      expect(LaporanController.validasiBukti([])).toBe(false);
      expect(LaporanController.validasiBukti(null)).toBe(false);
    });

    test('C20-UT06 [Batas] validasiBukti: satu berkas melebihi 5 MB → false', () => {
      const berkas = [
        {
          originalname: 'bukti1.png',
          mimetype: 'image/png',
          size: 6 * 1024 * 1024, // 6 MB
        },
      ];
      expect(LaporanController.validasiBukti(berkas)).toBe(false);
    });

    test('C20-UT07 [Negatif] validasiBukti: berkas bukan JPG atau PNG → false', () => {
      const berkas = [
        {
          originalname: 'bukti.pdf',
          mimetype: 'application/pdf',
          size: 1024,
        },
      ];
      expect(LaporanController.validasiBukti(berkas)).toBe(false);
    });

    test('C20-UT08 [Normal] validasiBukti: JPG dan PNG berukuran di bawah 5 MB → true', () => {
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
    test('C20-UT09 [Normal] susunMetadataPercakapan: ID percakapan dan pelapor → metadata tanpa isi pesan (KF37)', () => {
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

    test('C20-UT10 [Negatif] buatLaporan: token tidak sah → TIDAK_TEROTENTIKASI', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);
      const hasil = await LaporanController.buatLaporan('token-palsu', {}, []);

      expect(hasil.berhasil).toBe(false);
      expect(hasil.kodePesan).toBe('TIDAK_TEROTENTIKASI');
    });

    test('C20-UT11 [Negatif] buatLaporan: objek yang dilaporkan kosong → DATA_TIDAK_LENGKAP', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({
        getIdAkun: () => 'user-1',
      });

      const hasil = await LaporanController.buatLaporan('token-valid', { objekDilaporkan: '' }, []);
      expect(hasil.berhasil).toBe(false);
      expect(hasil.kodePesan).toBe('DATA_TIDAK_LENGKAP');
    });

    test('C20-UT12 [Negatif] buatLaporan: data lengkap tanpa bukti → BUKTI_TIDAK_VALID', async () => {
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

// Tambahan HIUPL (M10): operasi public C20 yang belum diuji dan jalur transaksi buatLaporan.
describe('LaporanController (C20) lanjutan HIUPL', () => {
  const Laporan = require('../../models/Laporan');
  const BuktiLaporan = require('../../models/BuktiLaporan');
  const LogAudit = require('../../models/LogAudit');
  const PenyimpananBerkas = require('../../penyimpanan/PenyimpananBerkas');

  const BUKTI_PNG = { originalname: 'bukti.png', mimetype: 'image/png', size: 2048, buffer: Buffer.from('png') };
  const DATA_SAH = { objekDilaporkan: 'brg-77', jenisPelanggaran: 'Penipuan', teksAlasan: 'Barang tidak pernah dikirim' };

  function klienPalsu() {
    return { query: jest.fn().mockResolvedValue({ rows: [], rowCount: 1 }), release: jest.fn() };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('C20-UT13 [Batas] validasiBukti: satu PNG berukuran tepat 5 MB (5.242.880 byte) → true', () => {
    const berkas = [{ originalname: 'pas.png', mimetype: 'image/png', size: 5 * 1024 * 1024 }];
    expect(LaporanController.validasiBukti(berkas)).toBe(true);
  });

  test('C20-UT14 [Batas] validasiDataLaporan: data null atau bukan objek → false', () => {
    expect(LaporanController.validasiDataLaporan(null)).toBe(false);
    expect(LaporanController.validasiDataLaporan('teks')).toBe(false);
  });

  test('C20-UT15 [Normal] getIdPelaporDariSesi: token sesi aktif → idAkun pemilik sesi', async () => {
    jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({ getIdAkun: () => 'akun-9' });
    await expect(LaporanController.getIdPelaporDariSesi('token-sah')).resolves.toBe('akun-9');
  });

  test('C20-UT16 [Negatif] getIdPelaporDariSesi: token tidak sah atau kedaluwarsa → null', async () => {
    jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue(null);
    await expect(LaporanController.getIdPelaporDariSesi('token-basi')).resolves.toBeNull();
  });

  test('C20-UT17 [Normal] simpanBukti: dua berkas → BuktiLaporan.simpan dipanggil dua kali dengan path dari PenyimpananBerkas', async () => {
    jest.spyOn(PenyimpananBerkas, 'simpan').mockResolvedValue(['/uploads/lap-1/a.png', '/uploads/lap-1/b.png']);
    const simpan = jest.spyOn(BuktiLaporan, 'simpan').mockResolvedValue(true);
    const klien = klienPalsu();

    const hasil = await LaporanController.simpanBukti('lap-1', [BUKTI_PNG, { name: 'kedua.png', size: 10 }], klien);

    expect(hasil).toEqual(['/uploads/lap-1/a.png', '/uploads/lap-1/b.png']);
    expect(simpan).toHaveBeenNthCalledWith(1, 'lap-1', 'bukti.png', '/uploads/lap-1/a.png', klien);
    expect(simpan).toHaveBeenNthCalledWith(2, 'lap-1', 'kedua.png', '/uploads/lap-1/b.png', klien);
  });

  test('C20-UT18 [Negatif] simpanBukti: PenyimpananBerkas gagal (null) → melempar galat dan tidak menyimpan metadata', async () => {
    jest.spyOn(PenyimpananBerkas, 'simpan').mockResolvedValue(null);
    const simpan = jest.spyOn(BuktiLaporan, 'simpan');

    await expect(LaporanController.simpanBukti('lap-1', [BUKTI_PNG])).rejects.toThrow(/Gagal menyimpan berkas bukti/);
    expect(simpan).not.toHaveBeenCalled();
  });

  test('C20-UT19 [Normal] simpanLaporan: data laporan → diteruskan ke Laporan.simpanLaporanBaru dan mengembalikan idLaporan', async () => {
    const simpan = jest.spyOn(Laporan, 'simpanLaporanBaru').mockResolvedValue('lap-5');
    const klien = klienPalsu();
    await expect(LaporanController.simpanLaporan({ idPelapor: 'a' }, klien)).resolves.toBe('lap-5');
    expect(simpan).toHaveBeenCalledWith({ idPelapor: 'a' }, klien);
  });

  test('C20-UT20 [Normal] catatLogAudit: idLaporan dan idPelapor → LogAudit.catatPenerimaanLaporan dipanggil', async () => {
    const catat = jest.spyOn(LogAudit, 'catatPenerimaanLaporan').mockResolvedValue();
    const klien = klienPalsu();
    await LaporanController.catatLogAudit('lap-5', 'akun-9', klien);
    expect(catat).toHaveBeenCalledWith('lap-5', 'akun-9', klien);
  });

  test('C20-UT21 [Normal] buatLaporan: data dan bukti sah → satu transaksi (BEGIN, laporan, bukti, log audit, COMMIT), status Baru', async () => {
    const klien = klienPalsu();
    jest.spyOn(db.pool, 'connect').mockResolvedValue(klien);
    jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({ getIdAkun: () => 'akun-9' });
    const simpanLaporan = jest.spyOn(Laporan, 'simpanLaporanBaru').mockResolvedValue('lap-5');
    jest.spyOn(PenyimpananBerkas, 'simpan').mockResolvedValue(['/uploads/lap-5/x.png']);
    jest.spyOn(BuktiLaporan, 'simpan').mockResolvedValue(true);
    const catat = jest.spyOn(LogAudit, 'catatPenerimaanLaporan').mockResolvedValue();

    const hasil = await LaporanController.buatLaporan('token-sah', { ...DATA_SAH, teksAlasan: '  Barang tidak pernah dikirim  ' }, [BUKTI_PNG]);

    expect(hasil).toMatchObject({ berhasil: true, data: { idLaporan: 'lap-5', statusPenanganan: 'Baru' } });
    expect(klien.query.mock.calls.map(([q]) => q)).toEqual(['BEGIN', 'COMMIT']);
    expect(simpanLaporan.mock.calls[0][0]).toMatchObject({ idPelapor: 'akun-9', teksAlasan: 'Barang tidak pernah dikirim', statusPenanganan: 'Baru' });
    expect(catat).toHaveBeenCalledWith('lap-5', 'akun-9', klien);
    expect(klien.release).toHaveBeenCalledTimes(1);
  });

  test('C20-UT22 [Negatif] buatLaporan: penyimpanan bukti gagal di tengah transaksi → ROLLBACK, GALAT_SERVER, koneksi tetap dilepas', async () => {
    const klien = klienPalsu();
    jest.spyOn(db.pool, 'connect').mockResolvedValue(klien);
    jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({ getIdAkun: () => 'akun-9' });
    jest.spyOn(Laporan, 'simpanLaporanBaru').mockResolvedValue('lap-5');
    jest.spyOn(PenyimpananBerkas, 'simpan').mockResolvedValue(null);
    const catat = jest.spyOn(LogAudit, 'catatPenerimaanLaporan');
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const hasil = await LaporanController.buatLaporan('token-sah', DATA_SAH, [BUKTI_PNG]);

    expect(hasil).toMatchObject({ berhasil: false, kodePesan: 'GALAT_SERVER' });
    expect(klien.query.mock.calls.map(([q]) => q)).toEqual(['BEGIN', 'ROLLBACK']);
    expect(catat).not.toHaveBeenCalled();
    expect(klien.release).toHaveBeenCalledTimes(1);
  });

  test('C20-UT23 [Normal] buatLaporan: laporan terhadap percakapan → metadata hanya berisi ID dan waktu, tanpa isi pesan (KF37)', async () => {
    const klien = klienPalsu();
    jest.spyOn(db.pool, 'connect').mockResolvedValue(klien);
    jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({ getIdAkun: () => 'akun-9' });
    const simpanLaporan = jest.spyOn(Laporan, 'simpanLaporanBaru').mockResolvedValue('lap-6');
    jest.spyOn(PenyimpananBerkas, 'simpan').mockResolvedValue(['/uploads/lap-6/x.png']);
    jest.spyOn(BuktiLaporan, 'simpan').mockResolvedValue(true);
    jest.spyOn(LogAudit, 'catatPenerimaanLaporan').mockResolvedValue();

    await LaporanController.buatLaporan('token-sah', { ...DATA_SAH, objekDilaporkan: 'prc-3', jenisObjek: 'Percakapan' }, [BUKTI_PNG]);

    const metadata = simpanLaporan.mock.calls[0][0].metadataTambahan;
    expect(metadata).toMatchObject({ idPercakapan: 'prc-3', idPelapor: 'akun-9' });
    expect(Object.keys(metadata).sort()).toEqual(['catatanPrivasi', 'idPelapor', 'idPercakapan', 'waktu']);
  });
});
