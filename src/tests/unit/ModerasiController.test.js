// src/tests/unit/ModerasiController.test.js
const ModerasiController = require('../../controllers/ModerasiController');
const Otorisasi = require('../../pendukung/Otorisasi');
const Laporan = require('../../models/Laporan');
const BuktiLaporan = require('../../models/BuktiLaporan');
const LogAudit = require('../../models/LogAudit');
const LogAdmin = require('../../models/LogAdmin');
const Akun = require('../../models/Akun');
const SesiLogin = require('../../models/SesiLogin');
const Barang = require('../../models/Barang');
const FotoBarang = require('../../models/FotoBarang');
const NotifikasiController = require('../../controllers/NotifikasiController');
const PenyimpananBerkas = require('../../penyimpanan/PenyimpananBerkas');
const db = require('../../config/db');

describe('ModerasiController Unit Test (UC20, UC22, UC23)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('otorisasiAdmin (KF56)', () => {
    test('mengembalikan idAdmin jika token valid dan berperan admin', async () => {
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });

      const res = await ModerasiController.otorisasiAdmin('token-admin-valid');
      expect(res).toBe('admin-id-123');
    });

    test('mengembalikan null jika bukan admin atau token tidak sah', async () => {
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue(null);

      const res = await ModerasiController.otorisasiAdmin('token-user-biasa');
      expect(res).toBeNull();
    });
  });

  describe('getAllLaporan (KF45, KF56)', () => {
    test('berhasil mengambil seluruh daftar laporan untuk admin yang terotorisasi', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      const laporanContoh = [
        new Laporan({
          idLaporan: 'lap-1',
          idPelapor: 'pelapor-1',
          objekDilaporkan: 'Barang #1',
          jenisPelanggaran: 'Penipuan',
          teksAlasan: 'Uang dibawa kabur',
          statusPenanganan: 'Baru',
        }),
      ];
      jest.spyOn(Laporan, 'getAllLaporan').mockResolvedValue(laporanContoh);

      const hasil = await ModerasiController.getAllLaporan('token-admin');
      expect(hasil).toHaveLength(1);
      expect(hasil[0].idLaporan).toBe('lap-1');
      expect(hasil[0].statusPenanganan).toBe('Baru');
    });

    test('menolak akses dan mengembalikan null jika bukan admin', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);
      const hasil = await ModerasiController.getAllLaporan('token-non-admin');
      expect(hasil).toBeNull();
    });
  });

  describe('filterByStatus (KF46, KF56)', () => {
    test('berhasil menyaring laporan berdasarkan status "Baru"', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      const laporanBaru = [
        new Laporan({
          idLaporan: 'lap-baru-1',
          idPelapor: 'pelapor-1',
          objekDilaporkan: 'Akun Spammer',
          jenisPelanggaran: 'Konten tidak pantas',
          statusPenanganan: 'Baru',
        }),
      ];
      jest.spyOn(Laporan, 'filterByStatus').mockResolvedValue(laporanBaru);

      const hasil = await ModerasiController.filterByStatus('token-admin', 'Baru');
      expect(hasil).toHaveLength(1);
      expect(hasil[0].statusPenanganan).toBe('Baru');
      expect(Laporan.filterByStatus).toHaveBeenCalledWith('Baru');
    });

    test('mengambil seluruh laporan jika filter status adalah "Semua"', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getAllLaporan').mockResolvedValue([]);

      const hasil = await ModerasiController.filterByStatus('token-admin', 'Semua');
      expect(hasil).toEqual([]);
      expect(Laporan.getAllLaporan).toHaveBeenCalled();
    });

    test('menolak akses jika bukan admin saat menyaring laporan', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);
      const hasil = await ModerasiController.filterByStatus('token-non-admin', 'Diproses');
      expect(hasil).toBeNull();
    });
  });

  describe('getDetailLaporan (KF45, KF56)', () => {
    test('berhasil mengambil rincian lengkap laporan termasuk pelapor, bukti, dan riwayat audit', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const dataLaporan = new Laporan({
        idLaporan: 'lap-detail-1',
        idPelapor: 'user-pelapor-id',
        objekDilaporkan: 'Barang Cacat',
        jenisPelanggaran: 'Penipuan',
        teksAlasan: 'Barang tidak sesuai deskripsi',
        statusPenanganan: 'Baru',
        waktuLapor: new Date('2026-10-28'),
      });
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(dataLaporan);

      jest.spyOn(Akun, 'cariById').mockResolvedValue(
        new Akun({
          idAkun: 'user-pelapor-id',
          nama: 'Budi Santoso',
          email: 'budi@std.stei.itb.ac.id',
          nim: '13525999',
        }),
      );

      jest.spyOn(BuktiLaporan, 'cariByLaporan').mockResolvedValue([
        new BuktiLaporan({
          idBukti: 'bukti-1',
          idLaporan: 'lap-detail-1',
          namaBerkas: 'tangkapan_chat.png',
          pathBerkas: '/uploads/tangkapan_chat.png',
        }),
      ]);

      jest.spyOn(LogAudit, 'getRiwayatByLaporan').mockResolvedValue([
        new LogAudit({
          idLog: 'log-1',
          idLaporan: 'lap-detail-1',
          waktu: new Date('2026-10-28'),
          identitasAktor: 'user-pelapor-id',
          tindakan: 'Penerimaan laporan',
        }),
      ]);

      const hasil = await ModerasiController.getDetailLaporan('token-admin', 'lap-detail-1');
      expect(hasil).not.toBeNull();
      expect(hasil.laporan.idLaporan).toBe('lap-detail-1');
      expect(hasil.pelapor.nama).toBe('Budi Santoso');
      expect(hasil.daftarBukti).toHaveLength(1);
      expect(hasil.riwayatAudit).toHaveLength(1);
      expect(hasil.riwayatAudit[0].tindakan).toBe('Penerimaan laporan');
    });

    test('mengembalikan null jika laporan tidak ditemukan', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(null);

      const hasil = await ModerasiController.getDetailLaporan('token-admin', 'id-tidak-ada');
      expect(hasil).toBeNull();
    });

    test('menolak akses jika bukan admin', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);
      const hasil = await ModerasiController.getDetailLaporan('token-non-admin', 'lap-1');
      expect(hasil).toBeNull();
    });
  });

  describe('getStatistik & ubahStatusLaporan', () => {
    test('berhasil mengambil data statistik laporan', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getStatistikStatus').mockResolvedValue({
        Baru: 5,
        Diproses: 2,
        Selesai: 10,
        Total: 17,
      });

      const stats = await ModerasiController.getStatistik('token-admin');
      expect(stats.Total).toBe(17);
      expect(stats.Baru).toBe(5);
    });

    test('berhasil memperbarui status laporan dan mencatat ke audit log (KF47, KF48)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'updateStatusPenanganan').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'catatLogAudit').mockResolvedValue();

      const sukses = await ModerasiController.ubahStatusLaporan('token-admin', 'lap-1', 'Diproses');
      expect(sukses).toBe(true);
      expect(Laporan.updateStatusPenanganan).toHaveBeenCalledWith('lap-1', 'Diproses');
      expect(ModerasiController.catatLogAudit).toHaveBeenCalledWith(
        'lap-1',
        'admin-id-123',
        'Perubahan status laporan menjadi Diproses',
      );
    });

    test('menolak pembaruan jika status baru tidak sah', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      const sukses = await ModerasiController.ubahStatusLaporan('token-admin', 'lap-1', 'StatusPalsu');
      expect(sukses).toBe(false);
    });
  });

  describe('hapusListingDilaporkan (KF50, KF52, KF55, KF56, Algo-022)', () => {
    let mockClient;

    beforeEach(() => {
      mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [] }),
        release: jest.fn(),
      };
      jest.spyOn(db.pool, 'connect').mockResolvedValue(mockClient);
    });

    test('berhasil menghapus listing dilaporkan, galeri foto, ubah status laporan, catat log audit & admin, serta kirim surel peringatan', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const barangMock = new Barang({
        idBarang: 'brg-101',
        idPenjual: 'penjual-99',
        judul: 'Kalkulator Casio KW',
        harga: 75000,
        deskripsiKondisi: 'Kondisi bekas',
        status: 'Tersedia',
      });
      jest.spyOn(Barang, 'cariById').mockResolvedValue(barangMock);
      jest.spyOn(Barang, 'hapus').mockResolvedValue(true);

      const akunPenjualMock = new Akun({
        idAkun: 'penjual-99',
        nama: 'Asep Suparman',
        email: 'asep@std.stei.itb.ac.id',
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akunPenjualMock);

      const fotoMock = [
        new FotoBarang({
          idFoto: 'f-1',
          idBarang: 'brg-101',
          namaBerkas: 'foto1.jpg',
          pathBerkas: '/uploads/brg-101/foto1.jpg',
        }),
      ];
      jest.spyOn(FotoBarang, 'getGaleri').mockResolvedValue(fotoMock);
      jest.spyOn(FotoBarang, 'hapus').mockResolvedValue(true);

      jest.spyOn(Laporan, 'updateStatusPenanganan').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'catatLogAudit').mockResolvedValue();
      jest.spyOn(ModerasiController, 'catatLogAdmin').mockResolvedValue();
      jest.spyOn(PenyimpananBerkas, 'hapus').mockResolvedValue(true);
      jest.spyOn(NotifikasiController, 'kirimPeringatanPenghapusan').mockResolvedValue(true);

      const hasil = await ModerasiController.hapusListingDilaporkan(
        'token-admin',
        'lap-201',
        'brg-101',
        'Barang tiruan/palsu melanggar aturan ITBELI',
      );

      expect(hasil).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(FotoBarang.hapus).toHaveBeenCalledWith('brg-101', mockClient);
      expect(Barang.hapus).toHaveBeenCalledWith('brg-101', mockClient);
      expect(Laporan.updateStatusPenanganan).toHaveBeenCalledWith('lap-201', 'Selesai', expect.any(Date), mockClient);
      expect(ModerasiController.catatLogAudit).toHaveBeenCalledWith(
        'lap-201',
        'admin-id-123',
        'Penghapusan listing: brg-101',
        mockClient,
      );
      expect(ModerasiController.catatLogAdmin).toHaveBeenCalledWith(
        'admin-id-123',
        'HAPUS_LISTING',
        'brg-101',
        'Barang tiruan/palsu melanggar aturan ITBELI',
        mockClient,
      );
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
      expect(PenyimpananBerkas.hapus).toHaveBeenCalledWith(['/uploads/brg-101/foto1.jpg']);
      expect(NotifikasiController.kirimPeringatanPenghapusan).toHaveBeenCalledWith(
        'penjual-99',
        'asep@std.stei.itb.ac.id',
        'Kalkulator Casio KW',
        'Barang tiruan/palsu melanggar aturan ITBELI',
      );
    });

    test('menolak jika pemohon bukan admin (KF56)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);

      const hasil = await ModerasiController.hapusListingDilaporkan(
        'token-user',
        'lap-1',
        'brg-1',
        'Alasan',
      );

      expect(hasil).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('menolak jika alasan penghapusan kosong atau hanya spasi (KF55)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const hasil1 = await ModerasiController.hapusListingDilaporkan('token-admin', 'lap-1', 'brg-1', '');
      const hasil2 = await ModerasiController.hapusListingDilaporkan('token-admin', 'lap-1', 'brg-1', '   ');

      expect(hasil1).toBe(false);
      expect(hasil2).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('mengembalikan false jika listing barang tidak ditemukan (404)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Barang, 'cariById').mockResolvedValue(null);

      const hasil = await ModerasiController.hapusListingDilaporkan(
        'token-admin',
        'lap-1',
        'brg-tidak-ada',
        'Alasan valid',
      );

      expect(hasil).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('berhasil menghapus listing jika idLaporan null/kosong (tanpa pembaruan laporan)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const barangMock = new Barang({
        idBarang: 'brg-102',
        idPenjual: 'penjual-88',
        judul: 'Barang Pelanggaran Langsung',
      });
      jest.spyOn(Barang, 'cariById').mockResolvedValue(barangMock);
      jest.spyOn(Barang, 'hapus').mockResolvedValue(true);
      jest.spyOn(Akun, 'cariById').mockResolvedValue(null);
      jest.spyOn(FotoBarang, 'getGaleri').mockResolvedValue([]);
      jest.spyOn(FotoBarang, 'hapus').mockResolvedValue(true);
      jest.spyOn(Laporan, 'updateStatusPenanganan').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'catatLogAudit').mockResolvedValue();
      jest.spyOn(ModerasiController, 'catatLogAdmin').mockResolvedValue();

      const hasil = await ModerasiController.hapusListingDilaporkan(
        'token-admin',
        null,
        'brg-102',
        'Dihapus langsung oleh admin',
      );

      expect(hasil).toBe(true);
      expect(Laporan.updateStatusPenanganan).not.toHaveBeenCalled();
      expect(ModerasiController.catatLogAudit).not.toHaveBeenCalled();
      expect(ModerasiController.catatLogAdmin).toHaveBeenCalledWith(
        'admin-id-123',
        'HAPUS_LISTING',
        'brg-102',
        'Dihapus langsung oleh admin',
        mockClient,
      );
    });

    test('melakukan rollback jika transaksi database mengalami kegagalan', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const barangMock = new Barang({
        idBarang: 'brg-103',
        idPenjual: 'penjual-77',
        judul: 'Buku',
      });
      jest.spyOn(Barang, 'cariById').mockResolvedValue(barangMock);
      jest.spyOn(FotoBarang, 'getGaleri').mockResolvedValue([]);
      jest.spyOn(Akun, 'cariById').mockResolvedValue(null);

      mockClient.query.mockImplementation((sql) => {
        if (sql === 'BEGIN') return Promise.resolve();
        if (sql.includes('DELETE FROM foto_barang')) return Promise.reject(new Error('DB Connection Lost'));
        if (sql === 'ROLLBACK') return Promise.resolve();
        return Promise.resolve();
      });

      await expect(
        ModerasiController.hapusListingDilaporkan('token-admin', 'lap-1', 'brg-103', 'Alasan error'),
      ).rejects.toThrow('DB Connection Lost');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('blokirAkun (KF51, KF52, KF53, KF54, KF55, KF56, Algo-023)', () => {
    let mockClient;

    beforeEach(() => {
      mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [] }),
        release: jest.fn(),
      };
      jest.spyOn(db.pool, 'connect').mockResolvedValue(mockClient);
    });

    test('berhasil memblokir akun sasaran, menonaktifkan seluruh listing, mencabut seluruh sesi, update laporan, catat log audit & admin, serta kirim surel penangguhan', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const akunSasaranMock = new Akun({
        idAkun: 'akun-penipu-1',
        nama: 'Akun Penipu',
        email: 'penipu@std.stei.itb.ac.id',
        statusAkun: 'Terverifikasi',
        statusBlokir: false,
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akunSasaranMock);
      jest.spyOn(akunSasaranMock, 'blokir').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'nonaktifkanListingPengguna').mockResolvedValue(true);
      jest.spyOn(SesiLogin, 'nonaktifkanByAkun').mockResolvedValue();
      jest.spyOn(Laporan, 'updateStatusPenanganan').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'catatLogAudit').mockResolvedValue();
      jest.spyOn(ModerasiController, 'catatLogAdmin').mockResolvedValue();
      jest.spyOn(NotifikasiController, 'kirimPesanPenangguhan').mockResolvedValue(true);

      const hasil = await ModerasiController.blokirAkun(
        'token-admin',
        'lap-301',
        'akun-penipu-1',
        'Terbukti melakukan transaksi fiktif berulang',
      );

      expect(hasil).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(akunSasaranMock.blokir).toHaveBeenCalledWith(mockClient);
      expect(ModerasiController.nonaktifkanListingPengguna).toHaveBeenCalledWith('akun-penipu-1', mockClient);
      expect(SesiLogin.nonaktifkanByAkun).toHaveBeenCalledWith('akun-penipu-1', mockClient);
      expect(Laporan.updateStatusPenanganan).toHaveBeenCalledWith('lap-301', 'Selesai', expect.any(Date), mockClient);
      expect(ModerasiController.catatLogAudit).toHaveBeenCalledWith(
        'lap-301',
        'admin-id-123',
        'Pemblokiran akun: akun-penipu-1',
        mockClient,
      );
      expect(ModerasiController.catatLogAdmin).toHaveBeenCalledWith(
        'admin-id-123',
        'BLOKIR_AKUN',
        'akun-penipu-1',
        'Terbukti melakukan transaksi fiktif berulang',
        mockClient,
      );
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
      expect(NotifikasiController.kirimPesanPenangguhan).toHaveBeenCalledWith(
        'akun-penipu-1',
        'penipu@std.stei.itb.ac.id',
        'Terbukti melakukan transaksi fiktif berulang',
      );
    });

    test('menolak jika pemohon bukan admin (KF56)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);

      const hasil = await ModerasiController.blokirAkun(
        'token-user',
        'lap-1',
        'akun-1',
        'Alasan blokir',
      );

      expect(hasil).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('menolak jika alasan pemblokiran kosong atau hanya spasi (KF55)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const hasil1 = await ModerasiController.blokirAkun('token-admin', 'lap-1', 'akun-1', '');
      const hasil2 = await ModerasiController.blokirAkun('token-admin', 'lap-1', 'akun-1', '   ');

      expect(hasil1).toBe(false);
      expect(hasil2).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('mengembalikan false jika akun sasaran tidak ditemukan (404)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Akun, 'cariById').mockResolvedValue(null);

      const hasil = await ModerasiController.blokirAkun(
        'token-admin',
        'lap-1',
        'akun-tidak-ada',
        'Alasan valid',
      );

      expect(hasil).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('berhasil memblokir akun jika idLaporan null/kosong (tanpa pembaruan laporan)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const akunSasaranMock = new Akun({
        idAkun: 'akun-penipu-2',
        nama: 'Akun Penipu 2',
        email: 'penipu2@std.stei.itb.ac.id',
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akunSasaranMock);
      jest.spyOn(akunSasaranMock, 'blokir').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'nonaktifkanListingPengguna').mockResolvedValue(true);
      jest.spyOn(SesiLogin, 'nonaktifkanByAkun').mockResolvedValue();
      jest.spyOn(Laporan, 'updateStatusPenanganan').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'catatLogAudit').mockResolvedValue();
      jest.spyOn(ModerasiController, 'catatLogAdmin').mockResolvedValue();
      jest.spyOn(NotifikasiController, 'kirimPesanPenangguhan').mockResolvedValue(true);

      const hasil = await ModerasiController.blokirAkun(
        'token-admin',
        null,
        'akun-penipu-2',
        'Pemblokiran langsung',
      );

      expect(hasil).toBe(true);
      expect(Laporan.updateStatusPenanganan).not.toHaveBeenCalled();
      expect(ModerasiController.catatLogAudit).not.toHaveBeenCalled();
      expect(ModerasiController.catatLogAdmin).toHaveBeenCalledWith(
        'admin-id-123',
        'BLOKIR_AKUN',
        'akun-penipu-2',
        'Pemblokiran langsung',
        mockClient,
      );
    });

    test('melakukan rollback jika transaksi database mengalami kegagalan', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const akunSasaranMock = new Akun({
        idAkun: 'akun-penipu-3',
        nama: 'Akun Error',
        email: 'error@std.stei.itb.ac.id',
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akunSasaranMock);
      jest.spyOn(akunSasaranMock, 'blokir').mockRejectedValue(new Error('Database lock timeout'));

      mockClient.query.mockImplementation((sql) => {
        if (sql === 'BEGIN') return Promise.resolve();
        if (sql === 'ROLLBACK') return Promise.resolve();
        return Promise.resolve();
      });

      await expect(
        ModerasiController.blokirAkun('token-admin', 'lap-1', 'akun-penipu-3', 'Alasan error'),
      ).rejects.toThrow('Database lock timeout');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});
