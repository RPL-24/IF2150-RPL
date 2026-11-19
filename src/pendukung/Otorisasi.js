// C41 Otorisasi
// verifikasiToken/verifikasiAdmin mengikuti DPPL (Algo-064, Algo-065).
// wajibLogin/wajibAdmin adalah middleware Express yang membungkus keduanya, dipakai route modul lain:
//   router.post('/', Otorisasi.wajibLogin, handler)   → req.akun = { idAkun }, req.token
//   router.get('/', Otorisasi.wajibAdmin, handler)
const SesiLogin = require('../models/SesiLogin');
const Admin = require('../models/Admin');

class Otorisasi {
  // Ambil token dari header "Authorization: Bearer <token>"
  static ambilToken(req) {
    const [skema, token] = (req.get('Authorization') || '').split(' ');
    return skema === 'Bearer' && token ? token : null;
  }

  // Algo-064
  static async verifikasiToken(token) {
    if (token == null || token.trim() === '') return null;
    return SesiLogin.cariSesiAktif(token);
  }

  // Algo-065
  // sesiTerverifikasi diisi wajibAdmin dengan sesi yang baru saja diperiksanya,
  // supaya token yang sama tidak dicari dua kali ke tabel sesi_login dalam satu permintaan.
  static async verifikasiAdmin(token, sesiTerverifikasi = null) {
    const sesi = sesiTerverifikasi ?? (await Otorisasi.verifikasiToken(token));
    if (sesi === null) return null;
    if (!(await Admin.verifikasiPeran(sesi.getIdAkun()))) return null;
    return sesi;
  }

  static async wajibLogin(req, res, next) {
    const token = Otorisasi.ambilToken(req);
    const sesi = await Otorisasi.verifikasiToken(token);
    if (sesi === null) {
      return res.status(401).json({ sukses: false, pesan: 'Silakan masuk terlebih dahulu.' });
    }
    req.token = token;
    req.akun = { idAkun: sesi.getIdAkun() };
    next();
  }

  static async wajibAdmin(req, res, next) {
    const token = Otorisasi.ambilToken(req);
    const sesiLogin = await Otorisasi.verifikasiToken(token);
    if (sesiLogin === null) {
      return res.status(401).json({ sukses: false, pesan: 'Silakan masuk terlebih dahulu.' });
    }
    const sesi = await Otorisasi.verifikasiAdmin(token, sesiLogin);
    if (sesi === null) {
      return res.status(403).json({ sukses: false, pesan: 'Akses hanya untuk admin.' });
    }
    req.token = token;
    req.akun = { idAkun: sesi.getIdAkun() };
    next();
  }
}

module.exports = Otorisasi;
