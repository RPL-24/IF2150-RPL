// C22 DokumenLegalController
const DokumenLegal = require('../models/DokumenLegal');

class DokumenLegalController {
  // KF13, KF38: naskah versi terbaru; null bila jenis tidak dikenal atau belum ada yang berlaku
  static async getDokumen(jenis) {
    if (!Object.values(DokumenLegal.JENIS).includes(jenis)) return null;
    return DokumenLegal.getVersiTerbaru(jenis);
  }

  // KF38: klausul kerahasiaan percakapan, tercantum pada Kebijakan Privasi yang berlaku
  static async getKlausaPrivasi() {
    const kebijakan = await DokumenLegal.getVersiTerbaru(DokumenLegal.JENIS.KEBIJAKAN_PRIVASI);
    return kebijakan === null ? null : kebijakan.klausaPrivasiPesan;
  }
}

module.exports = DokumenLegalController;
