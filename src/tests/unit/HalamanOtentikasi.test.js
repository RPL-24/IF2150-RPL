// src/tests/unit/HalamanOtentikasi.test.js
// C01 HalamanOtentikasi (View, tingkat Sedang): validasi formulir sisi klien sebelum memanggil API.
// Skrip View dijalankan di konteks vm dengan DOM, Api, dan penyimpanan peramban tiruan secukupnya.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const KODE = fs.readFileSync(path.join(__dirname, '../../views/js/HalamanOtentikasi.js'), 'utf8');

function elemen() {
  return {
    hidden: true,
    disabled: false,
    textContent: '',
    value: '',
    classList: { add: jest.fn(), remove: jest.fn() },
    append: jest.fn(),
    addEventListener: jest.fn(),
  };
}

function siapkanHalaman() {
  const elemenPerId = {};
  const document = {
    getElementById: (id) => (elemenPerId[id] ??= elemen()),
    querySelectorAll: () => [],
    createElement: () => ({}),
    addEventListener: jest.fn(),
  };
  const penyimpanan = () => ({ getItem: () => null, setItem: jest.fn(), removeItem: jest.fn() });
  const Api = {
    KUNCI_EMAIL: 'itbeli_email',
    getToken: () => null,
    kirim: jest.fn(),
    simpanSesi: jest.fn(),
    hapusSesi: jest.fn(),
  };
  const window = { location: { href: '/', search: '' } };
  const konteks = vm.createContext({
    document, window, Api, sessionStorage: penyimpanan(), localStorage: penyimpanan(), URLSearchParams, Date,
  });
  vm.runInContext(`${KODE}\nthis.HalamanOtentikasi = HalamanOtentikasi;`, konteks);
  return { halaman: new konteks.HalamanOtentikasi(), Api, window, el: document.getElementById };
}

describe('HalamanOtentikasi Unit Test (C01)', () => {
  test('C01-UT01 kirimFormulirPendaftaran: isian valid dikirim ke API lalu diarahkan ke halaman verifikasi', async () => {
    const { halaman, Api, window } = siapkanHalaman();
    Api.kirim.mockResolvedValue({ sukses: true, data: { email: 'uji@itb.ac.id', surelTerkirim: true, durasiKodeDetik: 900 } });

    await halaman.kirimFormulirPendaftaran('Mahasiswa Uji', '13599999', 'uji@itb.ac.id', 'rahasia123', true);

    expect(Api.kirim).toHaveBeenCalledWith('POST', '/api/akun/daftar', {
      nama: 'Mahasiswa Uji', nim: '13599999', email: 'uji@itb.ac.id', kataSandi: 'rahasia123', setujuKebijakan: true,
    });
    expect(window.location.href).toBe('/verifikasi?email=uji%40itb.ac.id');
  });

  test('C01-UT02 kirimFormulirPendaftaran: domain bukan ITB, NIM berhuruf, dan kata sandi lemah ditandai tanpa memanggil API', async () => {
    const { halaman, Api, el } = siapkanHalaman();

    await halaman.kirimFormulirPendaftaran('Mahasiswa Uji', '135ab', 'uji@gmail.com', 'pendek1', true);

    expect(Api.kirim).not.toHaveBeenCalled();
    expect(el('galat-email').textContent).toMatch(/itb\.ac\.id/);
    expect(el('galat-nim').textContent).toBe('NIM hanya boleh berisi angka.');
    expect(el('galat-kata-sandi').textContent).toBe('Minimal 8 karakter, memuat huruf dan angka.');
  });

  test('C01-UT03 kirimFormulirPendaftaran: kebijakan belum disetujui → pesan galat tanpa memanggil API (KF14)', async () => {
    const { halaman, Api, el } = siapkanHalaman();

    await halaman.kirimFormulirPendaftaran('Mahasiswa Uji', '13599999', 'uji@itb.ac.id', 'rahasia123', false);

    expect(Api.kirim).not.toHaveBeenCalled();
    expect(el('pesan-galat')).toMatchObject({ hidden: false, textContent: 'Anda harus menyetujui Kebijakan Privasi dan Ketentuan Penggunaan.' });
  });

  test('C01-UT04 kirimFormulirLogin: kredensial diterima server → sesi disimpan dan diarahkan ke beranda', async () => {
    const { halaman, Api, window } = siapkanHalaman();
    window.location.href = '/masuk';
    Api.kirim.mockResolvedValue({ sukses: true, data: { token: 'tkn', peran: 'Pengguna' } });

    await halaman.kirimFormulirLogin('uji@itb.ac.id', 'rahasia123');

    expect(Api.simpanSesi).toHaveBeenCalledWith('tkn', 'Pengguna', 'uji@itb.ac.id');
    expect(window.location.href).toBe('/');
  });

  test('C01-UT05 kirimFormulirLogin: surel di luar domain ITB ditolak di sisi klien', async () => {
    const { halaman, Api, el } = siapkanHalaman();

    await halaman.kirimFormulirLogin('uji@gmail.com', 'rahasia123');

    expect(Api.kirim).not.toHaveBeenCalled();
    expect(el('pesan-galat').textContent).toMatch(/itb\.ac\.id/);
  });

  test('C01-UT06 kirimKodeVerifikasi: kode yang bukan 6 digit ditolak tanpa memanggil API', async () => {
    const { halaman, Api, el } = siapkanHalaman();

    await halaman.kirimKodeVerifikasi('uji@itb.ac.id', '12345');

    expect(Api.kirim).not.toHaveBeenCalled();
    expect(el('pesan-galat').textContent).toBe('Masukkan 6 digit kode verifikasi.');
  });
});
