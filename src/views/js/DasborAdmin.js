// C11 DasborAdmin – View & Boundary untuk Dasbor Moderasi Admin (I-13 & I-14).
// Bergantung pada api.js (objek Api).

class DasborAdmin {
  constructor() {
    this.daftarLaporan = [];
    this.filterStatus = 'Semua';
    this.detailLaporan = null;
    this.statusBaru = '';
    this.alasanTindakan = '';
    this.tindakanAktif = null; // 'HAPUS_LISTING' | 'BLOKIR_AKUN' | 'BUKA_BLOKIR'
    this.targetIdAkun = null;
    this.targetIdBarang = null;
  }

  // Inisialisasi tampilan berdasarkan elemen halaman yang ada
  inisialisasi() {
    const token = Api.getToken();
    if (!token) {
      this.tampilkanAksesDitolak();
      return;
    }

    // Deteksi jika berada di halaman daftar laporan (I-13)
    if (document.getElementById('tabel-laporan')) {
      this.bukaDaftarLaporan();
      this.muatStatistik();
      this.pasangEventListenersDaftar();
    }

    // Deteksi jika berada di halaman detail laporan (I-14)
    if (document.getElementById('halaman-detail-laporan')) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      if (id) {
        this.bukaDetailLaporan(id);
      } else {
        this.tampilkanPesanGalat('ID laporan tidak ditemukan pada URL.');
      }
      this.pasangEventListenersDetail();
    }
  }

  // Mengambil dan menampilkan seluruh laporan dari server (KF45, KF56)
  async bukaDaftarLaporan() {
    this.tampilkanStatusMemuat(true);
    const res = await Api.kirim('GET', '/api/admin/laporan');
    this.tampilkanStatusMemuat(false);

    if (res.status === 401 || res.status === 403 || !res.sukses) {
      this.tampilkanAksesDitolak();
      return;
    }

    this.daftarLaporan = res.data || [];
    this.tampilkanDaftarLaporan(this.daftarLaporan);
  }

  // Mengambil metrik statistik jumlah laporan untuk kartu dasbor I-13
  async muatStatistik() {
    const res = await Api.kirim('GET', '/api/admin/laporan/statistik');
    if (res.sukses && res.data) {
      const stats = res.data;
      const elBaru = document.getElementById('stat-baru');
      const elDiproses = document.getElementById('stat-diproses');
      const elSelesai = document.getElementById('stat-selesai');
      const elTotal = document.getElementById('stat-total');

      if (elBaru) elBaru.textContent = stats.Baru ?? 0;
      if (elDiproses) elDiproses.textContent = stats.Diproses ?? 0;
      if (elSelesai) elSelesai.textContent = stats.Selesai ?? 0;
      if (elTotal) elTotal.textContent = stats.Total ?? 0;

      // Perbarui jumlah pada tab
      const tabSemua = document.getElementById('tab-semua');
      const tabBaru = document.getElementById('tab-baru');
      const tabDiproses = document.getElementById('tab-diproses');
      const tabSelesai = document.getElementById('tab-selesai');

      if (tabSemua) tabSemua.textContent = `Semua (${stats.Total ?? 0})`;
      if (tabBaru) tabBaru.textContent = `Baru (${stats.Baru ?? 0})`;
      if (tabDiproses) tabDiproses.textContent = `Diproses (${stats.Diproses ?? 0})`;
      if (tabSelesai) tabSelesai.textContent = `Selesai (${stats.Selesai ?? 0})`;
    }
  }

  // Menyaring laporan berdasarkan tab yang dipilih ("Semua", "Baru", "Diproses", "Selesai") (KF46)
  async filterLaporan(status) {
    this.filterStatus = status;
    this.tampilkanStatusMemuat(true);

    const query = status && status !== 'Semua' ? `?status=${encodeURIComponent(status)}` : '';
    const res = await Api.kirim('GET', `/api/admin/laporan${query}`);
    this.tampilkanStatusMemuat(false);

    if (res.status === 401 || res.status === 403 || !res.sukses) {
      this.tampilkanAksesDitolak();
      return;
    }

    this.daftarLaporan = res.data || [];
    this.tampilkanDaftarLaporan(this.daftarLaporan);
  }

  // Menampilkan daftar laporan ke dalam elemen tabel I-13
  tampilkanDaftarLaporan(daftar) {
    const tbody = document.getElementById('tabel-laporan-body');
    if (!tbody) return;

    if (!daftar || daftar.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 32px; color: var(--text-600)">
            Tidak ada laporan dalam kategori ini.
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = daftar
      .map((lap) => {
        const idPendek = `LP-${String(lap.idLaporan).slice(0, 6).toUpperCase()}`;
        const tglStr = lap.waktuLapor ? new Date(lap.waktuLapor).toLocaleDateString('id-ID') : '-';
        const badgeClass =
          lap.statusPenanganan === 'Diproses'
            ? 'badge badge--tinjau'
            : lap.statusPenanganan === 'Selesai'
            ? 'badge badge--selesai'
            : 'badge';

        return `
          <tr data-id="${lap.idLaporan}">
            <td class="mono" title="${lap.idLaporan}">${idPendek}</td>
            <td>
              <strong>${this.escapeHtml(lap.objekDilaporkan || '-')}</strong>
              <div class="t-caption muted" style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${this.escapeHtml(lap.teksAlasan || '')}
              </div>
            </td>
            <td>${this.escapeHtml(lap.jenisPelanggaran || '-')}</td>
            <td><span class="mono" style="font-size:12px">${this.escapeHtml(String(lap.idPelapor).slice(0, 8))}…</span></td>
            <td class="mono">${tglStr}</td>
            <td><span class="${badgeClass}">${lap.statusPenanganan || 'Baru'}</span></td>
            <td>
              <a href="/admin-detail?id=${encodeURIComponent(lap.idLaporan)}" class="btn btn--sekunder btn--sm" style="text-decoration:none; display:inline-block">
                Lihat Detail
              </a>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  // Mengambil rincian informasi satu laporan (I-14)
  async bukaDetailLaporan(idLaporan) {
    const res = await Api.kirim('GET', `/api/admin/laporan/${idLaporan}`);
    if (res.status === 401 || res.status === 403) {
      this.tampilkanAksesDitolak();
      return;
    }
    if (!res.sukses || !res.data) {
      this.tampilkanPesanGalat(res.pesan || 'Laporan tidak ditemukan.');
      return;
    }

    this.detailLaporan = res.data;
    this.tampilkanDetailLaporan(res.data);
  }

  // Menampilkan rincian lengkap laporan pada antarmuka I-14
  tampilkanDetailLaporan(data) {
    const { laporan, pelapor, daftarBukti, riwayatAudit } = data;
    if (!laporan) return;

    const idPendek = `LP-${String(laporan.idLaporan).slice(0, 6).toUpperCase()}`;
    const elJudul = document.getElementById('detail-judul');
    const elBreadcrumb = document.getElementById('detail-breadcrumb');
    const elBadge = document.getElementById('detail-badge');

    if (elJudul) elJudul.textContent = `Laporan ${idPendek}`;
    if (elBreadcrumb) elBreadcrumb.textContent = `Daftar Laporan · ${idPendek}`;
    if (elBadge) {
      elBadge.textContent = laporan.statusPenanganan || 'Baru';
      elBadge.className =
        laporan.statusPenanganan === 'Diproses'
          ? 'badge badge--tinjau'
          : laporan.statusPenanganan === 'Selesai'
          ? 'badge badge--selesai'
          : 'badge';
    }

    // Identitas Pelapor
    const elPelapor = document.getElementById('detail-pelapor');
    if (elPelapor) {
      if (pelapor) {
        elPelapor.textContent = `${pelapor.nama || 'Pengguna'} (${pelapor.nim || pelapor.email || pelapor.idAkun})`;
      } else {
        elPelapor.textContent = `ID: ${laporan.idPelapor}`;
      }
    }

    // Kategori, Waktu, Alasan
    const elKategori = document.getElementById('detail-kategori');
    if (elKategori) elKategori.textContent = laporan.jenisPelanggaran || '-';

    const elWaktu = document.getElementById('detail-waktu');
    if (elWaktu) {
      elWaktu.textContent = laporan.waktuLapor
        ? new Date(laporan.waktuLapor).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })
        : '-';
    }

    const elAlasan = document.getElementById('detail-alasan');
    if (elAlasan) elAlasan.textContent = laporan.teksAlasan || '-';

    const elObjekNama = document.getElementById('detail-objek-nama');
    if (elObjekNama) elObjekNama.textContent = laporan.objekDilaporkan || '-';

    // Status Selector dropdown
    const selectStatus = document.getElementById('select-status-penanganan');
    if (selectStatus) {
      selectStatus.value = laporan.statusPenanganan || 'Baru';
    }

    // Render bukti lampiran tangkapan layar
    const kontainerBukti = document.getElementById('detail-daftar-bukti');
    if (kontainerBukti) {
      if (!daftarBukti || daftarBukti.length === 0) {
        kontainerBukti.innerHTML = '<p class="muted">Tidak ada berkas bukti tangkapan layar terlampir.</p>';
      } else {
        kontainerBukti.innerHTML = daftarBukti
          .map(
            (b) => `
            <div class="bukti-item" style="border: 1px solid var(--border); border-radius: var(--radius-sm); overflow:hidden; background: var(--surface); display:flex; flex-direction:column;">
              <img src="${b.pathBerkas}" alt="${this.escapeHtml(b.namaBerkas)}" style="width:100%; height:140px; object-fit:cover; cursor:pointer;" onclick="window.open('${b.pathBerkas}', '_blank')">
              <div style="padding: 6px 8px; font-size: 11px; color: var(--text-600); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
                ${this.escapeHtml(b.namaBerkas)}
              </div>
            </div>
          `,
          )
          .join('');
      }
    }

    // Render riwayat log audit (immutable)
    const kontainerAudit = document.getElementById('detail-riwayat-audit');
    if (kontainerAudit) {
      if (!riwayatAudit || riwayatAudit.length === 0) {
        kontainerAudit.innerHTML = '<p class="muted">Belum ada catatan log audit.</p>';
      } else {
        kontainerAudit.innerHTML = riwayatAudit
          .map((log) => {
            const waktuStr = log.waktu
              ? new Date(log.waktu).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
              : '-';
            return `
              <div class="baris-audit" style="display:flex; justify-content:space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px;">
                <div>
                  <div style="font-weight: 500">${this.escapeHtml(log.tindakan)}</div>
                  <div class="t-caption muted">Oleh: ${this.escapeHtml(log.identitasAktor || 'Sistem')}</div>
                </div>
                <div class="mono muted" style="font-size:12px; white-space:nowrap">${waktuStr}</div>
              </div>
            `;
          })
          .join('');
      }
    }
  }

  // Mengubah status penanganan laporan (KF47, KF48)
  async onClickUbahStatus(idLaporan, statusBaru) {
    if (!['Baru', 'Diproses', 'Selesai'].includes(statusBaru)) {
      this.tampilkanPesanGalat('Status penanganan tidak valid.');
      return;
    }

    const res = await Api.kirim('PATCH', `/api/admin/laporan/${idLaporan}/status`, { status: statusBaru });
    if (!res.sukses) {
      this.tampilkanPesanGalat(res.pesan || 'Gagal mengubah status penanganan laporan.');
      return;
    }

    this.tampilkanStatusTerbaru(`Status laporan berhasil diubah menjadi ${statusBaru}.`);
    // Muat ulang data detail
    this.bukaDetailLaporan(idLaporan);
  }

  // Menampilkan peringatan Akses Ditolak dan mengalihkan pengguna bukan admin (KF56)
  tampilkanAksesDitolak() {
    alert('Akses Ditolak: Anda harus masuk menggunakan akun Admin untuk mengakses Dasbor Moderasi.');
    window.location.href = '/masuk';
  }

  // Menampilkan umpan balik berhasil
  tampilkanStatusTerbaru(pesan) {
    const elBanner = document.getElementById('pesan-sukses-banner');
    if (elBanner) {
      elBanner.textContent = pesan;
      elBanner.hidden = false;
      setTimeout(() => {
        elBanner.hidden = true;
      }, 4000);
    } else {
      alert(pesan);
    }
  }

  // Menampilkan pesan galat
  tampilkanPesanGalat(pesan) {
    const elBanner = document.getElementById('pesan-galat-banner');
    if (elBanner) {
      elBanner.textContent = pesan;
      elBanner.hidden = false;
      setTimeout(() => {
        elBanner.hidden = true;
      }, 4000);
    } else {
      alert(pesan);
    }
  }

  tampilkanStatusMemuat(sedangMemuat) {
    const elLoader = document.getElementById('indikator-memuat');
    if (elLoader) {
      elLoader.hidden = !sedangMemuat;
    }
  }

  // Event listener untuk halaman I-13 (Daftar Laporan)
  pasangEventListenersDaftar() {
    const tabs = document.querySelectorAll('.tabs a');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const statusDipilih = tab.getAttribute('data-status') || 'Semua';
        this.filterLaporan(statusDipilih);
      });
    });
  }

  // Event listener untuk halaman I-14 (Detail Laporan)
  pasangEventListenersDetail() {
    const btnSimpanStatus = document.getElementById('btn-simpan-status');
    const selectStatus = document.getElementById('select-status-penanganan');

    if (btnSimpanStatus && selectStatus) {
      btnSimpanStatus.addEventListener('click', () => {
        if (!this.detailLaporan || !this.detailLaporan.laporan) return;
        this.onClickUbahStatus(this.detailLaporan.laporan.idLaporan, selectStatus.value);
      });
    }

    // Modal & Konfirmasi Tindakan Moderasi (UC22-UC24)
    const btnHapus = document.getElementById('btn-hapus-listing');
    if (btnHapus) {
      btnHapus.addEventListener('click', () => {
        const idB = this.detailLaporan?.laporan?.objekDilaporkan;
        this.onClickHapusListing(idB);
      });
    }

    const btnBlokir = document.getElementById('btn-blokir-akun');
    if (btnBlokir) {
      btnBlokir.addEventListener('click', () => {
        const idAkun = this.detailLaporan?.pelapor?.idAkun || this.detailLaporan?.laporan?.idPelapor;
        this.onClickBlokirAkun(idAkun);
      });
    }

    const btnBukaBlokir = document.getElementById('btn-buka-blokir');
    if (btnBukaBlokir) {
      btnBukaBlokir.addEventListener('click', () => this.onClickBukaBlokir());
    }
  }

  // Tindakan moderasi hapus listing (UC22)
  onClickHapusListing(idBarang) {
    this.targetIdBarang = idBarang;
    this.tampilkanModalKonfirmasi('HAPUS_LISTING');
  }

  // Tindakan moderasi blokir akun (UC23)
  onClickBlokirAkun(idAkun) {
    this.targetIdAkun = idAkun || this.detailLaporan?.pelapor?.idAkun || this.detailLaporan?.laporan?.idPelapor;
    this.tampilkanModalKonfirmasi('BLOKIR_AKUN');
  }

  // Tindakan moderasi buka blokir akun (UC24)
  onClickBukaBlokir(idAkun) {
    this.targetIdAkun = idAkun || this.detailLaporan?.pelapor?.idAkun || this.detailLaporan?.laporan?.idPelapor;
    this.tampilkanModalKonfirmasi('BUKA_BLOKIR');
  }

  tampilkanModalKonfirmasi(aksi) {
    this.tindakanAktif = aksi;
    const modal = document.getElementById('modal-konfirmasi-moderasi');
    const judul = modal?.querySelector('h3');
    const desc = modal?.querySelector('p');
    const textarea = document.getElementById('modal-alasan-tindakan');

    if (textarea) textarea.value = '';

    if (aksi === 'BLOKIR_AKUN') {
      if (judul) judul.textContent = 'Konfirmasi Pemblokiran Akun';
      if (desc) {
        desc.textContent =
          'Akun pengguna akan diblokir, seluruh listing akan dinonaktifkan dari katalog, dan seluruh sesi aktif akan dicabut segera. Masukkan alasan pemblokiran:';
      }
      if (textarea) textarea.placeholder = 'Contoh: Terbukti melakukan penipuan berulang pada transaksi COD.';
    } else if (aksi === 'HAPUS_LISTING') {
      if (judul) judul.textContent = 'Konfirmasi Penghapusan Listing';
      if (desc) desc.textContent = 'Listing dan foto barang akan dihapus permanen. Masukkan alasan penghapusan:';
      if (textarea) textarea.placeholder = 'Contoh: Barang terbukti tiruan/palsu.';
    } else if (aksi === 'BUKA_BLOKIR') {
      if (judul) judul.textContent = 'Konfirmasi Pembukaan Blokir Akun';
      if (desc) desc.textContent = 'Status akun akan dipulihkan dan listing akan kembali aktif di katalog:';
    }

    if (modal) modal.hidden = false;
  }

  async konfirmasiTindakan(alasan) {
    if (!alasan || !alasan.trim()) {
      this.tampilkanPesanGalat('Alasan tindakan moderasi wajib diisi.');
      return;
    }

    if (this.tindakanAktif === 'BLOKIR_AKUN') {
      const idAkun = this.targetIdAkun || this.detailLaporan?.pelapor?.idAkun || this.detailLaporan?.laporan?.idPelapor;
      if (!idAkun) {
        this.tampilkanPesanGalat('ID Akun yang akan diblokir tidak ditemukan.');
        return;
      }

      const idLaporan = this.detailLaporan?.laporan?.idLaporan || null;
      const res = await Api.kirim('POST', `/api/admin/akun/${idAkun}/blokir`, {
        idLaporan,
        alasan: alasan.trim(),
      });

      if (!res.sukses) {
        this.tampilkanPesanGalat(res.pesan || 'Gagal memblokir akun pengguna.');
        return;
      }

      this.tampilkanStatusTerbaru(res.pesan || 'Akun berhasil diblokir.');
      const modal = document.getElementById('modal-konfirmasi-moderasi');
      if (modal) modal.hidden = true;

      if (idLaporan) {
        this.bukaDetailLaporan(idLaporan);
      }
    } else if (this.tindakanAktif === 'HAPUS_LISTING') {
      const idBarang = this.targetIdBarang;
      const idLaporan = this.detailLaporan?.laporan?.idLaporan || null;
      const res = await Api.kirim('DELETE', `/api/admin/laporan/${idLaporan}/barang/${idBarang}`, {
        alasan: alasan.trim(),
      });

      if (!res.sukses) {
        this.tampilkanPesanGalat(res.pesan || 'Gagal menghapus listing.');
        return;
      }

      this.tampilkanStatusTerbaru(res.pesan || 'Listing berhasil dihapus.');
      const modal = document.getElementById('modal-konfirmasi-moderasi');
      if (modal) modal.hidden = true;

      if (idLaporan) {
        this.bukaDetailLaporan(idLaporan);
      }
    } else {
      this.tampilkanStatusTerbaru('Tindakan moderasi berhasil dijalankan.');
      const modal = document.getElementById('modal-konfirmasi-moderasi');
      if (modal) modal.hidden = true;
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Inisialisasi otomatis ketika DOM selesai dimuat
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dasborAdmin = new DasborAdmin();
    window.dasborAdmin.inisialisasi();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DasborAdmin;
}
