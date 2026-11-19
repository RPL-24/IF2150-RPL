// src/tests/db/ModulC.test.js
// Pengujian integrasi Modul C (Katalog dan Pencarian) dengan komponen nyata, tanpa mock:
// HTTP (Supertest ke app Express) → katalogRoutes + Otorisasi → KatalogController (C15)
// → PencarianController (C16), FilterController (C17) → Barang (C29) → PostgreSQL 16 (itbeli_uji).
//
// Basis data uji dipakai bersama test modul lain, jadi setiap putaran memakai kategori unik
// (KATEGORI_*) supaya jumlah dan urutan hasil tidak terganggu data modul lain.
const crypto = require('crypto');
const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');
const AkunController = require('../../controllers/AkunController');

const ACAK = crypto.randomBytes(4).toString('hex');
const KATEGORI_KATALOG = `C-katalog-${ACAK}`;
const KATEGORI_STATUS = `C-status-${ACAK}`;
const KATEGORI_CARI = `C-cari-${ACAK}`;
const KATEGORI_FILTER = `C-filter-${ACAK}`;
const KATEGORI_KOSONG = `C-kosong-${ACAK}`;
const HASH_PALSU = `$2b$10$${'x'.repeat(53)}`;
const WAKTU_DASAR = new Date('2026-11-01T00:00:00Z').getTime();

async function buatAkun(nama, { diblokir = false } = {}) {
  const idAkun = crypto.randomUUID();
  await db.query(
    `INSERT INTO akun (id_akun, nama, nim, email, kata_sandi_hash, status_akun, status_blokir, setuju_kebijakan)
     VALUES ($1, $2, '13525121', $3, $4, $5, $6, true)`,
    [
      idAkun,
      nama,
      `modulc.${crypto.randomBytes(5).toString('hex')}@itb.ac.id`,
      HASH_PALSU,
      diblokir ? 'Diblokir' : 'Terverifikasi',
      diblokir,
    ],
  );
  const { token } = await AkunController.buatSesiLogin(idAkun);
  return { idAkun, token };
}

// urutanWaktu: semakin besar, semakin baru waktu unggahnya
async function buatBarang(idPenjual, data) {
  const idBarang = crypto.randomUUID();
  const waktu = new Date(WAKTU_DASAR + (data.urutanWaktu || 0) * 60 * 1000);
  await db.query(
    `INSERT INTO barang (id_barang, id_penjual, judul, harga, deskripsi_kondisi, id_kategori, id_lokasi,
                         status, waktu_unggah, waktu_ubah)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)`,
    [
      idBarang,
      idPenjual,
      data.judul,
      data.harga ?? 10000,
      data.deskripsi || 'Kondisi baik',
      data.kategori,
      data.lokasi || 'Labtek V',
      data.status || 'Tersedia',
      waktu,
    ],
  );
  return idBarang;
}

async function buatFoto(idBarang, urutan) {
  const idFoto = crypto.randomUUID();
  await db.query(
    `INSERT INTO foto_barang (id_foto, id_barang, nama_berkas, format, ukuran, urutan, path_berkas)
     VALUES ($1, $2, $3, 'png', 1024, $4, $5)`,
    [idFoto, idBarang, `foto${urutan}.png`, urutan, `/uploads/${idBarang}/foto${urutan}.png`],
  );
  return idFoto;
}

const katalog = (token, query) =>
  request(app).get('/api/katalog').query(query).set('Authorization', `Bearer ${token}`);
const detail = (token, id) => request(app).get(`/api/katalog/${id}`).set('Authorization', `Bearer ${token}`);
const judulDari = (res) => res.body.data.daftar.map((b) => b.judul);

describe('Integrasi Modul C dengan PostgreSQL (komponen nyata)', () => {
  let penjual;
  let pembeli;

  beforeAll(async () => {
    penjual = await buatAkun('Penjual Modul C');
    pembeli = await buatAkun('Pembeli Modul C');
  });

  afterAll(async () => {
    await db.pool.end();
  });

  test('INT-TC35 katalog membagi 25 listing menjadi halaman 20 dan 5, terbaru lebih dulu (UC13, KF28)', async () => {
    for (let i = 1; i <= 25; i += 1) {
      await buatBarang(penjual.idAkun, { judul: `Barang ${String(i).padStart(2, '0')}`, kategori: KATEGORI_KATALOG, urutanWaktu: i });
    }

    const hal1 = await katalog(pembeli.token, { kategori: KATEGORI_KATALOG });
    const hal2 = await katalog(pembeli.token, { kategori: KATEGORI_KATALOG, halaman: 2 });

    expect(hal1.status).toBe(200);
    expect(hal1.body.data.paginasi).toEqual({ halaman: 1, totalHalaman: 2, totalItem: 25, ukuranHalaman: 20 });
    expect(hal1.body.data.daftar).toHaveLength(20);
    expect(judulDari(hal1)[0]).toBe('Barang 25');
    expect(judulDari(hal1)[19]).toBe('Barang 06');
    expect(hal2.body.data.daftar).toHaveLength(5);
    expect(judulDari(hal2)).toEqual(['Barang 05', 'Barang 04', 'Barang 03', 'Barang 02', 'Barang 01']);
    const irisan = judulDari(hal1).filter((j) => judulDari(hal2).includes(j));
    expect(irisan).toEqual([]);
  });

  test('INT-TC36 katalog hanya memuat listing Tersedia milik akun tidak diblokir, termasuk setelah pemblokiran (UC13 Alt 2, KF30)', async () => {
    const penjualLain = await buatAkun('Penjual Akan Diblokir');
    const diblokirSejakAwal = await buatAkun('Penjual Diblokir', { diblokir: true });
    await buatBarang(penjual.idAkun, { judul: 'Tersedia A', kategori: KATEGORI_STATUS, urutanWaktu: 1 });
    await buatBarang(penjual.idAkun, { judul: 'Sudah Terjual', kategori: KATEGORI_STATUS, status: 'Terjual' });
    await buatBarang(penjual.idAkun, { judul: 'Dinonaktifkan', kategori: KATEGORI_STATUS, status: 'Dinonaktifkan' });
    await buatBarang(diblokirSejakAwal.idAkun, { judul: 'Milik Akun Diblokir', kategori: KATEGORI_STATUS });
    await buatBarang(penjualLain.idAkun, { judul: 'Tersedia B', kategori: KATEGORI_STATUS, urutanWaktu: 2 });

    const sebelum = await katalog(pembeli.token, { kategori: KATEGORI_STATUS });
    await db.query('UPDATE akun SET status_blokir = TRUE WHERE id_akun = $1', [penjualLain.idAkun]);
    const sesudah = await katalog(pembeli.token, { kategori: KATEGORI_STATUS });

    expect(judulDari(sebelum)).toEqual(['Tersedia B', 'Tersedia A']);
    expect(sebelum.body.data.paginasi.totalItem).toBe(2);
    expect(judulDari(sesudah)).toEqual(['Tersedia A']);
    expect(sesudah.body.data.paginasi.totalItem).toBe(1);
  });

  test('INT-TC37 pencarian tidak peka huruf besar, mencari di judul dan deskripsi, dan setiap kata harus muncul (UC14, KF25)', async () => {
    await buatBarang(penjual.idAkun, { judul: 'Jas Praktikum Kimia', kategori: KATEGORI_CARI });
    await buatBarang(penjual.idAkun, { judul: 'Jas Himpunan', deskripsi: 'Dipakai saat praktikum fisika', kategori: KATEGORI_CARI });
    await buatBarang(penjual.idAkun, { judul: 'Jas Hujan', kategori: KATEGORI_CARI });
    await buatBarang(penjual.idAkun, { judul: 'Diskon 50% Buku', kategori: KATEGORI_CARI });
    await buatBarang(penjual.idAkun, { judul: 'Buku 500 Soal', kategori: KATEGORI_CARI });

    const duaKata = await katalog(pembeli.token, { q: 'JAS praktikum', kategori: KATEGORI_CARI });
    const persen = await katalog(pembeli.token, { q: '50%', kategori: KATEGORI_CARI });

    expect(duaKata.status).toBe(200);
    expect(judulDari(duaKata).sort()).toEqual(['Jas Himpunan', 'Jas Praktikum Kimia']);
    expect(duaKata.body.data.kriteria.kataKunci).toBe('jas praktikum');
    expect(judulDari(persen)).toEqual(['Diskon 50% Buku']);
  });

  test('INT-TC38 filter kategori, rentang harga (inklusif), dan lokasi berlaku sekaligus (UC14, KF26)', async () => {
    await buatBarang(penjual.idAkun, { judul: 'Harga 49999', harga: 49999, kategori: KATEGORI_FILTER, lokasi: 'Labtek V' });
    await buatBarang(penjual.idAkun, { judul: 'Harga 50000', harga: 50000, kategori: KATEGORI_FILTER, lokasi: 'Labtek V' });
    await buatBarang(penjual.idAkun, { judul: 'Harga 150000', harga: 150000, kategori: KATEGORI_FILTER, lokasi: 'Labtek V' });
    await buatBarang(penjual.idAkun, { judul: 'Harga 150001', harga: 150001, kategori: KATEGORI_FILTER, lokasi: 'Labtek V' });
    await buatBarang(penjual.idAkun, { judul: 'Lokasi Lain', harga: 100000, kategori: KATEGORI_FILTER, lokasi: 'Labtek VI' });

    const res = await katalog(pembeli.token, {
      kategori: KATEGORI_FILTER,
      hargaMin: 50000,
      hargaMaks: 150000,
      lokasi: 'Labtek V',
    });

    expect(res.status).toBe(200);
    expect(judulDari(res).sort()).toEqual(['Harga 150000', 'Harga 50000']);
  });

  test('INT-TC39 pengurutan termurah dan termahal mengikuti harga (UC14, KF27)', async () => {
    const termurah = await katalog(pembeli.token, { kategori: KATEGORI_FILTER, urut: 'termurah' });
    const termahal = await katalog(pembeli.token, { kategori: KATEGORI_FILTER, urut: 'termahal' });

    const hargaMurah = termurah.body.data.daftar.map((b) => b.harga);
    const hargaMahal = termahal.body.data.daftar.map((b) => b.harga);
    expect(hargaMurah).toEqual([49999, 50000, 100000, 150000, 150001]);
    expect(hargaMahal).toEqual([150001, 150000, 100000, 50000, 49999]);
  });

  test('INT-TC40 kriteria tanpa hasil membalas daftar kosong dan pesan "Barang tidak ditemukan." (UC14 Alt 1, KF29)', async () => {
    const res = await katalog(pembeli.token, { q: 'zzzqqq', kategori: KATEGORI_KOSONG });

    expect(res.status).toBe(200);
    expect(res.body.data.daftar).toEqual([]);
    expect(res.body.data.paginasi).toMatchObject({ totalItem: 0, totalHalaman: 1 });
    expect(res.body.pesan).toBe('Barang tidak ditemukan.');
  });

  test('INT-TC41 rentang harga terbalik dan parameter tidak sah ditolak 400 (UC14 Alt 2)', async () => {
    const terbalik = await katalog(pembeli.token, { hargaMin: 200000, hargaMaks: 50000 });
    const urutan = await katalog(pembeli.token, { urut: 'acak' });

    expect(terbalik.status).toBe(400);
    expect(terbalik.body).toEqual({
      sukses: false,
      pesan: 'Harga minimum tidak boleh lebih besar dari harga maksimum.',
    });
    expect(urutan.status).toBe(400);
  });

  test('INT-TC42 detail memuat seluruh atribut, foto berurutan, identitas penjual, dan penanda pemilik (UC15, UC15 Alt 1, KF17)', async () => {
    const idBarang = await buatBarang(penjual.idAkun, {
      judul: 'Kalkulator Casio fx-991',
      harga: 150000,
      deskripsi: 'Mulus, lengkap dengan dus',
      kategori: 'Kalkulator',
      lokasi: 'Labtek VI',
    });
    const fotoKedua = await buatFoto(idBarang, 1);
    const fotoPertama = await buatFoto(idBarang, 0);

    const olehPembeli = await detail(pembeli.token, idBarang);
    const olehPemilik = await detail(penjual.token, idBarang);

    expect(olehPembeli.status).toBe(200);
    expect(olehPembeli.body.data).toMatchObject({
      idBarang,
      judul: 'Kalkulator Casio fx-991',
      harga: 150000,
      deskripsiKondisi: 'Mulus, lengkap dengan dus',
      idKategori: 'Kalkulator',
      idLokasi: 'Labtek VI',
      status: 'Tersedia',
      penjual: { idAkun: penjual.idAkun, nama: 'Penjual Modul C' },
      milikSendiri: false,
    });
    expect(olehPembeli.body.data.daftarFoto.map((f) => f.idFoto)).toEqual([fotoPertama, fotoKedua]);
    expect(olehPemilik.body.data.milikSendiri).toBe(true);
  });

  test('INT-TC43 detail listing Terjual tetap tampil, sedangkan yang dinonaktifkan, milik akun diblokir, atau tidak ada membalas 404 (UC15 Alt 2, Alt 3)', async () => {
    const diblokir = await buatAkun('Penjual Diblokir Detail', { diblokir: true });
    const terjual = await buatBarang(penjual.idAkun, { judul: 'Detail Terjual', kategori: 'Kalkulator', status: 'Terjual' });
    const nonaktif = await buatBarang(penjual.idAkun, { judul: 'Detail Nonaktif', kategori: 'Kalkulator', status: 'Dinonaktifkan' });
    const milikDiblokir = await buatBarang(diblokir.idAkun, { judul: 'Detail Milik Diblokir', kategori: 'Kalkulator' });

    const resTerjual = await detail(pembeli.token, terjual);
    const resNonaktif = await detail(pembeli.token, nonaktif);
    const resDiblokir = await detail(pembeli.token, milikDiblokir);
    const resTidakAda = await detail(pembeli.token, crypto.randomUUID());
    const resIdSalah = await detail(pembeli.token, 'bukan-uuid');

    expect(resTerjual.status).toBe(200);
    expect(resTerjual.body.data.status).toBe('Terjual');
    for (const res of [resNonaktif, resDiblokir, resTidakAda]) {
      expect(res.status).toBe(404);
      expect(res.body.pesan).toBe('Listing tidak ditemukan atau sudah tidak tersedia.');
    }
    expect(resIdSalah.status).toBe(400);
  });

  test('INT-TC44 katalog dan detail menolak permintaan tanpa sesi login yang sah (401)', async () => {
    const tanpaToken = await request(app).get('/api/katalog');
    const tokenPalsu = await katalog('token-palsu', {});
    const detailTanpaToken = await request(app).get(`/api/katalog/${crypto.randomUUID()}`);

    expect(tanpaToken.status).toBe(401);
    expect(tokenPalsu.status).toBe(401);
    expect(detailTanpaToken.status).toBe(401);
  });

  test('INT-TC45 nomor halaman sangat besar tidak menimbulkan galat server (batas)', async () => {
    const besar = await katalog(pembeli.token, { kategori: KATEGORI_KATALOG, halaman: 100000 });
    const sangatBesar = await katalog(pembeli.token, { kategori: KATEGORI_KATALOG, halaman: '99999999999999999999' });

    expect(besar.status).toBe(200);
    expect(besar.body.data.daftar).toEqual([]);
    // Harapan: ditolak 400 atau dibalas daftar kosong, bukan 500
    expect(sangatBesar.status).toBeLessThan(500);
  });
});
