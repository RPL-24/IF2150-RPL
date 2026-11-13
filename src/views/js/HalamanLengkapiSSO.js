// HalamanLengkapiSSO – melengkapi akun baru yang masuk lewat Google/Microsoft: NIM + persetujuan kebijakan.
// Nama dan surel berasal dari cookie profil sementara di server. Membutuhkan api.js.
class HalamanLengkapiSSO {
  static HALAMAN_TUJUAN = '/katalog';
  static HALAMAN_LOGIN = '/masuk';

  async mulai() {
    const profil = await Api.kirim('GET', '/api/akun/sso/profil-sementara');
    if (!profil.sukses) {
      window.location.href = `${HalamanLengkapiSSO.HALAMAN_LOGIN}?sso_galat=PROFIL_KEDALUWARSA`;
      return;
    }
    document.getElementById('nama').value = profil.data.nama;
    document.getElementById('email').value = profil.data.email;
    this.email = profil.data.email;

    Api.kirim('GET', '/api/akun/tautan-kebijakan').then((hasil) => {
      if (!hasil.sukses) return;
      document.querySelectorAll('[data-tautan-kebijakan]').forEach((a) => { a.href = hasil.data.tautan; });
    });

    const centang = document.getElementById('setuju-kebijakan');
    const tombol = document.getElementById('tombol-lengkapi');
    centang.addEventListener('change', () => { tombol.disabled = !centang.checked; });
    document.getElementById('nim').addEventListener('input', () => this.tampilkanGalatNim(null));
    document.getElementById('formulir-lengkapi').addEventListener('submit', (e) => {
      e.preventDefault();
      this.kirim(document.getElementById('nim').value.trim(), centang.checked);
    });
  }

  async kirim(nim, setujuKebijakan) {
    document.getElementById('pesan-galat').hidden = true;
    if (!nim) return this.tampilkanGalatNim('NIM wajib diisi.');
    if (!/^\d+$/.test(nim)) return this.tampilkanGalatNim('NIM hanya boleh berisi angka.');

    const tombol = document.getElementById('tombol-lengkapi');
    tombol.disabled = true;
    const hasil = await Api.kirim('POST', '/api/akun/sso/lengkapi', { nim, setujuKebijakan });
    tombol.disabled = false;

    if (!hasil.sukses) {
      if (hasil.kode === 'PROFIL_SSO_TIDAK_VALID') {
        window.location.href = `${HalamanLengkapiSSO.HALAMAN_LOGIN}?sso_galat=PROFIL_KEDALUWARSA`;
      } else if (hasil.kode === 'NIM_TIDAK_VALID') {
        this.tampilkanGalatNim(hasil.pesan);
      } else {
        const kotak = document.getElementById('pesan-galat');
        kotak.textContent = hasil.pesan;
        kotak.hidden = false;
      }
      return;
    }
    Api.simpanSesi(hasil.data.token, hasil.data.peran, this.email);
    window.location.href = HalamanLengkapiSSO.HALAMAN_TUJUAN;
  }

  tampilkanGalatNim(pesan) {
    const galat = document.getElementById('galat-nim');
    document.getElementById('nim').classList.toggle('is-error', pesan !== null);
    galat.textContent = pesan ?? '';
    galat.hidden = pesan === null;
  }
}

document.addEventListener('DOMContentLoaded', () => new HalamanLengkapiSSO().mulai());
