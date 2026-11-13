// C08 HalamanPercakapan – View untuk I-10 Percakapan (UC16, UC17, UC18, DPPL 5.8).
// Membutuhkan api.js. Seluruh teks pengguna ditulis dengan textContent demi keamanan XSS.
class HalamanPercakapan {
  static INTERVAL_POLL_PESAN_MS = 4000;
  static INTERVAL_POLL_DAFTAR_MS = 10000;
  static BATAS_KARAKTER_PESAN = 2000;
  static TAUTAN_KEBIJAKAN_BAWAAN = '/legal?jenis=kebijakan-privasi';

  constructor() {
    this.percakapanAktif = null;
    this.daftarPercakapan = [];
    this.isiTeksInput = '';
    this.idPercakapanAktif = null;
    this.timerPesan = null;
    this.timerDaftar = null;
    this.sedangMengirim = false;
  }

  async inisialisasi() {
    if (!Api.getToken()) {
      this.tanganiBelumLogin();
      return;
    }

    this.muatInisialProfil();
    this.pasangEventListeners();

    const params = new URLSearchParams(window.location.search);
    const idBarang = params.get('barang');
    const idPercakapan = params.get('id');

    if (idBarang) {
      await this.mulaiPercakapanDariBarang(idBarang);
      await this.bukaDaftarPercakapan();
    } else if (idPercakapan) {
      await Promise.all([
        this.bukaDaftarPercakapan(),
        this.bukaPercakapan(idPercakapan),
      ]);
    } else {
      await this.bukaDaftarPercakapan();
    }

    this.aturPolling();
  }

  // UC16 (Algo-016): memulai atau membuka ruang percakapan dari parameter ?barang=
  async mulaiPercakapanDariBarang(idBarang) {
    const hasil = await Api.kirim('POST', '/api/percakapan', { idBarang });
    if (hasil.status === 401) {
      this.tanganiBelumLogin();
      return;
    }
    if (!hasil.sukses || !hasil.data?.idPercakapan) {
      const judul = hasil.status === 403 ? 'Akses ditolak' : 'Tidak dapat memulai percakapan';
      this.tampilkanAksesDitolak(hasil.pesan || 'Gagal memulai percakapan.', judul);
      return;
    }

    const { idPercakapan } = hasil.data;
    history.replaceState(null, '', `/percakapan?id=${encodeURIComponent(idPercakapan)}`);
    await this.bukaPercakapan(idPercakapan);
  }

  // I10-O01 (UC18, Algo-019): meminta daftar percakapan pengguna
  async bukaDaftarPercakapan() {
    const hasil = await Api.kirim('GET', '/api/percakapan');
    if (hasil.status === 401) {
      this.tanganiBelumLogin();
      return;
    }
    if (!hasil.sukses) {
      this.tampilkanGalatDaftar(hasil.pesan || 'Gagal memuat daftar percakapan.');
      return;
    }

    this.tampilkanGalatDaftar('');
    this.daftarPercakapan = Array.isArray(hasil.data) ? hasil.data : [];
    this.showDaftarPercakapan(this.daftarPercakapan);
  }

  // I10-O01, I10-O08 (KF33, KF34): merender daftar percakapan di kolom kiri
  showDaftarPercakapan(daftar) {
    this.daftarPercakapan = Array.isArray(daftar) ? daftar : [];

    const totalBelumDibaca = this.daftarPercakapan.reduce(
      (total, item) => total + (Number(item.belumDibaca) || 0),
      0,
    );

    const badgeTotal = document.getElementById('badge-belum-dibaca');
    if (badgeTotal) {
      badgeTotal.textContent = `${totalBelumDibaca} belum dibaca`;
      badgeTotal.hidden = totalBelumDibaca <= 0;
    }

    const badgeTopbar = document.getElementById('badge-topbar-percakapan');
    if (badgeTopbar) {
      badgeTopbar.textContent = String(totalBelumDibaca);
      badgeTopbar.hidden = totalBelumDibaca <= 0;
    }

    const wadah = document.getElementById('daftar-percakapan');
    const kosong = document.getElementById('daftar-kosong');
    if (!wadah) return;

    wadah.replaceChildren();
    if (kosong) kosong.hidden = this.daftarPercakapan.length > 0;

    this.daftarPercakapan.forEach((item) => {
      const aktif = Boolean(
        this.idPercakapanAktif && String(item.idPercakapan) === String(this.idPercakapanAktif),
      );
      const elemen = document.createElement('a');
      elemen.className = `convitem${aktif ? ' is-active' : ''}`;
      elemen.href = `/percakapan?id=${encodeURIComponent(item.idPercakapan)}`;

      const avatar = document.createElement('div');
      avatar.className = 'convitem__avatar';
      const phAvatar = document.createElement('div');
      phAvatar.className = 'ph ph--avatar';
      avatar.append(phAvatar);

      const badan = document.createElement('div');
      badan.className = 'grow';
      badan.style.minWidth = '0';

      const barisAtas = document.createElement('div');
      barisAtas.className = 'row';

      const namaLawan = document.createElement('span');
      namaLawan.className = 'convitem__name';
      namaLawan.textContent = item.lawanBicara?.nama || 'Pengguna';

      const waktu = document.createElement('span');
      waktu.className = 't-caption faint ml-auto';
      const sumberWaktu = item.cuplikan?.waktuKirim || item.waktuPembaruanTerakhir;
      waktu.textContent = HalamanPercakapan.formatWaktuDaftar(sumberWaktu);

      barisAtas.append(namaLawan, waktu);

      const cuplikan = document.createElement('div');
      cuplikan.className = 'convitem__snippet';
      if (item.cuplikan && item.cuplikan.isi) {
        cuplikan.textContent = item.cuplikan.dariSaya
          ? `Anda: ${item.cuplikan.isi}`
          : item.cuplikan.isi;
      } else {
        cuplikan.textContent = 'Belum ada pesan';
      }

      const judulBarang = document.createElement('div');
      judulBarang.className = 't-caption faint';
      judulBarang.textContent = item.judulBarang || 'Barang tidak tersedia';

      badan.append(barisAtas, cuplikan, judulBarang);
      elemen.append(avatar, badan);

      const belumDibaca = Number(item.belumDibaca) || 0;
      if (belumDibaca > 0) {
        const badgeItem = document.createElement('span');
        badgeItem.className = 'iconbtn__badge';
        badgeItem.style.position = 'static';
        badgeItem.style.alignSelf = 'center';
        badgeItem.textContent = String(belumDibaca);
        elemen.append(badgeItem);
      }

      elemen.addEventListener('click', (e) => {
        e.preventDefault();
        history.replaceState(null, '', `/percakapan?id=${encodeURIComponent(item.idPercakapan)}`);
        this.bukaPercakapan(item.idPercakapan);
      });

      wadah.append(elemen);
    });
  }

  // I10-O02 (UC16, Algo-017): meminta isi ruang percakapan
  async bukaPercakapan(idPercakapan, dariPolling = false) {
    if (!idPercakapan) return;

    const hasil = await Api.kirim('GET', `/api/percakapan/${encodeURIComponent(idPercakapan)}`);
    if (hasil.status === 401) {
      this.tanganiBelumLogin();
      return;
    }
    if (hasil.status === 403) {
      this.idPercakapanAktif = null;
      this.percakapanAktif = null;
      this.tampilkanAksesDitolak(hasil.pesan);
      return;
    }
    if (!hasil.sukses || !hasil.data) {
      this.idPercakapanAktif = null;
      this.percakapanAktif = null;
      this.tampilkanAksesDitolak(
        hasil.pesan || 'Percakapan tidak ditemukan.',
        'Percakapan tidak tersedia',
      );
      return;
    }

    const ruang = hasil.data;
    const pesanLama = (
      this.percakapanAktif && String(this.percakapanAktif.idPercakapan) === String(idPercakapan)
    )
      ? (this.percakapanAktif.pesan || [])
      : null;
    const pesanBaru = Array.isArray(ruang.pesan) ? ruang.pesan : [];
    const adaPerubahan = !pesanLama
      || pesanLama.length !== pesanBaru.length
      || (pesanBaru.length > 0
        && pesanLama[pesanLama.length - 1]?.idPesan !== pesanBaru[pesanBaru.length - 1]?.idPesan);

    const gantiRuang = String(this.idPercakapanAktif) !== String(ruang.idPercakapan || idPercakapan);
    this.idPercakapanAktif = ruang.idPercakapan || idPercakapan;
    this.percakapanAktif = ruang;

    // Membuka ruang menandai pesan lawan bicara sebagai sudah dibaca
    let perluRenderDaftar = gantiRuang;
    this.daftarPercakapan.forEach((item) => {
      if (String(item.idPercakapan) === String(this.idPercakapanAktif) && item.belumDibaca > 0) {
        item.belumDibaca = 0;
        perluRenderDaftar = true;
      }
    });
    if (perluRenderDaftar) {
      this.showDaftarPercakapan(this.daftarPercakapan);
    }

    if (!dariPolling || adaPerubahan) {
      this.showPercakapan(ruang);
    }
  }

  // I10-O02, I10-O03, I10-O06: menampilkan ruang percakapan aktif
  showPercakapan(ruang) {
    this.percakapanAktif = ruang;

    const ruangKosong = document.getElementById('ruang-kosong');
    const ruangDitolak = document.getElementById('ruang-akses-ditolak');
    const ruangAktif = document.getElementById('ruang-aktif');
    if (ruangKosong) ruangKosong.hidden = true;
    if (ruangDitolak) ruangDitolak.hidden = true;
    if (ruangAktif) ruangAktif.hidden = false;

    const elNamaLawan = document.getElementById('nama-lawan');
    if (elNamaLawan) elNamaLawan.textContent = ruang.lawanBicara?.nama || 'Pengguna';

    const thumb = document.getElementById('thumb-barang');
    const judulHarga = document.getElementById('judul-barang-header');
    if (thumb) {
      thumb.replaceChildren();
      if (ruang.barang && ruang.barang.fotoUtama) {
        const img = document.createElement('img');
        img.src = ruang.barang.fotoUtama;
        img.alt = ruang.barang.judul || 'Foto barang';
        thumb.append(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'ph ph--jas';
        thumb.append(ph);
      }
    }

    if (judulHarga) {
      if (ruang.barang) {
        const bagian = [ruang.barang.judul];
        if (ruang.barang.harga !== undefined && ruang.barang.harga !== null) {
          bagian.push(HalamanPercakapan.formatHarga(ruang.barang.harga));
        }
        judulHarga.textContent = bagian.filter(Boolean).join(' · ');
      } else {
        judulHarga.textContent = 'Barang tidak lagi tersedia';
      }
    }

    this.tampilkanTautanKebijakan(ruang.tautanKebijakanPrivasi);
    this.tampilkanUrutanPesan(ruang.pesan || []);
    this.gulirKePesanTerakhir();
  }

  // I10-O06 (KF39): menampilkan tautan dokumen Kebijakan Privasi
  tampilkanTautanKebijakan(tautan) {
    const elTautan = document.getElementById('tautan-kebijakan');
    if (elTautan) {
      elTautan.href = tautan || HalamanPercakapan.TAUTAN_KEBIJAKAN_BAWAAN;
    }
  }

  // I10-O03 (KF36): menampilkan gelembung pesan berurutan berdasarkan waktu kirim
  tampilkanUrutanPesan(daftarPesan) {
    const wadah = document.getElementById('daftar-pesan');
    if (!wadah) return;
    wadah.replaceChildren();

    const terurut = [...(Array.isArray(daftarPesan) ? daftarPesan : [])].sort((a, b) => {
      const wa = new Date(a.waktuKirim || 0).getTime();
      const wb = new Date(b.waktuKirim || 0).getTime();
      return wa - wb;
    });

    const elHari = document.getElementById('hari-percakapan');
    if (elHari) {
      elHari.hidden = terurut.length === 0;
    }

    terurut.forEach((pesan) => {
      const dariSaya = pesan.dariSaya !== undefined
        ? Boolean(pesan.dariSaya)
        : Boolean(
          this.percakapanAktif
          && String(pesan.idPengirim) === String(this.percakapanAktif.idAkunSaya),
        );

      const gelembung = document.createElement('div');
      gelembung.className = `bubble ${dariSaya ? 'bubble--saya' : 'bubble--lawan'}`;
      gelembung.textContent = pesan.isi ?? '';

      const waktu = document.createElement('div');
      waktu.className = 'bubble__time';
      waktu.textContent = HalamanPercakapan.formatJam(pesan.waktuKirim);

      wadah.append(gelembung, waktu);
    });
  }

  // Menggulir ruang percakapan ke pesan paling akhir
  gulirKePesanTerakhir() {
    const badan = document.getElementById('badan-percakapan');
    if (badan) {
      badan.scrollTop = badan.scrollHeight;
    }
  }

  // I10-O07 (KF35): menampilkan penolakan akses tanpa menampilkan isi pesan apa pun
  tampilkanAksesDitolak(pesan, judul = 'Akses ditolak') {
    const ruangKosong = document.getElementById('ruang-kosong');
    const ruangAktif = document.getElementById('ruang-aktif');
    const ruangDitolak = document.getElementById('ruang-akses-ditolak');
    const wadahPesan = document.getElementById('daftar-pesan');

    if (wadahPesan) wadahPesan.replaceChildren();
    if (ruangKosong) ruangKosong.hidden = true;
    if (ruangAktif) ruangAktif.hidden = true;
    if (ruangDitolak) ruangDitolak.hidden = false;

    const elJudul = document.getElementById('judul-akses-ditolak');
    const elPesan = document.getElementById('pesan-akses-ditolak');
    if (elJudul) elJudul.textContent = judul;
    if (elPesan) elPesan.textContent = pesan || 'Anda bukan peserta ruang percakapan ini.';
  }

  // I10-O04 (UC17 Alt 1): memeriksa apakah isi pesan kosong atau hanya spasi
  validasiInputKosong(isi) {
    return typeof isi !== 'string' || isi.trim().length === 0;
  }

  // I10-O05 (UC17, Algo-018): mengirim pesan ke server bila tidak kosong
  async kirimPesan(isi) {
    this.isiTeksInput = typeof isi === 'string' ? isi : '';
    if (this.sedangMengirim || !this.idPercakapanAktif) return;
    if (this.validasiInputKosong(this.isiTeksInput)) return;

    const isiBersih = this.isiTeksInput.trim();
    if (isiBersih.length > HalamanPercakapan.BATAS_KARAKTER_PESAN) {
      this.tampilkanGalatPesan('Pesan tidak boleh melebihi 2000 karakter.');
      return;
    }

    this.sedangMengirim = true;
    const tombol = document.getElementById('tombol-kirim');
    if (tombol) tombol.disabled = true;
    this.tampilkanGalatPesan('');

    const hasil = await Api.kirim(
      'POST',
      `/api/percakapan/${encodeURIComponent(this.idPercakapanAktif)}/pesan`,
      { isi: isiBersih },
    );

    this.sedangMengirim = false;

    if (hasil.status === 401) {
      this.tanganiBelumLogin();
      return;
    }
    if (!hasil.sukses || !hasil.data) {
      if (tombol) tombol.disabled = false;
      this.tampilkanGalatPesan(hasil.pesan || 'Gagal mengirim pesan.');
      return;
    }

    const input = document.getElementById('input-pesan');
    if (input) input.value = '';
    this.isiTeksInput = '';
    if (tombol) tombol.disabled = true;

    if (!this.percakapanAktif) {
      this.percakapanAktif = { idPercakapan: this.idPercakapanAktif, pesan: [] };
    }
    if (!Array.isArray(this.percakapanAktif.pesan)) {
      this.percakapanAktif.pesan = [];
    }
    this.percakapanAktif.pesan.push(hasil.data);
    this.tampilkanUrutanPesan(this.percakapanAktif.pesan);
    this.gulirKePesanTerakhir();
    this.bukaDaftarPercakapan();
  }

  // ───────────── Polling & Event ─────────────

  aturPolling() {
    clearInterval(this.timerPesan);
    clearInterval(this.timerDaftar);
    this.timerPesan = null;
    this.timerDaftar = null;

    if (document.hidden) return;

    this.timerPesan = setInterval(() => {
      if (!document.hidden && this.idPercakapanAktif && !this.sedangMengirim) {
        this.bukaPercakapan(this.idPercakapanAktif, true);
      }
    }, HalamanPercakapan.INTERVAL_POLL_PESAN_MS);

    this.timerDaftar = setInterval(() => {
      if (!document.hidden) {
        this.bukaDaftarPercakapan();
      }
    }, HalamanPercakapan.INTERVAL_POLL_DAFTAR_MS);
  }

  pasangEventListeners() {
    const input = document.getElementById('input-pesan');
    const tombol = document.getElementById('tombol-kirim');
    const form = document.getElementById('form-pesan');

    if (input) {
      input.addEventListener('input', (e) => {
        this.isiTeksInput = e.target.value;
        this.tampilkanGalatPesan('');
        if (tombol) {
          tombol.disabled = this.validasiInputKosong(this.isiTeksInput);
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nilai = input ? input.value : this.isiTeksInput;
        this.kirimPesan(nilai);
      });
    }

    document.addEventListener('visibilitychange', () => {
      this.aturPolling();
      if (!document.hidden) {
        this.bukaDaftarPercakapan();
        if (this.idPercakapanAktif) {
          this.bukaPercakapan(this.idPercakapanAktif, true);
        }
      }
    });
  }

  muatInisialProfil() {
    Api.kirim('GET', '/api/akun/profil').then((r) => {
      const elAvatar = document.getElementById('avatar-topbar');
      if (r.sukses && r.data?.nama && elAvatar) {
        elAvatar.textContent = r.data.nama
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((k) => k[0])
          .join('')
          .toUpperCase();
      }
    });
  }

  tanganiBelumLogin() {
    clearInterval(this.timerPesan);
    clearInterval(this.timerDaftar);
    Api.hapusSesi();
    window.location.replace('/masuk');
  }

  tampilkanGalatDaftar(pesan) {
    const el = document.getElementById('galat-daftar');
    if (el) {
      el.textContent = pesan;
      el.hidden = !pesan;
    }
  }

  tampilkanGalatPesan(pesan) {
    const el = document.getElementById('galat-pesan');
    if (el) {
      el.textContent = pesan;
      el.hidden = !pesan;
    }
  }

  // ───────────── Pembantu Format ─────────────

  static formatHarga(harga) {
    return `Rp${Number(harga || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
  }

  static formatJam(waktuIso) {
    if (!waktuIso) return '';
    const d = new Date(waktuIso);
    if (Number.isNaN(d.getTime())) return String(waktuIso);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':');
  }

  static formatWaktuDaftar(waktuIso) {
    if (!waktuIso) return '';
    const d = new Date(waktuIso);
    if (Number.isNaN(d.getTime())) return String(waktuIso);

    const sekarang = new Date();
    const selisihHari = Math.floor(
      (
        new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate())
        - new Date(d.getFullYear(), d.getMonth(), d.getDate())
      ) / 86400000,
    );

    if (selisihHari <= 0) {
      return HalamanPercakapan.formatJam(waktuIso);
    }
    if (selisihHari === 1) {
      return 'Kemarin';
    }
    if (selisihHari < 7) {
      return `${selisihHari} hari`;
    }
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HalamanPercakapan;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body?.dataset.halaman === 'percakapan') {
    const halaman = new HalamanPercakapan();
    window.halamanPercakapan = halaman;
    halaman.inisialisasi();
  }
});
