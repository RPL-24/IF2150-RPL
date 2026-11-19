// src/tests/unit/BarangKatalog.test.js
// Pengujian unit operasi katalog C29 Barang (Modul C): getKatalog dan getDetailKatalog.
// Klien basis data diganti tiruan yang merekam teks SQL dan parameternya.
// Pengujian dengan PostgreSQL sungguhan ada di src/tests/db/ModulC.test.js.
const Barang = require('../../models/Barang');

// Klien tiruan: kueri pertama (COUNT) membalas total, kueri kedua membalas baris data.
function klienKatalog(total, baris = []) {
  return {
    query: jest
      .fn()
      .mockResolvedValueOnce({ rows: [{ total }] })
      .mockResolvedValueOnce({ rows: baris }),
  };
}

const BARIS_KATALOG = {
  id_barang: 'b1',
  id_penjual: 'p1',
  judul: 'Kalkulator Casio fx-991',
  harga: '150000.00',
  id_kategori: 'Kalkulator',
  id_lokasi: 'Labtek V',
  status: 'Tersedia',
  waktu_unggah: new Date('2026-11-01T10:00:00Z'),
  nama_penjual: 'Penjual Uji',
  foto_utama: '/uploads/b1/1.png',
};

describe('C29 Barang.getKatalog', () => {
  test('C29-UT05 kriteria bawaan: hanya Tersedia, akun tidak diblokir, terbaru, 20 baris dari offset 0', async () => {
    const klien = klienKatalog(1, [BARIS_KATALOG]);

    await Barang.getKatalog({}, klien);

    const [sqlHitung, nilaiHitung] = klien.query.mock.calls[0];
    expect(sqlHitung).toMatch(/SELECT COUNT\(\*\)::int AS total/);
    expect(sqlHitung).toContain('b.status = $1');
    expect(sqlHitung).toContain('a.status_blokir = FALSE');
    expect(nilaiHitung).toEqual(['Tersedia']);

    const [sqlData, nilaiData] = klien.query.mock.calls[1];
    expect(sqlData).toContain('ORDER BY b.waktu_unggah DESC, b.id_barang');
    expect(sqlData).toContain('LIMIT $2 OFFSET $3');
    expect(nilaiData).toEqual(['Tersedia', 20, 0]);
  });

  test('C29-UT06 memetakan baris menjadi objek Barang beserta fotoUtama dan namaPenjual', async () => {
    const { daftar, total } = await Barang.getKatalog({}, klienKatalog(1, [BARIS_KATALOG]));

    expect(total).toBe(1);
    expect(daftar).toHaveLength(1);
    expect(daftar[0]).toBeInstanceOf(Barang);
    expect(daftar[0]).toMatchObject({
      idBarang: 'b1',
      harga: 150000,
      idKategori: 'Kalkulator',
      idLokasi: 'Labtek V',
      fotoUtama: '/uploads/b1/1.png',
      namaPenjual: 'Penjual Uji',
    });
  });

  test('C29-UT07 setiap kata kunci menjadi syarat ILIKE pada judul atau deskripsi, digabung dengan AND (KF25)', async () => {
    const klien = klienKatalog(0);

    await Barang.getKatalog({ daftarKata: ['jas', 'praktikum'] }, klien);

    const [sql, nilai] = klien.query.mock.calls[0];
    expect(sql).toContain('(b.judul ILIKE $2 OR b.deskripsi_kondisi ILIKE $2)');
    expect(sql).toContain('(b.judul ILIKE $3 OR b.deskripsi_kondisi ILIKE $3)');
    expect(nilai).toEqual(['Tersedia', '%jas%', '%praktikum%']);
  });

  test('C29-UT08 karakter %, _, dan \\ pada kata kunci diloloskan agar dicocokkan apa adanya', async () => {
    const klien = klienKatalog(0);

    await Barang.getKatalog({ daftarKata: ['50%', 'a_b', 'c\\d'] }, klien);

    expect(klien.query.mock.calls[0][1]).toEqual(['Tersedia', '%50\\%%', '%a\\_b%', '%c\\\\d%']);
  });

  test('C29-UT09 seluruh filter aktif digabung dengan AND dan nilainya dikirim sebagai parameter (KF26)', async () => {
    const klien = klienKatalog(0);

    await Barang.getKatalog(
      { kategori: 'Kalkulator', lokasi: 'Labtek V', hargaMin: 50000, hargaMaks: 200000 },
      klien,
    );

    const [sql, nilai] = klien.query.mock.calls[0];
    expect(sql).toContain('b.id_kategori = $2');
    expect(sql).toContain('b.id_lokasi = $3');
    expect(sql).toContain('b.harga >= $4');
    expect(sql).toContain('b.harga <= $5');
    expect(nilai).toEqual(['Tersedia', 'Kalkulator', 'Labtek V', 50000, 200000]);
  });

  test('C29-UT10 harga minimum 0 tetap dipakai sebagai syarat (batas)', async () => {
    const klien = klienKatalog(0);

    await Barang.getKatalog({ hargaMin: 0 }, klien);

    expect(klien.query.mock.calls[0][0]).toContain('b.harga >= $2');
    expect(klien.query.mock.calls[0][1]).toEqual(['Tersedia', 0]);
  });

  test.each([
    ['termurah', 'ORDER BY b.harga ASC, b.waktu_unggah DESC, b.id_barang'],
    ['termahal', 'ORDER BY b.harga DESC, b.waktu_unggah DESC, b.id_barang'],
  ])('C29-UT11 urutan "%s" dipetakan ke klausa tetap (KF27)', async (urut, klausa) => {
    const klien = klienKatalog(0);

    await Barang.getKatalog({ urut }, klien);

    expect(klien.query.mock.calls[1][0]).toContain(klausa);
  });

  test('C29-UT12 urutan di luar daftar tetap jatuh ke "terbaru" dan tidak masuk ke SQL', async () => {
    const klien = klienKatalog(0);

    await Barang.getKatalog({ urut: 'b.harga; DROP TABLE barang' }, klien);

    const sqlData = klien.query.mock.calls[1][0];
    expect(sqlData).toContain('ORDER BY b.waktu_unggah DESC, b.id_barang');
    expect(sqlData).not.toContain('DROP TABLE');
  });

  test('C29-UT13 batas dan offset paginasi dikirim sebagai parameter (KF28)', async () => {
    const klien = klienKatalog(45);

    await Barang.getKatalog({ kategori: 'Buku kuliah', batas: 20, offset: 40 }, klien);

    expect(klien.query.mock.calls[1][0]).toContain('LIMIT $3 OFFSET $4');
    expect(klien.query.mock.calls[1][1]).toEqual(['Tersedia', 'Buku kuliah', 20, 40]);
  });
});

describe('C29 Barang.getDetailKatalog', () => {
  test('C29-UT14 mengembalikan detail beserta daftar foto dan identitas penjual (KF17)', async () => {
    const klien = {
      query: jest.fn().mockResolvedValue({
        rows: [
          {
            id_barang: 'b1',
            id_penjual: 'p1',
            judul: 'Jas Praktikum Kimia',
            harga: '75000.00',
            deskripsi_kondisi: 'Bekas satu semester',
            id_kategori: 'Jas praktikum',
            id_lokasi: 'Labtek VI',
            status: 'Terjual',
            nama_penjual: 'Penjual Uji',
            daftar_foto: [
              { idFoto: 'f1', pathBerkas: '/uploads/b1/1.png' },
              { idFoto: 'f2', pathBerkas: '/uploads/b1/2.png' },
            ],
          },
        ],
      }),
    };

    const barang = await Barang.getDetailKatalog('b1', klien);

    const [sql, nilai] = klien.query.mock.calls[0];
    expect(sql).toContain('b.status IN ($2, $3)');
    expect(sql).toContain('a.status_blokir = FALSE');
    expect(nilai).toEqual(['b1', 'Tersedia', 'Terjual']);
    expect(barang).toMatchObject({
      idBarang: 'b1',
      harga: 75000,
      deskripsiKondisi: 'Bekas satu semester',
      status: 'Terjual',
      penjual: { idAkun: 'p1', nama: 'Penjual Uji' },
    });
    expect(barang.daftarFoto.map((f) => f.idFoto)).toEqual(['f1', 'f2']);
  });

  test('C29-UT15 mengembalikan null bila listing tidak ada, dinonaktifkan, atau milik akun diblokir', async () => {
    const klien = { query: jest.fn().mockResolvedValue({ rows: [] }) };

    await expect(Barang.getDetailKatalog('tidak-ada', klien)).resolves.toBeNull();
  });
});
