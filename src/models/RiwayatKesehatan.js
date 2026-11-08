/** C05 - Riwayat kesehatan mental yang diisi pelajar saat registrasi, berisi ciphertext AES-256 (KNF01). */
class RiwayatKesehatan {
  constructor(riwayatKesehatan) {
    this.riwayatKesehatan = riwayatKesehatan;
  }

  async simpan(executor, idPelajar) {
    await executor.query(
      'INSERT INTO riwayat_kesehatan (id_pelajar, riwayat_kesehatan) VALUES ($1, $2);',
      [idPelajar, this.riwayatKesehatan]
    );
  }
}

module.exports = RiwayatKesehatan;
