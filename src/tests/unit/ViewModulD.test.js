// src/tests/unit/ViewModulD.test.js
// Pengujian unit kelas View Modul D bertingkat Sedang:
//   C08 HalamanPercakapan (validasi pesan kosong/batas karakter, kirim pesan, akses ditolak, daftar & urutan pesan)
//   C09 PanelNotifikasi (penanda belum dibaca, daftar notifikasi, klik/tandai semua dibaca, dukungan push)
// Keduanya skrip peramban yang mengekspor kelas lewat module.exports; dijalankan dengan DOM dan Api tiruan.

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
    src: '',
    alt: '',
    tabIndex: 0,
    scrollTop: 0,
    scrollHeight: 240,
    style: {},
    attrs: {},
    dataset: {},
    listeners: {},
    append(...anak) { this.children.push(...anak); },
    prepend(...anak) { this.children.unshift(...anak); },
    replaceChildren(...anak) { this.children = anak; },
    setAttribute(k, v) { this.attrs[k] = v; },
    addEventListener(ev, fn) { (this.listeners[ev] ??= []).push(fn); },
    querySelector() { return null; },
    querySelectorAll() { return []; },
  };
}

// Pasang document minimal sebelum require karena kedua skrip mendaftarkan listener DOMContentLoaded
global.document = { addEventListener() {}, body: buatElemen('body') };
const HalamanPercakapan = require('../../views/js/HalamanPercakapan');
const PanelNotifikasi = require('../../views/js/PanelNotifikasi');

function siapkanDom() {
  const elemenPerId = {};
  global.document = {
    hidden: false,
    head: buatElemen('head'),
    body: buatElemen('body'),
    getElementById: (id) => (elemenPerId[id] ??= buatElemen()),
    createElement: (tag) => buatElemen(tag),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
  };
  global.window = { location: { search: '', href: '/percakapan', replace: jest.fn() } };
  global.history = { replaceState: jest.fn() };
  global.Api = {
    getToken: jest.fn(() => 'token-sah'),
    kirim: jest.fn(),
    hapusSesi: jest.fn(),
  };
  return { el: (id) => global.document.getElementById(id) };
}

describe('HalamanPercakapan (C08)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('C08-UT01 [Normal] validasiInputKosong: teks berisi karakter mengembalikan false', () => {
    siapkanDom();
    const halaman = new HalamanPercakapan();
    expect(halaman.validasiInputKosong('Halo, masih ada?')).toBe(false);
    expect(halaman.validasiInputKosong('  ok  ')).toBe(false);
  });

  test('C08-UT02 [Negatif] validasiInputKosong: string kosong, hanya spasi, atau bukan string mengembalikan true', () => {
    siapkanDom();
    const halaman = new HalamanPercakapan();
    expect(halaman.validasiInputKosong('')).toBe(true);
    expect(halaman.validasiInputKosong('   \n\t  ')).toBe(true);
    expect(halaman.validasiInputKosong(null)).toBe(true);
    expect(halaman.validasiInputKosong(undefined)).toBe(true);
  });

  test('C08-UT03 [Normal] kirimPesan: mengirim POST /api/percakapan/:id/pesan, menampilkan gelembung, dan mengosongkan input', async () => {
    const { el } = siapkanDom();
    const halaman = new HalamanPercakapan();
    halaman.idPercakapanAktif = 'perc-1';
    halaman.percakapanAktif = { idPercakapan: 'perc-1', idAkunSaya: 'akun-1', pesan: [] };
    el('input-pesan').value = '  Halo kak  ';

    global.Api.kirim
      .mockResolvedValueOnce({
        sukses: true,
        status: 201,
        data: { idPesan: 'p1', idPengirim: 'akun-1', isi: 'Halo kak', waktuKirim: '2026-11-20T08:00:00Z', dariSaya: true },
      })
      .mockResolvedValueOnce({ sukses: true, status: 200, data: [] });

    await halaman.kirimPesan('  Halo kak  ');

    expect(global.Api.kirim).toHaveBeenCalledWith('POST', '/api/percakapan/perc-1/pesan', { isi: 'Halo kak' });
    expect(el('input-pesan').value).toBe('');
    expect(el('tombol-kirim').disabled).toBe(true);
    expect(halaman.percakapanAktif.pesan).toHaveLength(1);
    expect(el('daftar-pesan').children[0].textContent).toBe('Halo kak');
  });

  test('C08-UT04 [Negatif] kirimPesan: pesan kosong atau melebihi 2000 karakter ditolak tanpa memanggil API', async () => {
    const { el } = siapkanDom();
    const halaman = new HalamanPercakapan();
    halaman.idPercakapanAktif = 'perc-1';

    await halaman.kirimPesan('   ');
    expect(global.Api.kirim).not.toHaveBeenCalled();

    await halaman.kirimPesan('x'.repeat(2001));
    expect(global.Api.kirim).not.toHaveBeenCalled();
    expect(el('galat-pesan').textContent).toBe('Pesan tidak boleh melebihi 2000 karakter.');
    expect(el('galat-pesan').hidden).toBe(false);
  });

  test('C08-UT05 [Normal] showDaftarPercakapan: merender item daftar, cuplikan, dan memperbarui penanda belum dibaca', () => {
    const { el } = siapkanDom();
    const halaman = new HalamanPercakapan();

    halaman.showDaftarPercakapan([
      {
        idPercakapan: 'perc-1',
        judulBarang: 'Jas Lab Kimia',
        lawanBicara: { idAkun: 'penjual-1', nama: 'Penjual Uji' },
        cuplikan: { isi: 'Bisa COD di Labtek V?', waktuKirim: '2026-11-20T08:00:00Z', dariSaya: false },
        belumDibaca: 2,
      },
    ]);

    expect(el('daftar-percakapan').children).toHaveLength(1);
    expect(el('daftar-kosong').hidden).toBe(true);
    expect(el('badge-belum-dibaca')).toMatchObject({ hidden: false, textContent: '2 belum dibaca' });
    expect(el('badge-topbar-percakapan')).toMatchObject({ hidden: false, textContent: '2' });
  });

  test('C08-UT06 [Normal] showPercakapan: mengurutkan pesan menurut waktuKirim serta memasang tautan Kebijakan Privasi dan Laporkan', () => {
    const { el } = siapkanDom();
    const halaman = new HalamanPercakapan();

    halaman.showPercakapan({
      idPercakapan: 'perc-1',
      idAkunSaya: 'pembeli-1',
      lawanBicara: { idAkun: 'penjual-1', nama: 'Penjual Uji' },
      barang: { idBarang: 'b1', judul: 'Kalkulator', harga: 150000, fotoUtama: null },
      tautanKebijakanPrivasi: '/legal?jenis=kebijakan-privasi',
      pesan: [
        { idPesan: 'p2', idPengirim: 'penjual-1', isi: 'Pesan kedua', waktuKirim: '2026-11-20T08:05:00Z', dariSaya: false },
        { idPesan: 'p1', idPengirim: 'pembeli-1', isi: 'Pesan pertama', waktuKirim: '2026-11-20T08:01:00Z', dariSaya: true },
      ],
    });

    expect(el('ruang-aktif').hidden).toBe(false);
    expect(el('nama-lawan').textContent).toBe('Penjual Uji');
    expect(el('tautan-kebijakan').href).toBe('/legal?jenis=kebijakan-privasi');
    expect(el('tautan-lapor-percakapan').href).toBe('/laporan-form?objek=perc-1&jenis=Percakapan');
    expect(el('daftar-pesan').children[0].textContent).toBe('Pesan pertama');
    expect(el('daftar-pesan').children[2].textContent).toBe('Pesan kedua');
  });

  test('C08-UT07 [Negatif] bukaPercakapan: respons 403 menampilkan panel akses ditolak dan mengosongkan daftar pesan (KF35)', async () => {
    const { el } = siapkanDom();
    const halaman = new HalamanPercakapan();
    el('daftar-pesan').children = [buatElemen('div')];
    global.Api.kirim.mockResolvedValue({ sukses: false, status: 403, pesan: 'Anda bukan peserta percakapan ini.' });

    await halaman.bukaPercakapan('perc-orang-lain');

    expect(el('ruang-akses-ditolak').hidden).toBe(false);
    expect(el('ruang-aktif').hidden).toBe(true);
    expect(el('pesan-akses-ditolak').textContent).toBe('Anda bukan peserta percakapan ini.');
    expect(el('daftar-pesan').children).toEqual([]);
  });

  test('C08-UT08 [Negatif] mulaiPercakapanDariBarang: penjual diblokir (403) menampilkan penolakan tanpa membuka ruang', async () => {
    const { el } = siapkanDom();
    const halaman = new HalamanPercakapan();
    global.Api.kirim.mockResolvedValue({
      sukses: false,
      status: 403,
      pesan: 'Penjual sedang diblokir dan tidak dapat dihubungi.',
    });

    await halaman.mulaiPercakapanDariBarang('barang-diblokir');

    expect(el('ruang-akses-ditolak').hidden).toBe(false);
    expect(el('judul-akses-ditolak').textContent).toBe('Akses ditolak');
    expect(el('pesan-akses-ditolak').textContent).toBe('Penjual sedang diblokir dan tidak dapat dihubungi.');
  });
});

describe('PanelNotifikasi (C09)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('C09-UT01 [Normal] tampilkanPenandaBelumDibaca: angka > 0 menampilkan badge, 0 atau negatif menyembunyikannya', () => {
    siapkanDom();
    const panel = new PanelNotifikasi();
    panel.elBadge = buatElemen('span');

    panel.tampilkanPenandaBelumDibaca(3);
    expect(panel.elBadge).toMatchObject({ hidden: false, textContent: '3' });

    panel.tampilkanPenandaBelumDibaca(0);
    expect(panel.elBadge).toMatchObject({ hidden: true, textContent: '0' });

    panel.tampilkanPenandaBelumDibaca(-2);
    expect(panel.elBadge).toMatchObject({ hidden: true, textContent: '0' });
  });

  test('C09-UT02 [Normal] tampilkanDaftarNotifikasi: merender daftar beserta titik belum dibaca dan keadaan kosong', () => {
    siapkanDom();
    const panel = new PanelNotifikasi();
    panel.elDaftar = buatElemen('div');
    panel.elTombolBacaSemua = buatElemen('button');
    panel.jumlahBelumDibaca = 1;

    panel.tampilkanDaftarNotifikasi([
      { idNotifikasi: 'n1', jenis: 'pesan', isi: 'Pesan baru dari Pembeli Uji', waktuKirim: new Date().toISOString(), statusBaca: false },
    ]);
    expect(panel.elDaftar.children).toHaveLength(1);
    expect(panel.elDaftar.children[0].className).toContain('is-baru');
    expect(panel.elTombolBacaSemua.disabled).toBe(false);

    panel.jumlahBelumDibaca = 0;
    panel.tampilkanDaftarNotifikasi([]);
    expect(panel.elDaftar.children[0].textContent).toBe('Belum ada notifikasi');
    expect(panel.elTombolBacaSemua.disabled).toBe(true);
  });

  test('C09-UT03 [Normal] klikNotifikasi: memanggil PATCH /:id/baca, memperbarui badge, dan mengarahkan ke /percakapan', async () => {
    siapkanDom();
    const panel = new PanelNotifikasi();
    panel.elBadge = buatElemen('span');
    panel.elDaftar = buatElemen('div');
    panel.elPanel = buatElemen('section');
    panel.elDim = buatElemen('div');
    const item = { idNotifikasi: 'n1', jenis: 'pesan', isi: 'Pesan baru', statusBaca: false };
    panel.daftarNotifikasi = [item];
    global.Api.kirim.mockResolvedValue({ sukses: true, data: { belumDibaca: 0 } });

    await panel.klikNotifikasi(item);

    expect(global.Api.kirim).toHaveBeenCalledWith('PATCH', '/api/notifikasi/n1/baca');
    expect(item.statusBaca).toBe(true);
    expect(panel.elBadge.hidden).toBe(true);
    expect(global.window.location.href).toBe('/percakapan');
  });

  test('C09-UT04 [Normal] tandaiSemuaDibaca: memanggil PATCH /api/notifikasi/baca-semua dan menandai semua dibaca', async () => {
    siapkanDom();
    const panel = new PanelNotifikasi();
    panel.elBadge = buatElemen('span');
    panel.elDaftar = buatElemen('div');
    panel.daftarNotifikasi = [
      { idNotifikasi: 'n1', jenis: 'pesan', isi: 'A', statusBaca: false },
      { idNotifikasi: 'n2', jenis: 'pesan', isi: 'B', statusBaca: false },
    ];
    global.Api.kirim.mockResolvedValue({ sukses: true, data: { belumDibaca: 0 } });

    await panel.tandaiSemuaDibaca();

    expect(global.Api.kirim).toHaveBeenCalledWith('PATCH', '/api/notifikasi/baca-semua');
    expect(panel.daftarNotifikasi.every((n) => n.statusBaca)).toBe(true);
    expect(panel.jumlahBelumDibaca).toBe(0);
  });

  test('C09-UT05 [Negatif] periksaDukunganPush: menyembunyikan tombol push bila peramban tidak mendukung atau kunciPublik null', async () => {
    siapkanDom();
    const panel = new PanelNotifikasi();
    panel.elKakiPush = buatElemen('div');
    panel.elTombolPush = buatElemen('button');

    jest.spyOn(PanelNotifikasi, 'perambanMendukungPush').mockReturnValueOnce(false);
    await panel.periksaDukunganPush();
    expect(panel.elTombolPush.hidden).toBe(true);
    expect(panel.elKakiPush.hidden).toBe(true);

    panel.elKakiPush.hidden = false;
    panel.elTombolPush.hidden = false;
    jest.spyOn(PanelNotifikasi, 'perambanMendukungPush').mockReturnValueOnce(true);
    global.Api.kirim.mockResolvedValueOnce({ sukses: true, data: { kunciPublik: null } });
    await panel.periksaDukunganPush();
    expect(panel.elTombolPush.hidden).toBe(true);
    expect(panel.elKakiPush.hidden).toBe(true);
  });

  test('C09-UT06 [Normal] kelasIkonJenis: memetakan jenis notifikasi ke kelas ikon yang sesuai', () => {
    expect(PanelNotifikasi.kelasIkonJenis('pesan')).toBe('ic--chat');
    expect(PanelNotifikasi.kelasIkonJenis('moderasi')).toBe('ic--flag');
    expect(PanelNotifikasi.kelasIkonJenis('verifikasi')).toBe('ic--lock');
    expect(PanelNotifikasi.kelasIkonJenis('lainnya')).toBe('ic--bell');
  });
});
