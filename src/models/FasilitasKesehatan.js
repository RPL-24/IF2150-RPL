const db = require('../config/db');

/** C08 - Klinik atau fasilitas tempat tenaga kesehatan berpraktik. */
class FasilitasKesehatan {
  constructor(baris) {
    this.idFasilitas = baris.id_fasilitas;
    this.namaFasilitas = baris.nama_fasilitas;
    this.lokasi = baris.lokasi;
    this.estimasiBiaya = baris.estimasi_biaya;
  }

  /** Algo-C08-01, Q-C08-01 */
  static async findAll() {
    const { rows } = await db.query(
      `SELECT id_fasilitas, nama_fasilitas, lokasi, estimasi_biaya
       FROM fasilitas_kesehatan ORDER BY nama_fasilitas;`
    );
    return rows.map((baris) => new FasilitasKesehatan(baris));
  }

  getLokasi() {
    return this.lokasi;
  }

  getEstimasiBiaya() {
    return this.estimasiBiaya;
  }
}

module.exports = FasilitasKesehatan;
