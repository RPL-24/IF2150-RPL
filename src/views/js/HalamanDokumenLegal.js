// C12 HalamanDokumenLegal – View untuk I-15 Dokumen Legal.
// Membutuhkan api.js.
class HalamanDokumenLegal {
  static JENIS_BAWAAN = 'kebijakan-privasi';

  constructor() {
    this.judul = '';
    this.isiDokumen = '';
    this.pengamat = null;
  }

  // I15-O01 (UC06)
  async bukaDokumen(jenis) {
    document.querySelectorAll('[data-jenis]').forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.jenis === jenis);
    });
    document.getElementById('pesan-galat').hidden = true;

    const hasil = await Api.kirim('GET', `/api/dokumen-legal/${encodeURIComponent(jenis)}`);
    if (!hasil.sukses) {
      HalamanDokumenLegal.tampilkanGalat(hasil.pesan);
      return;
    }

    const dokumen = hasil.data;
    document.title = `${dokumen.judul} · ITBELI`;
    document.getElementById('info-versi').textContent =
      `Versi ${dokumen.versi} · Berlaku sejak ${HalamanDokumenLegal.formatTanggal(dokumen.tanggalBerlaku)}`;
    this.tampilkanDokumen(dokumen.judul, dokumen.isi);
    this.sorotKlausaPrivasi(dokumen.klausaPrivasiPesan);
  }

  // I15-O02, I15-O03, I15-O05
  tampilkanDokumen(judul, isi) {
    this.judul = judul;
    this.isiDokumen = isi;
    document.getElementById('judul-dokumen').textContent = judul;

    const wadah = document.getElementById('isi-dokumen');
    const daftarIsi = document.getElementById('daftar-isi');
    wadah.replaceChildren();
    daftarIsi.replaceChildren();

    HalamanDokumenLegal.uraikanBagian(isi).forEach((bagian, i) => {
      const elBagian = document.createElement('section');
      if (bagian.judul) {
        elBagian.id = `bagian-${i}`;
        const h3 = document.createElement('h3');
        h3.textContent = bagian.judul;
        elBagian.append(h3);

        const tautan = document.createElement('a');
        tautan.href = `#bagian-${i}`;
        tautan.textContent = bagian.judul;
        daftarIsi.append(tautan);
      }
      bagian.paragraf.forEach((teks) => {
        const p = document.createElement('p');
        p.className = 'mt-2';
        p.textContent = teks;
        elBagian.append(p);
      });
      wadah.append(elBagian);
    });

    this.pantauBagianAktif();
    document.getElementById('dokumen').hidden = false;
  }

  // I15-O04 (KF38)
  sorotKlausaPrivasi(klausa) {
    const kotak = document.getElementById('klausa-privasi');
    if (!klausa) {
      kotak.hidden = true;
      return;
    }
    // Kalimat pertama ditebalkan sebagai pernyataan utama.
    const batas = klausa.indexOf('. ');
    const utama = batas === -1 ? klausa : klausa.slice(0, batas + 1);
    const tebal = document.createElement('strong');
    tebal.textContent = utama;
    kotak.replaceChildren(tebal, batas === -1 ? '' : klausa.slice(batas + 2));
    kotak.hidden = false;
  }

  // Menandai butir daftar isi sesuai bagian yang sedang terlihat
  pantauBagianAktif() {
    if (this.pengamat) this.pengamat.disconnect();
    const tautan = [...document.querySelectorAll('#daftar-isi a')];
    if (tautan.length === 0) return;

    const tandai = (id) => tautan.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
    tandai(tautan[0].getAttribute('href').slice(1));
    // Bagian akhir dokumen pendek tidak bisa digulir sampai atas, jadi butir yang diklik langsung ditandai.
    let abaikanHingga = 0;
    tautan.forEach((a) => a.addEventListener('click', () => {
      tandai(a.getAttribute('href').slice(1));
      abaikanHingga = Date.now() + 800; // jangan ditimpa pengamat saat halaman melompat
    }));
    if (!('IntersectionObserver' in window)) return;

    this.pengamat = new IntersectionObserver((entri) => {
      if (Date.now() < abaikanHingga) return;
      const terlihat = entri.filter((e) => e.isIntersecting);
      if (terlihat.length > 0) tandai(terlihat[0].target.id);
    }, { rootMargin: '0px 0px -70% 0px' });
    document.querySelectorAll('#isi-dokumen section[id]').forEach((s) => this.pengamat.observe(s));
  }

  // ───────────── Pembantu ─────────────

  // "## Judul" memulai bagian baru; paragraf dipisahkan baris kosong.
  static uraikanBagian(isi) {
    const pisahParagraf = (teks) => teks.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
    return isi
      .split(/^## /m)
      .map((potongan, i) => {
        if (i === 0) return { judul: null, paragraf: pisahParagraf(potongan) };
        const [barisJudul, ...sisa] = potongan.split(/\r?\n/);
        return { judul: barisJudul.trim(), paragraf: pisahParagraf(sisa.join('\n')) };
      })
      .filter((b) => b.judul || b.paragraf.length > 0);
  }

  static formatTanggal(tanggal) {
    const waktu = new Date(`${tanggal}T00:00:00`);
    if (Number.isNaN(waktu.getTime())) return tanggal;
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(waktu);
  }

  static tampilkanGalat(pesan) {
    document.getElementById('dokumen').hidden = true;
    const kotak = document.getElementById('pesan-galat');
    kotak.textContent = pesan || 'Dokumen tidak dapat dimuat.';
    kotak.hidden = false;
  }

  // Topbar: tombol Masuk/Daftar untuk pengunjung, Beranda untuk pengguna yang sudah masuk
  static tampilkanNavigasi() {
    const sudahMasuk = Boolean(Api.getToken());
    document.querySelectorAll('[data-tamu]').forEach((el) => { el.hidden = sudahMasuk; });
    document.querySelectorAll('[data-pengguna]').forEach((el) => { el.hidden = !sudahMasuk; });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const halaman = new HalamanDokumenLegal();
  HalamanDokumenLegal.tampilkanNavigasi();

  document.querySelectorAll('[data-jenis]').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      history.replaceState(null, '', tab.getAttribute('href'));
      halaman.bukaDokumen(tab.dataset.jenis);
    });
  });

  const jenis = new URLSearchParams(window.location.search).get('jenis') || HalamanDokumenLegal.JENIS_BAWAAN;
  halaman.bukaDokumen(jenis);
});
