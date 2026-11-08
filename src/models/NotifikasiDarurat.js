const { randomUUID } = require('crypto');
const db = require('../config/db');

/** Entity untuk tabel notifikasi_darurat (UC08). Tidak ada pada Tabel 4.1, dicatat di Bagian B.1. */
class NotifikasiDarurat {
  constructor(baris) {
    this.id = baris.id;
    this.idPelajar = baris.id_pelajar;
    this.idWali = baris.id_wali;
    this.emailTujuan = baris.email_tujuan;
    this.ringkasanKondisi = baris.ringkasan_kondisi;
    this.status = baris.status;
    this.jumlahPercobaan = baris.jumlah_percobaan;
    this.waktuKirim = baris.waktu_kirim;
    this.waktuKonfirmasi = baris.waktu_konfirmasi;
    this.statusTindakLanjut = baris.status_tindak_lanjut;
    this.waktuTindakLanjut = baris.waktu_tindak_lanjut;
    this.namaPelajar = baris.nama_pelajar;
  }

  static async tambah(executor, { idPelajar, idWali, emailTujuan, ringkasanKondisi }) {
    const { rows } = await executor.query(
      `INSERT INTO notifikasi_darurat (id, id_pelajar, id_wali, email_tujuan, ringkasan_kondisi)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [`DRT-${randomUUID()}`, idPelajar, idWali, emailTujuan, ringkasanKondisi]
    );
    return new NotifikasiDarurat(rows[0]);
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM notifikasi_darurat WHERE id = $1;', [id]);
    return rows[0] ? new NotifikasiDarurat(rows[0]) : null;
  }

  /** Notifikasi yang belum ditindaklanjuti milik seorang wali. */
  static async findAktifByWali(idWali) {
    const { rows } = await db.query(
      `SELECT n.*, p.nama AS nama_pelajar
       FROM notifikasi_darurat n JOIN pelajar p ON p.id_pelajar = n.id_pelajar
       WHERE n.id_wali = $1 AND n.status_tindak_lanjut = 'Belum Ditindaklanjuti'
       ORDER BY n.created_at DESC;`,
      [idWali]
    );
    return rows.map((baris) => new NotifikasiDarurat(baris));
  }

  /**
   * Benar bila kondisi pelajar sudah pernah dilaporkan sejak check-in terakhirnya,
   * sehingga job harian tidak mengirim ulang kasus yang sudah ditindaklanjuti wali.
   */
  static async sudahDilaporkanSejak(idPelajar, tanggalCheckInTerakhir) {
    const { rowCount } = await db.query(
      `SELECT 1 FROM notifikasi_darurat
       WHERE id_pelajar = $1
         AND (created_at::date >= $2::date OR status_tindak_lanjut = 'Belum Ditindaklanjuti')
       LIMIT 1;`,
      [idPelajar, tanggalCheckInTerakhir]
    );
    return rowCount > 0;
  }

  /** Notifikasi yang belum dikonfirmasi wali lewat dari batas jam, untuk dikirim ulang. */
  static async findBelumDirespons(batasJam) {
    const { rows } = await db.query(
      `SELECT n.*, p.nama AS nama_pelajar
       FROM notifikasi_darurat n JOIN pelajar p ON p.id_pelajar = n.id_pelajar
       WHERE n.status IN ('Terkirim', 'Gagal Terkirim', 'Menunggu Pengiriman')
         AND n.status_tindak_lanjut = 'Belum Ditindaklanjuti'
         AND COALESCE(n.waktu_kirim, n.created_at) <= NOW() - ($1 || ' hours')::interval;`,
      [String(batasJam)]
    );
    return rows.map((baris) => new NotifikasiDarurat(baris));
  }

  async catatPengiriman(berhasil, jumlahPercobaan) {
    const status = berhasil ? 'Terkirim' : 'Gagal Terkirim';
    await db.query(
      `UPDATE notifikasi_darurat
       SET status = $1, jumlah_percobaan = jumlah_percobaan + $2, waktu_kirim = NOW()
       WHERE id = $3;`,
      [status, jumlahPercobaan, this.id]
    );
    this.status = status;
  }

  /** Q-C24-01. Konfirmasi ulang tidak menimpa waktu konfirmasi pertama. */
  async tandaiDiterima(executor = db) {
    await executor.query(
      `UPDATE notifikasi_darurat
       SET status = 'Diterima', waktu_konfirmasi = COALESCE(waktu_konfirmasi, NOW())
       WHERE id = $1;`,
      [this.id]
    );
    this.status = 'Diterima';
  }

  /** Q-C24-02. Tindak lanjut juga mencatat konfirmasi bila wali belum menekan "Diterima". */
  async tandaiDitindaklanjuti(executor = db) {
    await executor.query(
      `UPDATE notifikasi_darurat
       SET status_tindak_lanjut = 'Sudah Ditindaklanjuti',
           waktu_tindak_lanjut = COALESCE(waktu_tindak_lanjut, NOW()),
           status = 'Diterima',
           waktu_konfirmasi = COALESCE(waktu_konfirmasi, NOW())
       WHERE id = $1;`,
      [this.id]
    );
    this.statusTindakLanjut = 'Sudah Ditindaklanjuti';
    this.status = 'Diterima';
  }
}

module.exports = NotifikasiDarurat;
