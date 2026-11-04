// C10 FormulirLaporan – View & Boundary untuk I-12 Formulir Laporan (UC19).
// Membutuhkan api.js.
class FormulirLaporan {
  constructor() {
    this.jenisPelanggaran = 'Penipuan';
    this.teksAlasan = '';
    this.objekDilaporkan = '';
    this.jenisObjek = 'Listing';
    this.berkasBukti = [];
    this.token = Api.getToken();
  }

  inisialisasi() {
    const urlParams = new URLSearchParams(window.location.search);
    const objek = urlParams.get('objek') || 'Listing Preloved ITB';
    const jenis = urlParams.get('jenis') || 'Listing';
    this.tampilkanFormulirLaporan(objek, jenis);
    this.pasangEventListeners();
  }

  tampilkanFormulirLaporan(objekDilaporkan, jenisObjek = 'Listing') {
    this.objekDilaporkan = objekDilaporkan;
    this.jenisObjek = jenisObjek;

    const elKonteks = document.getElementById('konteks-objek');
    if (elKonteks) {
      elKonteks.textContent = objekDilaporkan;
    }

    const infoPrivasi = document.getElementById('info-privasi-chat');
    if (infoPrivasi) {
      infoPrivasi.hidden = jenisObjek !== 'Percakapan';
    }
  }

  unggahBukti(daftarBerkas) {
    if (!daftarBerkas) return;
    for (const f of daftarBerkas) {
      if (this.berkasBukti.length >= 5) break;
      if (f.size > 5 * 1024 * 1024) {
        this.tampilkanPesanGalat('Ukuran berkas melebihi batas 5 MB.');
        continue;
      }
      const nama = f.name.toLowerCase();
      if (!nama.endsWith('.jpg') && !nama.endsWith('.jpeg') && !nama.endsWith('.png')) {
        this.tampilkanPesanGalat('Format berkas harus JPG atau PNG.');
        continue;
      }
      this.berkasBukti.push(f);
    }
    this.renderPratinjauBukti();
  }

  renderPratinjauBukti() {
    const kontainer = document.getElementById('kontainer-bukti');
    if (!kontainer) return;
    kontainer.innerHTML = '';

    this.berkasBukti.forEach((f, idx) => {
      const item = document.createElement('div');
      item.className = 'bukti__item';

      const img = document.createElement('img');
      img.src = URL.createObjectURL(f);
      img.alt = f.name;

      const btnHapus = document.createElement('button');
      btnHapus.type = 'button';
      btnHapus.className = 'bukti__hapus';
      btnHapus.innerHTML = '&times;';
      btnHapus.title = 'Hapus berkas';
      btnHapus.onclick = () => {
        this.berkasBukti.splice(idx, 1);
        this.renderPratinjauBukti();
      };

      item.append(img, btnHapus);
      kontainer.appendChild(item);
    });

    if (this.berkasBukti.length < 5) {
      const slotKosong = document.createElement('label');
      slotKosong.className = 'bukti__tambah kosong';
      slotKosong.innerHTML = `
        <span style="font-size:24px; color:var(--muted)">+</span>
        <span style="font-size:12px; color:var(--muted)">Tambah</span>
        <input type="file" id="input-bukti-file" accept="image/png, image/jpeg, image/jpg" hidden multiple>
      `;
      slotKosong.querySelector('input').addEventListener('change', (e) => {
        this.unggahBukti(Array.from(e.target.files));
      });
      kontainer.appendChild(slotKosong);
    }
  }

  validasiIsianWajib() {
    const elAlasan = document.getElementById('teks-alasan');
    this.teksAlasan = elAlasan ? elAlasan.value.trim() : '';

    const radioSelected = document.querySelector('input[name="kategori"]:checked');
    this.jenisPelanggaran = radioSelected ? radioSelected.value : '';

    if (!this.objekDilaporkan || !this.jenisPelanggaran || !this.teksAlasan || this.berkasBukti.length === 0) {
      return false;
    }
    return true;
  }

  tandaiIsianKosong() {
    const elAlasan = document.getElementById('teks-alasan');
    if (!this.teksAlasan && elAlasan) {
      elAlasan.style.borderColor = 'var(--merah)';
    }
    this.tampilkanPesanGalat('Alasan dan sedikitnya satu bukti tangkapan layar (JPG/PNG) wajib diisi.');
  }

  async kirimLaporan() {
    this.sembunyikanPesanGalat();

    if (!Api.getToken()) {
      this.tampilkanPesanGalat('Silakan masuk terlebih dahulu untuk mengirim laporan.');
      setTimeout(() => {
        window.location.href = '/masuk';
      }, 1500);
      return;
    }

    if (!this.validasiIsianWajib()) {
      this.tandaiIsianKosong();
      return;
    }

    const formData = new FormData();
    formData.append('objekDilaporkan', this.objekDilaporkan);
    formData.append('jenisPelanggaran', this.jenisPelanggaran);
    formData.append('teksAlasan', this.teksAlasan);
    formData.append('jenisObjek', this.jenisObjek);

    for (const f of this.berkasBukti) {
      formData.append('bukti', f);
    }

    const tombolKirim = document.getElementById('tombol-kirim');
    if (tombolKirim) tombolKirim.disabled = true;

    try {
      const hasil = await Api.kirim('POST', '/api/laporan', formData);
      if (!hasil.sukses) {
        this.tampilkanPesanGalat(hasil.pesan || 'Gagal mengirim laporan.');
        if (tombolKirim) tombolKirim.disabled = false;
        return;
      }

      this.tampilkanNotifikasi('Laporan berhasil dikirim dan akan segera ditinjau admin.');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      this.tampilkanPesanGalat('Terjadi kesalahan koneksi.');
      if (tombolKirim) tombolKirim.disabled = false;
    }
  }

  tampilkanPesanGalat(pesan) {
    const el = document.getElementById('pesan-galat');
    if (el) {
      el.textContent = pesan;
      el.hidden = false;
    }
  }

  sembunyikanPesanGalat() {
    const el = document.getElementById('pesan-galat');
    if (el) el.hidden = true;
    const elAlasan = document.getElementById('teks-alasan');
    if (elAlasan) elAlasan.style.borderColor = '';
  }

  tampilkanNotifikasi(pesan) {
    const el = document.getElementById('pesan-sukses');
    if (el) {
      el.textContent = pesan;
      el.hidden = false;
    }
  }

  pasangEventListeners() {
    const form = document.getElementById('formulir-laporan');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.kirimLaporan();
      });
    }

    const btnBatal = document.getElementById('tombol-batal');
    if (btnBatal) {
      btnBatal.addEventListener('click', () => {
        window.history.length > 1 ? window.history.back() : (window.location.href = '/');
      });
    }

    const inputBukti = document.getElementById('input-bukti-file');
    if (inputBukti) {
      inputBukti.addEventListener('change', (e) => {
        this.unggahBukti(Array.from(e.target.files));
      });
    }

    this.renderPratinjauBukti();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const modulLaporan = new FormulirLaporan();
  modulLaporan.inisialisasi();
});
