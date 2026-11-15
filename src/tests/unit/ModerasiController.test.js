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

describe('ModerasiController Unit Test (UC20, UC21, UC22, UC23, UC24)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('otorisasiAdmin (KF56)', () => {
    test('C21-UT01 [Normal] otorisasiAdmin: token sesi admin → idAdmin', async () => {
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({
        getIdAkun: () => 'admin-id-123',
      });

      const res = await ModerasiController.otorisasiAdmin('token-admin-valid');
      expect(res).toBe('admin-id-123');
    });

    test('C21-UT02 [Negatif] otorisasiAdmin: token bukan admin atau tidak sah → null (KF56)', async () => {
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue(null);

      const res = await ModerasiController.otorisasiAdmin('token-user-biasa');
      expect(res).toBeNull();
    });
  });

  describe('getAllLaporan (KF45, KF56)', () => {
    test('C21-UT03 [Normal] getAllLaporan: admin sah → seluruh laporan', async () => {
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

    test('C21-UT04 [Negatif] getAllLaporan: bukan admin → null (KF56)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);
      const hasil = await ModerasiController.getAllLaporan('token-non-admin');
      expect(hasil).toBeNull();
    });
  });

  describe('filterByStatus (KF46, KF56)', () => {
    test('C21-UT05 [Normal] filterByStatus: status "Baru" → hanya laporan Baru (KF46)', async () => {
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

    test('C21-UT06 [Batas] filterByStatus: status "Semua" → seluruh laporan', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getAllLaporan').mockResolvedValue([]);

      const hasil = await ModerasiController.filterByStatus('token-admin', 'Semua');
      expect(hasil).toEqual([]);
      expect(Laporan.getAllLaporan).toHaveBeenCalled();
    });

    test('C21-UT07 [Negatif] filterByStatus: bukan admin → null (KF56)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);
      const hasil = await ModerasiController.filterByStatus('token-non-admin', 'Diproses');
      expect(hasil).toBeNull();
    });
  });

  describe('getDetailLaporan (KF45, KF56)', () => {
    test('C21-UT08 [Normal] getDetailLaporan: laporan yang ada → laporan, pelapor, bukti, dan riwayat audit', async () => {
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

    test('C21-UT09 [Negatif] getDetailLaporan: laporan tidak ditemukan → null', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(null);

      const hasil = await ModerasiController.getDetailLaporan('token-admin', 'id-tidak-ada');
      expect(hasil).toBeNull();
    });

    test('C21-UT10 [Negatif] getDetailLaporan: bukan admin → null (KF56)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);
      const hasil = await ModerasiController.getDetailLaporan('token-non-admin', 'lap-1');
      expect(hasil).toBeNull();
    });
  });

  describe('getStatistik & ubahStatusLaporan', () => {
    test('C21-UT11 [Normal] getStatistik: admin sah → jumlah laporan per status', async () => {
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

    test('C21-UT12 [Normal] ubahStatusLaporan: Baru ke Diproses → status diperbarui dan log audit dicatat (KF47, KF48)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-1', statusPenanganan: 'Baru' }),
      );
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

    test('C21-UT13 [Negatif] ubahStatusLaporan: status tujuan tidak sah → false', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      const sukses = await ModerasiController.ubahStatusLaporan('token-admin', 'lap-1', 'StatusPalsu');
      expect(sukses).toBe(false);
    });

    test('C21-UT14 [Normal] ubahStatusLaporan: Diproses ke Selesai → true', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-1', statusPenanganan: 'Diproses' }),
      );
      jest.spyOn(Laporan, 'updateStatusPenanganan').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'catatLogAudit').mockResolvedValue();

      const sukses = await ModerasiController.ubahStatusLaporan('token-admin', 'lap-1', 'Selesai');
      expect(sukses).toBe(true);
      expect(Laporan.updateStatusPenanganan).toHaveBeenCalledWith('lap-1', 'Selesai');
    });

    test('C21-UT15 [Negatif] ubahStatusLaporan: laporan tidak ditemukan → false', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(null);

      const sukses = await ModerasiController.ubahStatusLaporan('token-admin', 'lap-tidak-ada', 'Diproses');
      expect(sukses).toBe(false);
    });

    test('C21-UT16 [Negatif] ubahStatusLaporan: transisi mundur Selesai ke Diproses → false', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-1', statusPenanganan: 'Selesai' }),
      );

      const sukses = await ModerasiController.ubahStatusLaporan('token-admin', 'lap-1', 'Diproses');
      expect(sukses).toBe(false);
    });

    test('C21-UT17 [Negatif] ubahStatusLaporan: bukan admin → false (KF56)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);

      const sukses = await ModerasiController.ubahStatusLaporan('token-non-admin', 'lap-1', 'Diproses');
      expect(sukses).toBe(false);
    });

    // catatLogAudit tidak ditiru di sini, supaya teks yang benar-benar sampai ke tabel log_audit ikut teruji.
    test('C21-UT18 [Normal] ubahStatusLaporan: teks tindakan log audit tertulis satu kali (KF48)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-1', statusPenanganan: 'Baru' }),
      );
      jest.spyOn(Laporan, 'updateStatusPenanganan').mockResolvedValue(true);
      const kueri = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1, rows: [] });

      const sukses = await ModerasiController.ubahStatusLaporan('token-admin', 'lap-1', 'Diproses');

      expect(sukses).toBe(true);
      const sisipanLog = kueri.mock.calls.filter(([teks]) => /INSERT INTO log_audit/i.test(teks));
      expect(sisipanLog).toHaveLength(1);
      expect(sisipanLog[0][1]).toEqual([
        expect.any(String),
        'lap-1',
        expect.any(Date),
        'admin-id-123',
        'Perubahan status laporan menjadi Diproses',
      ]);
    });

    test('C21-UT19 [Batas] ubahStatusLaporan: status sama dengan status sekarang → true tanpa menulis laporan maupun log audit', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-1', statusPenanganan: 'Selesai' }),
      );
      const ubah = jest.spyOn(Laporan, 'updateStatusPenanganan').mockResolvedValue(true);
      const catat = jest.spyOn(ModerasiController, 'catatLogAudit').mockResolvedValue();

      const sukses = await ModerasiController.ubahStatusLaporan('token-admin', 'lap-1', 'Selesai');

      expect(sukses).toBe(true);
      expect(ubah).not.toHaveBeenCalled();
      expect(catat).not.toHaveBeenCalled();
    });
  });

  describe('catatLogAudit (KF48, KF49)', () => {
    test('C21-UT20 [Normal] catatLogAudit: tindakan perubahan status → hanya status yang diteruskan ke LogAudit', async () => {
      const catat = jest.spyOn(LogAudit, 'catatPerubahanStatusLaporan').mockResolvedValue();

      await ModerasiController.catatLogAudit('lap-1', 'admin-1', 'Perubahan status laporan menjadi Selesai');

      expect(catat).toHaveBeenCalledWith('lap-1', 'admin-1', 'Selesai', db);
    });

    test('C21-UT21 [Normal] catatLogAudit: awalan "Penghapusan listing:" dan "Pemblokiran akun:" → operasi LogAudit yang sesuai', async () => {
      const hapus = jest.spyOn(LogAudit, 'catatPenghapusanListing').mockResolvedValue();
      const blokir = jest.spyOn(LogAudit, 'catatPemblokiranAkun').mockResolvedValue();
      const status = jest.spyOn(LogAudit, 'catatPerubahanStatusLaporan').mockResolvedValue();

      await ModerasiController.catatLogAudit('lap-1', 'admin-1', 'Penghapusan listing: brg-9');
      await ModerasiController.catatLogAudit('lap-1', 'admin-1', 'Pemblokiran akun: akun-7');

      expect(hapus).toHaveBeenCalledWith('lap-1', 'admin-1', 'brg-9', db);
      expect(blokir).toHaveBeenCalledWith('lap-1', 'admin-1', 'akun-7', db);
      expect(status).not.toHaveBeenCalled();
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

    test('C21-UT22 [Normal] hapusListingDilaporkan: admin sah dan alasan terisi → listing dan foto dihapus, laporan Selesai, log audit dan admin dicatat, surel terkirim (Algo-022)', async () => {
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

      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-1', statusPenanganan: 'Baru' }),
      );
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

    test('C21-UT23 [Negatif] hapusListingDilaporkan: bukan admin → false (KF56)', async () => {
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

    test('C21-UT24 [Batas] hapusListingDilaporkan: alasan kosong atau hanya spasi → false (KF55)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const hasil1 = await ModerasiController.hapusListingDilaporkan('token-admin', 'lap-1', 'brg-1', '');
      const hasil2 = await ModerasiController.hapusListingDilaporkan('token-admin', 'lap-1', 'brg-1', '   ');

      expect(hasil1).toBe(false);
      expect(hasil2).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('C21-UT25 [Negatif] hapusListingDilaporkan: listing tidak ditemukan → false', async () => {
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

    test('C21-UT26 [Normal] hapusListingDilaporkan: tanpa idLaporan → listing terhapus tanpa mengubah laporan', async () => {
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
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-1', statusPenanganan: 'Baru' }),
      );
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

    test('C21-UT27 [Negatif] hapusListingDilaporkan: galat basis data di tengah transaksi → ROLLBACK dan galat dilempar', async () => {
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

    test('C21-UT28 [Normal] blokirAkun: admin sah dan alasan terisi → akun diblokir, listing dinonaktifkan, sesi dicabut, laporan Selesai, log dicatat, surel terkirim (Algo-023)', async () => {
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
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-1', statusPenanganan: 'Baru' }),
      );
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

    test('C21-UT29 [Negatif] blokirAkun: bukan admin → false (KF56)', async () => {
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

    test('C21-UT30 [Batas] blokirAkun: alasan kosong atau hanya spasi → false (KF55)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const hasil1 = await ModerasiController.blokirAkun('token-admin', 'lap-1', 'akun-1', '');
      const hasil2 = await ModerasiController.blokirAkun('token-admin', 'lap-1', 'akun-1', '   ');

      expect(hasil1).toBe(false);
      expect(hasil2).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('C21-UT31 [Negatif] blokirAkun: akun sasaran tidak ditemukan → false', async () => {
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

    test('C21-UT32 [Normal] blokirAkun: tanpa idLaporan → akun diblokir tanpa mengubah laporan', async () => {
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
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(
        new Laporan({ idLaporan: 'lap-1', statusPenanganan: 'Baru' }),
      );
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

    test('C21-UT33 [Negatif] blokirAkun: galat basis data di tengah transaksi → ROLLBACK dan galat dilempar', async () => {
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

  describe('bukaBlokirAkun (KF51, KF54, KF55, KF56, Algo-024)', () => {
    let mockClient;

    beforeEach(() => {
      mockClient = {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        release: jest.fn(),
      };
      jest.spyOn(db.pool, 'connect').mockResolvedValue(mockClient);
    });

    test('C21-UT34 [Normal] bukaBlokirAkun: admin sah → blokir dibuka, listing dipulihkan, log admin dicatat (Algo-024)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const akunSasaranMock = new Akun({
        idAkun: 'akun-terblokir-1',
        nama: 'Pengguna Insyaf',
        email: 'insyaf@std.stei.itb.ac.id',
        statusAkun: 'Dinonaktifkan',
        statusBlokir: true,
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akunSasaranMock);
      jest.spyOn(akunSasaranMock, 'bukaBlokir').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'pulihkanListingPengguna').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'catatLogAdmin').mockResolvedValue();

      const hasil = await ModerasiController.bukaBlokirAkun(
        'token-admin',
        'akun-terblokir-1',
        'Banding diterima setelah verifikasi data',
      );

      expect(hasil).toBe(true);
      expect(akunSasaranMock.bukaBlokir).toHaveBeenCalledWith(mockClient);
      expect(ModerasiController.pulihkanListingPengguna).toHaveBeenCalledWith('akun-terblokir-1', mockClient);
      expect(ModerasiController.catatLogAdmin).toHaveBeenCalledWith(
        'admin-id-123',
        'BUKA_BLOKIR',
        'akun-terblokir-1',
        'Banding diterima setelah verifikasi data',
        mockClient,
      );
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });

    test('C21-UT35 [Negatif] bukaBlokirAkun: bukan admin → false (KF56)', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);

      const hasil = await ModerasiController.bukaBlokirAkun('token-invalid', 'akun-1', 'Alasan');

      expect(hasil).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('C21-UT36 [Negatif] bukaBlokirAkun: akun sasaran tidak ditemukan → false', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');
      jest.spyOn(Akun, 'cariById').mockResolvedValue(null);

      const hasil = await ModerasiController.bukaBlokirAkun('token-admin', 'akun-tidak-ada', 'Alasan');

      expect(hasil).toBe(false);
      expect(db.pool.connect).not.toHaveBeenCalled();
    });

    test('C21-UT37 [Batas] bukaBlokirAkun: alasan kosong → memakai alasan bawaan pada log admin', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const akunSasaranMock = new Akun({
        idAkun: 'akun-terblokir-2',
        nama: 'Pengguna Dua',
        email: 'dua@std.stei.itb.ac.id',
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akunSasaranMock);
      jest.spyOn(akunSasaranMock, 'bukaBlokir').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'pulihkanListingPengguna').mockResolvedValue(true);
      jest.spyOn(ModerasiController, 'catatLogAdmin').mockResolvedValue();

      const hasil = await ModerasiController.bukaBlokirAkun('token-admin', 'akun-terblokir-2', '   ');

      expect(hasil).toBe(true);
      expect(ModerasiController.catatLogAdmin).toHaveBeenCalledWith(
        'admin-id-123',
        'BUKA_BLOKIR',
        'akun-terblokir-2',
        'Pembukaan blokir akun oleh admin',
        mockClient,
      );
    });

    test('C21-UT38 [Negatif] bukaBlokirAkun: galat basis data di tengah transaksi → ROLLBACK dan galat dilempar', async () => {
      jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue('admin-id-123');

      const akunSasaranMock = new Akun({
        idAkun: 'akun-terblokir-3',
        nama: 'Pengguna Tiga',
        email: 'tiga@std.stei.itb.ac.id',
      });
      jest.spyOn(Akun, 'cariById').mockResolvedValue(akunSasaranMock);
      jest.spyOn(akunSasaranMock, 'bukaBlokir').mockRejectedValue(new Error('Koneksi terputus saat unblock'));

      mockClient.query.mockImplementation((sql) => {
        if (sql === 'BEGIN') return Promise.resolve();
        if (sql === 'ROLLBACK') return Promise.resolve();
        return Promise.resolve();
      });

      await expect(
        ModerasiController.bukaBlokirAkun('token-admin', 'akun-terblokir-3', 'Alasan rollback'),
      ).rejects.toThrow('Koneksi terputus saat unblock');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('pulihkanListingPengguna (KF54)', () => {
    test('C21-UT39 [Normal] pulihkanListingPengguna: id akun → Barang.pulihkanKatalog dipanggil dengan klien transaksi', async () => {
      jest.spyOn(Barang, 'pulihkanKatalog').mockResolvedValue(3);

      const hasil = await ModerasiController.pulihkanListingPengguna('id-penjual-1', 'client-dummy');
      expect(hasil).toBe(3);
      expect(Barang.pulihkanKatalog).toHaveBeenCalledWith('id-penjual-1', 'client-dummy');
    });
  });

});

// Tambahan HIUPL (M10): operasi public C21 yang belum diuji secara langsung.
describe('ModerasiController (C21) lanjutan HIUPL', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('C21-UT40 [Negatif] getStatistik: pemohon bukan admin → null tanpa membaca tabel laporan (KF56)', async () => {
    jest.spyOn(ModerasiController, 'otorisasiAdmin').mockResolvedValue(null);
    const statistik = jest.spyOn(Laporan, 'getStatistikStatus');
    await expect(ModerasiController.getStatistik('token-pengguna')).resolves.toBeNull();
    expect(statistik).not.toHaveBeenCalled();
  });

  test('C21-UT41 [Normal] catatLogAdmin: tindakan admin → diteruskan ke LogAdmin.catatTindakan dengan klien yang sama', async () => {
    const catat = jest.spyOn(LogAdmin, 'catatTindakan').mockResolvedValue();
    const klien = { query: jest.fn() };
    await ModerasiController.catatLogAdmin('admin-1', 'BLOKIR_AKUN', 'akun-7', 'Penipuan', klien);
    expect(catat).toHaveBeenCalledWith('admin-1', 'BLOKIR_AKUN', 'akun-7', 'Penipuan', klien);
  });

  test('C21-UT42 [Normal] nonaktifkanListingPengguna: id akun → Barang.nonaktifkanByPemilik dipanggil dengan klien transaksi', async () => {
    const nonaktifkan = jest.spyOn(Barang, 'nonaktifkanByPemilik').mockResolvedValue(true);
    const klien = { query: jest.fn() };
    await expect(ModerasiController.nonaktifkanListingPengguna('akun-7', klien)).resolves.toBe(true);
    expect(nonaktifkan).toHaveBeenCalledWith('akun-7', klien);
  });
});
