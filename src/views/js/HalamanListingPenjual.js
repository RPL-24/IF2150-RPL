class HalamanListingPenjual {
  constructor() { this.daftar = []; this.tab = location.hash === '#terjual' ? 'Terjual' : 'Tersedia'; this.busy = false; }
  async mulai() {
    if (!await ListingUI.mulai()) return;
    for (const status of ['Tersedia','Terjual']) {
      document.getElementById(`tab-${status.toLowerCase()}`).onclick = e => { e.preventDefault(); this.tab = status; history.replaceState(null,'',`#${status.toLowerCase()}`); this.render(); };
    }
    await this.muat();
  }
  async muat() {
    try { this.daftar = await ListingUI.api('GET','/api/barang/saya'); ListingUI.galat(''); this.render(); }
    catch (err) { ListingUI.galat(err.message); }
    finally { document.getElementById('memuat').hidden = true; }
  }
  render() {
    for (const status of ['Tersedia','Terjual']) {
      const el = document.getElementById(`tab-${status.toLowerCase()}`);
      el.textContent = `${status} (${this.daftar.filter(b => b.status === status).length})`;
      el.classList.toggle('is-active',this.tab === status); el.setAttribute('aria-selected',String(this.tab === status));
    }
    const grid = document.getElementById('daftar-listing'); grid.replaceChildren();
    for (const b of this.daftar.filter(b => b.status === this.tab)) {
      const card = ListingUI.kartu(b); const actions = ListingUI.el('div','card__actions');
      const ubah = ListingUI.el('a','btn btn--sekunder btn--sm','Ubah'); ubah.href = `/listing-form?id=${encodeURIComponent(b.idBarang)}`;
      const status = ListingUI.el('button','btn btn--sekunder btn--sm',b.status === 'Terjual' ? 'Batalkan Terjual' : 'Terjual');
      status.setAttribute('aria-label',b.status === 'Terjual' ? 'Batalkan Terjual' : 'Tandai Terjual'); status.onclick = () => this.aksi(b,'status');
      const hapus = ListingUI.el('button','btn btn--sekunder btn--sm hapus','Hapus'); hapus.onclick = () => this.aksi(b,'hapus');
      actions.append(ubah,status,hapus); card.append(actions); grid.append(card);
    }
    document.getElementById('listing-kosong').hidden = !!grid.childElementCount;
    document.getElementById('teks-kosong').textContent = this.tab === 'Terjual' ? 'Belum ada listing terjual' : 'Anda belum punya listing tersedia';
  }
  async aksi(barang, aksi) {
    if (this.busy || document.querySelector('dialog[open]')) return;
    this.busy = true;
    try {
      const { barang: b } = await ListingUI.api('GET',`/api/barang/${barang.idBarang}`);
      if (b.status !== barang.status) { await this.muat(); ListingUI.toast('Status listing berubah. Silakan pilih aksi kembali.'); return; }
      const hapus = aksi === 'hapus', terjual = b.status === 'Tersedia';
      ListingUI.konfirmasi(hapus ? `Hapus “${b.judul}”?` : `${terjual ? 'Tandai terjual' : 'Batalkan penandaan terjual'} “${b.judul}”?`,
        hapus ? 'Listing beserta seluruh fotonya akan dihapus permanen dan tidak dapat dikembalikan. Percakapan yang sudah berjalan dengan calon pembeli tetap tersimpan.' : terjual ? 'Listing akan ditandai terjual dan tidak lagi ditampilkan pada katalog.' : 'Listing akan kembali tersedia pada katalog.',
        async () => {
          try {
            if (hapus) await ListingUI.api('DELETE',`/api/barang/${b.idBarang}`);
            else await ListingUI.api('PATCH',`/api/barang/${b.idBarang}/status`,{ statusAsal:b.status,statusTujuan:terjual ? 'Terjual' : 'Tersedia' });
          } catch (err) { await this.muat(); throw err; }
          await this.muat(); ListingUI.toast(hapus ? 'Listing berhasil dihapus' : terjual ? 'Listing ditandai terjual' : 'Listing kembali tersedia');
        }, hapus ? 'Hapus Listing' : terjual ? 'Tandai Terjual' : 'Batalkan Terjual', hapus);
    } catch (err) { ListingUI.galat(err.message); }
    finally { this.busy = false; }
  }
}
document.addEventListener('DOMContentLoaded', () => new HalamanListingPenjual().mulai());
