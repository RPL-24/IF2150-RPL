// src/tests/integration/SsoAPI.test.js
// Masuk dengan Google: fetch ke penyedia di-mock, model Akun/SesiLogin di-spy (tanpa basis data).
const crypto = require('crypto');
const request = require('supertest');
const app = require('../../app');
const config = require('../../config/env');
const Akun = require('../../models/Akun');
const SesiLogin = require('../../models/SesiLogin');
const Kriptografi = require('../../pendukung/Kriptografi');

const KUNCI = 'ab'.repeat(32);
const GOOGLE = { clientId: 'google-id', clientSecret: 'google-rahasia' };
const KOSONG = { google: { clientId: undefined, clientSecret: undefined } };

const base64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const buatJwt = (klaim) => `${base64url({ alg: 'RS256' })}.${base64url(klaim)}.tandatangan`;
const detik = (offset = 3600) => Math.floor(Date.now() / 1000) + offset;

function klaimGoogle(ubah = {}) {
  return {
    iss: 'https://accounts.google.com', aud: GOOGLE.clientId, exp: detik(),
    email: 'budi@itb.ac.id', email_verified: true, name: 'Budi Santoso', ...ubah,
  };
}

function akunUji(data = {}) {
  return new Akun({
    idAkun: 'akun-1', nama: 'Budi', nim: '13500001', email: 'budi@itb.ac.id', kataSandiHash: '$2b$10$lama',
    statusAkun: Akun.STATUS.TERVERIFIKASI, statusBlokir: false, peran: Akun.PERAN.PENGGUNA, setujuKebijakan: true, ...data,
  });
}

const cookieDari = (res, nama) => {
  const baris = [].concat(res.headers['set-cookie'] ?? []).find((c) => c.startsWith(`${nama}=`));
  return baris ?? null;
};
const nilaiCookie = (res, nama) => {
  const baris = cookieDari(res, nama);
  return baris === null ? null : baris.split(';')[0].slice(nama.length + 1);
};

// Menjalankan /mulai lalu /kembali. opsi.state mengganti state pada query; opsi.tanpaCookie membuang cookie state.
async function alurKembali(penyedia, klaim, opsi = {}) {
  const mulai = await request(app).get(`/api/akun/sso/${penyedia}/mulai`);
  const url = new URL(mulai.headers.location);
  global.fetch.mockResolvedValue(opsi.balasan ?? { ok: true, json: async () => ({ id_token: buatJwt(klaim) }) });
  const state = opsi.state ?? url.searchParams.get('state');
  const req = request(app).get(`/api/akun/sso/${penyedia}/kembali`).query({ code: 'kode-otorisasi', ...(state === '' ? {} : { state }) });
  if (!opsi.tanpaCookie) req.set('Cookie', `itbeli_sso_state=${nilaiCookie(mulai, 'itbeli_sso_state')}`);
  return { res: await req, url, mulai };
}

describe('SSO Google (/api/akun/sso)', () => {
  let simpanAkun;
  let simpanSesi;

  beforeEach(() => {
    Object.assign(config.sso, { urlDasar: 'http://localhost:3000', kunci: KUNCI, google: { ...GOOGLE } });
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Akun, 'cariByEmail').mockResolvedValue(null);
    simpanAkun = jest.spyOn(Akun, 'simpan').mockResolvedValue('akun-baru');
    simpanSesi = jest.spyOn(SesiLogin, 'simpan').mockResolvedValue(true);
    jest.spyOn(Kriptografi, 'hash').mockResolvedValue('$2b$10$hashacak');
    jest.spyOn(Akun.prototype, 'perbaruiStatusAkun').mockResolvedValue(true);
    jest.spyOn(Akun.prototype, 'perbaruiKataSandiHash').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe('GET /sso/penyedia', () => {
    test('google true hanya bila kredensialnya terisi', async () => {
      config.sso.google = { ...KOSONG.google };
      let res = await request(app).get('/api/akun/sso/penyedia');
      expect(res.body).toEqual({ sukses: true, data: { google: false } });

      config.sso.google = { ...GOOGLE };
      res = await request(app).get('/api/akun/sso/penyedia');
      expect(res.body.data).toEqual({ google: true });
    });
  });

  describe('GET /sso/:penyedia/mulai', () => {
    test.each(['facebook', 'microsoft', '__proto__', 'constructor'])('penyedia tak dikenal (%s) → 404 JSON', async (nama) => {
      const res = await request(app).get(`/api/akun/sso/${nama}/mulai`);
      expect(res.status).toBe(404);
      expect(res.body.sukses).toBe(false);
    });

    test('penyedia belum dikonfigurasi → 404 JSON', async () => {
      config.sso.google = { ...KOSONG.google };
      const res = await request(app).get('/api/akun/sso/google/mulai');
      expect(res.status).toBe(404);
      expect(res.body.sukses).toBe(false);
    });

    test('Google → redirect dengan state, PKCE S256, hd, dan cookie state httpOnly SameSite=Lax', async () => {
      const res = await request(app).get('/api/akun/sso/google/mulai');
      expect(res.status).toBe(302);
      const url = new URL(res.headers.location);
      expect(url.origin + url.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth');
      expect(Object.fromEntries(url.searchParams)).toMatchObject({
        client_id: GOOGLE.clientId,
        redirect_uri: 'http://localhost:3000/api/akun/sso/google/kembali',
        response_type: 'code',
        scope: 'openid email profile',
        code_challenge_method: 'S256',
        hd: 'itb.ac.id',
      });
      expect(url.searchParams.get('state').length).toBeGreaterThanOrEqual(30);
      const cookie = cookieDari(res, 'itbeli_sso_state');
      expect(cookie).toMatch(/HttpOnly/i);
      expect(cookie).toMatch(/SameSite=Lax/i);
      expect(cookie).toMatch(/Max-Age=600/i);
    });

    test('state berbeda tiap permintaan', async () => {
      const a = await request(app).get('/api/akun/sso/google/mulai');
      const b = await request(app).get('/api/akun/sso/google/mulai');
      expect(new URL(a.headers.location).searchParams.get('state'))
        .not.toBe(new URL(b.headers.location).searchParams.get('state'));
    });
  });

  describe('GET /sso/:penyedia/kembali — validasi', () => {
    const galat = (res) => new URL(res.headers.location, 'http://x').searchParams.get('sso_galat');

    test('penyedia belum dikonfigurasi → 404 JSON', async () => {
      config.sso.google = { ...KOSONG.google };
      const res = await request(app).get('/api/akun/sso/google/kembali').query({ code: 'c', state: 's' });
      expect(res.status).toBe(404);
    });

    test('state berbeda dengan cookie → ditolak, tanpa menghubungi penyedia', async () => {
      const { res } = await alurKembali('google', klaimGoogle(), { state: 'state-palsu' });
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/masuk?sso_galat=STATE_TIDAK_VALID');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('state kosong pada query → ditolak', async () => {
      const { res } = await alurKembali('google', klaimGoogle(), { state: '' });
      expect(galat(res)).toBe('STATE_TIDAK_VALID');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('cookie state tidak ada → ditolak', async () => {
      const { res } = await alurKembali('google', klaimGoogle(), { tanpaCookie: true });
      expect(galat(res)).toBe('STATE_TIDAK_VALID');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('cookie state milik penyedia lain → ditolak', async () => {
      const mulai = await request(app).get('/api/akun/sso/google/mulai');
      const state = new URL(mulai.headers.location).searchParams.get('state');
      const cookieLain = nilaiCookie(mulai, 'itbeli_sso_state').replace(/^google\./, 'facebook.');
      const res = await request(app).get('/api/akun/sso/google/kembali').query({ code: 'c', state })
        .set('Cookie', `itbeli_sso_state=${cookieLain}`);
      expect(galat(res)).toBe('STATE_TIDAK_VALID');
    });

    test('penyedia menolak (error=access_denied) → galat ramah', async () => {
      const mulai = await request(app).get('/api/akun/sso/google/mulai');
      const state = new URL(mulai.headers.location).searchParams.get('state');
      const res = await request(app).get('/api/akun/sso/google/kembali').query({ error: 'access_denied', state })
        .set('Cookie', `itbeli_sso_state=${nilaiCookie(mulai, 'itbeli_sso_state')}`);
      expect(galat(res)).toBe('DITOLAK_PENYEDIA');
    });

    test('kode ditukar dari server dengan client_secret dan code_verifier yang cocok dengan code_challenge', async () => {
      const { url } = await alurKembali('google', klaimGoogle());
      const [alamat, opsi] = global.fetch.mock.calls[0];
      expect(alamat).toBe('https://oauth2.googleapis.com/token');
      const badan = new URLSearchParams(opsi.body);
      expect(badan.get('grant_type')).toBe('authorization_code');
      expect(badan.get('code')).toBe('kode-otorisasi');
      expect(badan.get('client_secret')).toBe(GOOGLE.clientSecret);
      expect(badan.get('redirect_uri')).toBe('http://localhost:3000/api/akun/sso/google/kembali');
      const tantangan = crypto.createHash('sha256').update(badan.get('code_verifier')).digest('base64url');
      expect(tantangan).toBe(url.searchParams.get('code_challenge'));
    });

    test.each([
      ['non-ITB (gmail.com)', { email: 'budi@gmail.com' }, 'DOMAIN_TIDAK_VALID'],
      ['domain tiruan itb.ac.id.palsu.com', { email: 'budi@itb.ac.id.palsu.com' }, 'DOMAIN_TIDAK_VALID'],
      ['tanpa surel sama sekali', { email: undefined }, 'DOMAIN_TIDAK_VALID'],
      ['email_verified=false', { email_verified: false }, 'SUREL_BELUM_TERVERIFIKASI'],
      ['email_verified berupa string "true"', { email_verified: 'true' }, 'SUREL_BELUM_TERVERIFIKASI'],
      ['aud bukan client id', { aud: 'aplikasi-lain' }, 'TOKEN_TIDAK_VALID'],
      ['iss bukan Google', { iss: 'https://penyerang.example' }, 'TOKEN_TIDAK_VALID'],
      ['token kedaluwarsa', { exp: detik(-10) }, 'TOKEN_TIDAK_VALID'],
    ])('Google: %s → ditolak', async (_, ubah, kode) => {
      const { res } = await alurKembali('google', klaimGoogle(ubah));
      expect(galat(res)).toBe(kode);
      expect(simpanSesi).not.toHaveBeenCalled();
    });

    test('Google: subdomain ITB (std.stei.itb.ac.id) diterima, huruf besar/kecil diabaikan', async () => {
      const { res } = await alurKembali('google', klaimGoogle({ email: 'Ani@STD.STEI.ITB.AC.ID' }));
      expect(res.headers.location).toBe('/lengkapi-sso');
    });

    test('token endpoint gagal (HTTP 400) → PERTUKARAN_GAGAL', async () => {
      const { res } = await alurKembali('google', klaimGoogle(), { balasan: { ok: false, status: 400, json: async () => ({}) } });
      expect(galat(res)).toBe('PERTUKARAN_GAGAL');
    });

    test('jaringan putus → PERTUKARAN_GAGAL', async () => {
      const mulai = await request(app).get('/api/akun/sso/google/mulai');
      const state = new URL(mulai.headers.location).searchParams.get('state');
      global.fetch.mockRejectedValue(new Error('jaringan putus'));
      const res = await request(app).get('/api/akun/sso/google/kembali').query({ code: 'c', state })
        .set('Cookie', `itbeli_sso_state=${nilaiCookie(mulai, 'itbeli_sso_state')}`);
      expect(galat(res)).toBe('PERTUKARAN_GAGAL');
    });
  });

  describe('GET /sso/:penyedia/kembali — pemetaan akun', () => {
    test('akun diblokir → ditolak', async () => {
      Akun.cariByEmail.mockResolvedValue(akunUji({ statusBlokir: true }));
      const { res } = await alurKembali('google', klaimGoogle());
      expect(res.headers.location).toBe('/masuk?sso_galat=AKUN_DIBLOKIR');
      expect(simpanSesi).not.toHaveBeenCalled();
    });

    test('akun Admin → ditolak (SSO tidak memberi akses Admin)', async () => {
      Akun.cariByEmail.mockResolvedValue(akunUji({ peran: Akun.PERAN.ADMIN }));
      const { res } = await alurKembali('google', klaimGoogle());
      expect(res.headers.location).toBe('/masuk?sso_galat=SSO_ADMIN_DILARANG');
      expect(simpanSesi).not.toHaveBeenCalled();
    });

    test('akun lama terverifikasi → sesi dibuat, redirect /katalog, token dititipkan di cookie singkat', async () => {
      Akun.cariByEmail.mockResolvedValue(akunUji());
      const { res } = await alurKembali('google', klaimGoogle());
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/katalog');
      expect(simpanSesi).toHaveBeenCalledTimes(1);
      const [idAkun, token] = simpanSesi.mock.calls[0];
      expect(idAkun).toBe('akun-1');
      const sesi = JSON.parse(decodeURIComponent(nilaiCookie(res, 'itbeli_sso_sesi')));
      expect(sesi).toEqual({ token, peran: 'Pengguna', email: 'budi@itb.ac.id' });
      expect(cookieDari(res, 'itbeli_sso_state')).toMatch(/Expires=Thu, 01 Jan 1970/); // state sekali pakai
      expect(Akun.prototype.perbaruiStatusAkun).not.toHaveBeenCalled();
    });

    test('akun "Belum Terverifikasi" → menjadi Terverifikasi dan kata sandi lama dibuang', async () => {
      Akun.cariByEmail.mockResolvedValue(akunUji({ statusAkun: Akun.STATUS.BELUM_TERVERIFIKASI }));
      const { res } = await alurKembali('google', klaimGoogle());
      expect(res.headers.location).toBe('/katalog');
      expect(Akun.prototype.perbaruiStatusAkun).toHaveBeenCalledWith(Akun.STATUS.TERVERIFIKASI);
      expect(Akun.prototype.perbaruiKataSandiHash).toHaveBeenCalledWith('$2b$10$hashacak');
    });

    test('akun baru → cookie profil httpOnly bertanda tangan, redirect /lengkapi-sso, belum ada sesi/akun', async () => {
      const { res } = await alurKembali('google', klaimGoogle());
      expect(res.headers.location).toBe('/lengkapi-sso');
      const cookie = cookieDari(res, 'itbeli_sso_profil');
      expect(cookie).toMatch(/HttpOnly/i);
      expect(cookie).toMatch(/SameSite=Lax/i);
      expect(cookie).toMatch(/Max-Age=900/i);
      expect(simpanSesi).not.toHaveBeenCalled();
      expect(simpanAkun).not.toHaveBeenCalled();

      const profil = await request(app).get('/api/akun/sso/profil-sementara')
        .set('Cookie', `itbeli_sso_profil=${nilaiCookie(res, 'itbeli_sso_profil')}`);
      expect(profil.body.data).toEqual({ email: 'budi@itb.ac.id', nama: 'Budi Santoso', penyedia: 'google' });
    });
  });

  describe('POST /sso/lengkapi', () => {
    async function ambilCookieProfil() {
      const { res } = await alurKembali('google', klaimGoogle({ email: 'Baru@ITB.ac.id', name: 'Mahasiswa Baru' }));
      return nilaiCookie(res, 'itbeli_sso_profil');
    }
    const kirim = (cookie, body) => {
      const req = request(app).post('/api/akun/sso/lengkapi');
      if (cookie) req.set('Cookie', `itbeli_sso_profil=${cookie}`);
      return req.send(body);
    };

    test('NIM + persetujuan → akun Terverifikasi dengan kata sandi acak, sesi dibuat', async () => {
      const cookie = await ambilCookieProfil();
      const res = await kirim(cookie, { nim: '13599999', setujuKebijakan: true });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ sukses: true, data: { token: simpanSesi.mock.calls[0][1], peran: 'Pengguna' } });
      expect(simpanAkun).toHaveBeenCalledWith('Mahasiswa Baru', '13599999', 'baru@itb.ac.id', '$2b$10$hashacak', Akun.STATUS.TERVERIFIKASI, true);
      const kataSandiAcak = Kriptografi.hash.mock.calls[0][0];
      expect(kataSandiAcak).toMatch(/^[0-9a-f]{64}$/);
      expect(cookieDari(res, 'itbeli_sso_profil')).toMatch(/Expires=Thu, 01 Jan 1970/);
    });

    test.each([
      ['NIM bukan angka', { nim: 'abc', setujuKebijakan: true }, 400, 'NIM_TIDAK_VALID'],
      ['NIM kosong', { nim: '', setujuKebijakan: true }, 400, 'FORMULIR_TIDAK_LENGKAP'],
      ['kebijakan belum disetujui', { nim: '13599999', setujuKebijakan: false }, 400, 'KEBIJAKAN_BELUM_DISETUJUI'],
    ])('%s → %i', async (_, body, status, kode) => {
      const cookie = await ambilCookieProfil();
      const res = await kirim(cookie, body);
      expect(res.status).toBe(status);
      expect(res.body.kode).toBe(kode);
      expect(simpanAkun).not.toHaveBeenCalled();
    });

    test('tanpa cookie profil → 401', async () => {
      const res = await kirim(null, { nim: '13599999', setujuKebijakan: true });
      expect(res.status).toBe(401);
      expect(res.body.kode).toBe('PROFIL_SSO_TIDAK_VALID');
      expect(simpanAkun).not.toHaveBeenCalled();
    });

    test('isi cookie profil dimanipulasi (surel diganti) → ditolak', async () => {
      const [isi, tanda] = (await ambilCookieProfil()).split('.');
      const profil = JSON.parse(Buffer.from(isi, 'base64url').toString());
      const palsu = Buffer.from(JSON.stringify({ ...profil, email: 'korban@itb.ac.id' })).toString('base64url');
      const res = await kirim(`${palsu}.${tanda}`, { nim: '13599999', setujuKebijakan: true });
      expect(res.status).toBe(401);
      expect(simpanAkun).not.toHaveBeenCalled();
    });

    test('cookie profil ditandatangani dengan kunci lain → ditolak', async () => {
      const isi = Buffer.from(JSON.stringify({ email: 'korban@itb.ac.id', nama: 'X', penyedia: 'google', exp: Date.now() + 60_000 })).toString('base64url');
      const tanda = crypto.createHmac('sha256', Buffer.from('cd'.repeat(32), 'hex')).update(isi).digest('base64url');
      const res = await kirim(`${isi}.${tanda}`, { nim: '13599999', setujuKebijakan: true });
      expect(res.status).toBe(401);
    });

    test('tanda tangan benar tetapi sudah lewat 15 menit → ditolak', async () => {
      const isi = Buffer.from(JSON.stringify({ email: 'a@itb.ac.id', nama: 'A', penyedia: 'google', exp: Date.now() - 1 })).toString('base64url');
      const tanda = crypto.createHmac('sha256', Buffer.from(KUNCI, 'hex')).update(isi).digest('base64url');
      const res = await kirim(`${isi}.${tanda}`, { nim: '13599999', setujuKebijakan: true });
      expect(res.status).toBe(401);
    });

    test('cookie berformat sampah → ditolak tanpa galat server', async () => {
      const res = await kirim('bukan-cookie-sah', { nim: '13599999', setujuKebijakan: true });
      expect(res.status).toBe(401);
    });

    test('surel sudah terdaftar saat melengkapi → 409', async () => {
      const cookie = await ambilCookieProfil();
      Akun.cariByEmail.mockResolvedValue(akunUji({ email: 'baru@itb.ac.id' }));
      const res = await kirim(cookie, { nim: '13599999', setujuKebijakan: true });
      expect(res.status).toBe(409);
      expect(simpanAkun).not.toHaveBeenCalled();
    });
  });

  test('KUNCI_SSO tidak diatur → akun baru mendapat galat KONFIGURASI_SALAH, bukan 500', async () => {
    config.sso.kunci = undefined;
    const { res } = await alurKembali('google', klaimGoogle());
    expect(res.headers.location).toBe('/masuk?sso_galat=KONFIGURASI_SALAH');
  });
});
