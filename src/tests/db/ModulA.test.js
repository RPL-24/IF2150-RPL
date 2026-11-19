// src/tests/db/ModulA.test.js
// Pengujian integrasi Modul A (Akun & Otentikasi) dengan komponen nyata, tanpa mock:
// PostgreSQL 16 (basis data itbeli_uji), Mailpit sebagai server SMTP, dan token endpoint Google.
const crypto = require('crypto');
const request = require('supertest');
const app = require('../../app');
const config = require('../../config/env');
const db = require('../../config/db');
const AkunController = require('../../controllers/AkunController');
const DokumenLegalController = require('../../controllers/DokumenLegalController');
const SsoController = require('../../controllers/SsoController');
const SurelAdapter = require('../../integrasi/SurelAdapter');
const Admin = require('../../models/Admin');
const Akun = require('../../models/Akun');
const SesiLogin = require('../../models/SesiLogin');
const Kriptografi = require('../../pendukung/Kriptografi');
const Otorisasi = require('../../pendukung/Otorisasi');

const MAILPIT = process.env.MAILPIT_URL || 'http://localhost:8025';
const KATA_SANDI = 'rahasia123';

const surelBaru = (awalan = 'uji') => `${awalan}.${crypto.randomBytes(5).toString('hex')}@itb.ac.id`;

async function barisAkun(email) {
  const { rows } = await db.query('SELECT * FROM akun WHERE LOWER(email) = LOWER($1)', [email]);
  return rows;
}

async function barisToken(idAkun) {
  const { rows } = await db.query('SELECT * FROM token_verifikasi WHERE id_akun = $1 ORDER BY waktu_buat', [idAkun]);
  return rows;
}

// Surel terbaru untuk alamat tujuan, dibaca dari API Mailpit (menunggu sampai 5 detik)
async function surelTerbaru(tujuan, setelah = 0) {
  for (let i = 0; i < 25; i += 1) {
    const daftar = await (await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${tujuan}"`)}`)).json();
    if (daftar.messages.length > setelah) {
      return (await fetch(`${MAILPIT}/api/v1/message/${daftar.messages[0].ID}`)).json();
    }
    await new Promise((r) => { setTimeout(r, 200); });
  }
  throw new Error(`Tidak ada surel untuk ${tujuan} di Mailpit`);
}

const kodeDari = (surel) => surel.Text.match(/Kode verifikasi akun ITBELI Anda: (\d{6})/)[1];

async function daftarDanVerifikasi(email) {
  await AkunController.daftarAkun('Mahasiswa Uji', '13599999', email, KATA_SANDI, true);
  await AkunController.verifikasiAkun(email, kodeDari(await surelTerbaru(email)));
  return (await barisAkun(email))[0];
}

describe('Integrasi Modul A dengan PostgreSQL, Mailpit, dan Google (komponen nyata)', () => {
  afterAll(async () => {
    await db.pool.end();
  });

  test('INT-TC01 daftarAkun menyimpan akun "Belum Terverifikasi" dengan hash bcrypt dan token aktif 15 menit', async () => {
    const email = surelBaru();

    const hasil = await AkunController.daftarAkun(' Mahasiswa Uji ', '13599999', email.toUpperCase(), KATA_SANDI, true);

    expect(hasil).toMatchObject({ berhasil: true, email, surelTerkirim: true });
    const [akun] = await barisAkun(email);
    expect(akun).toMatchObject({
      nama: 'Mahasiswa Uji', nim: '13599999', email, status_akun: 'Belum Terverifikasi',
      status_blokir: false, peran: 'Pengguna', setuju_kebijakan: true,
    });
    expect(akun.kata_sandi_hash).toMatch(/^\$2b\$\d{2}\$[./A-Za-z0-9]{53}$/);
    expect(akun.kata_sandi_hash).not.toContain(KATA_SANDI);
    const [token] = await barisToken(akun.id_akun);
    expect(token.status_pakai).toBe('Aktif');
    expect(token.kode).toMatch(/^\d{6}$/);
    expect(token.waktu_kedaluwarsa - token.waktu_buat).toBe(15 * 60 * 1000);
  });

  test('INT-TC02 surel yang sama dengan huruf berbeda ditolak indeks unik akun_email_unik', async () => {
    const email = surelBaru();
    await AkunController.daftarAkun('Pertama', '13599999', email, KATA_SANDI, true);

    const lewatController = await AkunController.daftarAkun('Kedua', '13599998', email.toUpperCase(), KATA_SANDI, true);
    const lewatModel = Akun.simpan('Ketiga', '13599997', email.toUpperCase(), '$2b$10$x', 'Belum Terverifikasi', true);

    expect(lewatController.kodePesan).toBe('SUREL_TERDAFTAR');
    await expect(lewatModel).rejects.toMatchObject({ code: '23505' });
    expect(await barisAkun(email)).toHaveLength(1);
  });

  test('INT-TC03 kode verifikasi benar-benar terkirim ke kotak masuk SMTP (Mailpit) dan sama dengan kode di basis data', async () => {
    const email = surelBaru();
    await AkunController.daftarAkun('Mahasiswa Uji', '13599999', email, KATA_SANDI, true);

    const surel = await surelTerbaru(email);

    const [akun] = await barisAkun(email);
    const [token] = await barisToken(akun.id_akun);
    expect(surel.Subject).toBe('Kode Verifikasi ITBELI');
    expect(surel.From.Address).toBe('no-reply@itbeli.local');
    expect(surel.To[0].Address).toBe(email);
    expect(kodeDari(surel)).toBe(token.kode);
    expect(surel.Text).toContain('Kode berlaku selama 15 menit.');
  });

  test('INT-TC04 SMTP tidak dapat dihubungi: kirimSurel mengembalikan false tanpa melempar galat', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    const smtpMati = new SurelAdapter.constructor('127.0.0.1', 1, 'ITBELI <no-reply@itbeli.local>');

    expect(await smtpMati.kirimSurel(surelBaru(), 'Kode Verifikasi ITBELI', 'isi')).toBe(false);
    expect(log.mock.calls[0][1]).toMatch(/ECONNREFUSED/);
    log.mockRestore();
  });

  test('INT-TC05 kode dari surel memverifikasi akun, token menjadi "Terpakai", dan kode tidak dapat dipakai ulang', async () => {
    const email = surelBaru();
    await AkunController.daftarAkun('Mahasiswa Uji', '13599999', email, KATA_SANDI, true);
    const kode = kodeDari(await surelTerbaru(email));

    const hasil = await AkunController.verifikasiAkun(email, kode);
    const ulang = await AkunController.verifikasiAkun(email, kode);

    const [akun] = await barisAkun(email);
    expect(hasil).toMatchObject({ berhasil: true, idAkun: akun.id_akun });
    expect(akun.status_akun).toBe('Terverifikasi');
    expect((await barisToken(akun.id_akun)).map((t) => t.status_pakai)).toEqual(['Terpakai']);
    expect(ulang.kodePesan).toBe('SUDAH_TERVERIFIKASI');
  });

  test('INT-TC06 kode kedaluwarsa ditolak; kirim ulang menghanguskan kode lama dan kode baru diterima', async () => {
    const email = surelBaru();
    await AkunController.daftarAkun('Mahasiswa Uji', '13599999', email, KATA_SANDI, true);
    const kodeLama = kodeDari(await surelTerbaru(email));
    const [{ id_akun: idAkun }] = await barisAkun(email);
    await db.query("UPDATE token_verifikasi SET waktu_kedaluwarsa = now() - interval '1 second' WHERE id_akun = $1", [idAkun]);

    const kedaluwarsa = await AkunController.verifikasiAkun(email, kodeLama);
    expect(kedaluwarsa.kodePesan).toBe('KODE_KEDALUWARSA');
    expect((await barisAkun(email))[0].status_akun).toBe('Belum Terverifikasi');

    expect(await AkunController.kirimUlangKode(email)).toEqual({ berhasil: true });
    const kodeBaru = kodeDari(await surelTerbaru(email, 1));
    expect((await barisToken(idAkun)).map((t) => t.status_pakai)).toEqual(['Hangus', 'Aktif']);
    expect(await AkunController.verifikasiAkun(email, kodeBaru)).toMatchObject({ berhasil: true });
  });

  test('INT-TC07 login membuat sesi 24 jam di sesi_login; logout menonaktifkannya sehingga token ditolak Otorisasi', async () => {
    const email = surelBaru();
    const akun = await daftarDanVerifikasi(email);

    const masuk = await AkunController.login(email, KATA_SANDI);
    const { rows: [sesi] } = await db.query('SELECT * FROM sesi_login WHERE token = $1', [masuk.token]);
    expect(sesi).toMatchObject({ id_akun: akun.id_akun, status_aktif: true });
    expect(sesi.waktu_kedaluwarsa - sesi.waktu_mulai).toBe(24 * 60 * 60 * 1000);
    expect((await Otorisasi.verifikasiToken(masuk.token)).getIdAkun()).toBe(akun.id_akun);

    expect(await AkunController.logout(masuk.token)).toBe(true);
    const { rows: [setelah] } = await db.query('SELECT status_aktif FROM sesi_login WHERE token = $1', [masuk.token]);
    expect(setelah.status_aktif).toBe(false);
    expect(await Otorisasi.verifikasiToken(masuk.token)).toBeNull();
  });

  test('INT-TC08 sesi kedaluwarsa ditolak; blokir akun dalam satu transaksi mencabut sesi dan menolak login', async () => {
    const email = surelBaru();
    const baris = await daftarDanVerifikasi(email);
    const sesiLama = await AkunController.login(email, KATA_SANDI);
    const sesiKedaluwarsa = await AkunController.login(email, KATA_SANDI);
    await db.query("UPDATE sesi_login SET waktu_kedaluwarsa = now() - interval '1 second' WHERE token = $1", [sesiKedaluwarsa.token]);
    expect(await Otorisasi.verifikasiToken(sesiKedaluwarsa.token)).toBeNull();

    const klien = await db.pool.connect();
    try {
      await klien.query('BEGIN');
      await Akun.dariBaris(baris).blokir(klien);
      await SesiLogin.nonaktifkanByAkun(baris.id_akun, klien);
      await klien.query('COMMIT');
    } finally {
      klien.release();
    }

    expect(await Otorisasi.verifikasiToken(sesiLama.token)).toBeNull();
    expect(await Akun.getStatusBlokir(baris.id_akun)).toBe(true);
    expect((await AkunController.login(email, KATA_SANDI)).kodePesan).toBe('AKUN_DIBLOKIR');
  });

  test('INT-TC09 Admin.verifikasiPeran dan Otorisasi.verifikasiAdmin membaca peran dan status blokir dari tabel akun', async () => {
    const hash = await Kriptografi.hash(KATA_SANDI);
    const buat = async (peran, blokir) => {
      const id = crypto.randomUUID();
      await db.query(
        `INSERT INTO akun (id_akun, nama, nim, email, kata_sandi_hash, status_akun, status_blokir, peran, setuju_kebijakan)
         VALUES ($1, 'Uji', '1', $2, $3, 'Terverifikasi', $4, $5, true)`,
        [id, surelBaru(peran.toLowerCase()), hash, blokir, peran],
      );
      return id;
    };
    const adminAktif = await buat('Admin', false);
    const adminDiblokir = await buat('Admin', true);
    const pengguna = await buat('Pengguna', false);

    expect(await Admin.verifikasiPeran(adminAktif)).toBe(true);
    expect(await Admin.verifikasiPeran(adminDiblokir)).toBe(false);
    expect(await Admin.verifikasiPeran(pengguna)).toBe(false);

    const tokenAdmin = (await AkunController.buatSesiLogin(adminAktif)).token;
    const tokenPengguna = (await AkunController.buatSesiLogin(pengguna)).token;
    expect((await Otorisasi.verifikasiAdmin(tokenAdmin)).getIdAkun()).toBe(adminAktif);
    expect(await Otorisasi.verifikasiAdmin(tokenPengguna)).toBeNull();
  });

  test('INT-TC10 DokumenLegalController mengambil versi terbaru yang terbit dan sudah berlaku dari tabel dokumen_legal', async () => {
    await db.query(
      `INSERT INTO dokumen_legal (id_dokumen, jenis_dokumen, judul, isi, klausa_privasi_pesan, versi, tanggal_berlaku, status_publikasi, tautan)
       VALUES (gen_random_uuid(), 'kebijakan-privasi', 'Draf', 'draf', NULL, '1.1', CURRENT_DATE, false, '/legal'),
              (gen_random_uuid(), 'kebijakan-privasi', 'Masa depan', 'baru', NULL, '2.0', CURRENT_DATE + 30, true, '/legal')`,
    );

    const dokumen = await DokumenLegalController.getDokumen('kebijakan-privasi');

    expect(dokumen).toMatchObject({ judul: 'Kebijakan Privasi', versi: '1.0', tanggalBerlaku: '2026-11-01' });
    expect(await DokumenLegalController.getKlausaPrivasi()).toMatch(/tidak dapat diakses admin maupun pengembang/);
    expect(await AkunController.getTautanDokumenLegal()).toBe('/legal?jenis=kebijakan-privasi');
    expect(await DokumenLegalController.getDokumen('bukan-jenis')).toBeNull();
  });

  test('INT-TC11 token endpoint Google menolak kode dan kredensial tidak sah → SSO gagal tanpa membuat akun atau sesi', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    Object.assign(config.sso, { kunci: 'ab'.repeat(32), google: { clientId: 'itbeli-uji.apps.googleusercontent.com', clientSecret: 'rahasia-uji' } });
    const { rows: [{ jumlah: sesiAwal }] } = await db.query('SELECT COUNT(*)::int AS jumlah FROM sesi_login');

    const mulai = SsoController.mulai('google');
    const state = new URL(mulai.url).searchParams.get('state');
    const hasil = await SsoController.selesaikan('google', { state, code: 'kode-tidak-sah' },
      `${SsoController.COOKIE_STATE}=${encodeURIComponent(mulai.nilaiCookieState)}`);

    expect(new URL(mulai.url).origin).toBe('https://accounts.google.com');
    expect(hasil).toEqual({ tipe: 'galat', kode: 'PERTUKARAN_GAGAL' });
    expect(log.mock.calls[0][0]).toMatch(/token endpoint membalas 4\d\d/);
    const { rows: [{ jumlah: sesiAkhir }] } = await db.query('SELECT COUNT(*)::int AS jumlah FROM sesi_login');
    expect(sesiAkhir).toBe(sesiAwal);
    log.mockRestore();
  });

  test('INT-TC12 alur HTTP /api/akun: daftar → kode dari Mailpit → verifikasi → profil → logout', async () => {
    const email = surelBaru();

    const daftar = await request(app).post('/api/akun/daftar')
      .send({ nama: 'Mahasiswa Uji', nim: '13599999', email, kataSandi: KATA_SANDI, setujuKebijakan: true });
    expect(daftar.status).toBe(201);

    const verifikasi = await request(app).post('/api/akun/verifikasi').send({ email, kode: kodeDari(await surelTerbaru(email)) });
    expect(verifikasi.status).toBe(200);
    const { token } = verifikasi.body.data;

    const profil = await request(app).get('/api/akun/profil').set('Authorization', `Bearer ${token}`);
    expect(profil.status).toBe(200);
    expect(profil.body.data).toMatchObject({ nama: 'Mahasiswa Uji', nim: '13599999', email, statusAkun: 'Terverifikasi', daftarBarang: [] });
    expect(profil.body.data).not.toHaveProperty('kataSandiHash');

    expect((await request(app).post('/api/akun/logout').set('Authorization', `Bearer ${token}`)).status).toBe(200);
    expect((await request(app).get('/api/akun/profil').set('Authorization', `Bearer ${token}`)).status).toBe(401);
  });
});
