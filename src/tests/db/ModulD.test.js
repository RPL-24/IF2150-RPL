// src/tests/db/ModulD.test.js
// Pengujian integrasi Modul D (Percakapan dan Notifikasi) dengan komponen nyata, tanpa mock DB:
//   HTTP (Supertest ke app Express) -> percakapanRoutes / notifikasiRoutes + Otorisasi
//   -> PercakapanController (C18), NotifikasiController (C19), Kriptografi (C42)
//   -> Percakapan (C33), Pesan (C34), Notifikasi (C35), LanggananPush
//   -> PostgreSQL 16 (itbeli_uji) + server HTTP Web Push lokal nyata untuk PushNotifikasiAdapter (C44).
//
// Basis data uji dipakai bersama modul lain, sehingga setiap putaran memakai akun dan barang unik.
const crypto = require('crypto');
const https = require('https');
const request = require('supertest');
const webpush = require('web-push');
const app = require('../../app');
const db = require('../../config/db');
const AkunController = require('../../controllers/AkunController');
const Kriptografi = require('../../pendukung/Kriptografi');
const Percakapan = require('../../models/Percakapan');
const LanggananPush = require('../../models/LanggananPush');
const PushNotifikasiAdapter = require('../../integrasi/PushNotifikasiAdapter');

const HASH_PALSU = `$2b$10$${'x'.repeat(53)}`;
const ACAK = crypto.randomBytes(4).toString('hex');

async function buatAkun(nama, { diblokir = false, peran = 'Pengguna' } = {}) {
  const idAkun = crypto.randomUUID();
  await db.query(
    `INSERT INTO akun (id_akun, nama, nim, email, kata_sandi_hash, status_akun, status_blokir, peran, setuju_kebijakan)
     VALUES ($1, $2, '13525124', $3, $4, $5, $6, $7, true)`,
    [
      idAkun,
      nama,
      `moduld.${ACAK}.${crypto.randomBytes(4).toString('hex')}@itb.ac.id`,
      HASH_PALSU,
      diblokir ? 'Diblokir' : 'Terverifikasi',
      diblokir,
      peran,
    ],
  );
  const { token } = await AkunController.buatSesiLogin(idAkun);
  return { idAkun, nama, token };
}

async function buatBarang(idPenjual, judul, { harga = 85000, status = 'Tersedia' } = {}) {
  const idBarang = crypto.randomUUID();
  await db.query(
    `INSERT INTO barang (id_barang, id_penjual, judul, harga, deskripsi_kondisi, id_kategori, id_lokasi, status)
     VALUES ($1, $2, $3, $4, 'Kondisi baik', 'Jas praktikum', 'Labtek V', $5)`,
    [idBarang, idPenjual, judul, harga, status],
  );
  return idBarang;
}

// Bangkitkan kunci publik P-256 (65 byte uncompressed) dan auth 16 byte agar web-push melakukan enkripsi aes128gcm nyata
function buatKunciLanggananNyata() {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();
  return {
    p256dh: ecdh.getPublicKey().toString('base64url'),
    auth: crypto.randomBytes(16).toString('base64url'),
  };
}

// Buat sertifikat TLS swa-tanda tangan sementara di memori (tanpa ketergantungan biner eksternal)
// agar pustaka web-push dapat mengirim permintaan HTTPS Web Push sungguhan ke 127.0.0.1.
function buatSertifikatLokal() {
  const derLen = (n) => {
    if (n < 0x80) return Buffer.from([n]);
    const b = [];
    let x = n;
    while (x > 0) { b.unshift(x & 0xff); x >>= 8; }
    return Buffer.from([0x80 | b.length, ...b]);
  };
  const tag = (t, ...bufs) => {
    const body = Buffer.concat(bufs);
    return Buffer.concat([Buffer.from([t]), derLen(body.length), body]);
  };
  const seq = (...b) => tag(0x30, ...b);
  const set = (...b) => tag(0x31, ...b);
  const int = (buf) => tag(0x02, buf[0] & 0x80 ? Buffer.concat([Buffer.from([0]), buf]) : buf);
  const oid = (bytes) => tag(0x06, Buffer.from(bytes));
  const utf8 = (s) => tag(0x0c, Buffer.from(s, 'utf8'));
  const bitStr = (buf) => tag(0x03, Buffer.concat([Buffer.from([0]), buf]));
  const utc = (d) => tag(0x17, Buffer.from(
    d.toISOString().replace(/[-:T]/g, '').slice(2, 14) + 'Z',
    'ascii',
  ));

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const spki = publicKey.export({ type: 'spki', format: 'der' });
  const sha256Rsa = seq(oid([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x0b]), Buffer.from([0x05, 0x00]));
  const cn = seq(set(seq(oid([0x55, 0x04, 0x03]), utf8('127.0.0.1'))));
  const sekarang = new Date(Date.now() - 60000);
  const besok = new Date(Date.now() + 86400000);
  const sanExt = seq(
    oid([0x55, 0x1d, 0x11]),
    tag(0x04, seq(tag(0x87, Buffer.from([127, 0, 0, 1])))),
  );
  const tbs = seq(
    tag(0xa0, int(Buffer.from([2]))),
    int(crypto.randomBytes(8)),
    sha256Rsa,
    cn,
    seq(utc(sekarang), utc(besok)),
    cn,
    spki,
    tag(0xa3, seq(sanExt)),
  );
  const sig = crypto.sign('sha256', tbs, privateKey);
  const certDer = seq(tbs, sha256Rsa, bitStr(sig));
  const b64 = certDer.toString('base64').match(/.{1,64}/g).join('\n');
  return {
    key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
    cert: `-----BEGIN CERTIFICATE-----\n${b64}\n-----END CERTIFICATE-----\n`,
  };
}

const SERTIFIKAT_LOKAL = buatSertifikatLokal();

// Server HTTPS lokal yang berperan sebagai push service (menerima permintaan Web Push sungguhan dari web-push)
function jalankanPushServiceLokal(penangan) {
  return new Promise((resolve) => {
    const server = https.createServer(SERTIFIKAT_LOKAL, (req, res) => {
      const potongan = [];
      req.on('data', (c) => potongan.push(c));
      req.on('end', () => {
        penangan(req, Buffer.concat(potongan), res);
      });
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `https://127.0.0.1:${port}` });
    });
  });
}

const sebagai = (token) => ({ Authorization: `Bearer ${token}` });

describe('Integrasi Modul D dengan PostgreSQL dan Web Push lokal (komponen nyata)', () => {
  let penjual;
  let pembeli;
  let pihakKetiga;
  let admin;
  let penjualDiblokir;
  let idBarangUtama;
  let idBarangKedua;
  let idBarangDiblokir;

  beforeAll(async () => {
    penjual = await buatAkun('Penjual Modul D');
    pembeli = await buatAkun('Pembeli Modul D');
    pihakKetiga = await buatAkun('Pihak Ketiga Modul D');
    admin = await buatAkun('Admin Modul D', { peran: 'Admin' });
    penjualDiblokir = await buatAkun('Penjual Diblokir Modul D', { diblokir: true });

    idBarangUtama = await buatBarang(penjual.idAkun, `Jas Lab Modul D ${ACAK}`, { harga: 90000 });
    idBarangKedua = await buatBarang(penjual.idAkun, `Kalkulator Modul D ${ACAK}`, { harga: 150000 });
    idBarangDiblokir = await buatBarang(penjualDiblokir.idAkun, `Barang Diblokir ${ACAK}`);
  });

  afterAll(async () => {
    await db.pool.end();
  });

  test('INT-TC46 mulai percakapan baru (201) dan percakapan ganda memakai ulang ruang yang sama (200) tanpa duplikat (UC16, KF31)', async () => {
    const pertama = await request(app)
      .post('/api/percakapan')
      .set(sebagai(pembeli.token))
      .send({ idBarang: idBarangUtama });
    expect(pertama.status).toBe(201);
    const { idPercakapan } = pertama.body.data;
    expect(idPercakapan).toMatch(/^[0-9a-f-]{36}$/);

    const kedua = await request(app)
      .post('/api/percakapan')
      .set(sebagai(pembeli.token))
      .send({ idBarang: idBarangUtama });
    expect(kedua.status).toBe(200);
    expect(kedua.body.data.idPercakapan).toBe(idPercakapan);

    // Uji langsung ON CONFLICT pada Percakapan.simpan
    const konflik = await Percakapan.simpan(idBarangUtama, pembeli.idAkun, penjual.idAkun);
    expect(konflik.idPercakapan).toBe(idPercakapan);

    const { rows } = await db.query(
      'SELECT COUNT(*)::int AS jumlah FROM percakapan WHERE id_barang = $1 AND id_pembeli = $2 AND id_penjual = $3',
      [idBarangUtama, pembeli.idAkun, penjual.idAkun],
    );
    expect(rows[0].jumlah).toBe(1);
  });

  test('INT-TC47 mulai percakapan menolak listing sendiri (400), penjual diblokir (403), barang tidak ada (404), dan tanpa sesi (401)', async () => {
    const sendiri = await request(app)
      .post('/api/percakapan')
      .set(sebagai(penjual.token))
      .send({ idBarang: idBarangUtama });
    expect(sendiri.status).toBe(400);

    const diblokir = await request(app)
      .post('/api/percakapan')
      .set(sebagai(pembeli.token))
      .send({ idBarang: idBarangDiblokir });
    expect(diblokir.status).toBe(403);

    const takAda = await request(app)
      .post('/api/percakapan')
      .set(sebagai(pembeli.token))
      .send({ idBarang: crypto.randomUUID() });
    expect(takAda.status).toBe(404);

    const bukanUuid = await request(app)
      .post('/api/percakapan')
      .set(sebagai(pembeli.token))
      .send({ idBarang: 'bukan-uuid' });
    expect(bukanUuid.status).toBe(404);

    const tanpaToken = await request(app).post('/api/percakapan').send({ idBarang: idBarangUtama });
    expect(tanpaToken.status).toBe(401);

    const { rows } = await db.query('SELECT COUNT(*)::int AS jumlah FROM percakapan WHERE id_barang = $1', [
      idBarangDiblokir,
    ]);
    expect(rows[0].jumlah).toBe(0);
  });

  test('INT-TC48 kirim pesan tersimpan terenkripsi di tabel pesan, tidak memuat teks asli, dan terbaca peserta (UC17, KF32, KF36)', async () => {
    const ruang = await request(app)
      .post('/api/percakapan')
      .set(sebagai(pembeli.token))
      .send({ idBarang: idBarangUtama });
    const { idPercakapan } = ruang.body.data;

    const teksAsli = `Halo kak, bisa COD jam 15.00 di Labtek V? Kode-${ACAK}`;
    const kirim = await request(app)
      .post(`/api/percakapan/${idPercakapan}/pesan`)
      .set(sebagai(pembeli.token))
      .send({ isi: teksAsli });
    expect(kirim.status).toBe(201);
    expect(kirim.body.data).toMatchObject({ isi: teksAsli, idPengirim: pembeli.idAkun, dariSaya: true });

    // Pesan kosong ditolak 400
    const kosong = await request(app)
      .post(`/api/percakapan/${idPercakapan}/pesan`)
      .set(sebagai(pembeli.token))
      .send({ isi: '   ' });
    expect(kosong.status).toBe(400);

    // Inspeksi langsung tabel pesan: isi harus terenkripsi
    const { rows } = await db.query(
      'SELECT isi_pesan_terenkripsi, status_baca FROM pesan WHERE id_pesan = $1',
      [kirim.body.data.idPesan],
    );
    expect(rows).toHaveLength(1);
    const { isi_pesan_terenkripsi: sandi, status_baca: statusBaca } = rows[0];
    expect(statusBaca).toBe(false);
    expect(sandi).not.toContain(teksAsli);
    expect(sandi).not.toContain(`Kode-${ACAK}`);
    expect(Buffer.from(sandi, 'base64').toString('utf8')).not.toContain(`Kode-${ACAK}`);
    expect(Kriptografi.dekripsi(sandi)).toBe(teksAsli);

    // Pembeli dan penjual dapat membuka dan membaca teks asli
    const bukaPembeli = await request(app).get(`/api/percakapan/${idPercakapan}`).set(sebagai(pembeli.token));
    expect(bukaPembeli.status).toBe(200);
    expect(bukaPembeli.body.data.pesan.at(-1).isi).toBe(teksAsli);
    expect(bukaPembeli.body.data.tautanKebijakanPrivasi).toBe('/legal?jenis=kebijakan-privasi');
  });

  test('INT-TC49 kirim pesan menyimpan notifikasi in-app untuk penerima tanpa isi pesan dan bisa ditandai dibaca (KF34, KF36)', async () => {
    const penjualBaru = await buatAkun('Penjual Notif D');
    const pembeliBaru = await buatAkun('Pembeli Notif D');
    const idBrg = await buatBarang(penjualBaru.idAkun, `Buku Algoritma ${ACAK}`);

    const mulai = await request(app)
      .post('/api/percakapan')
      .set(sebagai(pembeliBaru.token))
      .send({ idBarang: idBrg });
    const { idPercakapan } = mulai.body.data;

    const rahasia = `RahasiaPesan-${ACAK}`;
    const kirim = await request(app)
      .post(`/api/percakapan/${idPercakapan}/pesan`)
      .set(sebagai(pembeliBaru.token))
      .send({ isi: rahasia });
    expect(kirim.status).toBe(201);

    // Baca langsung tabel notifikasi
    const { rows } = await db.query(
      'SELECT id_notifikasi, jenis, isi, status_baca FROM notifikasi WHERE id_akun = $1',
      [penjualBaru.idAkun],
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      jenis: 'pesan',
      isi: 'Pesan baru dari Pembeli Notif D',
      status_baca: false,
    });
    expect(rows[0].isi).not.toContain(rahasia);

    // GET /api/notifikasi
    const daftar = await request(app).get('/api/notifikasi').set(sebagai(penjualBaru.token));
    expect(daftar.status).toBe(200);
    expect(daftar.body.data.belumDibaca).toBe(1);
    const idNotif = daftar.body.data.daftar[0].idNotifikasi;

    // Akun lain ditolak 404 saat mencoba menandai notifikasi orang lain
    const bukanMilik = await request(app)
      .patch(`/api/notifikasi/${idNotif}/baca`)
      .set(sebagai(pembeliBaru.token));
    expect(bukanMilik.status).toBe(404);

    // Pemilik menandai dibaca
    const tandai = await request(app)
      .patch(`/api/notifikasi/${idNotif}/baca`)
      .set(sebagai(penjualBaru.token));
    expect(tandai.status).toBe(200);
    expect(tandai.body.data.belumDibaca).toBe(0);

    const cekDb = await db.query('SELECT status_baca FROM notifikasi WHERE id_notifikasi = $1', [idNotif]);
    expect(cekDb.rows[0].status_baca).toBe(true);
  });

  test('INT-TC50 non-peserta (pengguna lain dan admin) ditolak 403 saat membuka maupun mengirim pesan (UC16 Alt 3, KF35)', async () => {
    const ruang = await request(app)
      .post('/api/percakapan')
      .set(sebagai(pembeli.token))
      .send({ idBarang: idBarangUtama });
    const { idPercakapan } = ruang.body.data;

    const jumlahAwal = (await db.query('SELECT COUNT(*)::int AS j FROM pesan WHERE id_percakapan = $1', [idPercakapan]))
      .rows[0].j;

    for (const penyusup of [pihakKetiga, admin]) {
      const buka = await request(app).get(`/api/percakapan/${idPercakapan}`).set(sebagai(penyusup.token));
      expect(buka.status).toBe(403);
      expect(buka.body.sukses).toBe(false);
      expect(buka.body.data).toBeUndefined();

      const kirim = await request(app)
        .post(`/api/percakapan/${idPercakapan}/pesan`)
        .set(sebagai(penyusup.token))
        .send({ isi: 'Coba menyusup' });
      expect(kirim.status).toBe(403);
    }

    const jumlahAkhir = (await db.query('SELECT COUNT(*)::int AS j FROM pesan WHERE id_percakapan = $1', [idPercakapan]))
      .rows[0].j;
    expect(jumlahAkhir).toBe(jumlahAwal);
  });

  test('INT-TC51 daftar percakapan terurut terbaru, memuat cuplikan dan hitung belum dibaca, lalu nol setelah dibuka (UC18, KF33, KF34)', async () => {
    const penjualList = await buatAkun('Penjual Daftar D');
    const pembeliList = await buatAkun('Pembeli Daftar D');
    const brg1 = await buatBarang(penjualList.idAkun, `Barang Pertama ${ACAK}`);
    const brg2 = await buatBarang(penjualList.idAkun, `Barang Kedua ${ACAK}`);

    const r1 = (await request(app).post('/api/percakapan').set(sebagai(pembeliList.token)).send({ idBarang: brg1 }))
      .body.data.idPercakapan;
    const r2 = (await request(app).post('/api/percakapan').set(sebagai(pembeliList.token)).send({ idBarang: brg2 }))
      .body.data.idPercakapan;

    await request(app).post(`/api/percakapan/${r1}/pesan`).set(sebagai(pembeliList.token)).send({ isi: 'Pesan ruang 1' });
    // Jeda kecil agar waktu_pembaruan_terakhir ruang 2 pasti lebih baru
    await new Promise((r) => setTimeout(r, 25));
    const pesanPanjang = 'Pesan ruang kedua yang cukup panjang untuk menguji pemotongan cuplikan 80 karakter secara tepat.';
    await request(app).post(`/api/percakapan/${r2}/pesan`).set(sebagai(pembeliList.token)).send({ isi: 'Pesan awal 2' });
    await request(app).post(`/api/percakapan/${r2}/pesan`).set(sebagai(pembeliList.token)).send({ isi: pesanPanjang });

    const daftarSebelum = await request(app).get('/api/percakapan').set(sebagai(penjualList.token));
    expect(daftarSebelum.status).toBe(200);
    expect(daftarSebelum.body.data.map((d) => d.idPercakapan)).toEqual([r2, r1]);
    expect(daftarSebelum.body.data[0]).toMatchObject({
      idPercakapan: r2,
      judulBarang: `Barang Kedua ${ACAK}`,
      lawanBicara: { idAkun: pembeliList.idAkun, nama: 'Pembeli Daftar D' },
      belumDibaca: 2,
    });
    expect(daftarSebelum.body.data[0].cuplikan.isi).toBe(`${pesanPanjang.slice(0, 79)}…`);
    expect(daftarSebelum.body.data[1].belumDibaca).toBe(1);

    // Penjual membuka ruang 2 -> belumDibaca ruang 2 menjadi 0, ruang 1 tetap 1
    const bukaR2 = await request(app).get(`/api/percakapan/${r2}`).set(sebagai(penjualList.token));
    expect(bukaR2.status).toBe(200);
    expect(bukaR2.body.data.pesan).toHaveLength(2);

    const daftarSesudah = await request(app).get('/api/percakapan').set(sebagai(penjualList.token));
    expect(daftarSesudah.body.data[0].belumDibaca).toBe(0);
    expect(daftarSesudah.body.data[1].belumDibaca).toBe(1);
  });

  test('INT-TC52 tandai semua notifikasi dibaca mengubah seluruh status_baca menjadi true di tabel notifikasi (KF34)', async () => {
    const akunNotif = await buatAkun('Akun Baca Semua D');
    const brg = await buatBarang(akunNotif.idAkun, `Barang Notif Batch ${ACAK}`);
    const r = (await request(app).post('/api/percakapan').set(sebagai(pembeli.token)).send({ idBarang: brg }))
      .body.data.idPercakapan;

    await request(app).post(`/api/percakapan/${r}/pesan`).set(sebagai(pembeli.token)).send({ isi: 'Halo 1' });
    await request(app).post(`/api/percakapan/${r}/pesan`).set(sebagai(pembeli.token)).send({ isi: 'Halo 2' });

    const sebelum = await request(app).get('/api/notifikasi').set(sebagai(akunNotif.token));
    expect(sebelum.body.data.belumDibaca).toBe(2);

    const bacaSemua = await request(app).patch('/api/notifikasi/baca-semua').set(sebagai(akunNotif.token));
    expect(bacaSemua.status).toBe(200);
    expect(bacaSemua.body.data.belumDibaca).toBe(0);

    const { rows } = await db.query(
      'SELECT COUNT(*)::int AS sisa FROM notifikasi WHERE id_akun = $1 AND status_baca = false',
      [akunNotif.idAkun],
    );
    expect(rows[0].sisa).toBe(0);
  });

  test('INT-TC53 LanggananPush simpan, upsert endpoint sama, baca per akun, dan hapus pada tabel nyata (KF34)', async () => {
    const endpoint = `https://push.itbeli.uji/${ACAK}/device-1`;
    const k1 = buatKunciLanggananNyata();
    const k2 = buatKunciLanggananNyata();

    // Simpan melalui endpoint HTTP
    const simpan = await request(app)
      .post('/api/notifikasi/langganan-push')
      .set(sebagai(pembeli.token))
      .send({ endpoint, keys: k1 });
    expect(simpan.status).toBe(201);

    // Upsert endpoint sama ke akun penjual dengan kunci baru
    const upsert = await request(app)
      .post('/api/notifikasi/langganan-push')
      .set(sebagai(penjual.token))
      .send({ endpoint, keys: k2 });
    expect(upsert.status).toBe(201);

    // Endpoint http non-https ditolak 400
    const ditolak = await request(app)
      .post('/api/notifikasi/langganan-push')
      .set(sebagai(penjual.token))
      .send({ endpoint: 'http://tidak-aman.test/1', keys: k2 });
    expect(ditolak.status).toBe(400);

    // Pastikan tetap 1 baris di tabel dan pemiliknya berpindah ke penjual dengan kunci terbaru
    const { rows } = await db.query('SELECT id_akun, p256dh, auth FROM langganan_push WHERE endpoint = $1', [endpoint]);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({ id_akun: penjual.idAkun, p256dh: k2.p256dh, auth: k2.auth });

    const milikPenjual = await LanggananPush.getByAkun(penjual.idAkun);
    expect(milikPenjual.some((l) => l.endpoint === endpoint)).toBe(true);

    expect(await LanggananPush.hapusByEndpoint(endpoint)).toBe(true);
    expect(await LanggananPush.hapusByEndpoint(endpoint)).toBe(false);
  });

  test('INT-TC54 PushNotifikasiAdapter mengirim permintaan Web Push sungguhan (VAPID + aes128gcm) ke push service lokal (KF34, Algo-071)', async () => {
    const akunPush = await buatAkun('Penerima Web Push D');
    const vapid = webpush.generateVAPIDKeys();
    const kunciKlien = buatKunciLanggananNyata();
    const diterima = [];

    const { server, baseUrl } = await jalankanPushServiceLokal((req, body, res) => {
      diterima.push({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body,
      });
      res.writeHead(201);
      res.end();
    });

    const adapterAsli = {
      pub: PushNotifikasiAdapter.kunciPublikVapid,
      priv: PushNotifikasiAdapter.kunciPrivatVapid,
      sub: PushNotifikasiAdapter.subjekVapid,
    };

    const caLama = https.globalAgent.options.ca;
    https.globalAgent.options.ca = SERTIFIKAT_LOKAL.cert;

    try {
      const endpoint = `${baseUrl}/push/${ACAK}/ok`;
      await LanggananPush.simpan(akunPush.idAkun, endpoint, kunciKlien.p256dh, kunciKlien.auth);

      PushNotifikasiAdapter.kunciPublikVapid = vapid.publicKey;
      PushNotifikasiAdapter.kunciPrivatVapid = vapid.privateKey;
      PushNotifikasiAdapter.subjekVapid = 'mailto:uji@itbeli.local';

      const teksPush = `Pesan baru dari Pembeli Modul D (${ACAK})`;
      const terkirim = await PushNotifikasiAdapter.kirimPush(akunPush.idAkun, 'ITBELI', teksPush, '/percakapan');

      expect(terkirim).toBe(true);
      expect(diterima).toHaveLength(1);
      expect(diterima[0].method).toBe('POST');
      expect(diterima[0].headers.authorization).toMatch(/^vapid t=.+, k=.+$/);
      expect(diterima[0].headers['content-encoding']).toBe('aes128gcm');
      expect(diterima[0].body.length).toBeGreaterThan(0);
      // Muatan Web Push terenkripsi di kawat (tidak memuat teks polos)
      expect(diterima[0].body.toString('utf8')).not.toContain(teksPush);

      // Langganan tetap tersimpan setelah 201
      const sisa = await LanggananPush.getByAkun(akunPush.idAkun);
      expect(sisa).toHaveLength(1);
    } finally {
      https.globalAgent.options.ca = caLama;
      PushNotifikasiAdapter.kunciPublikVapid = adapterAsli.pub;
      PushNotifikasiAdapter.kunciPrivatVapid = adapterAsli.priv;
      PushNotifikasiAdapter.subjekVapid = adapterAsli.sub;
      await new Promise((r) => server.close(r));
    }
  });

  test('INT-TC55 PushNotifikasiAdapter menghapus langganan di PostgreSQL saat push service membalas 404 atau 410 (KF34, Algo-071)', async () => {
    const akunKadaluarsa = await buatAkun('Penerima Push Kedaluwarsa D');
    const vapid = webpush.generateVAPIDKeys();
    const k410 = buatKunciLanggananNyata();
    const k404 = buatKunciLanggananNyata();

    const { server, baseUrl } = await jalankanPushServiceLokal((req, _body, res) => {
      if (req.url.endsWith('/gone')) {
        res.writeHead(410);
        res.end('Gone');
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    const adapterAsli = {
      pub: PushNotifikasiAdapter.kunciPublikVapid,
      priv: PushNotifikasiAdapter.kunciPrivatVapid,
      sub: PushNotifikasiAdapter.subjekVapid,
    };

    const caLama = https.globalAgent.options.ca;
    https.globalAgent.options.ca = SERTIFIKAT_LOKAL.cert;

    try {
      await LanggananPush.simpan(akunKadaluarsa.idAkun, `${baseUrl}/push/${ACAK}/gone`, k410.p256dh, k410.auth);
      await LanggananPush.simpan(akunKadaluarsa.idAkun, `${baseUrl}/push/${ACAK}/notfound`, k404.p256dh, k404.auth);

      PushNotifikasiAdapter.kunciPublikVapid = vapid.publicKey;
      PushNotifikasiAdapter.kunciPrivatVapid = vapid.privateKey;
      PushNotifikasiAdapter.subjekVapid = 'mailto:uji@itbeli.local';

      const terkirim = await PushNotifikasiAdapter.kirimPush(akunKadaluarsa.idAkun, 'ITBELI', 'Tes hapus', '/percakapan');
      expect(terkirim).toBe(false);

      const sisa = await LanggananPush.getByAkun(akunKadaluarsa.idAkun);
      expect(sisa).toEqual([]);
    } finally {
      https.globalAgent.options.ca = caLama;
      PushNotifikasiAdapter.kunciPublikVapid = adapterAsli.pub;
      PushNotifikasiAdapter.kunciPrivatVapid = adapterAsli.priv;
      PushNotifikasiAdapter.subjekVapid = adapterAsli.sub;
      await new Promise((r) => server.close(r));
    }
  });
});
