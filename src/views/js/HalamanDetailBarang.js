/* C07 HalamanDetailBarang (I-06): seluruh foto, judul, harga, deskripsi kondisi, kategori,
   lokasi COD, identitas penjual, tombol Hubungi Penjual (Modul D) dan Laporkan (Modul E) (UC15). */

// Alamat halaman milik modul lain. Sesuaikan jika nama halamannya berbeda.
const URL_PERCAKAPAN = '/percakapan';
const URL_PERCAKAPAN_API = '/api/percakapan';
const URL_FORM_LAPORAN = '/laporan-form';
const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class HalamanDetailBarang {
  constructor() {
    this.idBarang = new URLSearchParams(location.search).get('id') || '';
  }

  async mulai() {
    if (!await ListingUI.mulai()) return;
    LayoutKatalog.pasangPencarian('', (q) => {
      location.assign(q.trim() ? `/katalog?q=${encodeURIComponent(q.trim())}` : '/katalog');
    });

    const memuat = document.getElementById('memuat');
    try {
      if (!POLA_UUID.test(this.idBarang)) throw new Error('ID listing tidak valid.');
      const barang = await ListingUI.api('GET', `/api/katalog/${encodeURIComponent(this.idBarang)}`);
      this.render(barang);
    } catch (err) {
      ListingUI.galat(err.message);
    } finally {
      memuat.hidden = true;
    }
  }

  render(b) {
    document.title = `${b.judul} · ITBELI`;
    document.getElementById('judul').textContent = b.judul;
    document.getElementById('harga').textContent = ListingUI.uang(b.harga);
    document.getElementById('kategori').textContent = b.idKategori || '-';
    document.getElementById('status-teks').textContent = b.status || '-';
    document.getElementById('lokasi').textContent = b.idLokasi || '-';
    document.getElementById('waktu').textContent = b.waktuUnggah
      ? new Date(b.waktuUnggah).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '-';
    document.getElementById('deskripsi').textContent = b.deskripsiKondisi || '-';
    document.getElementById('badge-status').hidden = b.status !== 'Terjual';

    const nama = (b.penjual && b.penjual.nama) || 'Penjual';
    document.getElementById('penjual-nama').textContent = nama;
    document.getElementById('penjual-inisial').textContent = nama
      .split(/\s+/).slice(0, 2).map((x) => x[0]).join('').toUpperCase();

    this.renderGaleri(b);
    this.renderAksi(b);
    document.getElementById('detail').hidden = false;
  }

  renderGaleri(b) {
    const utama = document.getElementById('foto-utama');
    const thumbs = document.getElementById('foto-thumbs');
    const sebelum = document.getElementById('foto-sebelum');
    const berikut = document.getElementById('foto-berikut');
    const daftar = Array.isArray(b.daftarFoto) ? b.daftarFoto : [];

    if (daftar.length === 0) {
      utama.replaceChildren(ListingUI.el('div', 'ph', 'Belum ada foto'));
      thumbs.hidden = true;
      return;
    }

    const img = ListingUI.el('img');
    let sekarang = 0;
    const tampilkan = (i) => {
      sekarang = (i + daftar.length) % daftar.length;
      img.src = daftar[sekarang].pathBerkas;
      img.alt = `${b.judul} (foto ${sekarang + 1} dari ${daftar.length})`;
      thumbs.querySelectorAll('button').forEach((t, j) => t.classList.toggle('is-active', sekarang === j));
    };
    utama.replaceChildren(img);

    thumbs.replaceChildren(...daftar.map((foto, i) => {
      const tombol = ListingUI.el('button', 'detail__thumb');
      tombol.type = 'button';
      tombol.setAttribute('aria-label', `Tampilkan foto ${i + 1}`);
      const kecil = ListingUI.el('img');
      kecil.src = foto.pathBerkas;
      kecil.alt = '';
      tombol.append(kecil);
      tombol.onclick = () => tampilkan(i);
      return tombol;
    }));
    thumbs.hidden = daftar.length < 2;
    sebelum.hidden = berikut.hidden = daftar.length < 2;
    sebelum.onclick = () => tampilkan(sekarang - 1);
    berikut.onclick = () => tampilkan(sekarang + 1);
    tampilkan(0);
  }

  renderAksi(b) {
    const aksi = document.getElementById('aksi');
    const kotak = document.getElementById('kotak-pesan');
    aksi.replaceChildren();
    kotak.hidden = true;

    if (b.milikSendiri) {
      aksi.append(ListingUI.el('p', 'muted', 'Ini listing milik Anda.'));
      const ubah = ListingUI.el('a', 'btn btn--primer', 'Ubah Listing');
      ubah.href = `/listing-form?id=${encodeURIComponent(b.idBarang)}`;
      aksi.append(ubah);
      return;
    }

    if (b.status === 'Tersedia') {
      const hubungi = ListingUI.el('button', 'btn btn--primer', 'Kirim pesan');
      hubungi.type = 'button';
      hubungi.onclick = () => this.hubungiPenjual(b, hubungi);
      aksi.append(hubungi);

      const tombolKirim = document.getElementById('kirim-pesan-awal');
      kotak.hidden = false;
      kotak.onsubmit = (e) => {
        e.preventDefault();
        const isi = document.getElementById('pesan-awal').value.trim();
        if (!isi) { ListingUI.toast('Tulis pesan terlebih dahulu.'); return; }
        this.hubungiPenjual(b, tombolKirim, isi);
      };
    } else {
      aksi.append(ListingUI.el('p', 'muted', 'Barang ini sudah terjual.'));
    }

    const lapor = ListingUI.el('a', 'iconbtn');
    lapor.title = 'Laporkan';
    lapor.setAttribute('aria-label', 'Laporkan listing ini');
    lapor.append(ListingUI.el('span', 'ic ic--flag'));
    lapor.href = `${URL_FORM_LAPORAN}?${new URLSearchParams({ objek: b.idBarang, jenis: 'Listing' })}`;
    aksi.append(lapor);
  }

  // UC16 (Modul D): membuka atau membuat percakapan untuk listing ini.
  // Bila pesanAwal diberikan, pesan itu dikirim lewat API percakapan yang sama dengan ruang chat (UC17).
  async hubungiPenjual(b, tombol, pesanAwal) {
    tombol.disabled = true;
    try {
      const r = await Api.kirim('POST', '/api/percakapan', { idBarang: b.idBarang });
      if (r.status === 401) { Api.hapusSesi(); location.assign('/masuk'); return; }
      if (r.status === 404 && !r.sukses && r.pesan === 'Endpoint tidak ditemukan.') {
        ListingUI.toast('Fitur percakapan belum tersedia.');
        return;
      }
      if (!r.sukses) throw new Error(r.pesan || 'Percakapan gagal dibuka.');
      const id = r.data && (r.data.idPercakapan || r.data.id);
      if (id && pesanAwal) {
        const k = await Api.kirim('POST', `${URL_PERCAKAPAN_API}/${encodeURIComponent(id)}/pesan`, { isi: pesanAwal });
        if (!k.sukses) throw new Error(k.pesan || 'Pesan gagal dikirim.');
      }
      location.assign(id ? `${URL_PERCAKAPAN}?id=${encodeURIComponent(id)}` : URL_PERCAKAPAN);
    } catch (err) {
      ListingUI.toast(err.message);
    } finally {
      tombol.disabled = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new HalamanDetailBarang().mulai());
