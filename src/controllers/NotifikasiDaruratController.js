const db = require('../config/db');
const AppError = require('../utils/AppError');
const { kirimEmail, urlAplikasi } = require('../utils/kirimEmail');
const LaporanKesehatan = require('../models/LaporanKesehatan');
const NotifikasiDarurat = require('../models/NotifikasiDarurat');
const OrangTuaWali = require('../models/OrangTuaWali');
const Pelajar = require('../models/Pelajar');

const JUMLAH_CHECK_IN_EVALUASI = 7;
const MAKS_PENGIRIMAN_ULANG = 3; // KNF06
const BATAS_JAM_BELUM_DIRESPONS = 24;

function tunggu(milidetik) {
  return new Promise((selesai) => {
    setTimeout(selesai, milidetik);
  });
}

async function ambilMilikWali(idPengguna, idNotifikasi) {
  if (!idNotifikasi) {
    throw new AppError(400, 'ID notifikasi harus diisi.');
  }
  const wali = await OrangTuaWali.findByIdPengguna(idPengguna);
  const notifikasi = await NotifikasiDarurat.findById(idNotifikasi);
  if (!notifikasi) {
    throw new AppError(404, 'Notifikasi tidak ditemukan.');
  }
  if (!wali || notifikasi.idWali !== wali.idWali) {
    throw new AppError(403, 'Notifikasi ini bukan milik Anda.');
  }
  return notifikasi;
}

/** C24 - Mengatur deteksi, pengiriman, konfirmasi, dan tindak lanjut notifikasi darurat. */
class NotifikasiDaruratController {
  /**
   * Menilai satu pelajar lalu membuat notifikasi bila kondisinya darurat (KF18, KF19).
   * Penilaian memakai check-in terakhir, bukan jendela 7 hari, agar pelajar yang sudah lama
   * berhenti check-in tetap dinilai dari kondisi terakhirnya.
   */
  static async evaluasiPelajar(pelajar, riwayat) {
    const laporan = new LaporanKesehatan();
    const hasil = laporan.evaluateThreshold(riwayat);
    if (!laporan.detectEmergency()) {
      return null;
    }

    const tanggalTerakhir = riwayat
      .map((checkIn) => checkIn.tanggalCheckIn)
      .reduce((terbaru, tanggal) => (tanggal > terbaru ? tanggal : terbaru));
    if (await NotifikasiDarurat.sudahDilaporkanSejak(pelajar.idPelajar, tanggalTerakhir)) {
      return null;
    }

    const emailTujuan = await NotifikasiDaruratController.tentukanEmailTujuan(pelajar);
    let notifikasi;
    try {
      notifikasi = await db.withTransaction(async (client) => {
        const baru = await NotifikasiDarurat.tambah(client, {
          idPelajar: pelajar.idPelajar,
          idWali: pelajar.idWali,
          emailTujuan,
          ringkasanKondisi: hasil.ringkasanKondisi,
        });
        await pelajar.updateEmergencyStatus(true, client);
        return baru;
      });
    } catch (err) {
      // Indeks unik notifikasi aktif: evaluasi lain yang berjalan bersamaan sudah membuatnya
      if (err.code === '23505') {
        return null;
      }
      throw err;
    }
    notifikasi.namaPelajar = pelajar.nama;
    await NotifikasiDaruratController.sendEmergencyNotification(notifikasi);
    return notifikasi;
  }

  static async tentukanEmailTujuan(pelajar) {
    if (pelajar.idWali) {
      const wali = await OrangTuaWali.findById(pelajar.idWali);
      if (wali) {
        return wali.email;
      }
    }
    return pelajar.emailWali;
  }

  /** Dijalankan scheduler sekali sehari. Kegagalan satu pelajar tidak menghentikan yang lain. */
  static async jalankanEvaluasiHarian() {
    const daftar = await Pelajar.findSemuaAktif();
    const riwayat = await Pelajar.getRiwayatTerbaruSemuaAktif(JUMLAH_CHECK_IN_EVALUASI);
    let jumlahDarurat = 0;
    for (const pelajar of daftar) {
      try {
        const milikPelajar = riwayat.get(pelajar.idPelajar) || [];
        if (await NotifikasiDaruratController.evaluasiPelajar(pelajar, milikPelajar)) {
          jumlahDarurat += 1;
        }
      } catch (err) {
        console.error(`[Darurat] Gagal mengevaluasi ${pelajar.idPelajar}:`, err.message);
      }
    }
    const belumDirespons = await NotifikasiDarurat.findBelumDirespons(BATAS_JAM_BELUM_DIRESPONS);
    let jumlahDikirimUlang = 0;
    for (const notifikasi of belumDirespons) {
      try {
        await NotifikasiDaruratController.sendEmergencyNotification(notifikasi);
        jumlahDikirimUlang += 1;
      } catch (err) {
        console.error(`[Darurat] Gagal mengirim ulang ${notifikasi.id}:`, err.message);
      }
    }
    return { jumlahPelajar: daftar.length, jumlahDarurat, jumlahDikirimUlang };
  }

  /** Algo-C24-01. Bila gagal, dikirim ulang otomatis hingga 3 kali (KNF06). */
  static async sendEmergencyNotification(notifikasi) {
    if (!notifikasi.emailTujuan) {
      await notifikasi.catatPengiriman(false, 0);
      return false;
    }
    const jeda = Number(process.env.NOTIF_RETRY_DELAY_MS ?? 2000);
    const maksPercobaan = 1 + MAKS_PENGIRIMAN_ULANG;
    for (let percobaan = 1; percobaan <= maksPercobaan; percobaan += 1) {
      try {
        await kirimEmail({
          to: notifikasi.emailTujuan,
          subject: 'Notifikasi darurat MahaSehat',
          text:
            `Kondisi ${notifikasi.namaPelajar || 'pelajar'} memerlukan perhatian Anda.\n` +
            `${notifikasi.ringkasanKondisi}\n\n` +
            `Mohon masuk ke ${urlAplikasi()} untuk mengonfirmasi dan mencatat tindak lanjut.`,
        });
        await notifikasi.catatPengiriman(true, percobaan);
        return true;
      } catch (err) {
        console.error(`[Darurat] Percobaan ${percobaan} gagal:`, err.message);
        if (percobaan < maksPercobaan) {
          await tunggu(jeda);
        }
      }
    }
    await notifikasi.catatPengiriman(false, maksPercobaan);
    return false;
  }

  /** Algo-C24-02. Notifikasi yang masih aktif milik wali yang login. */
  static async loadEmergencyDetail(idPengguna) {
    const wali = await OrangTuaWali.findByIdPengguna(idPengguna);
    if (!wali) {
      throw new AppError(404, 'Data orang tua/wali tidak ditemukan.');
    }
    return NotifikasiDarurat.findAktifByWali(wali.idWali);
  }

  /** Algo-C24-03, Q-C24-01 */
  static async confirmReceived(idPengguna, idNotifikasi) {
    const notifikasi = await ambilMilikWali(idPengguna, idNotifikasi);
    await notifikasi.tandaiDiterima();
    return true;
  }

  /**
   * Algo-C24-04, Q-C24-02, Q-C02-04. Tindak lanjut sekaligus menandai notifikasi diterima.
   * Notifikasi yang sudah ditindaklanjuti tidak diubah lagi, agar status darurat dari
   * notifikasi lain yang masih aktif tidak ikut terhapus.
   */
  static async markFollowUp(idPengguna, idNotifikasi) {
    const notifikasi = await ambilMilikWali(idPengguna, idNotifikasi);
    if (notifikasi.statusTindakLanjut === 'Sudah Ditindaklanjuti') {
      return true;
    }
    const pelajar = await Pelajar.findById(notifikasi.idPelajar);
    await db.withTransaction(async (client) => {
      await notifikasi.tandaiDitindaklanjuti(client);
      await pelajar.updateEmergencyStatus(false, client);
    });
    return true;
  }
}

module.exports = NotifikasiDaruratController;
