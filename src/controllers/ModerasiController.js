// C21 ModerasiController
const db = require('../config/db');
const Otorisasi = require('../pendukung/Otorisasi');
const Laporan = require('../models/Laporan');
const BuktiLaporan = require('../models/BuktiLaporan');
const LogAudit = require('../models/LogAudit');
const LogAdmin = require('../models/LogAdmin');
const Akun = require('../models/Akun');
const Barang = require('../models/Barang');
const FotoBarang = require('../models/FotoBarang');
const NotifikasiController = require('./NotifikasiController');
const PenyimpananBerkas = require('../penyimpanan/PenyimpananBerkas');

class ModerasiController {
  // Validasi token dan memastikan peran pengguna adalah Admin (KF56)
  static async otorisasiAdmin(token) {
    const sesi = await Otorisasi.verifikasiAdmin(token);
    return sesi ? sesi.getIdAkun() : null;
  }

  // Algo-052: mengambil seluruh daftar laporan untuk dasbor admin (KF45, KF56)
  static async getAllLaporan(token) {
    const idAdmin = await this.otorisasiAdmin(token);
    if (!idAdmin) {
      return null;
    }
    return Laporan.getAllLaporan();
  }

  // Algo-053: menyaring laporan berdasarkan status penanganan (KF46, KF56)
  static async filterByStatus(token, status) {
    const idAdmin = await this.otorisasiAdmin(token);
    if (!idAdmin) {
      return null;
    }
    if (!status || status === 'Semua') {
      return Laporan.getAllLaporan();
    }
    return Laporan.filterByStatus(status);
  }

  // Algo-054: mengambil data lengkap satu laporan beserta lampiran dan riwayat audit (KF45, KF56)
  static async getDetailLaporan(token, idLaporan) {
    const idAdmin = await this.otorisasiAdmin(token);
    if (!idAdmin) {
      return null;
    }

    const laporan = await Laporan.getDetailLaporan(idLaporan);
    if (!laporan) {
      return null;
    }

    const [akunPelapor, daftarBukti, riwayatAudit] = await Promise.all([
      Akun.cariById(laporan.idPelapor),
      BuktiLaporan.cariByLaporan(idLaporan),
      LogAudit.getRiwayatByLaporan(idLaporan),
    ]);

    return {
      laporan,
      pelapor: akunPelapor
        ? {
            idAkun: akunPelapor.idAkun,
            nama: akunPelapor.nama,
            email: akunPelapor.email,
            nim: akunPelapor.nim,
          }
        : null,
      daftarBukti: daftarBukti || [],
      riwayatAudit: riwayatAudit || [],
    };
  }

  // Mengambil statistik jumlah laporan per status penanganan untuk kartu metrik dasbor
  static async getStatistik(token) {
    const idAdmin = await this.otorisasiAdmin(token);
    if (!idAdmin) {
      return null;
    }
    return Laporan.getStatistikStatus();
  }

  // Algo-055: memperbarui status laporan dan mencatat ke log audit (KF47, KF48)
  static async ubahStatusLaporan(token, idLaporan, statusBaru) {
    const idAdmin = await this.otorisasiAdmin(token);
    if (!idAdmin) return false;

    if (!['Baru', 'Diproses', 'Selesai'].includes(statusBaru)) {
      return false;
    }

    const berhasil = await Laporan.updateStatusPenanganan(idLaporan, statusBaru);
    if (berhasil) {
      await this.catatLogAudit(idLaporan, idAdmin, `Perubahan status laporan menjadi ${statusBaru}`);
    }
    return berhasil;
  }

  // Menyimpan rekaman riwayat tindak lanjut penanganan laporan ke LogAudit (KF48, KF49)
  static async catatLogAudit(idLaporan, idAdmin, tindakan, client = db) {
    if (tindakan && tindakan.startsWith('Penghapusan listing:')) {
      const idBarang = tindakan.replace('Penghapusan listing:', '').trim();
      await LogAudit.catatPenghapusanListing(idLaporan, idAdmin, idBarang, client);
    } else {
      await LogAudit.catatPerubahanStatusLaporan(idLaporan, idAdmin, tindakan, client);
    }
  }

  // Menyimpan rekaman tindakan moderasi admin ke LogAdmin (KF55)
  static async catatLogAdmin(idAdmin, jenisTindakan, objekDitindak, alasan, client = db) {
    await LogAdmin.catatTindakan(idAdmin, jenisTindakan, objekDitindak, alasan, client);
  }

  // Algo-022: Menghapus listing yang melanggar ketentuan, menghapus foto terkait dari penyimpanan,
  // mengirim surel peringatan kepada penjual, dan mencatat log (KF50, KF52, KF55, KF56)
  static async hapusListingDilaporkan(token, idLaporan, idBarang, alasan) {
    const idAdmin = await this.otorisasiAdmin(token);
    if (!idAdmin) {
      return false; // hak akses ditolak bila bukan admin (KF56)
    }

    if (!alasan || typeof alasan !== 'string' || !alasan.trim()) {
      return false; // alasan wajib diisi (KF55)
    }

    const barang = await Barang.cariById(idBarang);
    if (!barang) {
      return false;
    }

    const akunPenjual = await Akun.cariById(barang.idPenjual);
    const daftarFoto = await FotoBarang.getGaleri(idBarang);

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      await FotoBarang.hapus(idBarang, client);
      await Barang.hapus(idBarang, client); // listing dihapus permanen (KF50)

      // Perbarui status laporan terkait menjadi "Selesai" jika idLaporan ada
      if (idLaporan) {
        await Laporan.updateStatusPenanganan(idLaporan, 'Selesai', new Date(), client);
        await this.catatLogAudit(idLaporan, idAdmin, `Penghapusan listing: ${idBarang}`, client);
      }

      await this.catatLogAdmin(idAdmin, 'HAPUS_LISTING', idBarang, alasan.trim(), client); // KF55

      await client.query('COMMIT');
    } catch (galat) {
      await client.query('ROLLBACK');
      throw galat;
    } finally {
      client.release();
    }

    // Hapus berkas fisik foto pada folder penyimpanan
    if (daftarFoto && daftarFoto.length > 0) {
      const pathArray = daftarFoto.map((f) => f.pathBerkas || f.path_berkas).filter(Boolean);
      await PenyimpananBerkas.hapus(pathArray);
    }

    // Kirim surel pemberitahuan penghapusan kepada pemilik listing (KF52)
    if (akunPenjual && akunPenjual.email) {
      await NotifikasiController.kirimPeringatanPenghapusan(
        barang.idPenjual,
        akunPenjual.email,
        barang.judul,
        alasan.trim(),
      );
    }

    return true;
  }

  // --- Stubs untuk implementasi lanjutan UC23-UC24 ---
  static async blokirAkun(token, idLaporan, idAkun, alasan) {
    // TODO(UC23): Blokir akun, putus sesi, nonaktifkan listing, dan catat log
    const idAdmin = await this.otorisasiAdmin(token);
    if (!idAdmin) return false;
    return true;
  }

  static async bukaBlokirAkun(token, idAkun) {
    // TODO(UC24): Buka blokir akun dan pulihkan listing di katalog
    const idAdmin = await this.otorisasiAdmin(token);
    if (!idAdmin) return false;
    return true;
  }

  static async nonaktifkanListingPengguna(idAkun) {
    // TODO(UC23): Mengubah status listing pengguna yang diblokir
    return true;
  }

  static async pulihkanListingPengguna(idAkun) {
    // TODO(UC24): Memulihkan status listing pengguna
    return true;
  }
}

module.exports = ModerasiController;
