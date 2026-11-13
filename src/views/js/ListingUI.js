/* Utilitas khusus modul listing. Data pengguna selalu ditulis sebagai teks. */
const ListingUI = {
  uang: n => 'Rp' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(Number(n) || 0),
  el(tag, kelas, teks) { const e = document.createElement(tag); if (kelas) e.className = kelas; if (teks !== undefined) e.textContent = teks; return e; },
  async api(method, url, body) {
    const r = await Api.kirim(method, url, body);
    if (r.status === 401) { Api.hapusSesi(); location.assign('/masuk'); }
    if (!r.sukses) throw new Error(r.pesan || 'Permintaan gagal.');
    return r.data;
  },
  galat(pesan) { const e = document.getElementById('galat-umum'); e.textContent = pesan; e.hidden = !pesan; },
  toast(pesan) { const e = document.getElementById('pesan'); e.textContent = pesan; e.hidden = false; clearTimeout(this.timer); this.timer = setTimeout(() => { e.hidden = true; }, 5000); },
  kartu(b) {
    const card = this.el('article', `card${b.status === 'Terjual' ? ' is-terjual' : ''}`);
    const media = this.el('div', 'card__media');
    if (b.fotoUtama) { const img = this.el('img'); img.src = b.fotoUtama; img.alt = b.judul || 'Foto barang'; media.append(img); }
    else media.append(this.el('div', 'ph', 'Belum ada foto'));
    if (b.status === 'Terjual') media.append(this.el('span', 'badge badge--terjual card__badge', 'Terjual'));
    const body = this.el('div', 'card__body');
    body.append(this.el('div','card__price',this.uang(b.harga)),this.el('div','card__title', b.judul || 'Judul barang'),this.el('div','card__meta', `${b.idLokasi || 'Pilih lokasi'} · ${b.idKategori || 'Pilih kategori'}`));
    card.append(media,body); return card;
  },
  konfirmasi(judul, teks, aksi, label = 'Konfirmasi', merusak = false) {
    const modal = this.el('dialog','dialog');
    modal.setAttribute('aria-labelledby','dialog-judul');
    const h = this.el('h2','dialog__title',judul); h.id = 'dialog-judul';
    const pesan = this.el('div','field__error'); pesan.setAttribute('role','alert'); pesan.hidden = true;
    const tombol = this.el('div','dialog__actions');
    const batal = this.el('button','btn btn--sekunder','Batal');
    const ok = this.el('button',`btn ${merusak ? 'btn--merusak' : 'btn--primer'}`,label);
    let busy = false;
    batal.onclick = () => modal.close();
    modal.addEventListener('cancel', e => { if (busy) e.preventDefault(); });
    modal.onclose = () => modal.remove();
    ok.onclick = async () => {
      busy = true; ok.disabled = batal.disabled = true;
      try { await aksi(); modal.close(); }
      catch (err) { pesan.textContent = err.message; pesan.hidden = false; }
      finally { busy = false; ok.disabled = batal.disabled = false; }
    };
    tombol.append(batal,ok); modal.append(h,this.el('p','dialog__text',teks),pesan,tombol);
    document.body.append(modal); modal.showModal(); batal.focus();
  },
  async mulai() {
    if (!Api.getToken()) { location.replace('/masuk'); return false; }
    const pesan = sessionStorage.getItem('listing-pesan');
    if (pesan) { sessionStorage.removeItem('listing-pesan'); this.toast(pesan); }
    return true;
  },
};
