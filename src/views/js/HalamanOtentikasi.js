// C01 HalamanOtentikasi – View untuk I-01 Masuk (I-02 Daftar dan I-03 Verifikasi menyusul).
// Membutuhkan api.js.
class HalamanOtentikasi {
  static BERANDA = '/';
  static HALAMAN_LOGIN = '/masuk';
  static HALAMAN_VERIFIKASI = '/verifikasi';
  static DOMAIN_SUREL = '@itb.ac.id';

  constructor() {
    this.nama = '';
    this.nim = '';
    this.email = '';
    this.kataSandi = '';
    this.setujuKebijakan = false;
    this.kodeVerifikasi = '';
    this.sisaWaktu = 0;
    this.token = Api.getToken();
  }

  // ───────────── I-01 Masuk ─────────────

  tampilkanFormulirLogin() {
    if (this.token) {
      this.tampilkanTombolKeluar();
      return;
    }
    document.getElementById('formulir-login').hidden = false;
    document.getElementById('formulir-login').addEventListener('submit', (e) => {
      e.preventDefault();
      this.kirimFormulirLogin(
        document.getElementById('email').value.trim(),
        document.getElementById('kata-sandi').value,
      );
    });
  }

  async kirimFormulirLogin(email, kataSandi) {
    this.email = email;
    this.kataSandi = kataSandi;

    if (!email || !kataSandi) {
      this.tampilkanPesanGalat('Surel dan kata sandi wajib diisi.');
      return;
    }
    // I01-O01: validasi awal domain di sisi klien
    if (!email.toLowerCase().endsWith(HalamanOtentikasi.DOMAIN_SUREL)) {
      this.tampilkanPesanGalat(`Gunakan email berdomain ${HalamanOtentikasi.DOMAIN_SUREL}.`);
      return;
    }

    const tombol = document.getElementById('tombol-masuk');
    tombol.disabled = true;
    const hasil = await Api.kirim('POST', '/api/akun/login', { email, kataSandi });
    tombol.disabled = false;

    if (!hasil.sukses) {
      this.tampilkanPesanGalat(hasil.pesan, hasil.kode);
      return;
    }
    Api.simpanSesi(hasil.data.token, hasil.data.peran, email);
    this.arahkanKeBeranda();
  }

  arahkanKeBeranda() {
    window.location.href = HalamanOtentikasi.BERANDA;
  }

  // I01-O05: kredensial salah, akun belum terverifikasi, atau akun diblokir (KF53)
  tampilkanPesanGalat(pesan, kode) {
    const kotak = document.getElementById('pesan-galat');
    kotak.textContent = pesan;
    if (kode === 'BELUM_TERVERIFIKASI') {
      const tautan = document.createElement('a');
      tautan.href = `${HalamanOtentikasi.HALAMAN_VERIFIKASI}?email=${encodeURIComponent(this.email)}`;
      tautan.textContent = 'Verifikasi sekarang';
      kotak.append(' ', tautan);
    }
    kotak.hidden = false;
  }

  // I01-O08: bagi pengguna yang sedang masuk
  tampilkanTombolKeluar() {
    document.getElementById('formulir-login').hidden = true;
    document.getElementById('panel-masuk').hidden = false;
    document.getElementById('email-masuk').textContent = localStorage.getItem(Api.KUNCI_EMAIL) || '';
    document.getElementById('tombol-keluar').addEventListener('click', () => {
      this.kirimPermintaanLogout(this.token);
    });
  }

  // UC04
  async kirimPermintaanLogout(token) {
    await Api.kirim('POST', '/api/akun/logout');
    // Token lokal tetap dihapus walaupun sesi di server sudah kedaluwarsa.
    this.hapusTokenLokal();
    this.arahkanKeHalamanLogin();
  }

  hapusTokenLokal() {
    Api.hapusSesi();
    this.token = null;
  }

  arahkanKeHalamanLogin() {
    window.location.href = HalamanOtentikasi.HALAMAN_LOGIN;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const halaman = new HalamanOtentikasi();
  if (document.body.dataset.halaman === 'masuk') halaman.tampilkanFormulirLogin();
});
