// SsoController – masuk dengan Google (akun ITB berdomain itb.ac.id).
// OAuth 2.0 Authorization Code + PKCE (S256), sepenuhnya di sisi server; tanpa dependency tambahan.
const crypto = require('crypto');
const config = require('../config/env');
const AkunController = require('./AkunController');

const COOKIE_STATE = 'itbeli_sso_state';
const COOKIE_PROFIL = 'itbeli_sso_profil';
const UMUR_STATE_DETIK = 10 * 60;
const UMUR_PROFIL_DETIK = 15 * 60;
const BATAS_WAKTU_MS = 10_000;
const KUNCI_HEX = /^[0-9a-f]{64}$/i;

const PENYEDIA = Object.freeze({
  google: {
    scope: 'openid email profile',
    otorisasi: () => 'https://accounts.google.com/o/oauth2/v2/auth',
    token: () => 'https://oauth2.googleapis.com/token',
    // hd hanya petunjuk tampilan; keputusan tetap diambil dari klaim email pada id_token
    parameterTambahan: () => ({ hd: 'itb.ac.id', prompt: 'select_account' }),
    kredensial: () => config.sso.google,
    wajib: ['clientId', 'clientSecret'],
  },
});

function galat(kode) {
  return { tipe: 'galat', kode };
}

const sha256Base64Url = (teks) => crypto.createHash('sha256').update(teks).digest('base64url');
const acak = (byte) => crypto.randomBytes(byte).toString('base64url');

function samaPersis(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function kunciHmac() {
  if (!KUNCI_HEX.test(config.sso.kunci ?? '')) throw new Error('KUNCI_SSO belum diatur (64 karakter hex).');
  return Buffer.from(config.sso.kunci, 'hex');
}

function tandaTangan(isi) {
  return crypto.createHmac('sha256', kunciHmac()).update(isi).digest('base64url');
}

class SsoController {
  static COOKIE_STATE = COOKIE_STATE;
  static COOKIE_PROFIL = COOKIE_PROFIL;
  static UMUR_STATE_DETIK = UMUR_STATE_DETIK;
  static UMUR_PROFIL_DETIK = UMUR_PROFIL_DETIK;

  static ambilKredensial(nama) {
    if (typeof nama !== 'string' || !Object.hasOwn(PENYEDIA, nama)) return null;
    const kredensial = PENYEDIA[nama].kredensial();
    const lengkap = PENYEDIA[nama].wajib.every((k) => typeof kredensial[k] === 'string' && kredensial[k].trim() !== '');
    return lengkap ? kredensial : null;
  }

  static penyediaAktif() {
    return { google: SsoController.ambilKredensial('google') !== null };
  }

  static alamatKembali(nama) {
    return `${config.sso.urlDasar}/api/akun/sso/${nama}/kembali`;
  }

  // Null bila penyedia tidak dikenal atau belum dikonfigurasi.
  static mulai(nama) {
    const kredensial = SsoController.ambilKredensial(nama);
    if (kredensial === null) return null;

    const state = acak(24);
    const verifier = acak(48);
    const url = new URL(PENYEDIA[nama].otorisasi(kredensial));
    const parameter = {
      client_id: kredensial.clientId,
      redirect_uri: SsoController.alamatKembali(nama),
      response_type: 'code',
      scope: PENYEDIA[nama].scope,
      state,
      code_challenge: sha256Base64Url(verifier),
      code_challenge_method: 'S256',
      ...PENYEDIA[nama].parameterTambahan(),
    };
    Object.entries(parameter).forEach(([k, v]) => url.searchParams.set(k, v));
    // Alfabet base64url tidak memuat "." sehingga pemisahnya aman
    return { url: url.toString(), nilaiCookieState: `${nama}.${state}.${verifier}` };
  }

  // ───────────── Callback ─────────────

  // Hasil: { tipe: 'sesi', token, peran, email } | { tipe: 'lengkapi', nilaiCookieProfil } | { tipe: 'galat', kode }
  static async selesaikan(nama, query, headerCookie) {
    const kredensial = SsoController.ambilKredensial(nama);
    if (kredensial === null) return galat('PENYEDIA_NONAKTIF');

    const [namaCookie, state, verifier, sisa] = (SsoController.bacaCookie(headerCookie, COOKIE_STATE) ?? '').split('.');
    const stateQuery = query?.state;
    if (!state || !verifier || sisa !== undefined || namaCookie !== nama
        || typeof stateQuery !== 'string' || !samaPersis(stateQuery, state)) {
      return galat('STATE_TIDAK_VALID');
    }
    if (query.error) return galat('DITOLAK_PENYEDIA');
    if (typeof query.code !== 'string' || query.code === '') return galat('PERTUKARAN_GAGAL');

    let klaim;
    try {
      const idToken = await SsoController.tukarKode(nama, kredensial, query.code, verifier);
      klaim = SsoController.bacaKlaim(idToken);
    } catch (e) {
      console.error(`SSO ${nama}: ${e.message}`);
      return galat('PERTUKARAN_GAGAL');
    }

    const identitas = SsoController.periksaKlaim(nama, kredensial, klaim);
    if (identitas.kode) return galat(identitas.kode);

    const hasil = await AkunController.masukDenganSso(identitas.email);
    if (!hasil.berhasil) return galat(hasil.kodePesan);
    if (hasil.akunBaru) {
      try {
        const profil = { email: identitas.email, nama: identitas.nama, penyedia: nama, exp: Date.now() + UMUR_PROFIL_DETIK * 1000 };
        return { tipe: 'lengkapi', nilaiCookieProfil: SsoController.tandatangani(profil) };
      } catch (e) {
        console.error(`SSO: ${e.message}`);
        return galat('KONFIGURASI_SALAH');
      }
    }
    return { tipe: 'sesi', token: hasil.token, peran: hasil.peran, email: identitas.email };
  }

  static async tukarKode(nama, kredensial, code, verifier) {
    const respons = await fetch(PENYEDIA[nama].token(kredensial), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SsoController.alamatKembali(nama),
        client_id: kredensial.clientId,
        client_secret: kredensial.clientSecret,
        code_verifier: verifier,
      }),
      signal: AbortSignal.timeout(BATAS_WAKTU_MS),
    });
    if (!respons.ok) throw new Error(`token endpoint membalas ${respons.status}`);
    const isi = await respons.json();
    if (typeof isi?.id_token !== 'string') throw new Error('id_token tidak ada pada balasan token endpoint');
    return isi.id_token;
  }

  // id_token diterima langsung dari token endpoint lewat TLS dengan client_secret, jadi tanda tangannya
  // tidak diverifikasi ulang (OIDC Core §3.1.3.7); iss, aud, dan exp tetap diperiksa di periksaKlaim.
  static bacaKlaim(idToken) {
    const bagian = idToken.split('.');
    if (bagian.length !== 3) throw new Error('id_token bukan JWT');
    const klaim = JSON.parse(Buffer.from(bagian[1], 'base64url').toString('utf8'));
    if (klaim === null || typeof klaim !== 'object') throw new Error('klaim id_token tidak sah');
    return klaim;
  }

  // { email, nama } bila lolos; { kode } bila ditolak
  static periksaKlaim(nama, kredensial, klaim) {
    if (!['https://accounts.google.com', 'accounts.google.com'].includes(klaim.iss)) return { kode: 'TOKEN_TIDAK_VALID' };
    if (![].concat(klaim.aud).includes(kredensial.clientId)) return { kode: 'TOKEN_TIDAK_VALID' };
    if (typeof klaim.exp !== 'number' || klaim.exp * 1000 <= Date.now()) return { kode: 'TOKEN_TIDAK_VALID' };

    if (klaim.email_verified !== true) return { kode: 'SUREL_BELUM_TERVERIFIKASI' };
    if (!AkunController.validasiDomainEmail(klaim.email)) return { kode: 'DOMAIN_TIDAK_VALID' };
    const email = klaim.email.trim().toLowerCase();
    const namaKlaim = typeof klaim.name === 'string' ? klaim.name.trim() : '';
    return { email, nama: (namaKlaim || email.split('@')[0]).slice(0, 100) };
  }

  // ───────────── Melengkapi akun baru ─────────────

  static profilSementara(headerCookie) {
    const profil = SsoController.periksaTandatangan(SsoController.bacaCookie(headerCookie, COOKIE_PROFIL));
    if (profil === null || typeof profil.email !== 'string' || typeof profil.nama !== 'string') return null;
    return { email: profil.email, nama: profil.nama, penyedia: profil.penyedia };
  }

  // Hasil AkunController.daftarAkunSso, atau gagal PROFIL_SSO_TIDAK_VALID bila cookie profil rusak/kedaluwarsa
  static async lengkapi(headerCookie, nim, setujuKebijakan) {
    const profil = SsoController.profilSementara(headerCookie);
    if (profil === null) {
      return { berhasil: false, kodePesan: 'PROFIL_SSO_TIDAK_VALID', pesan: 'Sesi pendaftaran SSO tidak valid atau sudah kedaluwarsa. Masuk ulang.' };
    }
    return AkunController.daftarAkunSso(profil.nama, nim, profil.email, setujuKebijakan);
  }

  // ───────────── Pembantu ─────────────

  static tandatangani(data) {
    const isi = Buffer.from(JSON.stringify(data)).toString('base64url');
    return `${isi}.${tandaTangan(isi)}`;
  }

  // Data bila tanda tangan cocok dan belum kedaluwarsa; selain itu null (termasuk bila KUNCI_SSO tidak diatur)
  static periksaTandatangan(nilai) {
    if (typeof nilai !== 'string') return null;
    const [isi, tanda, sisa] = nilai.split('.');
    if (!isi || !tanda || sisa !== undefined) return null;
    try {
      if (!samaPersis(tanda, tandaTangan(isi))) return null;
      const data = JSON.parse(Buffer.from(isi, 'base64url').toString('utf8'));
      return data !== null && typeof data === 'object' && data.exp > Date.now() ? data : null;
    } catch {
      return null;
    }
  }

  static bacaCookie(header, nama) {
    for (const bagian of (header ?? '').split(';')) {
      const i = bagian.indexOf('=');
      if (i < 0 || bagian.slice(0, i).trim() !== nama) continue;
      try {
        return decodeURIComponent(bagian.slice(i + 1).trim());
      } catch {
        return null;
      }
    }
    return null;
  }
}

module.exports = SsoController;
