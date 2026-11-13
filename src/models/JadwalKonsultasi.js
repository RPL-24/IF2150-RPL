const db = require('../config/db');
const AppError = require('../utils/AppError');
const { gabungTanggalWaktu } = require('../utils/waktu');

const STATUS_PENGAJUAN = ['Belum Diajukan', 'Diajukan', 'Disetujui', 'Rescheduled'];
const KOLOM = `id_jadwal, id_tenaga_kesehatan, tanggal, waktu, status_ketersediaan, status_pengajuan,
  id_pelajar, keluhan`;

/** C09 - Satu slot konsultasi milik tenaga kesehatan beserta status pengajuannya. */
class JadwalKonsultasi {
  constructor(baris) {
    this.idJadwal = baris.id_jadwal;
    this.idTenagaKesehatan = baris.id_tenaga_kesehatan;
    this.tanggal = baris.tanggal;
    this.waktu = baris.waktu ? baris.waktu.slice(0, 5) : baris.waktu;
    this.statusKetersediaan = baris.status_ketersediaan;
    this.statusPengajuan = baris.status_pengajuan;
    this.idPelajar = baris.id_pelajar;
    this.keluhan = baris.keluhan;
  }

  /** Algo-C09-01, Q-C09-01 */
  static async findById(idJadwal) {
    const { rows } = await db.query(`SELECT ${KOLOM} FROM jadwal_konsultasi WHERE id_jadwal = $1;`, [
      idJadwal,
    ]);
    return rows[0] ? new JadwalKonsultasi(rows[0]) : null;
  }

  /** Daftar pengajuan yang masuk ke tenaga kesehatan (KF15). */
  static async findPengajuanMasuk(idTenagaKesehatan) {
    const { rows } = await db.query(
      `SELECT j.id_jadwal, j.id_tenaga_kesehatan, j.tanggal, j.waktu, j.status_ketersediaan,
              j.status_pengajuan, j.id_pelajar, j.keluhan, p.nama AS nama_pelajar
       FROM jadwal_konsultasi j JOIN pelajar p ON p.id_pelajar = j.id_pelajar
       WHERE j.id_tenaga_kesehatan = $1 AND j.status_pengajuan <> 'Belum Diajukan'
       ORDER BY j.tanggal, j.waktu;`,
      [idTenagaKesehatan]
    );
    return rows.map((baris) => {
      const jadwal = new JadwalKonsultasi(baris);
      jadwal.namaPelajar = baris.nama_pelajar;
      return jadwal;
    });
  }

  /** Daftar slot milik pelajar yang sudah diajukan, lengkap dengan nama tenaga kesehatan. */
  static async findByPelajar(idPelajar) {
    const { rows } = await db.query(
      `SELECT j.id_jadwal, j.id_tenaga_kesehatan, j.tanggal, j.waktu, j.status_ketersediaan,
              j.status_pengajuan, j.id_pelajar, j.keluhan, t.nama AS nama_tenaga_kesehatan,
              t.jenis_tenaga_kesehatan
       FROM jadwal_konsultasi j JOIN tenaga_kesehatan t ON t.id_tenaga_kesehatan = j.id_tenaga_kesehatan
       WHERE j.id_pelajar = $1 AND j.status_pengajuan <> 'Belum Diajukan'
       ORDER BY j.tanggal, j.waktu;`,
      [idPelajar]
    );
    return rows.map((baris) => {
      const jadwal = new JadwalKonsultasi(baris);
      jadwal.namaTenagaKesehatan = baris.nama_tenaga_kesehatan;
      jadwal.jenisTenagaKesehatan = baris.jenis_tenaga_kesehatan;
      return jadwal;
    });
  }

  /** Seluruh slot milik tenaga kesehatan (terpakai maupun kosong). */
  static async findByTenagaKesehatan(idTenagaKesehatan) {
    const { rows } = await db.query(
      `SELECT j.id_jadwal, j.id_tenaga_kesehatan, j.tanggal, j.waktu, j.status_ketersediaan,
              j.status_pengajuan, j.id_pelajar, j.keluhan, p.nama AS nama_pelajar
       FROM jadwal_konsultasi j LEFT JOIN pelajar p ON p.id_pelajar = j.id_pelajar
       WHERE j.id_tenaga_kesehatan = $1
       ORDER BY j.tanggal, j.waktu;`,
      [idTenagaKesehatan]
    );
    return rows.map((baris) => {
      const jadwal = new JadwalKonsultasi(baris);
      jadwal.namaPelajar = baris.nama_pelajar;
      return jadwal;
    });
  }

  /** Algo-C09-02 */
  isAvailable() {
    return this.statusKetersediaan && gabungTanggalWaktu(this.tanggal, this.waktu) > new Date();
  }

  /** Algo-C09-03, Q-C09-02, Q-C09-03. FOR UPDATE mencegah dua pelajar memesan slot yang sama. */
  async reservasi(idPelajar, keluhan) {
    return db.withTransaction(async (client) => {
      const { rows } = await client.query(
        'SELECT status_ketersediaan FROM jadwal_konsultasi WHERE id_jadwal = $1 FOR UPDATE;',
        [this.idJadwal]
      );
      if (!rows[0] || rows[0].status_ketersediaan === false) {
        this.statusKetersediaan = false;
        return false;
      }
      await client.query(
        'UPDATE jadwal_konsultasi SET id_pelajar = $1, keluhan = $2 WHERE id_jadwal = $3;',
        [idPelajar, keluhan, this.idJadwal]
      );
      this.idPelajar = idPelajar;
      this.keluhan = keluhan;
      await this.updateAvailability(false, client);
      await this.updateStatus('Diajukan', client);
      return true;
    });
  }

  getDate() {
    return this.tanggal;
  }

  getTime() {
    return this.waktu;
  }

  getStatus() {
    return this.statusPengajuan;
  }

  /** Algo-C09-04, Q-C09-04 */
  async updateAvailability(status, executor = db) {
    await executor.query('UPDATE jadwal_konsultasi SET status_ketersediaan = $1 WHERE id_jadwal = $2;', [
      status,
      this.idJadwal,
    ]);
    this.statusKetersediaan = status;
  }

  /** Algo-C09-05, Q-C09-05 */
  async updateStatus(statusBaru, executor = db) {
    if (!STATUS_PENGAJUAN.includes(statusBaru)) {
      throw new AppError(400, 'Status pengajuan tidak dikenal.');
    }
    if (statusBaru === 'Disetujui' && !['Diajukan', 'Rescheduled'].includes(this.statusPengajuan)) {
      throw new AppError(409, 'Hanya pengajuan yang sudah diajukan yang dapat disetujui.');
    }
    if (
      statusBaru === 'Rescheduled' &&
      !['Diajukan', 'Disetujui', 'Rescheduled'].includes(this.statusPengajuan)
    ) {
      throw new AppError(409, 'Slot yang belum diajukan tidak dapat dijadwalkan ulang.');
    }
    await executor.query('UPDATE jadwal_konsultasi SET status_pengajuan = $1 WHERE id_jadwal = $2;', [
      statusBaru,
      this.idJadwal,
    ]);
    this.statusPengajuan = statusBaru;
  }

  /** Algo-C09-06, Q-C09-06, Q-C09-07 */
  async updateSchedule(tanggalBaru, waktuBaru) {
    if (gabungTanggalWaktu(tanggalBaru, waktuBaru) <= new Date()) {
      throw new AppError(400, 'Jadwal baru harus setelah waktu sekarang.');
    }
    await db.withTransaction(async (client) => {
      const bentrok = await client.query(
        `SELECT 1 FROM jadwal_konsultasi j
         WHERE j.id_tenaga_kesehatan = (SELECT id_tenaga_kesehatan FROM jadwal_konsultasi WHERE id_jadwal = $1)
           AND j.tanggal = $2 AND j.waktu = $3 AND j.id_jadwal <> $1
         LIMIT 1;`,
        [this.idJadwal, tanggalBaru, waktuBaru]
      );
      if (bentrok.rowCount > 0) {
        throw new AppError(409, 'Tenaga kesehatan sudah memiliki jadwal pada waktu tersebut.');
      }
      await client.query('UPDATE jadwal_konsultasi SET tanggal = $1, waktu = $2 WHERE id_jadwal = $3;', [
        tanggalBaru,
        waktuBaru,
        this.idJadwal,
      ]);
      await this.updateStatus('Rescheduled', client);
    });
    this.tanggal = tanggalBaru;
    this.waktu = waktuBaru;
  }

  async tolakPengajuan() {
    if (!['Diajukan', 'Rescheduled'].includes(this.statusPengajuan)) {
      throw new AppError(409, 'Hanya pengajuan yang menunggu yang dapat ditolak.');
    }
    await db.query(
      `UPDATE jadwal_konsultasi
          SET id_pelajar = NULL,keluhan = NULL,
            status_pengajuan = 'Belum Diajukan', status_ketersediaan = TRUE
        WHERE id_jadwal = $1;`,
      [this.idJadwal]
    );
    this.idPelajar = null;
    this.keluhan = null;
    this.statusPengajuan = 'Belum Diajukan';
    this.statusKetersediaan = true;
  }

}

module.exports = JadwalKonsultasi;
