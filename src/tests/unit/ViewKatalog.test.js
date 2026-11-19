// src/tests/unit/ViewKatalog.test.js
// Pengujian unit kelas View Modul C bertingkat Sedang:
//   C05 HalamanKatalog (validasi harga sisi klien, kriteria di URL, keadaan kosong)
//   C07 HalamanDetailBarang (pilihan tombol aksi menurut pemilik/status, penolakan ID tidak sah)
// Skrip View dijalankan di konteks vm dengan DOM, Api, dan objek peramban tiruan secukupnya
// (pola yang sama dengan HalamanOtentikasi.test.js).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baca = (nama) => fs.readFileSync(path.join(__dirname, '../../views/js', nama), 'utf8');
const KODE_LISTING_UI = baca('ListingUI.js');
const KODE_KATALOG = baca('HalamanKatalog.js');
const KODE_DETAIL = baca('HalamanDetailBarang.js');

function buatElemen(tag = 'div') {
  return {
    tagName: tag.toUpperCase(),
    children: [],
    hidden: false,
    disabled: false,
    textContent: '',
    className: '',
    value: '',
    href: '',
    attrs: {},
    classList: { add() {}, remove() {}, toggle() {} },
    append(...anak) { this.children.push(...anak); },
    replaceChildren(...anak) { this.children = anak; },
    setAttribute(k, v) { this.attrs[k] = v; },
    querySelectorAll() { return []; },
    addEventListener() {},
    focus() {},
  };
}

function siapkanKonteks({ search = '' } = {}) {
  const elemenPerId = {};
  const document = {
    getElementById: (id) => (elemenPerId[id] ??= buatElemen()),
    createElement: (tag) => buatElemen(tag),
    addEventListener() {},
    body: buatElemen('body'),
  };
  const Api = {
    getToken: () => 'tkn',
    kirim: jest.fn(),
    hapusSesi: jest.fn(),
  };
  const konteks = vm.createContext({
    document,
    Api,
    location: { search, assign: jest.fn(), replace: jest.fn() },
    history: { pushState: jest.fn() },
    window: { scrollTo: jest.fn(), addEventListener() {}, matchMedia: () => ({ matches: false }) },
    sessionStorage: { getItem: () => null, removeItem() {} },
    LayoutKatalog: { pasangPencarian: () => null },
    KartuProduk: { buat: (b) => ({ kartu: b.judul }) },
    URLSearchParams,
    Intl,
    Date,
    setTimeout,
    clearTimeout,
  });
  return { konteks, Api, el: document.getElementById };
}

function muatKatalog(opsi) {
  const k = siapkanKonteks(opsi);
  vm.runInContext(`${KODE_LISTING_UI}\n${KODE_KATALOG}\nthis.HalamanKatalog = HalamanKatalog;`, k.konteks);
  const halaman = new k.konteks.HalamanKatalog();
  // Formulir filter tiruan (diisi oleh mulai() pada halaman sungguhan)
  halaman.form = {
    elements: {
      kategori: { value: '' }, lokasi: { value: '' }, hargaMin: { value: '' }, hargaMaks: { value: '' }, urut: { value: '' },
    },
  };
  return { ...k, halaman };
}

function muatDetail(opsi) {
  const k = siapkanKonteks(opsi);
  vm.runInContext(`${KODE_LISTING_UI}\n${KODE_DETAIL}\nthis.HalamanDetailBarang = HalamanDetailBarang;`, k.konteks);
  return { ...k, halaman: new k.konteks.HalamanDetailBarang() };
}

const tunggu = () => new Promise((r) => { setTimeout(r, 0); });
const teksAnak = (elemen) => elemen.children.map((c) => c.textContent);

const DATA_KATALOG = (daftar, totalItem, halaman = 1) => ({
  sukses: true,
  data: {
    daftar,
    paginasi: { halaman, totalHalaman: Math.max(1, Math.ceil(totalItem / 20)), totalItem, ukuranHalaman: 20 },
    kriteria: { kataKunci: '' },
  },
});

describe('C05 HalamanKatalog', () => {
  test('C05-UT01 terapkan: kriteria sah ditulis ke URL lalu dikirim ke GET /api/katalog', async () => {
    const { halaman, Api, konteks } = muatKatalog();
    Api.kirim.mockResolvedValue(DATA_KATALOG([{ judul: 'Jas Praktikum Kimia' }], 1));

    halaman.terapkan({ q: 'jas', kategori: 'Jas praktikum', hargaMin: '50000', hargaMaks: '150000', urut: 'termurah' });
    await tunggu();

    const query = 'q=jas&kategori=Jas+praktikum&hargaMin=50000&hargaMaks=150000&urut=termurah';
    expect(konteks.history.pushState).toHaveBeenCalledWith(null, '', `/katalog?${query}`);
    expect(Api.kirim).toHaveBeenCalledWith('GET', `/api/katalog?${query}`, undefined);
    expect(halaman.form.elements.kategori.value).toBe('Jas praktikum');
  });

  test('C05-UT02 terapkan: harga minimum lebih besar dari maksimum ditolak tanpa mengubah URL dan tanpa memanggil API', async () => {
    const { halaman, Api, konteks, el } = muatKatalog();

    halaman.terapkan({ hargaMin: '200000', hargaMaks: '50000' });
    await tunggu();

    expect(el('galat-umum')).toMatchObject({ hidden: false, textContent: 'Harga minimum tidak boleh lebih besar dari harga maksimum.' });
    expect(konteks.history.pushState).not.toHaveBeenCalled();
    expect(Api.kirim).not.toHaveBeenCalled();
  });

  test('C05-UT03 keQuery: kriteria kosong dan spasi dibuang, urutan kolom tetap', () => {
    const { konteks } = muatKatalog();

    expect(konteks.HalamanKatalog.keQuery({ halaman: 2, q: '  meja ', kategori: '', lokasi: '   ', urut: 'terbaru' }))
      .toBe('q=meja&urut=terbaru&halaman=2');
    expect(konteks.HalamanKatalog.keQuery({})).toBe('');
  });

  test('C05-UT04 render: 20 dari 24 listing menampilkan 20 kartu, jumlah hasil, dan navigasi halaman 1 dari 2', () => {
    const { halaman, el } = muatKatalog();
    const daftar = Array.from({ length: 20 }, (_, i) => ({ judul: `Barang ${i + 1}` }));

    halaman.render(DATA_KATALOG(daftar, 24).data);

    expect(el('daftar-katalog').children).toHaveLength(20);
    expect(el('info-hasil').textContent).toBe('24 barang ditemukan');
    expect(el('katalog-kosong').hidden).toBe(true);
    expect(el('paginasi').hidden).toBe(false);
    expect(el('hal-info').textContent).toBe('Halaman 1 dari 2');
    expect(el('hal-sebelum').disabled).toBe(true);
    expect(el('hal-berikut').disabled).toBe(false);
  });

  test('C05-UT05 render: tanpa hasil menampilkan "Barang tidak ditemukan" dan menyembunyikan navigasi (KF29)', () => {
    const { halaman, el } = muatKatalog();

    halaman.render(DATA_KATALOG([], 0).data);

    expect(el('daftar-katalog').children).toHaveLength(0);
    expect(el('katalog-kosong').hidden).toBe(false);
    expect(el('kosong-judul').textContent).toBe('Barang tidak ditemukan');
    expect(el('paginasi').hidden).toBe(true);
  });

  test('C05-UT06 render: halaman di luar batas menampilkan "Halaman tidak tersedia" (batas)', () => {
    const { halaman, el } = muatKatalog();

    halaman.render(DATA_KATALOG([], 24, 5).data);

    expect(el('kosong-judul').textContent).toBe('Halaman tidak tersedia');
    expect(el('kosong-teks').textContent).toBe('Katalog hanya memiliki 2 halaman.');
  });
});

describe('C07 HalamanDetailBarang', () => {
  const BARANG = {
    idBarang: '5ab4cb97-1bd6-43d2-9b7a-52ed00eafe2d',
    judul: 'Paket HP Android dan Earbuds',
    harga: 950000,
    status: 'Tersedia',
    milikSendiri: false,
  };

  test('C07-UT01 renderAksi: pembeli pada listing Tersedia mendapat tombol "Kirim pesan", kotak pesan, dan tautan Laporkan', () => {
    const { halaman, el } = muatDetail();

    halaman.renderAksi(BARANG);

    const aksi = el('aksi');
    expect(teksAnak(aksi)[0]).toBe('Kirim pesan');
    expect(aksi.children[1].href).toBe('/laporan-form?objek=5ab4cb97-1bd6-43d2-9b7a-52ed00eafe2d&jenis=Listing');
    expect(el('kotak-pesan').hidden).toBe(false);
  });

  test('C07-UT02 renderAksi: pemilik listing hanya mendapat keterangan dan tombol "Ubah Listing" (UC15 Alternatif 1)', () => {
    const { halaman, el } = muatDetail();

    halaman.renderAksi({ ...BARANG, milikSendiri: true });

    expect(teksAnak(el('aksi'))).toEqual(['Ini listing milik Anda.', 'Ubah Listing']);
    expect(el('aksi').children[1].href).toBe('/listing-form?id=5ab4cb97-1bd6-43d2-9b7a-52ed00eafe2d');
    expect(el('kotak-pesan').hidden).toBe(true);
  });

  test('C07-UT03 renderAksi: listing Terjual tidak menyediakan tombol kirim pesan (UC15 Alternatif 3)', () => {
    const { halaman, el } = muatDetail();

    halaman.renderAksi({ ...BARANG, status: 'Terjual' });

    expect(teksAnak(el('aksi'))[0]).toBe('Barang ini sudah terjual.');
    expect(teksAnak(el('aksi'))).not.toContain('Kirim pesan');
    expect(el('kotak-pesan').hidden).toBe(true);
  });

  test('C07-UT04 mulai: ID listing bukan UUID ditolak tanpa memanggil API', async () => {
    const { halaman, Api, el } = muatDetail({ search: '?id=bukan-uuid' });

    await halaman.mulai();

    expect(Api.kirim).not.toHaveBeenCalled();
    expect(el('galat-umum')).toMatchObject({ hidden: false, textContent: 'ID listing tidak valid.' });
    expect(el('judul').textContent).toBe(''); // detail tidak dirender
  });

  test('C07-UT05 mulai: listing tidak tersedia (404) menampilkan pesan dari server', async () => {
    const { halaman, Api, el } = muatDetail({ search: `?id=${BARANG.idBarang}` });
    Api.kirim.mockResolvedValue({ sukses: false, status: 404, pesan: 'Listing tidak ditemukan atau sudah tidak tersedia.' });

    await halaman.mulai();

    expect(Api.kirim).toHaveBeenCalledWith('GET', `/api/katalog/${BARANG.idBarang}`, undefined);
    expect(el('galat-umum').textContent).toBe('Listing tidak ditemukan atau sudah tidak tersedia.');
  });
});
