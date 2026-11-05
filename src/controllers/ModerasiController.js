// C21 ModerasiController
const db = require('../config/db');
const Otorisasi = require('../pendukung/Otorisasi');
const Laporan = require('../models/Laporan');
const BuktiLaporan = require('../models/BuktiLaporan');
const LogAudit = require('../models/LogAudit');
const LogAdmin = require('../models/LogAdmin');
const Akun = require('../models/Akun');

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
    await LogAudit.catatPerubahanStatusLaporan(idLaporan, idAdmin, tindakan, client);
  }

  // Menyimpan rekaman tindakan moderasi admin ke LogAdmin (KF55)
  static async catatLogAdmin(idAdmin, jenisTindakan, objekDitindak, alasan, client = db) {
    await LogAdmin.catatTindakan(idAdmin, jenisTindakan, objekDitindak, alasan, client);
  }

  // --- Stubs untuk implementasi lanjutan UC22-UC24 ---
  static async hapusListingDilaporkan(token, idLaporan, idBarang, alasan) {
    // TODO(UC22): Hapus listing, kirim notifikasi surel, dan catat log
    const idAdmin = await this.otorisasiAdmin(token);
    if (!idAdmin) return false;
    return true;
  }

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
