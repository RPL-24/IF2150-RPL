// src/tests/unit/ModerasiController.test.js
const ModerasiController = require('../../controllers/ModerasiController');
const Otorisasi = require('../../pendukung/Otorisasi');
const Laporan = require('../../models/Laporan');
const BuktiLaporan = require('../../models/BuktiLaporan');
const LogAudit = require('../../models/LogAudit');
const Akun = require('../../models/Akun');

describe('ModerasiController Unit Test (UC20)', () => {
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
});
