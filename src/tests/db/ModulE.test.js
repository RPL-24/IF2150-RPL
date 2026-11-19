// src/tests/db/ModulE.test.js
// Pengujian integrasi Modul E (Laporan & Moderasi) dengan komponen nyata, tanpa mock:
// PostgreSQL 16 (basis data itbeli_uji), folder src/uploads/ di disk, Mailpit sebagai server SMTP,
// dan Vercel Blob bila BLOB_TOKEN_UJI diisi.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');
const AkunController = require('../../controllers/AkunController');
const LaporanController = require('../../controllers/LaporanController');
const ModerasiController = require('../../controllers/ModerasiController');
const Barang = require('../../models/Barang');
const FotoBarang = require('../../models/FotoBarang');
const Kriptografi = require('../../pendukung/Kriptografi');
const PenyimpananBerkas = require('../../penyimpanan/PenyimpananBerkas');

const MAILPIT = process.env.MAILPIT_URL || 'http://localhost:8025';
const DIR_UPLOADS = path.join(__dirname, '..', '..', 'uploads');
// PNG 1x1 piksel yang sah
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);
const BUKTI = () => ({ originalname: 'bukti.png', mimetype: 'image/png', size: PNG.length, buffer: PNG });

const surelBaru = (awalan) => `${awalan}.${crypto.randomBytes(5).toString('hex')}@itb.ac.id`;
let hashKataSandi;

// Akun terverifikasi langsung di tabel akun, beserta token sesi aktif dari AkunController
async function buatAkun(peran = 'Pengguna') {
  const idAkun = crypto.randomUUID();
  const email = surelBaru(peran === 'Admin' ? 'admin' : 'pengguna');
  await db.query(
    `INSERT INTO akun (id_akun, nama, nim, email, kata_sandi_hash, status_akun, status_blokir, peran, setuju_kebijakan)
     VALUES ($1, $2, '13599999', $3, $4, 'Terverifikasi', false, $5, true)`,
    [idAkun, `${peran} Uji`, email, hashKataSandi, peran],
  );
  const { token } = await AkunController.buatSesiLogin(idAkun);
  return { idAkun, email, token };
}

async function buatListing(idPenjual, judul = 'Kalkulator Casio fx-991') {
  return Barang.simpan({
    idPenjual, judul, harga: 150000, deskripsiKondisi: 'Masih berfungsi', idKategori: 'Kalkulator', idLokasi: 'Labtek V',
  });
}

async function satu(kueri, nilai) {
  const { rows } = await db.query(kueri, nilai);
  return rows;
}

const pathAbsolut = (p) => path.join(DIR_UPLOADS, p.replace(/^\/uploads\//, ''));

async function surelUntuk(tujuan) {
  for (let i = 0; i < 25; i += 1) {
    const daftar = await (await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${tujuan}"`)}`)).json();
    if (daftar.messages.length > 0) return (await fetch(`${MAILPIT}/api/v1/message/${daftar.messages[0].ID}`)).json();
    await new Promise((r) => { setTimeout(r, 200); });
  }
  throw new Error(`Tidak ada surel untuk ${tujuan} di Mailpit`);
}

describe('Integrasi Modul E dengan PostgreSQL, disk, Mailpit, dan Vercel Blob (komponen nyata)', () => {
  const folderDibuat = [];

  beforeAll(async () => {
    hashKataSandi = await Kriptografi.hash('rahasia123');
  });

  afterAll(async () => {
    folderDibuat.forEach((id) => fs.rmSync(path.join(DIR_UPLOADS, id), { recursive: true, force: true }));
    await db.pool.end();
  });

  test('INT-TC24 buatLaporan menyimpan laporan Baru, metadata bukti, berkas di disk, dan log audit penerimaan', async () => {
    const pelapor = await buatAkun();

    const hasil = await LaporanController.buatLaporan(
      pelapor.token,
      { objekDilaporkan: 'brg-uji-24', jenisPelanggaran: 'Penipuan', teksAlasan: 'Penjual meminta transfer di muka' },
      [BUKTI()],
    );

    expect(hasil).toMatchObject({ berhasil: true, data: { statusPenanganan: 'Baru' } });
    const { idLaporan } = hasil.data;
    folderDibuat.push(idLaporan);
    const [laporan] = await satu('SELECT * FROM laporan WHERE id_laporan = $1', [idLaporan]);
    expect(laporan).toMatchObject({ id_pelapor: pelapor.idAkun, status_penanganan: 'Baru', jenis_pelanggaran: 'Penipuan' });
    const bukti = await satu('SELECT * FROM bukti_laporan WHERE id_laporan = $1', [idLaporan]);
    expect(bukti).toHaveLength(1);
    expect(fs.readFileSync(pathAbsolut(bukti[0].path_berkas))).toEqual(PNG);
    const log = await satu('SELECT * FROM log_audit WHERE id_laporan = $1', [idLaporan]);
    expect(log.map((l) => [l.identitas_aktor, l.tindakan])).toEqual([[pelapor.idAkun, 'Penerimaan laporan']]);
  });

  test('INT-TC25 penyimpanan bukti gagal di tengah transaksi → GALAT_SERVER dan tidak ada baris baru di laporan maupun log audit', async () => {
    const pelapor = await buatAkun();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Berkas lolos validasi (PNG, ukuran > 0) tetapi tidak membawa isi, sehingga PenyimpananBerkas gagal menulis
    const hasil = await LaporanController.buatLaporan(
      pelapor.token,
      { objekDilaporkan: 'brg-uji-25', jenisPelanggaran: 'Penipuan', teksAlasan: 'Alasan' },
      [{ originalname: 'kosong.png', mimetype: 'image/png', size: 10 }],
    );

    console.error.mockRestore();
    expect(hasil).toMatchObject({ berhasil: false, kodePesan: 'GALAT_SERVER' });
    expect(await satu('SELECT 1 FROM laporan WHERE id_pelapor = $1', [pelapor.idAkun])).toHaveLength(0);
    expect(await satu('SELECT 1 FROM log_audit WHERE identitas_aktor = $1', [pelapor.idAkun])).toHaveLength(0);
  });

  test('INT-TC26 ubahStatusLaporan Baru ke Diproses memperbarui status dan waktu perubahan serta menambah tepat satu log audit', async () => {
    const pelapor = await buatAkun();
    const admin = await buatAkun('Admin');
    const { data } = await LaporanController.buatLaporan(pelapor.token, { objekDilaporkan: 'brg-uji-26', jenisPelanggaran: 'Konten tidak pantas', teksAlasan: 'Foto tidak pantas' }, [BUKTI()]);
    folderDibuat.push(data.idLaporan);
    const [sebelum] = await satu('SELECT waktu_perubahan FROM laporan WHERE id_laporan = $1', [data.idLaporan]);

    expect(await ModerasiController.ubahStatusLaporan(admin.token, data.idLaporan, 'Diproses')).toBe(true);
    expect(await ModerasiController.ubahStatusLaporan(admin.token, data.idLaporan, 'Baru')).toBe(false);

    const [sesudah] = await satu('SELECT status_penanganan, waktu_perubahan FROM laporan WHERE id_laporan = $1', [data.idLaporan]);
    expect(sesudah.status_penanganan).toBe('Diproses');
    expect(sesudah.waktu_perubahan.getTime()).toBeGreaterThan(sebelum.waktu_perubahan.getTime());
    const log = await satu('SELECT identitas_aktor, tindakan FROM log_audit WHERE id_laporan = $1 ORDER BY waktu', [data.idLaporan]);
    expect(log.map((l) => l.tindakan)).toEqual(['Penerimaan laporan', 'Perubahan status laporan menjadi Diproses']);
    expect(log[1].identitas_aktor).toBe(admin.idAkun);
  });

  test('INT-TC27 blokirAkun dalam satu transaksi: akun diblokir, listing dinonaktifkan, sesi dicabut, laporan Selesai, log admin dan audit tercatat', async () => {
    const pelapor = await buatAkun();
    const penjual = await buatAkun();
    const admin = await buatAkun('Admin');
    const listing = [await buatListing(penjual.idAkun), await buatListing(penjual.idAkun, 'Jas lab ukuran M')];
    const { data } = await LaporanController.buatLaporan(pelapor.token, { objekDilaporkan: listing[0], jenisPelanggaran: 'Penipuan', teksAlasan: 'Penipuan' }, [BUKTI()]);
    folderDibuat.push(data.idLaporan);

    expect(await ModerasiController.blokirAkun(admin.token, data.idLaporan, penjual.idAkun, 'Penipuan berulang')).toBe(true);

    const [akun] = await satu('SELECT status_akun, status_blokir FROM akun WHERE id_akun = $1', [penjual.idAkun]);
    expect(akun).toEqual({ status_akun: 'Diblokir', status_blokir: true });
    const status = await satu('SELECT status FROM barang WHERE id_penjual = $1', [penjual.idAkun]);
    expect(status.map((b) => b.status)).toEqual(['Dinonaktifkan', 'Dinonaktifkan']);
    expect(await satu('SELECT 1 FROM sesi_login WHERE id_akun = $1 AND status_aktif', [penjual.idAkun])).toHaveLength(0);
    const [laporan] = await satu('SELECT status_penanganan FROM laporan WHERE id_laporan = $1', [data.idLaporan]);
    expect(laporan.status_penanganan).toBe('Selesai');
    const [logAdmin] = await satu('SELECT * FROM log_admin WHERE objek_ditindak = $1', [penjual.idAkun]);
    expect(logAdmin).toMatchObject({ id_admin: admin.idAkun, jenis_tindakan: 'BLOKIR_AKUN', alasan: 'Penipuan berulang' });
    const logAudit = await satu('SELECT tindakan FROM log_audit WHERE id_laporan = $1 ORDER BY waktu', [data.idLaporan]);
    expect(logAudit.map((l) => l.tindakan)).toContain(`Pemblokiran akun: ${penjual.idAkun}`);
    expect((await AkunController.login(penjual.email, 'rahasia123')).kodePesan).toBe('AKUN_DIBLOKIR');
  });

  test('INT-TC28 galat di tengah blokirAkun (ID laporan tidak ada) → transaksi dibatalkan, akun, listing, dan sesi tidak berubah', async () => {
    const penjual = await buatAkun();
    const admin = await buatAkun('Admin');
    await buatListing(penjual.idAkun);

    // INSERT ke log_audit melanggar foreign key id_laporan, setelah akun dan listing sempat diubah di dalam transaksi
    await expect(ModerasiController.blokirAkun(admin.token, crypto.randomUUID(), penjual.idAkun, 'Uji rollback')).rejects.toThrow();

    const [akun] = await satu('SELECT status_blokir FROM akun WHERE id_akun = $1', [penjual.idAkun]);
    expect(akun.status_blokir).toBe(false);
    const [barang] = await satu('SELECT status FROM barang WHERE id_penjual = $1', [penjual.idAkun]);
    expect(barang.status).toBe('Tersedia');
    expect(await satu('SELECT 1 FROM sesi_login WHERE id_akun = $1 AND status_aktif', [penjual.idAkun])).toHaveLength(1);
    expect(await satu('SELECT 1 FROM log_admin WHERE objek_ditindak = $1', [penjual.idAkun])).toHaveLength(0);
  });

  test('INT-TC29 bukaBlokirAkun mengaktifkan akun, memulihkan listing ke katalog, dan mencatat BUKA_BLOKIR', async () => {
    const penjual = await buatAkun();
    const admin = await buatAkun('Admin');
    const idBarang = await buatListing(penjual.idAkun, 'Buku Kalkulus Purcell');
    await ModerasiController.blokirAkun(admin.token, null, penjual.idAkun, 'Penipuan');
    expect((await Barang.getKatalog({ daftarKata: ['purcell'] })).daftar.map((b) => b.idBarang)).not.toContain(idBarang);

    expect(await ModerasiController.bukaBlokirAkun(admin.token, penjual.idAkun, 'Banding diterima')).toBe(true);

    const [akun] = await satu('SELECT status_akun, status_blokir FROM akun WHERE id_akun = $1', [penjual.idAkun]);
    expect(akun).toEqual({ status_akun: 'Terverifikasi', status_blokir: false });
    expect((await Barang.getKatalog({ daftarKata: ['purcell'] })).daftar.map((b) => b.idBarang)).toContain(idBarang);
    const log = await satu('SELECT jenis_tindakan, alasan FROM log_admin WHERE objek_ditindak = $1 ORDER BY waktu', [penjual.idAkun]);
    expect(log).toEqual([
      { jenis_tindakan: 'BLOKIR_AKUN', alasan: 'Penipuan' },
      { jenis_tindakan: 'BUKA_BLOKIR', alasan: 'Banding diterima' },
    ]);
  });

  test('INT-TC30 hapusListingDilaporkan menghapus baris barang dan foto, berkas foto di disk, dan mencatat HAPUS_LISTING', async () => {
    const penjual = await buatAkun();
    const pelapor = await buatAkun();
    const admin = await buatAkun('Admin');
    const idBarang = await buatListing(penjual.idAkun);
    folderDibuat.push(idBarang);
    const daftarPath = await PenyimpananBerkas.simpan(idBarang, [BUKTI(), BUKTI()]);
    await FotoBarang.simpan(idBarang, 'a.png', 'png', PNG.length, 1, daftarPath[0]);
    await FotoBarang.simpan(idBarang, 'b.png', 'png', PNG.length, 2, daftarPath[1]);
    const { data } = await LaporanController.buatLaporan(pelapor.token, { objekDilaporkan: idBarang, jenisPelanggaran: 'Penipuan', teksAlasan: 'Barang palsu' }, [BUKTI()]);
    folderDibuat.push(data.idLaporan);

    expect(await ModerasiController.hapusListingDilaporkan(admin.token, data.idLaporan, idBarang, 'Barang palsu')).toBe(true);

    expect(await satu('SELECT 1 FROM barang WHERE id_barang = $1', [idBarang])).toHaveLength(0);
    expect(await satu('SELECT 1 FROM foto_barang WHERE id_barang = $1', [idBarang])).toHaveLength(0);
    daftarPath.forEach((p) => expect(fs.existsSync(pathAbsolut(p))).toBe(false));
    const [log] = await satu('SELECT jenis_tindakan, alasan FROM log_admin WHERE objek_ditindak = $1', [idBarang]);
    expect(log).toEqual({ jenis_tindakan: 'HAPUS_LISTING', alasan: 'Barang palsu' });
  });

  test('INT-TC31 POST /api/laporan multipart: berkas bukti tersimpan di src/uploads/<idLaporan>/ dan dapat diunduh lewat /uploads', async () => {
    const pelapor = await buatAkun();

    const res = await request(app)
      .post('/api/laporan')
      .set('Authorization', `Bearer ${pelapor.token}`)
      .field('objekDilaporkan', 'brg-uji-31')
      .field('jenisPelanggaran', 'Bug atau masalah teknis')
      .field('teksAlasan', 'Tombol simpan tidak merespons')
      .attach('bukti', PNG, { filename: 'tangkapan.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    const { idLaporan } = res.body.data;
    folderDibuat.push(idLaporan);
    const [bukti] = await satu('SELECT path_berkas FROM bukti_laporan WHERE id_laporan = $1', [idLaporan]);
    expect(bukti.path_berkas).toMatch(new RegExp(`^/uploads/${idLaporan}/[0-9a-f-]{36}\\.png$`));
    const unduh = await request(app).get(bukti.path_berkas);
    expect(unduh.status).toBe(200);
    expect(Buffer.from(unduh.body)).toEqual(PNG);
  });

  const adaTokenBlob = Boolean(process.env.BLOB_TOKEN_UJI);
  (adaTokenBlob ? test : test.skip)('INT-TC32 PenyimpananBerkas mode Vercel Blob: URL publik dapat diunduh setelah simpan dan hilang setelah hapus', async () => {
    const blob = new PenyimpananBerkas.constructor(DIR_UPLOADS, process.env.BLOB_TOKEN_UJI);
    const [url] = await blob.simpan(`uji-${crypto.randomUUID()}`, [BUKTI()]);
    expect((await fetch(url)).status).toBe(200);
    expect(await blob.hapus([url])).toBe(true);
    expect((await fetch(url, { cache: 'no-store' })).status).toBe(404);
  });

  test('INT-TC33 blokirAkun mengirim surel penangguhan beserta alasannya ke kotak masuk server SMTP', async () => {
    const penjual = await buatAkun();
    const admin = await buatAkun('Admin');

    await ModerasiController.blokirAkun(admin.token, null, penjual.idAkun, 'Menjual barang terlarang');

    const surel = await surelUntuk(penjual.email);
    expect(surel.Subject).toBe('Pemberitahuan Penangguhan Akun ITBELI');
    expect(surel.Text).toContain('Menjual barang terlarang');
  });

  test('INT-TC34 GET /api/admin/laporan: token admin → 200 berisi laporan; token pengguna biasa → 403 (KF56)', async () => {
    const admin = await buatAkun('Admin');
    const pengguna = await buatAkun();

    const resAdmin = await request(app).get('/api/admin/laporan').set('Authorization', `Bearer ${admin.token}`);
    const resPengguna = await request(app).get('/api/admin/laporan').set('Authorization', `Bearer ${pengguna.token}`);

    expect(resAdmin.status).toBe(200);
    expect(resAdmin.body.data.length).toBeGreaterThan(0);
    expect(resPengguna.status).toBe(403);
  });
});
