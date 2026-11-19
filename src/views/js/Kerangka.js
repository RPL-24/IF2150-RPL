/* Kerangka halaman bersama: topbar (header[data-topbar]) dan sidebar (aside[data-judul]).
   Satu sumber markup agar semua halaman pengguna tampil seragam.
   Dimuat sebelum PanelNotifikasi.js, sehingga lonceng sudah ada saat panel dipasang. */
const Kerangka = {
  // [label, alamat, ikon, awalan alamat yang dianggap aktif]
  MENU: [
    ['Katalog', '/katalog', 'store', ['/katalog', '/barang']],
    ['Listing Saya', '/listing-saya', 'list', ['/listing-saya', '/listing-form', '/detail']],
    ['Percakapan', '/percakapan', 'chat', ['/percakapan']],
  ],
  MENU_RAIL: [
    ['Notifikasi', '#notifikasi', 'bell', []],
    ['Profil Akun', '/profil', 'user', ['/profil']],
  ],

  aktif(awalan) {
    const p = location.pathname.replace(/\.html$/, '');
    return awalan.some((a) => p === a || p.startsWith(`${a}/`));
  },

  el(tag, kelas, html) {
    const e = document.createElement(tag);
    if (kelas) e.className = kelas;
    if (html !== undefined) e.innerHTML = html;
    return e;
  },

  // Seluruh string di bawah statis (bukan data pengguna).
  htmlTopbar() {
    const tab = this.MENU.map(([nama, url, ikon, awalan]) => {
      const aktif = this.aktif(awalan);
      return `<a class="topbar__tab${aktif ? ' is-active' : ''}" href="${url}" title="${nama}" aria-label="${nama}"${aktif ? ' aria-current="page"' : ''}><span class="ic ic--${ikon}"></span></a>`;
    }).join('');
    return `<div class="topbar__left">
        <a class="brand" href="/" aria-label="ITBELI, beranda"><img class="brand__mark" src="/ikon/itbeli-simbol.svg" alt="" width="40" height="40"></a>
        <form class="searchbar" role="search" action="/katalog" method="get">
          <span class="ic ic--search" aria-hidden="true"></span>
          <input class="searchbar__input" type="search" name="q" maxlength="100" placeholder="Cari di ITBELI" aria-label="Cari barang">
        </form>
      </div>
      <nav class="topbar__tabs" aria-label="Menu utama">${tab}</nav>
      <div class="topbar__right">
        <a class="iconbtn topbar__jual" href="/listing-form" title="Jual barang" aria-label="Jual barang"><span class="ic ic--plus"></span></a>
        <a class="iconbtn" href="/percakapan" title="Percakapan" aria-label="Percakapan"><span class="ic ic--chat"></span><span id="badge-topbar-percakapan" class="iconbtn__badge" hidden>0</span></a>
        <button type="button" class="iconbtn" title="Notifikasi" aria-label="Notifikasi" data-notifikasi-lonceng><span class="ic ic--bell"></span></button>
        <a id="avatar-topbar" class="avatar" href="/profil" aria-label="Profil akun">?</a>
      </div>`;
  },

  pasangTopbar() {
    const bar = document.querySelector('header[data-topbar]');
    if (!bar) return;
    bar.classList.add('topbar');
    bar.innerHTML = this.htmlTopbar();
    if (typeof Api === 'undefined' || !Api.getToken()) return;
    Api.kirim('GET', '/api/akun/profil').then((r) => {
      if (!r.sukses || !r.data || !r.data.nama) return;
      document.getElementById('avatar-topbar').textContent = r.data.nama
        .trim().split(/\s+/).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
    });
  },

  // Menyisipkan judul, menu, dan tombol jual di awal sidebar; isi yang sudah ada (mis. filter) tetap di bawahnya.
  pasangRail() {
    const rail = document.querySelector('aside.rail[data-judul]');
    if (!rail) return;
    const judul = this.el('h1', 'rail__judul');
    judul.textContent = rail.dataset.judul;

    const nav = this.el('nav', 'navlist');
    nav.setAttribute('aria-label', 'Menu akun');
    for (const [nama, url, ikon, awalan] of [...this.MENU, ...this.MENU_RAIL]) {
      const a = this.el('a', this.aktif(awalan) ? 'is-active' : '', `<span class="navlist__ic"><span class="ic ic--${ikon}"></span></span>`);
      a.href = url;
      if (a.classList.contains('is-active')) a.setAttribute('aria-current', 'page');
      a.append(document.createTextNode(nama));
      nav.append(a);
    }
    const jual = this.el('a', 'btn btn--biru btn--blok');
    jual.href = '/listing-form';
    jual.textContent = '+ Jual Barang';
    rail.prepend(judul, nav, jual);
    if (rail.children.length > 3) jual.after(this.el('div', 'divider'));
  },

  mulai() {
    this.pasangTopbar();
    this.pasangRail();
  },
};

Kerangka.mulai();
