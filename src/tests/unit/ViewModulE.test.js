// Uji unit kelas View Modul E bertingkat Sedang: C10 FormulirLaporan dan C11 DasborAdmin.
// Keduanya skrip peramban, jadi dijalankan dengan objek document, window, dan Api tiruan.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR_JS = path.join(__dirname, '..', '..', 'views', 'js');

function elemenPalsu(nilai = '') {
  return { value: nilai, textContent: '', hidden: false, disabled: false, style: {}, innerHTML: '', addEventListener() {}, appendChild() {} };
}

// Memuat FormulirLaporan.js ke konteks terisolasi dan mengembalikan kelasnya beserta tiruan yang dipakai.
function muatFormulirLaporan({ token = 'token-sah', alasan = 'Penjual tidak membalas setelah transfer', kategori = 'Penipuan' } = {}) {
  const elemen = { 'teks-alasan': elemenPalsu(alasan), 'tombol-kirim': elemenPalsu() };
  const kiriman = [];
  const konteks = {
    console,
    URLSearchParams,
    setTimeout: () => 0,
    FormData: class {
      constructor() { this.isi = []; }
      append(k, v) { this.isi.push([k, v]); }
    },
    window: { location: { search: '', href: '/laporan-form' } },
    document: {
      addEventListener() {},
      getElementById: (id) => elemen[id] || null,
      querySelector: () => (kategori ? { value: kategori } : null),
      createElement: () => elemenPalsu(),
    },
    Api: {
      getToken: () => token,
      kirim: jest.fn(async (metode, alamat, isi) => {
        kiriman.push({ metode, alamat, isi });
        return { sukses: true };
      }),
    },
  };
  vm.createContext(konteks);
  const kode = fs.readFileSync(path.join(DIR_JS, 'FormulirLaporan.js'), 'utf8');
  vm.runInContext(`${kode}\n;this.FormulirLaporan = FormulirLaporan;`, konteks);
  return { FormulirLaporan: konteks.FormulirLaporan, konteks, kiriman };
}

const PNG = (nama = 'bukti.png', size = 1024) => ({ name: nama, size });

describe('FormulirLaporan (C10)', () => {
  function formulirSiap(opsi) {
    const muat = muatFormulirLaporan(opsi);
    const formulir = new muat.FormulirLaporan();
    formulir.renderPratinjauBukti = jest.fn();
    formulir.tampilkanPesanGalat = jest.fn();
    formulir.tampilkanNotifikasi = jest.fn();
    formulir.sembunyikanPesanGalat = jest.fn();
    formulir.objekDilaporkan = 'brg-77';
    return { ...muat, formulir };
  }

  test('C10-UT01 [Normal] validasiIsianWajib: objek, kategori, alasan, dan satu bukti terisi → true', () => {
    const { formulir } = formulirSiap();
    formulir.berkasBukti = [PNG()];
    expect(formulir.validasiIsianWajib()).toBe(true);
    expect(formulir.jenisPelanggaran).toBe('Penipuan');
  });

  test('C10-UT02 [Negatif] validasiIsianWajib: alasan hanya berisi spasi → false', () => {
    const { formulir } = formulirSiap({ alasan: '    ' });
    formulir.berkasBukti = [PNG()];
    expect(formulir.validasiIsianWajib()).toBe(false);
  });

  test('C10-UT03 [Negatif] validasiIsianWajib: belum ada bukti tangkapan layar → false', () => {
    const { formulir } = formulirSiap();
    expect(formulir.validasiIsianWajib()).toBe(false);
  });

  test('C10-UT04 [Normal] unggahBukti: satu PNG dan satu JPG di bawah 5 MB → keduanya masuk daftar bukti', () => {
    const { formulir } = formulirSiap();
    formulir.unggahBukti([PNG('a.png'), PNG('b.JPG')]);
    expect(formulir.berkasBukti.map((b) => b.name)).toEqual(['a.png', 'b.JPG']);
    expect(formulir.tampilkanPesanGalat).not.toHaveBeenCalled();
  });

  test('C10-UT05 [Negatif] unggahBukti: berkas 6 MB dan berkas .gif → keduanya ditolak dengan pesan galat', () => {
    const { formulir } = formulirSiap();
    formulir.unggahBukti([PNG('besar.png', 6 * 1024 * 1024), PNG('animasi.gif')]);
    expect(formulir.berkasBukti).toEqual([]);
    expect(formulir.tampilkanPesanGalat).toHaveBeenCalledWith('Ukuran berkas melebihi batas 5 MB.');
    expect(formulir.tampilkanPesanGalat).toHaveBeenCalledWith('Format berkas harus JPG atau PNG.');
  });

  test('C10-UT06 [Batas] unggahBukti: tujuh berkas sah → hanya lima pertama yang disimpan', () => {
    const { formulir } = formulirSiap();
    formulir.unggahBukti(Array.from({ length: 7 }, (_, i) => PNG(`b${i + 1}.png`)));
    expect(formulir.berkasBukti.map((b) => b.name)).toEqual(['b1.png', 'b2.png', 'b3.png', 'b4.png', 'b5.png']);
  });

  test('C10-UT07 [Negatif] kirimLaporan: pengguna belum masuk → pesan galat dan tidak ada permintaan ke /api/laporan', async () => {
    const { formulir, konteks } = formulirSiap({ token: null });
    formulir.berkasBukti = [PNG()];
    await formulir.kirimLaporan();
    expect(formulir.tampilkanPesanGalat).toHaveBeenCalledWith('Silakan masuk terlebih dahulu untuk mengirim laporan.');
    expect(konteks.Api.kirim).not.toHaveBeenCalled();
  });

  test('C10-UT08 [Normal] kirimLaporan: isian lengkap → POST /api/laporan berisi objek, kategori, alasan, jenis objek, dan bukti', async () => {
    const { formulir, kiriman } = formulirSiap();
    formulir.berkasBukti = [PNG('bukti.png')];

    await formulir.kirimLaporan();

    expect(kiriman).toHaveLength(1);
    expect(kiriman[0].metode).toBe('POST');
    expect(kiriman[0].alamat).toBe('/api/laporan');
    expect(kiriman[0].isi.isi.map(([k]) => k)).toEqual(['objekDilaporkan', 'jenisPelanggaran', 'teksAlasan', 'jenisObjek', 'bukti']);
    expect(formulir.tampilkanNotifikasi).toHaveBeenCalledWith('Laporan berhasil dikirim dan akan segera ditinjau admin.');
  });
});

describe('DasborAdmin (C11)', () => {
  const DasborAdmin = require('../../views/js/DasborAdmin');

  function dasborSiap() {
    global.Api = { kirim: jest.fn().mockResolvedValue({ sukses: true }) };
    const dasbor = new DasborAdmin();
    dasbor.tampilkanPesanGalat = jest.fn();
    dasbor.tampilkanStatusTerbaru = jest.fn();
    dasbor.muatStatistik = jest.fn();
    dasbor.filterLaporan = jest.fn();
    dasbor.bukaDetailLaporan = jest.fn();
    return dasbor;
  }

  afterEach(() => {
    delete global.Api;
  });

  test('C11-UT01 [Normal] validasiTransisiStatus: Baru ke Diproses, Diproses ke Selesai, Baru ke Selesai → true', () => {
    const dasbor = dasborSiap();
    expect(dasbor.validasiTransisiStatus('Baru', 'Diproses')).toBe(true);
    expect(dasbor.validasiTransisiStatus('Diproses', 'Selesai')).toBe(true);
    expect(dasbor.validasiTransisiStatus('Baru', 'Selesai')).toBe(true);
  });

  test('C11-UT02 [Negatif] validasiTransisiStatus: Selesai ke Baru, Diproses ke Baru, status tidak dikenal → false', () => {
    const dasbor = dasborSiap();
    expect(dasbor.validasiTransisiStatus('Selesai', 'Baru')).toBe(false);
    expect(dasbor.validasiTransisiStatus('Diproses', 'Baru')).toBe(false);
    expect(dasbor.validasiTransisiStatus('Baru', 'Ditutup')).toBe(false);
  });

  test('C11-UT03 [Negatif] onClickUbahStatus: di halaman detail, laporan Selesai diubah ke Diproses → pesan galat, API tidak dipanggil', async () => {
    const dasbor = dasborSiap();
    dasbor.detailLaporan = { laporan: { idLaporan: 'lap-1', statusPenanganan: 'Selesai' } };
    await dasbor.onClickUbahStatus('lap-1', 'Diproses');
    expect(dasbor.tampilkanPesanGalat).toHaveBeenCalledWith(expect.stringMatching(/tidak diperbolehkan/));
    expect(global.Api.kirim).not.toHaveBeenCalled();
  });

  test('C11-UT04 [Normal] onClickUbahStatus: dari daftar laporan I-13, detail belum dibuka → PATCH terkirim, statistik dan daftar dimuat ulang', async () => {
    const dasbor = dasborSiap();
    dasbor.filterStatus = 'Baru';

    await dasbor.onClickUbahStatus('lap-2', 'Diproses');

    expect(global.Api.kirim).toHaveBeenCalledWith('PATCH', '/api/admin/laporan/lap-2/status', { status: 'Diproses' });
    expect(dasbor.tampilkanStatusTerbaru).toHaveBeenCalledWith('Status laporan berhasil diubah menjadi Diproses.');
    expect(dasbor.muatStatistik).toHaveBeenCalledTimes(1);
    expect(dasbor.filterLaporan).toHaveBeenCalledWith('Baru');
  });

  test('C11-UT05 [Negatif] konfirmasiTindakan: alasan kosong atau hanya spasi → pesan galat, tidak ada tindakan moderasi terkirim', async () => {
    const dasbor = dasborSiap();
    dasbor.tindakanAktif = 'BLOKIR_AKUN';
    await dasbor.konfirmasiTindakan('   ');
    expect(dasbor.tampilkanPesanGalat).toHaveBeenCalledWith('Alasan tindakan moderasi wajib diisi.');
    expect(global.Api.kirim).not.toHaveBeenCalled();
  });

  test('C11-UT06 [Normal] escapeHtml: alasan laporan berisi tag <script> → karakter HTML diubah menjadi entitas', () => {
    const dasbor = dasborSiap();
    expect(dasbor.escapeHtml('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    expect(dasbor.escapeHtml(null)).toBe('');
  });
});

// Tambahan HIUPL (M10) setelah uji use case UC20, UC23, dan UC24.
describe('DasborAdmin (C11) sasaran tindakan dan akses ditolak', () => {
  const DasborAdmin = require('../../views/js/DasborAdmin');

  function tombolPalsu() {
    return { klik: null, addEventListener(jenis, fn) { if (jenis === 'click') this.klik = fn; } };
  }

  afterEach(() => {
    delete global.Api;
    delete global.document;
    delete global.window;
    delete global.alert;
  });

  test('C11-UT07 [Normal] pasangEventListenersDetail: tombol Blokir dan Buka Blokir → diarahkan ke akun terlapor, bukan pelapor', () => {
    const tombol = { 'btn-blokir-akun': tombolPalsu(), 'btn-buka-blokir': tombolPalsu() };
    global.document = { getElementById: (id) => tombol[id] || null };
    const dasbor = new DasborAdmin();
    dasbor.onClickBlokirAkun = jest.fn();
    dasbor.onClickBukaBlokir = jest.fn();
    dasbor.detailLaporan = { laporan: { idLaporan: 'lap-1', idPelapor: 'pelapor-1' }, pelapor: { idAkun: 'pelapor-1' }, terlapor: { idAkun: 'penjual-1' } };

    dasbor.pasangEventListenersDetail();
    tombol['btn-blokir-akun'].klik();
    tombol['btn-buka-blokir'].klik();

    expect(dasbor.onClickBlokirAkun).toHaveBeenCalledWith('penjual-1');
    expect(dasbor.onClickBukaBlokir).toHaveBeenCalledWith('penjual-1');
  });

  test('C11-UT08 [Negatif] onClickBlokirAkun dan onClickBukaBlokir: terlapor tidak diketahui → pesan galat, dialog konfirmasi tidak dibuka', () => {
    const dasbor = new DasborAdmin();
    dasbor.tampilkanPesanGalat = jest.fn();
    dasbor.tampilkanModalKonfirmasi = jest.fn();
    dasbor.detailLaporan = { pelapor: { idAkun: 'pelapor-1' }, terlapor: null };

    dasbor.onClickBlokirAkun(undefined);
    dasbor.onClickBukaBlokir(undefined);

    expect(dasbor.tampilkanPesanGalat).toHaveBeenCalledTimes(2);
    expect(dasbor.tampilkanModalKonfirmasi).not.toHaveBeenCalled();
    expect(dasbor.targetIdAkun).toBeNull();
  });

  test('C11-UT09 [Normal] tampilkanAksesDitolak: pengguna bukan admin yang sudah masuk → beranda; belum masuk → halaman masuk', () => {
    global.alert = jest.fn();
    global.window = { location: { href: '/admin-laporan' } };
    const dasbor = new DasborAdmin();

    global.Api = { getToken: () => 'token-pengguna' };
    dasbor.tampilkanAksesDitolak();
    expect(global.window.location.href).toBe('/');

    global.Api = { getToken: () => null };
    dasbor.tampilkanAksesDitolak();
    expect(global.window.location.href).toBe('/masuk');
    expect(global.alert).toHaveBeenCalledWith(expect.stringMatching(/^Akses Ditolak/));
  });
});
