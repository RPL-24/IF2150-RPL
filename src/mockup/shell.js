/* ITBELI — kerangka bersama untuk berkas mockup.
   Menyisipkan top bar dan rail kiri supaya markup-nya tidak diulang di tiap layar.

   Pemakaian:
     <div data-topbar></div>                 → top bar pengguna (default)
     <div data-topbar="tamu"></div>          → top bar pengunjung yang belum masuk
     <div data-topbar="admin"></div>         → top bar admin
     <div data-rail="katalog"></div>         → rail filter + kategori
     <div data-rail="akun"></div>            → rail navigasi akun
     <div data-rail="admin"></div>           → rail navigasi moderasi

   Atribut tambahan pada rail:
     data-aktif="Buku kuliah"                → menandai butir yang sedang dipilih
*/

const BRAND = `
  <div class="brand">
    <div class="brand__mark">IT</div>
    <div>
      <div class="brand__name">ITBELI</div>
      <div class="brand__tag">Marketplace preloved sivitas ITB</div>
    </div>
  </div>`;

const SEARCHBAR = `
  <div class="searchbar">
    <span class="ic ic--search"></span>
    <span>Cari jas praktikum, buku, kalkulator…</span>
  </div>`;

const TOPBAR = {
  pengguna: `
    ${BRAND}${SEARCHBAR}
    <div class="topbar__right">
      <div class="iconbtn"><span class="ic ic--bell"></span><span class="iconbtn__badge">3</span></div>
      <div class="iconbtn"><span class="ic ic--chat"></span><span class="iconbtn__badge">2</span></div>
      <div class="avatar">SD</div>
    </div>`,

  tamu: `
    ${BRAND}${SEARCHBAR}
    <div class="topbar__right">
      <button class="btn btn--sekunder btn--sm">Masuk</button>
      <button class="btn btn--primer btn--sm">Daftar</button>
    </div>`,

  /* Halaman otentikasi (I-01, I-02): tanpa kolom pencarian, karena pengunjung
     di sini sedang masuk atau mendaftar, bukan menjelajah katalog. */
  otentikasi: `
    ${BRAND}
    <div class="topbar__right">
      <a href="#" style="color:var(--text-600);text-decoration:none;font-size:14px">Bantuan</a>
      <button class="btn btn--sekunder btn--sm">Masuk</button>
      <button class="btn btn--primer btn--sm">Daftar</button>
    </div>`,

  admin: `
    ${BRAND}
    <div class="row gap-3 ml-auto">
      <span class="badge">Mode Admin</span>
      <div class="iconbtn"><span class="ic ic--bell"></span><span class="iconbtn__badge">5</span></div>
      <div class="avatar">AD</div>
    </div>`
};

const KATEGORI = [
  "Semua kategori", "Jas praktikum", "Buku kuliah",
  "Alat laboratorium", "Kalkulator", "Jaket himpunan", "Perlengkapan kos"
];

function railKatalog(aktif) {
  const butir = KATEGORI.map(nama => {
    const kelas = nama === aktif ? ' class="is-active"' : "";
    return `<a href="#"${kelas}><span class="dot"></span>${nama}</a>`;
  }).join("\n        ");

  return `
    <button class="btn btn--primer btn--blok">+ Jual Barang</button>

    <div class="rail__group">
      <div class="rail__title">Filter</div>

      <div class="field">
        <div class="field__label">Harga</div>
        <div class="row gap-2">
          <div class="field__input is-placeholder grow">Min.</div>
          <span class="muted">—</span>
          <div class="field__input is-placeholder grow">Maks.</div>
        </div>
      </div>

      <div class="field">
        <div class="field__label">Lokasi titik temu COD</div>
        <div class="field__input select is-placeholder">Semua lokasi</div>
      </div>

      <div class="field">
        <div class="field__label">Urutkan</div>
        <div class="field__input select">Terbaru</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="rail__group">
      <div class="rail__title">Kategori</div>
      <nav class="navlist">
        ${butir}
      </nav>
    </div>`;
}

function railNav(judul, butir, aktif) {
  const daftar = butir.map(nama => {
    const kelas = nama === aktif ? ' class="is-active"' : "";
    return `<a href="#"${kelas}><span class="dot"></span>${nama}</a>`;
  }).join("\n        ");

  return `
    <button class="btn btn--primer btn--blok">+ Jual Barang</button>
    <div class="rail__group">
      <div class="rail__title">${judul}</div>
      <nav class="navlist">
        ${daftar}
      </nav>
    </div>`;
}

const RAIL_AKUN = ["Katalog", "Listing Saya", "Percakapan", "Notifikasi", "Profil Akun"];
const RAIL_ADMIN = ["Daftar Laporan", "Akun Diblokir", "Log Aktivitas"];

/* Data contoh — dipakai ulang di seluruh layar supaya isinya konsisten.
   Lihat docs/design/ITBELI-UI-Design-Spec.md bagian 10. */
const BARANG = [
  { harga: "Rp120.000", judul: "Jas Praktikum Kimia Ukuran M", meta: "Labtek V · Jas praktikum", foto: "jas" },
  { harga: "Rp180.000", judul: "Kalkulator Casio FX-991EX Classwiz", meta: "Gedung Oktagon · Kalkulator", foto: "kalkulator", badge: "Baru" },
  { harga: "Rp85.000", judul: "Kalkulus Jilid 1 — Purcell edisi 9", meta: "Perpustakaan Pusat · Buku kuliah", foto: "buku" },
  { harga: "Rp250.000", judul: "Jaket Himpunan HMIF 2023", meta: "Labtek V · Jaket himpunan", foto: "jaket" },
  { harga: "Rp60.000", judul: "Rak Buku Lipat 3 Susun", meta: "Gerbang Belakang · Perlengkapan kos", foto: "rak" },
  { harga: "Rp95.000", judul: "Set Alat Gelas Praktikum Dasar", meta: "Labtek X · Alat laboratorium", foto: "lab" },
  { harga: "Rp110.000", judul: "Jas Praktikum Fisika Ukuran L", meta: "Labtek VI · Jas praktikum", foto: "jas", terjual: true },
  { harga: "Rp95.000", judul: "Fisika Dasar Halliday Jilid 2", meta: "Perpustakaan Pusat · Buku kuliah", foto: "buku" }
];

function kartu(b) {
  const badge = b.terjual
    ? '<span class="badge badge--terjual card__badge">Terjual</span>'
    : b.badge ? `<span class="badge badge--baru card__badge">${b.badge}</span>` : "";
  return `
    <article class="card${b.terjual ? " is-terjual" : ""}">
      <div class="card__media">${badge}<div class="ph ph--${b.foto}"></div></div>
      <div class="card__body">
        <div class="card__price">${b.harga}</div>
        <div class="card__title">${b.judul}</div>
        <div class="card__meta">${b.meta}</div>
      </div>
    </article>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const bar = document.querySelector("[data-topbar]");
  if (bar) {
    bar.className = "topbar";
    bar.innerHTML = TOPBAR[bar.dataset.topbar || "pengguna"];
  }

  const rail = document.querySelector("[data-rail]");
  if (rail) {
    rail.className = "rail";
    const aktif = rail.dataset.aktif;
    const jenis = rail.dataset.rail;
    if (jenis === "katalog") rail.innerHTML = railKatalog(aktif || "Semua kategori");
    else if (jenis === "akun") rail.innerHTML = railNav("Akun Saya", RAIL_AKUN, aktif || "Katalog");
    else if (jenis === "admin") {
      rail.innerHTML = railNav("Moderasi", RAIL_ADMIN, aktif || "Daftar Laporan");
      rail.querySelector(".btn").remove();
    }
  }

  document.querySelectorAll("[data-cards]").forEach(el => {
    const n = Number(el.dataset.cards) || BARANG.length;
    el.innerHTML = BARANG.slice(0, n).map(kartu).join("\n");
  });
});
