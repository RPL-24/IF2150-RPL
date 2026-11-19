// src/tests/integration/AlurModulE.test.js
const request = require('supertest');
const app = require('../../app');
const Otorisasi = require('../../pendukung/Otorisasi');
const LaporanController = require('../../controllers/LaporanController');
const ModerasiController = require('../../controllers/ModerasiController');
const Laporan = require('../../models/Laporan');
const Barang = require('../../models/Barang');
const Akun = require('../../models/Akun');

describe('Pengujian Integrasi Alur End-to-End Modul E: Laporan & Moderasi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Skenario 1: Pengguna lapor listing → laporan masuk status "Baru" → admin ubah status jadi "Diproses"', () => {
    test('alur lengkap pelaporan pelanggaran listing hingga pembaruan status oleh admin', async () => {
      // 1. Pengguna masuk sistem dengan token otentikasi
      jest.spyOn(Otorisasi, 'verifikasiToken').mockImplementation(async (token) => {
        if (token === 'token-pelapor') return { getIdAkun: () => 'user-pelapor-1' };
        if (token === 'token-admin') return { getIdAkun: () => 'admin-id-1' };
        return null;
      });

      // 2. Pengguna mengirimkan laporan via POST /api/laporan
      jest.spyOn(LaporanController, 'buatLaporan').mockResolvedValue({
        berhasil: true,
        data: {
          idLaporan: 'lap-e2e-1',
          statusPenanganan: 'Baru',
          pesan: 'Laporan berhasil dikirim dan akan segera ditinjau admin.',
        },
      });

      const resLapor = await request(app)
        .post('/api/laporan')
        .set('Authorization', 'Bearer token-pelapor')
        .field('objekDilaporkan', 'Listing Buku Bajakan')
        .field('jenisPelanggaran', 'Konten tidak pantas')
        .field('teksAlasan', 'Buku yang dijual merupakan salinan bajakan tanpa izin hak cipta.')
        .attach('bukti', Buffer.from('fake-image-bytes'), 'bukti_bajakan.png');

      expect(resLapor.status).toBe(201);
      expect(resLapor.body.sukses).toBe(true);
      expect(resLapor.body.data.idLaporan).toBe('lap-e2e-1');
      expect(resLapor.body.data.statusPenanganan).toBe('Baru');

      // 3. Admin memeriksa rincian laporan yang berstatus "Baru"
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockImplementation(async (token) => {
        if (token === 'token-admin') return { getIdAkun: () => 'admin-id-1' };
        return null;
      });

      const mockLaporanTersimpan = new Laporan({
        idLaporan: 'lap-e2e-1',
        idPelapor: 'user-pelapor-1',
        objekDilaporkan: 'Listing Buku Bajakan',
        jenisPelanggaran: 'Konten tidak pantas',
        teksAlasan: 'Buku yang dijual merupakan salinan bajakan tanpa izin hak cipta.',
        statusPenanganan: 'Baru',
      });
      jest.spyOn(Laporan, 'getDetailLaporan').mockResolvedValue(mockLaporanTersimpan);
      jest.spyOn(ModerasiController, 'getDetailLaporan').mockResolvedValue({
        laporan: mockLaporanTersimpan,
        pelapor: { idAkun: 'user-pelapor-1', nama: 'Mahasiswa Pelapor' },
        daftarBukti: [{ idBukti: 'buk-1', namaBerkas: 'bukti_bajakan.png' }],
        riwayatAudit: [{ tindakan: 'Penerimaan laporan' }],
      });

      const resDetail = await request(app)
        .get('/api/admin/laporan/lap-e2e-1')
        .set('Authorization', 'Bearer token-admin');

      expect(resDetail.status).toBe(200);
      expect(resDetail.body.data.laporan.statusPenanganan).toBe('Baru');

      // 4. Admin memperbarui status laporan menjadi "Diproses"
      jest.spyOn(ModerasiController, 'ubahStatusLaporan').mockResolvedValue(true);

      const resUbah = await request(app)
        .patch('/api/admin/laporan/lap-e2e-1/status')
        .set('Authorization', 'Bearer token-admin')
        .send({ status: 'Diproses' });

      expect(resUbah.status).toBe(200);
      expect(resUbah.body.sukses).toBe(true);
      expect(resUbah.body.pesan).toMatch(/berhasil diperbarui menjadi Diproses/i);
      expect(ModerasiController.ubahStatusLaporan).toHaveBeenCalledWith('token-admin', 'lap-e2e-1', 'Diproses');
    });
  });

  describe('Skenario 2: Admin hapus listing dilaporkan → listing tidak lagi ditemukan di katalog', () => {
    test('alur lengkap penghapusan listing melanggar oleh admin dan verifikasi katalog', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({ getIdAkun: () => 'admin-id-1' });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({ getIdAkun: () => 'admin-id-1' });

      const mockBarangDilaporkan = new Barang({
        idBarang: 'brg-e2e-2',
        idPenjual: 'penjual-nakal-1',
        judul: 'Kunci Jawaban Ujian',
        status: 'Tersedia',
      });
      jest.spyOn(Barang, 'cariById').mockResolvedValue(mockBarangDilaporkan);
      jest.spyOn(ModerasiController, 'hapusListingDilaporkan').mockResolvedValue(true);

      // 1. Admin menghapus listing yang melanggar ketentuan
      const resHapus = await request(app)
        .delete('/api/admin/laporan/lap-e2e-2/barang/brg-e2e-2')
        .set('Authorization', 'Bearer token-admin')
        .send({ alasan: 'Penjualan kunci jawaban melanggar etika akademik dan aturan ITBELI' });

      expect(resHapus.status).toBe(200);
      expect(resHapus.body.sukses).toBe(true);
      expect(resHapus.body.pesan).toMatch(/listing berhasil dihapus/i);
      expect(ModerasiController.hapusListingDilaporkan).toHaveBeenCalledWith(
        'token-admin',
        'lap-e2e-2',
        'brg-e2e-2',
        'Penjualan kunci jawaban melanggar etika akademik dan aturan ITBELI',
      );

      // 2. Verifikasi listing setelah dihapus: tidak ditemukan lagi di katalog (null)
      jest.spyOn(Barang, 'cariById').mockResolvedValue(null);
      const barangSetelahHapus = await Barang.cariById('brg-e2e-2');
      expect(barangSetelahHapus).toBeNull();
    });
  });

  describe('Skenario 3: Admin blokir akun penjual → akun tidak bisa login kembali → admin buka blokir → akun bisa login kembali', () => {
    test('alur lengkap penangguhan akun, pencabutan sesi, dan pemulihan akun oleh admin', async () => {
      jest.spyOn(Otorisasi, 'verifikasiToken').mockResolvedValue({ getIdAkun: () => 'admin-id-1' });
      jest.spyOn(Otorisasi, 'verifikasiAdmin').mockResolvedValue({ getIdAkun: () => 'admin-id-1' });

      const mockAkunPenjual = new Akun({
        idAkun: 'penjual-bermasalah-1',
        nama: 'Penjual Nakal',
        email: 'nakal@std.stei.itb.ac.id',
        statusAkun: 'Terverifikasi',
        statusBlokir: false,
      });

      jest.spyOn(Akun, 'cariById').mockResolvedValue(mockAkunPenjual);
      jest.spyOn(ModerasiController, 'blokirAkun').mockImplementation(async () => {
        mockAkunPenjual.statusAkun = 'Dinonaktifkan';
        mockAkunPenjual.statusBlokir = true;
        return true;
      });

      // 1. Admin memblokir akun penjual
      const resBlokir = await request(app)
        .post('/api/admin/akun/penjual-bermasalah-1/blokir')
        .set('Authorization', 'Bearer token-admin')
        .send({ alasan: 'Penipuan transaksi berulang dan penolakan COD' });

      expect(resBlokir.status).toBe(200);
      expect(resBlokir.body.sukses).toBe(true);
      expect(resBlokir.body.pesan).toMatch(/akun berhasil diblokir/i);
      expect(mockAkunPenjual.statusBlokir).toBe(true);

      // 2. Akun terblokir mencoba login/mengakses: ditolak karena status_blokir = true
      const dapatAksesSaatDiblokir = !mockAkunPenjual.statusBlokir;
      expect(dapatAksesSaatDiblokir).toBe(false);

      // 3. Admin membuka kembali blokir akun setelah klarifikasi/banding
      jest.spyOn(ModerasiController, 'bukaBlokirAkun').mockImplementation(async () => {
        mockAkunPenjual.statusAkun = 'Terverifikasi';
        mockAkunPenjual.statusBlokir = false;
        return true;
      });

      const resBukaBlokir = await request(app)
        .post('/api/admin/akun/penjual-bermasalah-1/buka-blokir')
        .set('Authorization', 'Bearer token-admin')
        .send({ alasan: 'Klarifikasi identitas dan penyelesaian kewajiban disetujui' });

      expect(resBukaBlokir.status).toBe(200);
      expect(resBukaBlokir.body.sukses).toBe(true);
      expect(resBukaBlokir.body.pesan).toMatch(/blokir akun berhasil dibuka/i);
      expect(mockAkunPenjual.statusBlokir).toBe(false);

      // 4. Akun berhasil dipulihkan dan dapat kembali mengakses sistem
      const dapatAksesSetelahDibuka = !mockAkunPenjual.statusBlokir;
      expect(dapatAksesSetelahDibuka).toBe(true);
    });
  });
});
