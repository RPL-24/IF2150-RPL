// C02 HalamanProfil – View untuk I-09 Profil Akun.
// Membutuhkan api.js dan HalamanOtentikasi.js (untuk tombol Keluar, I09-O05).
class HalamanProfil {
  static HALAMAN_DETAIL = '/detail';

  constructor() {
    this.dataAkun = null;
    this.daftarKartuProduk = [];
  }

  // I09-O01 (KF04)
  async muatProfil() {
    if (!Api.getToken()) {
      new HalamanOtentikasi().arahkanKeHalamanLogin();
      return;
    }

    const hasil = await Api.kirim('GET', '/api/akun/profil');
    if (hasil.status === 401) {
      // Sesi kedaluwarsa atau sudah dicabut
      const otentikasi = new HalamanOtentikasi();
      otentikasi.hapusTokenLokal();
      otentikasi.arahkanKeHalamanLogin();
      return;
    }
    if (!hasil.sukses) {
      HalamanProfil.tampilkanGalat(hasil.pesan);
      return;
    }

    this.tampilkanProfil(hasil.data);
    this.tampilkanDaftarListing(hasil.data.daftarBarang);
    this.bukaPengaturanAkun();
    document.getElementById('profil').hidden = false;
  }

  tampilkanProfil(data) {
    this.dataAkun = data;
    document.getElementById('nama-akun').textContent = data.nama;
    document.getElementById('identitas-akun').textContent = `${data.nim} · ${data.email}`;
    document.getElementById('inisial').textContent = HalamanProfil.inisial(data.nama);
    document.getElementById('status-akun').textContent = data.statusAkun;
    document.getElementById('badge-diblokir').hidden = !data.statusBlokir; // I09-O06
    document.getElementById('badge-admin').hidden = data.peran !== 'Admin';

    const tersedia = data.daftarBarang.filter((b) => b.status === 'Tersedia').length;
    document.getElementById('jumlah-tersedia').textContent = tersedia;
    document.getElementById('jumlah-terjual').textContent = data.daftarBarang.length - tersedia;
  }

  // I09-O02
  tampilkanDaftarListing(daftarBarang) {
    const grid = document.getElementById('daftar-listing');
    this.daftarKartuProduk = daftarBarang.map((barang) => HalamanProfil.buatKartu(barang));
    grid.replaceChildren(...this.daftarKartuProduk);
    document.getElementById('listing-kosong').hidden = daftarBarang.length > 0;
  }

  // I09-O03: tautan dokumen legal diambil dari AkunController.getTautanDokumenLegal()
  async bukaPengaturanAkun() {
    const hasil = await Api.kirim('GET', '/api/akun/tautan-kebijakan');
    if (hasil.sukses) this.tampilkanTautanKebijakan(hasil.data.tautan);

    document.getElementById('tombol-keluar').addEventListener('click', (e) => {
      e.preventDefault();
      new HalamanOtentikasi().kirimPermintaanLogout(Api.getToken()); // I09-O05 (UC04)
    });
  }

  // I09-O04 (KF39)
  tampilkanTautanKebijakan(tautan) {
    document.getElementById('tautan-kebijakan').href = tautan;
  }

  // ───────────── Pembantu ─────────────

  // Kartu sederhana bergaya .card sesuai mockup.
  // TODO(modul-C): ganti dengan KartuProduk.render(barang) setelah C06 tersedia.
  static buatKartu(barang) {
    const terjual = barang.status === 'Terjual';
    const kartu = document.createElement('a');
    kartu.className = `card${terjual ? ' is-terjual' : ''}`;
    kartu.href = `${HalamanProfil.HALAMAN_DETAIL}?id=${encodeURIComponent(barang.idBarang)}`;

    const media = document.createElement('div');
    media.className = 'card__media';
    if (terjual) {
      const badge = document.createElement('span');
      badge.className = 'badge badge--terjual card__badge';
      badge.textContent = 'Terjual';
      media.append(badge);
    }
    if (barang.fotoUtama) {
      const img = document.createElement('img');
      img.src = barang.fotoUtama;
      img.alt = barang.judul;
      img.loading = 'lazy';
      media.append(img);
    } else {
      const kosong = document.createElement('div');
      kosong.className = 'ph ph--bukti';
      media.append(kosong);
    }

    const badan = document.createElement('div');
    badan.className = 'card__body';
    const harga = document.createElement('div');
    harga.className = 'card__price';
    harga.textContent = HalamanProfil.formatHarga(barang.harga);
    const judul = document.createElement('div');
    judul.className = 'card__title';
    judul.textContent = barang.judul;
    const meta = document.createElement('div');
    meta.className = 'card__meta';
    meta.textContent = [barang.idLokasi, barang.idKategori].filter(Boolean).join(' · ');
    badan.append(harga, judul, meta);

    kartu.append(media, badan);
    return kartu;
  }

  static formatHarga(harga) {
    return `Rp${Number(harga).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
  }

  static inisial(nama) {
    return nama.trim().split(/\s+/).slice(0, 2).map((k) => k[0]).join('').toUpperCase();
  }

  static tampilkanGalat(pesan) {
    const kotak = document.getElementById('pesan-galat');
    kotak.textContent = pesan || 'Profil tidak dapat dimuat.';
    kotak.hidden = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HalamanProfil().muatProfil();
});
