// C20 LaporanController
const db = require('../config/db');
const Otorisasi = require('../pendukung/Otorisasi');
const Laporan = require('../models/Laporan');
const BuktiLaporan = require('../models/BuktiLaporan');
const LogAudit = require('../models/LogAudit');
const PenyimpananBerkas = require('../penyimpanan/PenyimpananBerkas');

const BATAS_UKURAN_BUKTI = 5 * 1024 * 1024; // 5 MB per berkas (KF44)
const FORMAT_DIIZINKAN = ['image/jpeg', 'image/png', 'image/jpg'];

class LaporanController {
  // Verifikasi token melalui Otorisasi dan mengembalikan idAkun pelapor dari sesi aktif
  static async getIdPelaporDariSesi(token) {
    const sesi = await Otorisasi.verifikasiToken(token);
    return sesi ? sesi.getIdAkun() : null;
  }

  // Memeriksa kelengkapan objek yang dilaporkan, jenis pelanggaran yang sah, dan alasan (KF43)
  static validasiDataLaporan(data) {
    if (!data || typeof data !== 'object') return false;

    const { objekDilaporkan, jenisPelanggaran, teksAlasan } = data;
    if (!objekDilaporkan || String(objekDilaporkan).trim() === '') return false;
    if (!jenisPelanggaran || !['Penipuan', 'Konten tidak pantas', 'Bug atau masalah teknis'].includes(jenisPelanggaran)) {
      return false;
    }
    if (!teksAlasan || String(teksAlasan).trim() === '') return false;

    return true;
  }

  // Menyusun metadata laporan percakapan yang hanya memuat ID percakapan, pelapor, dan waktu (KF37)
  // Menjaga privasi: tidak menyertakan rekaman isi pesan obrolan
  static susunMetadataPercakapan(idPercakapan, idPelapor) {
    return {
      idPercakapan: String(idPercakapan),
      idPelapor: String(idPelapor),
      waktu: new Date().toISOString(),
      catatanPrivasi: 'Isi rekaman obrolan dilindungi secara enkripsi dan tidak disertakan.',
    };
  }

  // Memeriksa bahwa berkas bukti berupa gambar valid dan <= 5 MB per berkas (KF44)
  static validasiBukti(berkasBukti) {
    if (!BuktiLaporan.validasiLampiranWajib(berkasBukti)) {
      return false;
    }

    for (const f of berkasBukti) {
      const ukuran = f?.size ?? f?.ukuran ?? 0;
      if (ukuran > BATAS_UKURAN_BUKTI) return false;

      const mimetype = (f?.mimetype || f?.type || '').toLowerCase();
      const nama = (f?.originalname || f?.name || '').toLowerCase();
      const ekstensiValid = nama.endsWith('.jpg') || nama.endsWith('.jpeg') || nama.endsWith('.png');

      if (!FORMAT_DIIZINKAN.includes(mimetype) && !ekstensiValid) {
        return false;
      }
    }

    return true;
  }

  // Mengunggah berkas bukti ke PenyimpananBerkas dan menyimpan rekaman ke BuktiLaporan (KF44)
  static async simpanBukti(idLaporan, berkasBukti, client = db) {
    const daftarPath = await PenyimpananBerkas.simpan(idLaporan, berkasBukti);
    if (!daftarPath || daftarPath.length === 0) {
      throw new Error('Gagal menyimpan berkas bukti ke penyimpanan.');
    }

    for (let i = 0; i < berkasBukti.length; i++) {
      const f = berkasBukti[i];
      const namaBerkas = f.originalname || f.name || `bukti-${i + 1}.png`;
      const pathBerkas = daftarPath[i];
      await BuktiLaporan.simpan(idLaporan, namaBerkas, pathBerkas, client);
    }

    return daftarPath;
  }

  // Menyimpan entitas laporan baru dengan status awal "Baru"
  static async simpanLaporan(data, client = db) {
    return Laporan.simpanLaporanBaru(data, client);
  }

  // Mencatat penerimaan laporan baru secara permanen dan immutable ke LogAudit (KF48, KF49)
  static async catatLogAudit(idLaporan, idPelapor, client = db) {
    await LogAudit.catatPenerimaanLaporan(idLaporan, idPelapor, client);
  }

  // Algo-021: buatLaporan (KF37, KF43, KF44, KF48, KF49)
  static async buatLaporan(token, data, berkasBukti) {
    const idPelapor = await this.getIdPelaporDariSesi(token);
    if (!idPelapor) {
      return { berhasil: false, kodePesan: 'TIDAK_TEROTENTIKASI', pesan: 'Silakan masuk terlebih dahulu.' };
    }

    if (!this.validasiDataLaporan(data)) {
      return {
        berhasil: false,
        kodePesan: 'DATA_TIDAK_LENGKAP',
        pesan: 'Alasan, objek yang dilaporkan, dan kategori pelanggaran wajib diisi dengan benar.',
      };
    }

    if (!this.validasiBukti(berkasBukti)) {
      return {
        berhasil: false,
        kodePesan: 'BUKTI_TIDAK_VALID',
        pesan: 'Minimal satu tangkapan layar bukti wajib dilampirkan (JPG/PNG, maks 5 MB).',
      };
    }

    const dataSimpan = {
      idPelapor,
      objekDilaporkan: data.objekDilaporkan.trim(),
      jenisPelanggaran: data.jenisPelanggaran,
      teksAlasan: data.teksAlasan.trim(),
      waktuLapor: new Date(),
      statusPenanganan: 'Baru',
    };

    // Perlindungan privasi khusus laporan obrolan (KF37)
    if (data.jenisObjek === 'Percakapan' || data.objekDilaporkan.toLowerCase().startsWith('chat:')) {
      dataSimpan.metadataTambahan = this.susunMetadataPercakapan(data.objekDilaporkan, idPelapor);
    }

    const client = await db.pool.connect();
    let idLaporan;
    try {
      await client.query('BEGIN');

      idLaporan = await this.simpanLaporan(dataSimpan, client);
      await this.simpanBukti(idLaporan, berkasBukti, client);
      await this.catatLogAudit(idLaporan, idPelapor, client);

      await client.query('COMMIT');
    } catch (galat) {
      await client.query('ROLLBACK');
      console.error('Transaksi buatLaporan gagal:', galat);
      return { berhasil: false, kodePesan: 'GALAT_SERVER', pesan: 'Terjadi galat saat memproses laporan.' };
    } finally {
      client.release();
    }

    return {
      berhasil: true,
      data: {
        idLaporan,
        statusPenanganan: 'Baru',
        pesan: 'Laporan berhasil dikirim dan akan segera ditinjau admin.',
      },
    };
  }
}

module.exports = LaporanController;
