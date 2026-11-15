// src/tests/unit/LaporanModel.test.js
const Laporan = require('../../models/Laporan');
const BuktiLaporan = require('../../models/BuktiLaporan');
const LogAudit = require('../../models/LogAudit');
const PenyimpananBerkas = require('../../penyimpanan/PenyimpananBerkas');
const fs = require('fs');
const path = require('path');

describe('Model & Penyimpanan Laporan Unit Test (UC19)', () => {
  describe('Laporan Model (C36)', () => {
    test('C36-UT01 [Normal] dariBaris: baris snake_case dari basis data → objek Laporan camelCase', () => {
      const baris = {
        id_laporan: 'lap-1',
        id_pelapor: 'usr-1',
        objek_dilaporkan: 'Barang #99',
        jenis_pelanggaran: 'Penipuan',
        teks_alasan: 'Alasan penipuan',
        waktu_lapor: new Date('2026-11-04T10:00:00Z'),
        status_penanganan: 'Baru',
        waktu_perubahan: new Date('2026-11-04T10:00:00Z'),
      };

      const model = Laporan.dariBaris(baris);
      expect(model.idLaporan).toBe('lap-1');
      expect(model.idPelapor).toBe('usr-1');
      expect(model.objekDilaporkan).toBe('Barang #99');
      expect(model.statusPenanganan).toBe('Baru');
    });

    test('C36-UT02 [Negatif] filterByStatus: status di luar Baru, Diproses, Selesai → [] tanpa kueri', async () => {
      const hasil = await Laporan.filterByStatus('StatusTidakDikenal');
      expect(hasil).toEqual([]);
    });

    test('C36-UT03 [Negatif] updateStatusPenanganan: status tujuan "Batal" → false', async () => {
      const hasil = await Laporan.updateStatusPenanganan('lap-1', 'Batal');
      expect(hasil).toBe(false);
    });

    test('C36-UT04 [Batas] validasiTransisiStatus: alur maju dan status sama → true; mundur, tidak dikenal, atau null → false', () => {
      // Alur transisi valid (KF47)
      expect(Laporan.validasiTransisiStatus('Baru', 'Diproses')).toBe(true);
      expect(Laporan.validasiTransisiStatus('Baru', 'Selesai')).toBe(true);
      expect(Laporan.validasiTransisiStatus('Diproses', 'Selesai')).toBe(true);
      expect(Laporan.validasiTransisiStatus('Diproses', 'Diproses')).toBe(true);
      expect(Laporan.validasiTransisiStatus('Selesai', 'Selesai')).toBe(true);

      // Alur transisi mundur ditolak
      expect(Laporan.validasiTransisiStatus('Diproses', 'Baru')).toBe(false);
      expect(Laporan.validasiTransisiStatus('Selesai', 'Diproses')).toBe(false);
      expect(Laporan.validasiTransisiStatus('Selesai', 'Baru')).toBe(false);

      // Status tidak dikenal ditolak
      expect(Laporan.validasiTransisiStatus('Baru', 'Dihapus')).toBe(false);
      expect(Laporan.validasiTransisiStatus(null, 'Diproses')).toBe(false);
    });
  });

  describe('BuktiLaporan Model (C37)', () => {
    test('C37-UT01 [Normal] validasiLampiranWajib: satu berkas tidak kosong → true', () => {
      const berkas = [{ size: 1024, name: 'foto.png' }];
      expect(BuktiLaporan.validasiLampiranWajib(berkas)).toBe(true);
    });

    test('C37-UT02 [Batas] validasiLampiranWajib: berkas berukuran 0 byte → false', () => {
      const berkas = [{ size: 0, name: 'foto.png' }];
      expect(BuktiLaporan.validasiLampiranWajib(berkas)).toBe(false);
    });

    test('C37-UT03 [Normal] dariBaris: baris bukti_laporan → objek BuktiLaporan', () => {
      const baris = {
        id_bukti: 'buk-1',
        id_laporan: 'lap-1',
        nama_berkas: 'bukti.png',
        path_berkas: '/uploads/lap-1/bukti.png',
      };
      const model = BuktiLaporan.dariBaris(baris);
      expect(model.idBukti).toBe('buk-1');
      expect(model.namaBerkas).toBe('bukti.png');
      expect(model.pathBerkas).toBe('/uploads/lap-1/bukti.png');
    });
  });

  describe('LogAudit Model (C38 - Immutable KF48, KF49)', () => {
    test('C38-UT01 [Normal] dariBaris: baris log_audit → objek LogAudit', () => {
      const baris = {
        id_log: 'log-1',
        id_laporan: 'lap-1',
        waktu: new Date(),
        identitas_aktor: 'usr-1',
        tindakan: 'Penerimaan laporan',
      };
      const model = LogAudit.dariBaris(baris);
      expect(model.idLog).toBe('log-1');
      expect(model.identitasAktor).toBe('usr-1');
      expect(model.tindakan).toBe('Penerimaan laporan');
    });

    test('C38-UT02 [Negatif] tidak ada operasi ubah atau hapus catatan audit (KF48, KF49)', () => {
      // Tidak ada fungsi update/edit baik statis maupun pada instance
      expect(LogAudit.prototype.update).toBeUndefined();
      expect(LogAudit.prototype.edit).toBeUndefined();
      expect(LogAudit.prototype.hapus).toBeUndefined();
      expect(LogAudit.prototype.delete).toBeUndefined();
      expect(LogAudit.update).toBeUndefined();
      expect(LogAudit.edit).toBeUndefined();
      expect(LogAudit.hapus).toBeUndefined();
      expect(LogAudit.delete).toBeUndefined();
    });

    test('C38-UT03 [Normal] empat operasi catat → masing-masing satu INSERT ke log_audit dengan teks tindakan yang benar', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 1 }),
      };

      // 1. Catat penerimaan laporan
      await LogAudit.catatPenerimaanLaporan('lap-1', 'user-1', mockClient);
      expect(mockClient.query).toHaveBeenLastCalledWith(
        expect.stringMatching(/INSERT INTO log_audit/i),
        expect.arrayContaining(['lap-1', 'user-1']),
      );

      // 2. Catat perubahan status laporan
      await LogAudit.catatPerubahanStatusLaporan('lap-1', 'admin-1', 'Diproses', mockClient);
      expect(mockClient.query).toHaveBeenLastCalledWith(
        expect.stringMatching(/INSERT INTO log_audit/i),
        expect.arrayContaining(['lap-1', 'admin-1', 'Perubahan status laporan menjadi Diproses']),
      );

      // 3. Catat penghapusan listing
      await LogAudit.catatPenghapusanListing('lap-1', 'admin-1', 'brg-101', mockClient);
      expect(mockClient.query).toHaveBeenLastCalledWith(
        expect.stringMatching(/INSERT INTO log_audit/i),
        expect.arrayContaining(['lap-1', 'admin-1', 'Penghapusan listing: brg-101']),
      );

      // 4. Catat pemblokiran akun
      await LogAudit.catatPemblokiranAkun('lap-1', 'admin-1', 'akun-99', mockClient);
      expect(mockClient.query).toHaveBeenLastCalledWith(
        expect.stringMatching(/INSERT INTO log_audit/i),
        expect.arrayContaining(['lap-1', 'admin-1', 'Pemblokiran akun: akun-99']),
      );
    });
  });

  describe('PenyimpananBerkas (C45)', () => {
    const tempDir = path.join(__dirname, '..', 'temp_test_uploads');

    afterAll(() => {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    test('C45-UT01 [Normal] simpan lalu hapus: satu berkas buffer → tersimpan di /uploads/<idObjek>/ lalu terhapus, hasil true', async () => {
      PenyimpananBerkas.direktoriBasis = tempDir;
      const berkas = [
        {
          originalname: 'tangkap_layar.png',
          buffer: Buffer.from('fake-image-bytes'),
        },
      ];

      const hasil = await PenyimpananBerkas.simpan('laporan-uji-1', berkas);
      expect(hasil).toBeDefined();
      expect(hasil.length).toBe(1);
      expect(hasil[0]).toContain('/uploads/laporan-uji-1/');

      // Uji hapus berkas
      const hapusSukses = await PenyimpananBerkas.hapus(hasil);
      expect(hapusSukses).toBe(true);
    });
  });
});

// Tambahan HIUPL (M10): operasi public C36, C37, C38, dan C45 yang belum diuji.
describe('Model laporan lanjutan HIUPL (C36, C37, C38, C45)', () => {
  const db = require('../../config/db');
  const os = require('os');

  function klienPalsu(hasil = { rows: [], rowCount: 1 }) {
    return { query: jest.fn().mockResolvedValue(hasil) };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Laporan (C36)', () => {
    const BARIS = {
      id_laporan: 'lap-1', id_pelapor: 'akun-1', objek_dilaporkan: 'brg-1', jenis_pelanggaran: 'Penipuan',
      teks_alasan: 'alasan', waktu_lapor: new Date('2026-11-10T03:00:00Z'), status_penanganan: 'Baru',
      waktu_perubahan: new Date('2026-11-10T03:00:00Z'),
    };

    test('C36-UT05 [Normal] simpanLaporanBaru: data laporan → INSERT dengan status awal Baru, mengembalikan id laporan', async () => {
      const klien = klienPalsu({ rows: [{ id_laporan: 'lap-baru' }] });
      const waktu = new Date('2026-11-12T01:00:00Z');

      const id = await Laporan.simpanLaporanBaru(
        { idPelapor: 'akun-1', objekDilaporkan: 'brg-1', jenisPelanggaran: 'Penipuan', teksAlasan: 'alasan', waktuLapor: waktu },
        klien,
      );

      expect(id).toBe('lap-baru');
      const [kueri, nilai] = klien.query.mock.calls[0];
      expect(kueri).toMatch(/INSERT INTO laporan[\s\S]*'Baru'/);
      expect(nilai.slice(1)).toEqual(['akun-1', 'brg-1', 'Penipuan', 'alasan', waktu, waktu]);
    });

    test('C36-UT06 [Normal] getAllLaporan: dua baris di basis data → dua objek Laporan, terbaru lebih dulu', async () => {
      const kueri = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS, { ...BARIS, id_laporan: 'lap-2' }] });
      const hasil = await Laporan.getAllLaporan();
      expect(hasil.map((l) => l.idLaporan)).toEqual(['lap-1', 'lap-2']);
      expect(hasil[0]).toBeInstanceOf(Laporan);
      expect(kueri.mock.calls[0][0]).toMatch(/ORDER BY waktu_lapor DESC/);
    });

    test('C36-UT07 [Normal] filterByStatus: status Diproses → kueri WHERE status_penanganan = Diproses', async () => {
      const kueri = jest.spyOn(db, 'query').mockResolvedValue({ rows: [{ ...BARIS, status_penanganan: 'Diproses' }] });
      const hasil = await Laporan.filterByStatus('Diproses');
      expect(hasil[0].statusPenanganan).toBe('Diproses');
      expect(kueri.mock.calls[0][1]).toEqual(['Diproses']);
    });

    test('C36-UT08 [Normal] getDetailLaporan: id laporan yang ada → objek Laporan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS] });
      const hasil = await Laporan.getDetailLaporan('lap-1');
      expect(hasil).toMatchObject({ idLaporan: 'lap-1', jenisPelanggaran: 'Penipuan', statusPenanganan: 'Baru' });
    });

    test('C36-UT09 [Negatif] getDetailLaporan: id laporan tidak ada → null', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      await expect(Laporan.getDetailLaporan('lap-hilang')).resolves.toBeNull();
    });

    test('C36-UT10 [Normal] updateStatusPenanganan: status Selesai, satu baris berubah → true dan waktu perubahan ikut disimpan', async () => {
      const klien = klienPalsu({ rowCount: 1 });
      const waktu = new Date('2026-11-12T02:00:00Z');
      await expect(Laporan.updateStatusPenanganan('lap-1', 'Selesai', waktu, klien)).resolves.toBe(true);
      expect(klien.query.mock.calls[0][1]).toEqual(['Selesai', waktu, 'lap-1']);
    });

    test('C36-UT11 [Negatif] updateStatusPenanganan: id laporan tidak ada (0 baris berubah) → false', async () => {
      const klien = klienPalsu({ rowCount: 0 });
      await expect(Laporan.updateStatusPenanganan('lap-hilang', 'Diproses', new Date(), klien)).resolves.toBe(false);
    });

    test('C36-UT12 [Normal] getStatistikStatus: 5 Baru, 2 Diproses, 9 Selesai → jumlah per status dan Total 16', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({
        rows: [
          { status_penanganan: 'Baru', jumlah: 5 },
          { status_penanganan: 'Diproses', jumlah: 2 },
          { status_penanganan: 'Selesai', jumlah: 9 },
        ],
      });
      await expect(Laporan.getStatistikStatus()).resolves.toEqual({ Baru: 5, Diproses: 2, Selesai: 9, Total: 16 });
    });

    test('C36-UT13 [Batas] getStatistikStatus: belum ada laporan → semua status 0 dan Total 0', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      await expect(Laporan.getStatistikStatus()).resolves.toEqual({ Baru: 0, Diproses: 0, Selesai: 0, Total: 0 });
    });
  });

  describe('BuktiLaporan (C37)', () => {
    test('C37-UT04 [Negatif] validasiLampiranWajib: null, bukan array, atau array kosong → false', () => {
      expect(BuktiLaporan.validasiLampiranWajib(null)).toBe(false);
      expect(BuktiLaporan.validasiLampiranWajib({ size: 10 })).toBe(false);
      expect(BuktiLaporan.validasiLampiranWajib([])).toBe(false);
    });

    test('C37-UT05 [Batas] validasiLampiranWajib: satu berkas berukuran 1 byte → true', () => {
      expect(BuktiLaporan.validasiLampiranWajib([{ size: 1 }])).toBe(true);
    });

    test('C37-UT06 [Normal] simpan: metadata berkas bukti → INSERT ke bukti_laporan, true', async () => {
      const klien = klienPalsu({ rowCount: 1 });
      await expect(BuktiLaporan.simpan('lap-1', 'bukti.png', '/uploads/lap-1/a.png', klien)).resolves.toBe(true);
      const [kueri, nilai] = klien.query.mock.calls[0];
      expect(kueri).toMatch(/INSERT INTO bukti_laporan/);
      expect(nilai.slice(1)).toEqual(['lap-1', 'bukti.png', '/uploads/lap-1/a.png']);
    });

    test('C37-UT07 [Normal] cariByLaporan: id laporan → daftar bukti milik laporan tersebut', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({
        rows: [{ id_bukti: 'b-1', id_laporan: 'lap-1', nama_berkas: 'a.png', path_berkas: '/uploads/lap-1/a.png' }],
      });
      const hasil = await BuktiLaporan.cariByLaporan('lap-1');
      expect(hasil).toHaveLength(1);
      expect(hasil[0]).toMatchObject({ idBukti: 'b-1', namaBerkas: 'a.png' });
    });
  });

  describe('LogAudit (C38)', () => {
    test('C38-UT04 [Normal] getRiwayatByLaporan: id laporan → riwayat urut dari yang paling lama', async () => {
      const kueri = jest.spyOn(db, 'query').mockResolvedValue({
        rows: [{ id_log: 'log-1', id_laporan: 'lap-1', waktu: new Date(), identitas_aktor: 'akun-1', tindakan: 'Penerimaan laporan' }],
      });
      const hasil = await LogAudit.getRiwayatByLaporan('lap-1');
      expect(hasil[0]).toMatchObject({ idLog: 'log-1', tindakan: 'Penerimaan laporan' });
      expect(kueri.mock.calls[0][0]).toMatch(/ORDER BY waktu ASC/);
    });

    test('C38-UT05 [Normal] catatPenerimaanLaporan tanpa klien transaksi → memakai koneksi bawaan db', async () => {
      const kueri = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      await LogAudit.catatPenerimaanLaporan('lap-1', 'akun-1');
      expect(kueri).toHaveBeenCalledWith(expect.stringMatching(/INSERT INTO log_audit/), expect.arrayContaining(['lap-1', 'akun-1']));
    });
  });

  describe('PenyimpananBerkas (C45)', () => {
    const Kelas = PenyimpananBerkas.constructor;
    let penyimpanan;
    let dirUji;

    beforeEach(() => {
      dirUji = fs.mkdtempSync(path.join(os.tmpdir(), 'itbeli-c45-'));
      penyimpanan = new Kelas(dirUji, undefined);
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      fs.rmSync(dirUji, { recursive: true, force: true });
    });

    test('C45-UT02 [Normal] simpan: berkas sementara multer di disk → disalin ke folder objek dan berkas sementara dihapus', async () => {
      const sementara = path.join(dirUji, 'sementara.jpg');
      fs.writeFileSync(sementara, 'isi-foto');

      const hasil = await penyimpanan.simpan('lap-9', [{ originalname: 'Foto.JPG', path: sementara }]);

      expect(hasil).toHaveLength(1);
      expect(hasil[0]).toMatch(/^\/uploads\/lap-9\/[0-9a-f-]{36}\.jpg$/);
      expect(fs.readFileSync(path.join(dirUji, 'lap-9', path.basename(hasil[0])), 'utf8')).toBe('isi-foto');
      expect(fs.existsSync(sementara)).toBe(false);
    });

    test('C45-UT03 [Negatif] simpan: berkas kedua tanpa buffer maupun path → null, berkas pertama yang sempat tertulis dihapus', async () => {
      const hasil = await penyimpanan.simpan('lap-9', [
        { originalname: 'a.png', buffer: Buffer.from('a') },
        { originalname: 'b.png' },
      ]);

      expect(hasil).toBeNull();
      expect(fs.readdirSync(path.join(dirUji, 'lap-9'))).toEqual([]);
    });

    test('C45-UT04 [Batas] simpan: daftar berkas kosong atau bukan array → [] tanpa membuat folder', async () => {
      await expect(penyimpanan.simpan('lap-9', [])).resolves.toEqual([]);
      await expect(penyimpanan.simpan('lap-9', null)).resolves.toEqual([]);
      expect(fs.existsSync(path.join(dirUji, 'lap-9'))).toBe(false);
    });

    test('C45-UT05 [Normal] hapus: path /uploads/ yang ada dan yang sudah tidak ada → berkas yang ada terhapus, hasil true', async () => {
      const [pathBerkas] = await penyimpanan.simpan('lap-9', [{ originalname: 'a.png', buffer: Buffer.from('a') }]);

      await expect(penyimpanan.hapus([pathBerkas, '/uploads/lap-9/sudah-hilang.png'])).resolves.toBe(true);
      expect(fs.readdirSync(path.join(dirUji, 'lap-9'))).toEqual([]);
    });

    test('C45-UT06 [Batas] hapus: daftar kosong atau null → true tanpa menyentuh disk', async () => {
      await expect(penyimpanan.hapus([])).resolves.toBe(true);
      await expect(penyimpanan.hapus(null)).resolves.toBe(true);
    });
  });
});
