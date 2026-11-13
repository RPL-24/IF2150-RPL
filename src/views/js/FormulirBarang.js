class FormulirBarang {
  constructor() {
    this.id = new URLSearchParams(location.search).get('id');
    this.foto = []; this.dirty = false; this.busy = false;
    this.form = document.getElementById('form-listing');
    this.fields = ['judul','harga','idKategori','idLokasi','deskripsiKondisi'];
  }
  async mulai() {
    if (!await ListingUI.mulai()) return;
    document.getElementById('batal').onclick = () => this.batal();
    this.form.onsubmit = e => { e.preventDefault(); this.simpan(); };
    this.form.oninput = () => { this.dirty = true; this.preview(); };
    this.form.onchange = () => { this.dirty = true; this.preview(); };
    window.addEventListener('beforeunload', e => { if (this.dirty) { e.preventDefault(); e.returnValue = ''; } });
    document.getElementById('foto').onchange = e => { this.tambahFoto([...e.target.files]); e.target.value = ''; };
    const grid = document.getElementById('foto-list');
    grid.ondragover = e => { e.preventDefault(); grid.classList.add('dragover'); };
    grid.ondragleave = () => grid.classList.remove('dragover');
    grid.ondrop = e => { e.preventDefault(); grid.classList.remove('dragover'); if (e.dataTransfer.files.length) this.tambahFoto([...e.dataTransfer.files]); };
    this.renderFoto(); this.preview();
    try {
      const data = await ListingUI.api('GET',this.id ? `/api/barang/${encodeURIComponent(this.id)}` : '/api/barang/formulir');
      for (const [key, values] of [['idKategori',data.kategori],['idLokasi',data.lokasi]]) {
        for (const v of values) { const o = ListingUI.el('option','',v); o.value = v; document.getElementById(key).append(o); }
      }
      if (this.id) {
        document.getElementById('judul-halaman').textContent = 'Ubah Listing';
        document.getElementById('breadcrumb').textContent = 'Listing Saya · Ubah listing';
        document.getElementById('simpan').textContent = 'Simpan Perubahan';
        this.fields.forEach(k => { document.getElementById(k).value = data.barang[k]; });
        this.foto = data.daftarFoto.map(f => ({ id: f.idFoto, url: f.pathBerkas }));
      }
      this.renderFoto(); this.preview(); document.getElementById('simpan').disabled = false;
    } catch (err) { ListingUI.galat(err.message); }
  }
  tambahFoto(files) {
    if (this.busy) return;
    let pesan = '';
    if (this.foto.length + files.length > 5) pesan = 'Maksimum 5 foto. Hapus foto terlebih dahulu.';
    else if (files.some(f => !['image/jpeg','image/png'].includes(f.type) || !/\.(jpe?g|png)$/i.test(f.name) || f.size <= 0 || f.size > 5*1024*1024)) pesan = 'Foto harus JPG/PNG, maksimum 5 MB per foto.';
    this.error('foto',pesan);
    if (pesan) return;
    this.foto.push(...files.map(file => ({ file, url: URL.createObjectURL(file) })));
    this.dirty = true; this.renderFoto(); this.preview();
  }
  pindah(dari, ke) {
    if (this.busy || ke < 0 || ke >= this.foto.length || dari === ke) return;
    this.foto.splice(ke,0,this.foto.splice(dari,1)[0]);
    this.dirty = true; this.renderFoto(); this.preview();
  }
  renderFoto() {
    const grid = document.getElementById('foto-list'); grid.replaceChildren();
    this.foto.forEach((f,i) => {
      const tile = ListingUI.el('div'); tile.draggable = true;
      tile.ondragstart = e => e.dataTransfer.setData('text/plain', String(i));
      tile.ondrop = e => {
        if (e.dataTransfer.files.length) return;
        e.preventDefault(); e.stopPropagation(); grid.classList.remove('dragover');
        const raw = e.dataTransfer.getData('text/plain');
        if (/^\d+$/.test(raw) && Number(raw) < this.foto.length) this.pindah(Number(raw),i);
      };
      const img = ListingUI.el('img'); img.src = f.url; img.alt = `Foto ${i+1}`; img.draggable = false; tile.append(img);
      if (!i) tile.append(ListingUI.el('span','badge badge--baru tag','Utama'));
      const actions = ListingUI.el('div','foto-tools');
      const left = ListingUI.el('button','','←'); left.type = 'button'; left.title = `Pindahkan foto ${i+1} ke kiri`; left.setAttribute('aria-label',left.title); left.disabled = i === 0; left.onclick = () => this.pindah(i,i-1);
      const remove = ListingUI.el('button','','×'); remove.type = 'button'; remove.title = `Hapus foto ${i+1}`; remove.setAttribute('aria-label',remove.title);
      remove.onclick = () => { if (this.busy) return; if (f.file) URL.revokeObjectURL(f.url); this.foto.splice(i,1); this.dirty = true; this.renderFoto(); this.preview(); };
      actions.append(left,remove); tile.append(actions); grid.append(tile);
    });
    for (let i = this.foto.length; i < 5; i++) {
      const add = ListingUI.el('button','foto-tambah'); add.type = 'button'; add.setAttribute('aria-label',`Tambah foto ${i+1}`); add.append(ListingUI.el('span','ic ic--plus'));
      add.onclick = () => { if (!this.busy) document.getElementById('foto').click(); }; grid.append(add);
    }
  }
  data() { return Object.fromEntries(this.fields.map(k => [k,document.getElementById(k).value.trim()])); }
  preview() {
    const data = this.data(); data.fotoUtama = this.foto[0]?.url;
    document.getElementById('pratinjau').replaceChildren(ListingUI.kartu(data));
    document.getElementById('judul-hitung').textContent = `${data.judul.length} / 80 karakter`;
    document.getElementById('deskripsi-hitung').textContent = `${data.deskripsiKondisi.length} / 1000 karakter`;
  }
  error(key,pesan) {
    const e = document.getElementById(`${key}-error`); e.textContent = pesan; e.hidden = !pesan;
    const input = document.getElementById(key); input?.classList.toggle('is-error',!!pesan); input?.setAttribute('aria-invalid',String(!!pesan)); input?.setAttribute('aria-describedby',`${key}-error`);
  }
  validasi() {
    let valid = true;
    const label = { judul:'Judul barang wajib diisi.', harga:'Harga wajib berupa angka positif.',idKategori:'Kategori wajib dipilih.',idLokasi:'Lokasi titik temu COD wajib dipilih.',deskripsiKondisi:'Deskripsi kondisi wajib diisi.' };
    this.fields.forEach(k => { const el = document.getElementById(k); const salah = !el.value.trim() || !el.validity.valid; this.error(k,salah ? label[k] : ''); valid &&= !salah; });
    this.error('foto',this.foto.length ? '' : 'Sertakan minimal satu foto barang.');
    if (!valid) this.form.querySelector('[aria-invalid="true"]')?.focus();
    return valid && this.foto.length > 0;
  }
  async simpan() {
    if (this.busy || !this.validasi()) return;
    this.busy = true; document.getElementById('simpan').disabled = true; document.getElementById('batal').disabled = true; ListingUI.galat('');
    const body = new FormData(); Object.entries(this.data()).forEach(([k,v]) => body.append(k,v));
    let n = 0; const urutan = this.foto.map(f => { if (!f.file) return f.id; body.append('foto',f.file); return `baru:${n++}`; });
    body.append('urutanFoto',JSON.stringify(urutan));
    this.form.querySelectorAll('input,select,textarea').forEach(e => { e.disabled = true; });
    try {
      const data = await ListingUI.api(this.id ? 'PUT' : 'POST',this.id ? `/api/barang/${encodeURIComponent(this.id)}` : '/api/barang',body);
      this.dirty = false; sessionStorage.setItem('listing-pesan',this.id ? 'Listing berhasil diubah' : 'Listing berhasil dibuat');
      location.assign(`/detail?id=${encodeURIComponent(data.idBarang)}`);
    } catch (err) { ListingUI.galat(err.message); }
    finally {
      this.busy = false; document.getElementById('simpan').disabled = false; document.getElementById('batal').disabled = false;
      this.form.querySelectorAll('input,select,textarea').forEach(e => { e.disabled = false; });
    }
  }
  batal() {
    const keluar = () => { this.dirty = false; location.assign('/listing-saya'); };
    if (this.dirty) ListingUI.konfirmasi('Buang perubahan?', 'Perubahan yang belum disimpan akan hilang.', keluar, 'Buang Perubahan', true);
    else keluar();
  }
}
document.addEventListener('DOMContentLoaded', () => new FormulirBarang().mulai());
