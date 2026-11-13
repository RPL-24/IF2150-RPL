// C09 PanelNotifikasi – View untuk I-11 Panel Notifikasi (UC17, DPPL 5.9).
// Dapat disisipkan di halaman mana pun yang memuat api.js dan memiliki .topbar.
class PanelNotifikasi {
  static INTERVAL_POLL_MS = 30000;

  constructor() {
    this.daftarNotifikasi = [];
    this.jumlahBelumDibaca = 0;
    this.terbuka = false;
    this.timerPoll = null;
    this.tombolLonceng = null;
    this.elBadge = null;
    this.elPanel = null;
    this.elDim = null;
    this.elDaftar = null;
    this.elTombolBacaSemua = null;
    this.elKakiPush = null;
    this.elTombolPush = null;
    this.pengamatTopbar = null;
  }

  async inisialisasi() {
    if (typeof Api === 'undefined' || !Api.getToken()) {
      return;
    }

    PanelNotifikasi.pastikanGayaTerpasang();
    this.pasangLoncengTopbar();
    this.bangunPanel();
    this.pasangPengamatTopbar();
    this.pasangTautanRail();

    await this.muatNotifikasi();
    await this.periksaDukunganPush();
    this.aturPolling();

    document.addEventListener('visibilitychange', () => {
      this.aturPolling();
      if (!document.hidden && Api.getToken()) {
        this.muatNotifikasi();
      }
    });
  }

  // Memastikan berkas percakapan.css termuat walaupun halaman belum menyertakannya
  static pastikanGayaTerpasang() {
    if (typeof document === 'undefined' || !document.head) return;
    const sudahAda = document.querySelector('link[href*="/css/percakapan.css"]');
    if (!sudahAda) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/percakapan.css';
      document.head.append(link);
    }
  }

  // Mencari atau membuat tombol ikon lonceng pada .topbar dan memasang badge belum dibaca
  pasangLoncengTopbar() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    let ikonBell = topbar.querySelector('.ic--bell');
    let tombol = ikonBell ? ikonBell.closest('.iconbtn') : null;

    if (!tombol) {
      let kanan = topbar.querySelector('.topbar__right');
      if (!kanan) {
        kanan = document.createElement('div');
        kanan.className = 'topbar__right';
        topbar.append(kanan);
      }

      tombol = document.createElement('button');
      tombol.type = 'button';
      tombol.className = 'iconbtn';
      tombol.title = 'Notifikasi';
      tombol.setAttribute('aria-label', 'Notifikasi');
      const ic = document.createElement('span');
      ic.className = 'ic ic--bell';
      tombol.append(ic);

      // Bila belum ada tautan percakapan di topbar (mis. di halaman profil), tambahkan juga
      if (!kanan.querySelector('.ic--chat')) {
        const tautanChat = document.createElement('a');
        tautanChat.className = 'iconbtn';
        tautanChat.href = '/percakapan';
        tautanChat.title = 'Percakapan';
        tautanChat.setAttribute('aria-label', 'Percakapan');
        const icChat = document.createElement('span');
        icChat.className = 'ic ic--chat';
        tautanChat.append(icChat);
        kanan.prepend(tautanChat);
      }

      kanan.prepend(tombol);
    }

    let badge = tombol.querySelector('.iconbtn__badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'iconbtn__badge';
      badge.hidden = true;
      tombol.append(badge);
    }

    if (this.tombolLonceng !== tombol) {
      tombol.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.togglePanel();
      });
    }

    this.tombolLonceng = tombol;
    this.elBadge = badge;
    this.tampilkanPenandaBelumDibaca(this.jumlahBelumDibaca);
  }

  // Memantau perubahan isi .topbar (misalnya saat ListingUI.mulai() menulis ulang innerHTML)
  pasangPengamatTopbar() {
    const topbar = document.querySelector('.topbar');
    if (!topbar || typeof MutationObserver === 'undefined') return;
    if (this.pengamatTopbar) this.pengamatTopbar.disconnect();

    this.pengamatTopbar = new MutationObserver(() => {
      if (!topbar.contains(this.tombolLonceng)) {
        this.pasangLoncengTopbar();
        this.pasangTautanRail();
      }
    });
    this.pengamatTopbar.observe(topbar, { childList: true });
  }

  // Menghubungkan tautan "Notifikasi" pada rail kiri agar membuka panel dropdown I-11
  pasangTautanRail() {
    document.querySelectorAll('a[href="/notifikasi"], a[href="#notifikasi"]').forEach((a) => {
      if (a.dataset.notifikasiTerpasang === '1') return;
      a.dataset.notifikasiTerpasang = '1';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        this.bukaPanel();
      });
    });
  }

  // Membangun struktur DOM untuk lapisan redup (.dim) dan popover I-11 (.notif.popover)
  bangunPanel() {
    if (this.elPanel) return;

    const dim = document.createElement('div');
    dim.className = 'dim';
    dim.hidden = true;
    dim.addEventListener('click', () => this.tutupPanel());

    const panel = document.createElement('section');
    panel.className = 'notif popover';
    panel.setAttribute('aria-label', 'Panel Notifikasi');
    panel.hidden = true;

    const kepala = document.createElement('div');
    kepala.className = 'notif__head';

    const judul = document.createElement('span');
    judul.className = 'notif__judul';
    judul.textContent = 'Notifikasi';

    const tombolBacaSemua = document.createElement('button');
    tombolBacaSemua.type = 'button';
    tombolBacaSemua.className = 'btn btn--teks btn--sm ml-auto';
    tombolBacaSemua.textContent = 'Tandai semua dibaca';
    tombolBacaSemua.addEventListener('click', () => this.tandaiSemuaDibaca());

    kepala.append(judul, tombolBacaSemua);

    const wadahDaftar = document.createElement('div');
    wadahDaftar.className = 'notif__list';

    const kakiPush = document.createElement('div');
    kakiPush.className = 'notif__foot';
    kakiPush.hidden = true;

    const tombolPush = document.createElement('button');
    tombolPush.type = 'button';
    tombolPush.className = 'btn btn--sekunder btn--sm btn--blok';
    tombolPush.textContent = 'Aktifkan notifikasi peramban';
    tombolPush.addEventListener('click', () => this.aktifkanNotifikasiPeramban());

    kakiPush.append(tombolPush);
    panel.append(kepala, wadahDaftar, kakiPush);

    document.body.append(dim, panel);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.terbuka) {
        this.tutupPanel();
      }
    });

    this.elDim = dim;
    this.elPanel = panel;
    this.elDaftar = wadahDaftar;
    this.elTombolBacaSemua = tombolBacaSemua;
    this.elKakiPush = kakiPush;
    this.elTombolPush = tombolPush;
  }

  togglePanel() {
    if (this.terbuka) {
      this.tutupPanel();
    } else {
      this.bukaPanel();
    }
  }

  async bukaPanel() {
    if (!this.elPanel) this.bangunPanel();
    this.terbuka = true;
    this.elDim.hidden = false;
    this.elPanel.hidden = false;
    await this.muatNotifikasi();
  }

  tutupPanel() {
    this.terbuka = false;
    if (this.elDim) this.elDim.hidden = true;
    if (this.elPanel) this.elPanel.hidden = true;
  }

  // Mengambil daftar notifikasi dan jumlah belum dibaca dari GET /api/notifikasi
  async muatNotifikasi() {
    if (typeof Api === 'undefined' || !Api.getToken()) return;

    const hasil = await Api.kirim('GET', '/api/notifikasi');
    if (!hasil.sukses || !hasil.data) return;

    const belumDibaca = Number(hasil.data.belumDibaca) || 0;
    const daftar = Array.isArray(hasil.data.daftar) ? hasil.data.daftar : [];

    this.tampilkanPenandaBelumDibaca(belumDibaca);
    this.tampilkanDaftarNotifikasi(daftar);
  }

  // I11-O02 (DPPL 5.9.1): menampilkan angka jumlah belum dibaca pada ikon lonceng
  tampilkanPenandaBelumDibaca(jumlah) {
    this.jumlahBelumDibaca = Math.max(0, Number(jumlah) || 0);
    if (!this.elBadge) return;

    if (this.jumlahBelumDibaca > 0) {
      this.elBadge.textContent = String(this.jumlahBelumDibaca);
      this.elBadge.hidden = false;
    } else {
      this.elBadge.textContent = '0';
      this.elBadge.hidden = true;
    }
  }

  // I11-O01, I11-O03, I11-O04, I11-O05 (DPPL 5.9.1): menampilkan daftar notifikasi
  tampilkanDaftarNotifikasi(daftar) {
    this.daftarNotifikasi = Array.isArray(daftar) ? daftar : [];
    if (!this.elDaftar) return;

    this.elDaftar.replaceChildren();

    if (this.elTombolBacaSemua) {
      this.elTombolBacaSemua.disabled = this.jumlahBelumDibaca <= 0;
    }

    if (this.daftarNotifikasi.length === 0) {
      const kosong = document.createElement('div');
      kosong.className = 'notif__empty';
      kosong.textContent = 'Belum ada notifikasi';
      this.elDaftar.append(kosong);
      return;
    }

    this.daftarNotifikasi.forEach((item) => {
      const belumDibaca = !item.statusBaca;
      const baris = document.createElement('div');
      baris.className = `notif__item${belumDibaca ? ' is-baru' : ''}`;
      baris.setAttribute('role', 'button');
      baris.tabIndex = 0;

      const wadahIkon = document.createElement('div');
      wadahIkon.className = 'notif__ic';
      const ikon = document.createElement('span');
      ikon.className = `ic ${PanelNotifikasi.kelasIkonJenis(item.jenis)}`;
      wadahIkon.append(ikon);

      const badan = document.createElement('div');
      badan.className = 'grow';

      const teks = document.createElement('div');
      teks.className = 'notif__teks';
      teks.textContent = item.isi || '';

      const waktu = document.createElement('div');
      waktu.className = 't-caption muted notif__waktu';
      waktu.textContent = PanelNotifikasi.formatWaktuRelatif(item.waktuKirim);

      badan.append(teks, waktu);
      baris.append(wadahIkon, badan);

      if (belumDibaca) {
        const titik = document.createElement('span');
        titik.className = 'notif__dot';
        baris.append(titik);
      }

      const aksiKlik = () => this.klikNotifikasi(item);
      baris.addEventListener('click', aksiKlik);
      baris.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          aksiKlik();
        }
      });

      this.elDaftar.append(baris);
    });
  }

  // I11-O03 (KF34): menandai satu notifikasi sudah dibaca lalu mengarahkan ke /percakapan bila jenis 'pesan'
  async klikNotifikasi(item) {
    if (!item) return;

    if (item.idNotifikasi !== undefined && item.idNotifikasi !== null) {
      const hasil = await Api.kirim(
        'PATCH',
        `/api/notifikasi/${encodeURIComponent(item.idNotifikasi)}/baca`,
      );
      if (hasil.sukses && hasil.data) {
        item.statusBaca = true;
        this.tampilkanPenandaBelumDibaca(hasil.data.belumDibaca);
        this.tampilkanDaftarNotifikasi(this.daftarNotifikasi);
      }
    }

    if (String(item.jenis || '').toLowerCase() === 'pesan') {
      this.tutupPanel();
      window.location.href = '/percakapan';
    }
  }

  // Menandai seluruh notifikasi sebagai sudah dibaca
  async tandaiSemuaDibaca() {
    const hasil = await Api.kirim('PATCH', '/api/notifikasi/baca-semua');
    if (!hasil.sukses) return;

    this.daftarNotifikasi.forEach((n) => {
      n.statusBaca = true;
    });
    const sisa = hasil.data?.belumDibaca ?? 0;
    this.tampilkanPenandaBelumDibaca(sisa);
    this.tampilkanDaftarNotifikasi(this.daftarNotifikasi);
  }

  // ───────────── Web Push (C44 / KF34) ─────────────

  static perambanMendukungPush() {
    return (
      typeof window !== 'undefined'
      && typeof navigator !== 'undefined'
      && 'serviceWorker' in navigator
      && 'PushManager' in window
      && 'Notification' in window
    );
  }

  async periksaDukunganPush() {
    if (!PanelNotifikasi.perambanMendukungPush()) {
      this.sembunyikanTombolPush();
      return;
    }

    try {
      const hasil = await Api.kirim('GET', '/api/notifikasi/kunci-publik');
      if (!hasil.sukses || !hasil.data?.kunciPublik) {
        this.sembunyikanTombolPush();
        return;
      }
      if (this.elKakiPush && this.elTombolPush) {
        this.elKakiPush.hidden = false;
        this.elTombolPush.hidden = false;
      }
    } catch {
      this.sembunyikanTombolPush();
    }
  }

  sembunyikanTombolPush() {
    if (this.elTombolPush) this.elTombolPush.hidden = true;
    if (this.elKakiPush) this.elKakiPush.hidden = true;
  }

  // Mendaftarkan Service Worker dan berlangganan Web Push
  async aktifkanNotifikasiPeramban() {
    if (!PanelNotifikasi.perambanMendukungPush()) {
      this.sembunyikanTombolPush();
      return;
    }

    try {
      const registrasi = await navigator.serviceWorker.register('/sw.js');
      const izin = await Notification.requestPermission();
      if (izin !== 'granted') {
        return;
      }

      const hasilKunci = await Api.kirim('GET', '/api/notifikasi/kunci-publik');
      const kunciPublik = hasilKunci.sukses ? hasilKunci.data?.kunciPublik : null;
      if (!kunciPublik) {
        this.sembunyikanTombolPush();
        return;
      }

      const applicationServerKey = PanelNotifikasi.urlBase64KeUint8Array(kunciPublik);
      const langganan = await registrasi.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      const bodyLangganan = typeof langganan.toJSON === 'function' ? langganan.toJSON() : langganan;
      const hasilSimpan = await Api.kirim('POST', '/api/notifikasi/langganan-push', bodyLangganan);
      if (hasilSimpan.sukses && this.elTombolPush) {
        this.elTombolPush.textContent = 'Notifikasi peramban aktif';
        this.elTombolPush.disabled = true;
      }
    } catch {
      this.sembunyikanTombolPush();
    }
  }

  aturPolling() {
    clearInterval(this.timerPoll);
    this.timerPoll = null;
    if (typeof document !== 'undefined' && document.hidden) return;

    this.timerPoll = setInterval(() => {
      if (!document.hidden && typeof Api !== 'undefined' && Api.getToken()) {
        this.muatNotifikasi();
      }
    }, PanelNotifikasi.INTERVAL_POLL_MS);
  }

  // ───────────── Pembantu ─────────────

  static kelasIkonJenis(jenis) {
    const j = String(jenis || '').toLowerCase();
    if (j === 'pesan') return 'ic--chat';
    if (j === 'moderasi' || j === 'peringatan' || j === 'laporan') return 'ic--flag';
    if (j === 'verifikasi') return 'ic--lock';
    return 'ic--bell';
  }

  static formatWaktuRelatif(waktuIso) {
    if (!waktuIso) return '';
    const d = new Date(waktuIso);
    if (Number.isNaN(d.getTime())) return String(waktuIso);

    const selisihDetik = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
    if (selisihDetik < 60) return 'Baru saja';
    const selisihMenit = Math.floor(selisihDetik / 60);
    if (selisihMenit < 60) return `${selisihMenit} menit lalu`;
    const selisihJam = Math.floor(selisihMenit / 60);
    if (selisihJam < 24) return `${selisihJam} jam lalu`;
    const selisihHari = Math.floor(selisihJam / 24);
    if (selisihHari === 1) return 'Kemarin';
    if (selisihHari < 7) return `${selisihHari} hari lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  static urlBase64KeUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i += 1) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PanelNotifikasi;
}

document.addEventListener('DOMContentLoaded', () => {
  const panel = new PanelNotifikasi();
  window.panelNotifikasi = panel;
  panel.inisialisasi();
});
