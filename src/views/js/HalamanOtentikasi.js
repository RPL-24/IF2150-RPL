// C01 HalamanOtentikasi – View untuk I-01 Masuk, I-02 Daftar Akun, dan I-03 Verifikasi Surel.
// Membutuhkan api.js.
class HalamanOtentikasi {
  static BERANDA = '/';
  static HALAMAN_LOGIN = '/masuk';
  static HALAMAN_VERIFIKASI = '/verifikasi';
  static TAUTAN_KEBIJAKAN = '/legal?jenis=kebijakan-privasi';
  static DOMAIN_SUREL = '@itb.ac.id';
  static KUNCI_BATAS_KODE = 'itbeli_batas_kode';

  // Isian I-02 yang menampilkan galat dari server, berdasarkan kode hasil AkunController
  static ISIAN_GALAT = {
    DOMAIN_TIDAK_VALID: 'email',
    SUREL_TERDAFTAR: 'email',
    NIM_TIDAK_VALID: 'nim',
    KATA_SANDI_LEMAH: 'kata-sandi',
  };

  constructor() {
    this.nama = '';
    this.nim = '';
    this.email = '';
    this.kataSandi = '';
    this.setujuKebijakan = false;
    this.kodeVerifikasi = '';
    this.sisaWaktu = 0;
    this.token = Api.getToken();
    this.pengatur = null;
  }

  // ───────────── I-01 Masuk ─────────────

  tampilkanFormulirLogin() {
    if (this.token) {
      this.tampilkanTombolKeluar();
      return;
    }
    const formulir = document.getElementById('formulir-login');
    formulir.hidden = false;
    formulir.addEventListener('submit', (e) => {
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
    if (!HalamanOtentikasi.surelBerdomainItb(email)) {
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

  // I01-O05, I02, I03-O06
  tampilkanPesanGalat(pesan, kode) {
    const kotak = document.getElementById('pesan-galat');
    kotak.textContent = pesan;
    if (kode === 'BELUM_TERVERIFIKASI') {
      kotak.append(' ', HalamanOtentikasi.tautan(HalamanOtentikasi.alamatVerifikasi(this.email), 'Verifikasi sekarang'));
    } else if (kode === 'SUREL_TERDAFTAR' || kode === 'SUDAH_TERVERIFIKASI') {
      kotak.append(' ', HalamanOtentikasi.tautan(HalamanOtentikasi.HALAMAN_LOGIN, 'Masuk'));
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

  // ───────────── I-02 Daftar Akun ─────────────

  tampilkanFormulirPendaftaran() {
    const formulir = document.getElementById('formulir-daftar');
    const centang = document.getElementById('setuju-kebijakan');
    const tombol = document.getElementById('tombol-daftar');

    // I02-O06: tautan diambil dari AkunController.getTautanDokumenLegal(); bawaan dipakai bila gagal
    Api.kirim('GET', '/api/akun/tautan-kebijakan').then((hasil) => {
      this.tampilkanKebijakanPrivasi(hasil.sukses ? hasil.data.tautan : HalamanOtentikasi.TAUTAN_KEBIJAKAN);
    });

    // I02-O05: tombol "Buat Akun" nonaktif selama kebijakan belum disetujui (KF13)
    centang.addEventListener('change', () => { tombol.disabled = !centang.checked; });
    tombol.disabled = !centang.checked;

    document.getElementById('kata-sandi').addEventListener('input', (e) => {
      HalamanOtentikasi.tampilkanKekuatanKataSandi(e.target.value);
    });
    formulir.querySelectorAll('input').forEach((isian) => {
      isian.addEventListener('input', () => HalamanOtentikasi.hapusGalatIsian(isian.id));
    });

    formulir.addEventListener('submit', (e) => {
      e.preventDefault();
      this.kirimFormulirPendaftaran(
        document.getElementById('nama').value.trim(),
        document.getElementById('nim').value.trim(),
        document.getElementById('email').value.trim(),
        document.getElementById('kata-sandi').value,
        centang.checked,
      );
    });
  }

  // I02-O06
  tampilkanKebijakanPrivasi(tautan) {
    document.querySelectorAll('[data-tautan-kebijakan]').forEach((a) => { a.href = tautan; });
  }

  async kirimFormulirPendaftaran(nama, nim, email, kataSandi, setujuKebijakan) {
    Object.assign(this, { nama, nim, email, kataSandi, setujuKebijakan });
    document.getElementById('pesan-galat').hidden = true;

    // Validasi awal di sisi klien; server tetap memvalidasi ulang.
    const galat = {};
    if (!nama) galat.nama = 'Nama lengkap wajib diisi.';
    if (!nim) galat.nim = 'NIM wajib diisi.';
    else if (!/^\d+$/.test(nim)) galat.nim = 'NIM hanya boleh berisi angka.';
    if (!email) galat.email = 'Email institusi wajib diisi.';
    else if (!HalamanOtentikasi.surelBerdomainItb(email)) galat.email = `Gunakan surel berdomain ${HalamanOtentikasi.DOMAIN_SUREL}.`;
    if (!HalamanOtentikasi.kataSandiCukupKuat(kataSandi)) galat['kata-sandi'] = 'Minimal 8 karakter, memuat huruf dan angka.';
    if (Object.keys(galat).length > 0) {
      Object.entries(galat).forEach(([id, pesan]) => HalamanOtentikasi.tampilkanGalatIsian(id, pesan));
      return;
    }
    if (!setujuKebijakan) {
      this.tampilkanPesanGalat('Anda harus menyetujui Kebijakan Privasi dan Ketentuan Penggunaan.');
      return;
    }

    const tombol = document.getElementById('tombol-daftar');
    tombol.disabled = true;
    tombol.textContent = 'Membuat akun…';
    const hasil = await Api.kirim('POST', '/api/akun/daftar', { nama, nim, email, kataSandi, setujuKebijakan });
    tombol.textContent = 'Buat Akun';
    tombol.disabled = false;

    if (!hasil.sukses) {
      const isian = HalamanOtentikasi.ISIAN_GALAT[hasil.kode];
      if (isian) HalamanOtentikasi.tampilkanGalatIsian(isian, hasil.pesan);
      if (!isian || hasil.kode === 'SUREL_TERDAFTAR') this.tampilkanPesanGalat(hasil.pesan, hasil.kode);
      return;
    }

    HalamanOtentikasi.simpanBatasKode(hasil.data.email, hasil.data.durasiKodeDetik);
    this.arahkanKeHalamanVerifikasi(hasil.data.email, hasil.data.surelTerkirim);
  }

  arahkanKeHalamanVerifikasi(email = this.email, surelTerkirim = true) {
    const alamat = HalamanOtentikasi.alamatVerifikasi(email);
    window.location.href = surelTerkirim ? alamat : `${alamat}&terkirim=0`;
  }

  // ───────────── I-03 Verifikasi Surel ─────────────

  tampilkanFormulirVerifikasi() {
    const parameter = new URLSearchParams(window.location.search);
    this.email = (parameter.get('email') || '').trim().toLowerCase();

    if (!this.email) {
      document.getElementById('formulir-verifikasi').hidden = true;
      this.tampilkanPesanGalat('Alamat surel tidak diketahui. Silakan daftar atau masuk terlebih dahulu.');
      return;
    }
    document.getElementById('email-tujuan').textContent = this.email;
    if (parameter.get('terkirim') === '0') {
      this.tampilkanPesanGalat('Akun berhasil dibuat, tetapi kode verifikasi gagal dikirim. Gunakan tombol kirim ulang.');
    }

    this.pasangIsianKode();
    document.getElementById('tombol-kirim-ulang').addEventListener('click', () => this.mintaKirimUlang(this.email));
    document.getElementById('formulir-verifikasi').addEventListener('submit', (e) => {
      e.preventDefault();
      this.kirimKodeVerifikasi(this.email, HalamanOtentikasi.bacaKode());
    });

    // Hitung mundur dilanjutkan dari batas waktu yang disimpan saat kode dikirim.
    // Bila tidak ada (misalnya datang dari I-01), tombol kirim ulang langsung aktif.
    const batas = Number(sessionStorage.getItem(`${HalamanOtentikasi.KUNCI_BATAS_KODE}:${this.email}`)) || 0;
    this.mulaiHitungMundur(Math.max(0, Math.round((batas - Date.now()) / 1000)));
  }

  async kirimKodeVerifikasi(email, kode) {
    this.kodeVerifikasi = kode;
    document.getElementById('pesan-galat').hidden = true;
    if (!/^\d{6}$/.test(kode)) {
      this.tampilkanPesanGalat('Masukkan 6 digit kode verifikasi.');
      return;
    }

    const tombol = document.getElementById('tombol-verifikasi');
    tombol.disabled = true;
    const hasil = await Api.kirim('POST', '/api/akun/verifikasi', { email, kode });
    tombol.disabled = false;

    if (!hasil.sukses) {
      this.tampilkanPesanGalat(hasil.pesan, hasil.kode);
      return;
    }
    sessionStorage.removeItem(`${HalamanOtentikasi.KUNCI_BATAS_KODE}:${email}`);
    Api.simpanSesi(hasil.data.token, hasil.data.peran, email);
    this.arahkanKeBeranda();
  }

  async mintaKirimUlang(email) {
    const tombol = document.getElementById('tombol-kirim-ulang');
    tombol.disabled = true;
    tombol.textContent = 'Mengirim…';
    document.getElementById('pesan-galat').hidden = true;

    const hasil = await Api.kirim('POST', '/api/akun/kirim-ulang', { email });
    tombol.textContent = 'Kirim ulang kode';
    if (!hasil.sukses) {
      this.tampilkanPesanGalat(hasil.pesan, hasil.kode);
      tombol.disabled = false;
      return;
    }
    HalamanOtentikasi.simpanBatasKode(email, hasil.data.durasiKodeDetik);
    HalamanOtentikasi.kosongkanKode();
    this.resetHitungMundur(hasil.data.durasiKodeDetik);
    this.tampilkanPesanSukses('Kode verifikasi baru telah dikirim.');
  }

  // I03-O03
  resetHitungMundur(durasiDetik) {
    this.mulaiHitungMundur(durasiDetik);
  }

  // I03-O07
  tampilkanPesanSukses(pesan) {
    const toast = document.getElementById('toast');
    toast.textContent = `✓ ${pesan}`;
    toast.hidden = false;
    clearTimeout(this.pengaturToast);
    this.pengaturToast = setTimeout(() => { toast.hidden = true; }, 4000);
  }

  mulaiHitungMundur(detik) {
    clearInterval(this.pengatur);
    this.sisaWaktu = detik;
    const label = document.getElementById('sisa-waktu');
    const tombol = document.getElementById('tombol-kirim-ulang');

    const perbarui = () => {
      if (this.sisaWaktu <= 0) {
        clearInterval(this.pengatur);
        document.getElementById('label-berlaku').hidden = true;
        tombol.disabled = false; // I03-O05: aktif setelah hitung mundur habis
        return;
      }
      const menit = String(Math.floor(this.sisaWaktu / 60)).padStart(2, '0');
      const sisaDetik = String(this.sisaWaktu % 60).padStart(2, '0');
      label.textContent = `${menit}:${sisaDetik}`;
      document.getElementById('label-berlaku').hidden = false;
      tombol.disabled = true;
      this.sisaWaktu -= 1;
    };
    perbarui();
    this.pengatur = setInterval(perbarui, 1000);
  }

  // I03-O02: enam kotak angka dengan fokus berpindah otomatis
  pasangIsianKode() {
    const kotak = [...document.querySelectorAll('.otp input')];
    kotak.forEach((isian, i) => {
      isian.addEventListener('input', () => {
        isian.value = isian.value.replace(/\D/g, '').slice(-1);
        isian.classList.toggle('is-filled', isian.value !== '');
        if (isian.value && i < kotak.length - 1) kotak[i + 1].focus();
      });
      isian.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !isian.value && i > 0) kotak[i - 1].focus();
      });
      isian.addEventListener('paste', (e) => {
        const angka = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, kotak.length);
        if (!angka) return;
        e.preventDefault();
        kotak.forEach((k, j) => {
          k.value = angka[j] || '';
          k.classList.toggle('is-filled', k.value !== '');
        });
        kotak[Math.min(angka.length, kotak.length) - 1].focus();
      });
    });
    kotak[0].focus();
  }

  // ───────────── Pembantu ─────────────

  static surelBerdomainItb(email) {
    return /^[^\s@]+@itb\.ac\.id$/i.test(email);
  }

  static kataSandiCukupKuat(kataSandi) {
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(kataSandi);
  }

  // I02-O04: indikator kekuatan kata sandi
  static tampilkanKekuatanKataSandi(kataSandi) {
    const petunjuk = document.getElementById('petunjuk-kata-sandi');
    if (!kataSandi) {
      petunjuk.textContent = 'Minimal 8 karakter, memuat huruf dan angka.';
      return;
    }
    let skor = 0;
    if (kataSandi.length >= 8) skor += 1;
    if (/[A-Za-z]/.test(kataSandi) && /\d/.test(kataSandi)) skor += 1;
    if (kataSandi.length >= 12 && /[^A-Za-z0-9]/.test(kataSandi)) skor += 1;
    petunjuk.textContent = `Kekuatan kata sandi: ${['lemah', 'lemah', 'cukup', 'kuat'][skor]}`;
  }

  static tampilkanGalatIsian(id, pesan) {
    const isian = document.getElementById(id);
    isian.classList.add('is-error');
    const galat = document.getElementById(`galat-${id}`);
    galat.textContent = pesan;
    galat.hidden = false;
  }

  static hapusGalatIsian(id) {
    const galat = document.getElementById(`galat-${id}`);
    if (!galat) return;
    document.getElementById(id).classList.remove('is-error');
    galat.hidden = true;
  }

  static bacaKode() {
    return [...document.querySelectorAll('.otp input')].map((k) => k.value).join('');
  }

  static kosongkanKode() {
    const kotak = [...document.querySelectorAll('.otp input')];
    kotak.forEach((k) => { k.value = ''; k.classList.remove('is-filled'); });
    kotak[0].focus();
  }

  static simpanBatasKode(email, durasiDetik) {
    sessionStorage.setItem(`${HalamanOtentikasi.KUNCI_BATAS_KODE}:${email}`, String(Date.now() + durasiDetik * 1000));
  }

  static alamatVerifikasi(email) {
    return `${HalamanOtentikasi.HALAMAN_VERIFIKASI}?email=${encodeURIComponent(email)}`;
  }

  static tautan(href, teks) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = teks;
    return a;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const halaman = new HalamanOtentikasi();
  const jenis = document.body.dataset.halaman;
  if (jenis === 'masuk') halaman.tampilkanFormulirLogin();
  else if (jenis === 'daftar') halaman.tampilkanFormulirPendaftaran();
  else if (jenis === 'verifikasi') halaman.tampilkanFormulirVerifikasi();
});
