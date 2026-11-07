// C42 Kriptografi
// hash/cocokkanHash dipakai AkunController (modul A),
// enkripsi/dekripsi dipakai PercakapanController (modul D).
const bcrypt = require('bcrypt');
const config = require('../config/env');

class Kriptografi {
  constructor(saltRounds, kunciEnkripsi) {
    this.saltRounds = saltRounds;
    this.kunciEnkripsi = kunciEnkripsi;
  }

  // Algo-066: hash bcrypt satu arah (KF09)
  async hash(teks) {
    const garam = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(teks, garam);
  }

  // Algo-067: bandingkan teks dengan hash tersimpan (KF10)
  async cocokkanHash(teks, hash) {
    if (teks == null || hash == null) return false;
    return bcrypt.compare(teks, hash);
  }

  // Algo-068 – TODO(modul-D)
  enkripsi(teks) {
    throw new Error('Kriptografi.enkripsi belum diimplementasikan (modul D).');
  }

  // Algo-069 – TODO(modul-D)
  dekripsi(isiPesanTerenkripsi) {
    throw new Error('Kriptografi.dekripsi belum diimplementasikan (modul D).');
  }
}

module.exports = new Kriptografi(config.bcryptSaltRounds, config.kunciEnkripsiPesan);
