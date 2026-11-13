// TombolSSO – menampilkan tombol masuk Google/Microsoft sesuai penyedia yang aktif di server,
// dan pesan galat ramah bila server mengembalikan ?sso_galat=<KODE>. Dipakai di masuk.html.
(() => {
  const PESAN_GALAT = {
    STATE_TIDAK_VALID: 'Permintaan masuk tidak valid atau sudah kedaluwarsa. Silakan coba lagi.',
    DITOLAK_PENYEDIA: 'Proses masuk dibatalkan atau ditolak oleh penyedia. Silakan coba lagi.',
    PERTUKARAN_GAGAL: 'Tidak dapat menyelesaikan proses masuk dengan penyedia. Coba lagi beberapa saat lagi.',
    TOKEN_TIDAK_VALID: 'Identitas dari penyedia tidak dapat diterima. Pastikan memakai akun ITB yang benar.',
    SUREL_BELUM_TERVERIFIKASI: 'Surel akun Google Anda belum terverifikasi oleh Google.',
    DOMAIN_TIDAK_VALID: 'Gunakan akun ITB: Google @itb.ac.id atau Microsoft @mahasiswa.itb.ac.id.',
    AKUN_DIBLOKIR: 'Akun Anda ditangguhkan oleh admin karena melanggar ketentuan penggunaan.',
    SSO_ADMIN_DILARANG: 'Akun admin tidak dapat masuk lewat Google atau Microsoft. Masuk dengan surel dan kata sandi.',
    PENYEDIA_NONAKTIF: 'Masuk dengan penyedia tersebut belum tersedia.',
    PROFIL_KEDALUWARSA: 'Sesi pendaftaran sudah kedaluwarsa. Silakan masuk ulang dengan Google atau Microsoft.',
    KONFIGURASI_SALAH: 'Masuk dengan akun ITB sedang bermasalah. Hubungi pengelola.',
  };

  function tampilkanGalat() {
    const parameter = new URLSearchParams(window.location.search);
    const kode = parameter.get('sso_galat');
    if (!kode) return;
    const pesan = PESAN_GALAT[kode] || 'Masuk dengan akun ITB gagal. Silakan coba lagi.';

    // #pesan-galat milik formulir login; bila belum ada (tata letak lain), buat kotak sendiri.
    let kotak = document.getElementById('pesan-galat');
    if (!kotak) {
      kotak = document.createElement('div');
      kotak.className = 'infobox infobox--galat';
      kotak.setAttribute('role', 'alert');
      document.getElementById('sso-masuk').before(kotak);
    }
    kotak.textContent = pesan;
    kotak.hidden = false;
    parameter.delete('sso_galat');
    const sisa = parameter.toString();
    history.replaceState(null, '', window.location.pathname + (sisa ? `?${sisa}` : ''));
  }

  async function tampilkanTombol() {
    const wadah = document.getElementById('sso-masuk');
    if (!wadah) return;
    let aktif = {};
    try {
      const respons = await fetch('/api/akun/sso/penyedia');
      const isi = await respons.json();
      if (isi.sukses) aktif = isi.data;
    } catch { /* server tak terjangkau: tombol tetap tersembunyi */ }

    const google = document.getElementById('tombol-sso-google');
    const microsoft = document.getElementById('tombol-sso-microsoft');
    if (google) google.hidden = !aktif.google;
    if (microsoft) microsoft.hidden = !aktif.microsoft;
    wadah.hidden = !(aktif.google || aktif.microsoft);
  }

  tampilkanGalat();
  tampilkanTombol();
})();
