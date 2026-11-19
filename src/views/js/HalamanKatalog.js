/* C05 HalamanKatalog (I-04, I-05, I-05b): menampilkan katalog listing, pencarian kata kunci,
   penyaringan kategori/lokasi/harga, pengurutan, dan navigasi antarhalaman (UC13, UC14).
   Kriteria disimpan di URL sehingga tombol Kembali peramban dan tautan hasil tetap berfungsi. */
const KOLOM_KRITERIA = ['q', 'kategori', 'lokasi', 'hargaMin', 'hargaMaks', 'urut', 'halaman'];

class HalamanKatalog {
  constructor() {
    this.kriteria = HalamanKatalog.bacaUrl();
    this.inputCari = null;
    this.form = null;
    this.totalHalaman = 1;
  }

  static bacaUrl() {
    const p = new URLSearchParams(location.search);
    const kriteria = {};
    for (const kolom of KOLOM_KRITERIA) {
      const nilai = (p.get(kolom) || '').trim();
      if (nilai) kriteria[kolom] = nilai;
    }
    return kriteria;
  }

  static keQuery(kriteria) {
    const p = new URLSearchParams();
    for (const kolom of KOLOM_KRITERIA) {
      const nilai = kriteria[kolom];
      if (nilai !== undefined && nilai !== null && String(nilai).trim() !== '') p.set(kolom, String(nilai).trim());
    }
    return p.toString();
  }

  async mulai() {
    if (!await ListingUI.mulai()) return;
    this.inputCari = LayoutKatalog.pasangPencarian(this.kriteria.q, (q) => {
      this.terapkan({ ...this.kriteria, q, halaman: undefined });
    });

    this.form = document.getElementById('form-filter');
    // Di layar sempit filter dilipat agar barang langsung terlihat; di layar lebar selalu terbuka.
    const rinci = document.getElementById('filter-rinci');
    const sempit = window.matchMedia('(max-width: 959px)');
    rinci.open = !sempit.matches;
    rinci.addEventListener('toggle', () => { if (!sempit.matches) rinci.open = true; });
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.terapkan({ ...this.kriteria, ...this.bacaFormulir(), halaman: undefined });
    });
    this.form.elements.urut.addEventListener('change', () => {
      this.terapkan({ ...this.kriteria, urut: this.form.elements.urut.value, halaman: undefined });
    });
    const reset = () => this.terapkan({});
    document.getElementById('reset-filter').onclick = reset;
    document.getElementById('kosong-reset').onclick = reset;
    document.getElementById('hal-sebelum').onclick = () => this.keHalaman(-1);
    document.getElementById('hal-berikut').onclick = () => this.keHalaman(1);

    window.addEventListener('popstate', () => {
      this.kriteria = HalamanKatalog.bacaUrl();
      this.isiFormulir();
      this.muat();
    });

    await this.muatReferensi();
    this.isiFormulir();
    await this.muat();
  }

  // Mengisi pilihan kategori dan lokasi COD dari daftar tetap modul listing.
  async muatReferensi() {
    try {
      const { kategori = [], lokasi = [] } = await ListingUI.api('GET', '/api/barang/formulir');
      this.isiPilihan(this.form.elements.kategori, kategori);
      this.isiPilihan(this.form.elements.lokasi, lokasi);
    } catch (err) {
      ListingUI.galat(`Daftar kategori dan lokasi gagal dimuat: ${err.message}`);
    }
  }

  isiPilihan(select, daftar) {
    for (const nama of daftar) {
      const opsi = ListingUI.el('option', '', nama);
      opsi.value = nama;
      select.append(opsi);
    }
  }

  isiFormulir() {
    const el = this.form.elements;
    el.kategori.value = this.kriteria.kategori || '';
    el.lokasi.value = this.kriteria.lokasi || '';
    el.hargaMin.value = this.kriteria.hargaMin || '';
    el.hargaMaks.value = this.kriteria.hargaMaks || '';
    el.urut.value = this.kriteria.urut || 'terbaru';
    if (this.inputCari) this.inputCari.value = this.kriteria.q || '';
  }

  bacaFormulir() {
    const el = this.form.elements;
    return {
      kategori: el.kategori.value,
      lokasi: el.lokasi.value,
      hargaMin: el.hargaMin.value,
      hargaMaks: el.hargaMaks.value,
      urut: el.urut.value,
    };
  }

  terapkan(kriteriaBaru) {
    const { hargaMin, hargaMaks } = kriteriaBaru;
    if (hargaMin && hargaMaks && Number(hargaMin) > Number(hargaMaks)) {
      ListingUI.galat('Harga minimum tidak boleh lebih besar dari harga maksimum.');
      return;
    }
    const query = HalamanKatalog.keQuery(kriteriaBaru);
    this.kriteria = HalamanKatalog.bacaUrlDari(query);
    history.pushState(null, '', query ? `/katalog?${query}` : '/katalog');
    this.isiFormulir();
    this.muat();
  }

  static bacaUrlDari(query) {
    const kriteria = {};
    new URLSearchParams(query).forEach((nilai, kolom) => { kriteria[kolom] = nilai; });
    return kriteria;
  }

  keHalaman(langkah) {
    // Dari halaman di luar batas, "Sebelumnya" langsung kembali ke halaman terakhir.
    const sekarang = Math.min(Number(this.kriteria.halaman) || 1, this.totalHalaman + 1);
    this.terapkan({ ...this.kriteria, halaman: Math.max(1, sekarang + langkah) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async muat() {
    const memuat = document.getElementById('memuat');
    memuat.hidden = false;
    try {
      const query = HalamanKatalog.keQuery(this.kriteria);
      const data = await ListingUI.api('GET', `/api/katalog${query ? `?${query}` : ''}`);
      ListingUI.galat('');
      this.render(data);
    } catch (err) {
      ListingUI.galat(err.message);
      this.render(null);
    } finally {
      memuat.hidden = true;
    }
  }

  render(data) {
    const grid = document.getElementById('daftar-katalog');
    const info = document.getElementById('info-hasil');
    const kosong = document.getElementById('katalog-kosong');
    const nav = document.getElementById('paginasi');

    if (!data) {
      grid.replaceChildren();
      info.textContent = '';
      kosong.hidden = true;
      nav.hidden = true;
      return;
    }

    const { daftar, paginasi, kriteria } = data;
    this.totalHalaman = paginasi.totalHalaman;
    grid.replaceChildren(...daftar.map((b) => KartuProduk.buat(b)));

    const untuk = kriteria.kataKunci ? ` untuk “${kriteria.kataKunci}”` : '';
    info.textContent = paginasi.totalItem > 0 ? `${paginasi.totalItem} barang ditemukan${untuk}` : '';

    // I-05b: tidak ada hasil, atau nomor halaman melewati halaman terakhir.
    kosong.hidden = daftar.length > 0;
    const lewatBatas = daftar.length === 0 && paginasi.totalItem > 0;
    document.getElementById('kosong-judul').textContent = lewatBatas ? 'Halaman tidak tersedia' : 'Barang tidak ditemukan';
    document.getElementById('kosong-teks').textContent = lewatBatas
      ? `Katalog hanya memiliki ${paginasi.totalHalaman} halaman.`
      : 'Coba kata kunci lain atau ubah filter pencarian.';

    nav.hidden = paginasi.totalHalaman <= 1 && paginasi.halaman <= 1;
    document.getElementById('hal-info').textContent = `Halaman ${paginasi.halaman} dari ${paginasi.totalHalaman}`;
    document.getElementById('hal-sebelum').disabled = paginasi.halaman <= 1;
    document.getElementById('hal-berikut').disabled = paginasi.halaman >= paginasi.totalHalaman;
  }
}

document.addEventListener('DOMContentLoaded', () => new HalamanKatalog().mulai());
