// src/tests/unit/LaporanModel.test.js
const Laporan = require('../../models/Laporan');
const BuktiLaporan = require('../../models/BuktiLaporan');
const LogAudit = require('../../models/LogAudit');
const PenyimpananBerkas = require('../../penyimpanan/PenyimpananBerkas');
const fs = require('fs');
const path = require('path');

describe('Model & Penyimpanan Laporan Unit Test (UC19)', () => {
  describe('Laporan Model (C36)', () => {
    test('dariBaris berhasil memetakan snake_case DB ke camelCase model', () => {
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

    test('filterByStatus menolak status di luar ketentuan', async () => {
      const hasil = await Laporan.filterByStatus('StatusTidakDikenal');
      expect(hasil).toEqual([]);
    });

    test('updateStatusPenanganan menolak status tujuan di luar ketentuan', async () => {
      const hasil = await Laporan.updateStatusPenanganan('lap-1', 'Batal');
      expect(hasil).toBe(false);
    });
  });

  describe('BuktiLaporan Model (C37)', () => {
    test('validasiLampiranWajib mengembalikan true jika ada berkas tidak kosong', () => {
      const berkas = [{ size: 1024, name: 'foto.png' }];
      expect(BuktiLaporan.validasiLampiranWajib(berkas)).toBe(true);
    });

    test('validasiLampiranWajib mengembalikan false jika berkas berukuran 0', () => {
      const berkas = [{ size: 0, name: 'foto.png' }];
      expect(BuktiLaporan.validasiLampiranWajib(berkas)).toBe(false);
    });

    test('dariBaris berhasil memetakan metadata berkas bukti', () => {
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
    test('dariBaris berhasil memetakan riwayat audit', () => {
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
  });

  describe('PenyimpananBerkas (C45)', () => {
    const tempDir = path.join(__dirname, '..', 'temp_test_uploads');

    afterAll(() => {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    test('berhasil menyimpan berkas buffer ke folder lokal', async () => {
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
