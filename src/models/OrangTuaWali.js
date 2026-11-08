const { randomUUID } = require('crypto');
const db = require('../config/db');
const AppError = require('../utils/AppError');
const { hariIni, tambahHari } = require('../utils/waktu');
const Pengguna = require('./Pengguna');
const LaporanKesehatan = require('./LaporanKesehatan');

/** C03 - Subkelas Pengguna untuk orang tua/wali. */
class OrangTuaWali extends Pengguna {
  constructor(baris) {
    super(baris);
    this.idWali = baris.id_wali;
    this.nama = baris.nama;
    this.nomorTelepon = baris.nomor_telepon;
  }

  static async findByIdPengguna(idPengguna) {
    const { rows } = await db.query(
      `SELECT w.*, u.username, u.role, u.status_akun
       FROM orang_tua_wali w JOIN pengguna u ON u.id_pengguna = w.id_pengguna
       WHERE w.id_pengguna = $1;`,
      [idPengguna]
    );
    return rows[0] ? new OrangTuaWali(rows[0]) : null;
  }

  static async findById(idWali) {
    const { rows } = await db.query(
      `SELECT w.*, u.username, u.role, u.status_akun
       FROM orang_tua_wali w JOIN pengguna u ON u.id_pengguna = w.id_pengguna
       WHERE w.id_wali = $1;`,
      [idWali]
    );
    return rows[0] ? new OrangTuaWali(rows[0]) : null;
  }

  /** Mencari akun wali aktif berdasarkan e-mail, untuk menghubungkan pelajar saat konfirmasi. */
  static async findIdByEmail(email, executor = db) {
    const { rows } = await executor.query(
      'SELECT id_wali FROM orang_tua_wali WHERE LOWER(email) = LOWER($1) LIMIT 1;',
      [email]
    );
    return rows[0] ? rows[0].id_wali : null;
  }

  static async tambah(executor, { idPengguna, nama, email, nomorTelepon }) {
    const idWali = `WALI-${randomUUID()}`;
    await executor.query(
      `INSERT INTO orang_tua_wali (id_wali, id_pengguna, nama, email, nomor_telepon)
       VALUES ($1, $2, $3, $4, $5);`,
      [idWali, idPengguna, nama, email, nomorTelepon]
    );
    return idWali;
  }

  /** Q-C03-01. Hanya pelajar berakun aktif yang dapat dipantau wali. */
  async getPelajarTerhubung() {
    const { rows } = await db.query(
      `SELECT p.id_pelajar, p.nama FROM pelajar p
       JOIN pengguna u ON u.id_pengguna = p.id_pengguna
       WHERE p.id_wali = $1 AND u.status_akun = 'Aktif'
       ORDER BY p.nama;`,
      [this.idWali]
    );
    return rows.map((baris) => ({ idPelajar: baris.id_pelajar, nama: baris.nama }));
  }

  /**
   * Memilih pelajar yang dilaporkan. Bila wali terhubung dengan lebih dari satu pelajar,
   * idPelajar menentukan pilihannya; yang bukan miliknya ditolak.
   */
  async pilihPelajar(idPelajar = null) {
    const daftar = await this.getPelajarTerhubung();
    if (daftar.length === 0) {
      throw new AppError(404, 'Akun wali belum terhubung dengan pelajar.');
    }
    if (!idPelajar) {
      return daftar[0];
    }
    const pilihan = daftar.find((pelajar) => pelajar.idPelajar === idPelajar);
    if (!pilihan) {
      throw new AppError(403, 'Pelajar tersebut tidak terhubung dengan akun Anda.');
    }
    return pilihan;
  }

  /** Algo-C03-01. Q-C03-02 tidak mengambil catatan_refleksi sehingga jurnal tidak sampai ke wali (KNF02). */
  async getSummaryReport(idPelajar = null) {
    // eslint-disable-next-line global-require
    const Pelajar = require('./Pelajar');
    const pilihan = await this.pilihPelajar(idPelajar);
    const pelajar = await Pelajar.findById(pilihan.idPelajar);
    const daftar = await pelajar.getCheckInSejak(tambahHari(hariIni(), -6));
    const tanggalTerakhir = await pelajar.getTanggalCheckInTerakhir();
    const hasil = new LaporanKesehatan().evaluateThreshold(daftar, { tanggalTerakhir });

    return {
      namaPelajar: pelajar.nama,
      periode: hasil.periode,
      ringkasanKondisi: hasil.ringkasanKondisi,
      indikatorRisiko: hasil.indikatorRisiko,
      jumlahHariTidakCheckIn: hasil.jumlahHariTidakCheckIn,
    };
  }
}

module.exports = OrangTuaWali;
