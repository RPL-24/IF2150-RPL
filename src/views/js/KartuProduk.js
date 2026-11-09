/* C06 KartuProduk: ringkasan satu listing pada katalog (foto utama, harga, judul,
   lokasi COD, kategori, penjual). Seluruh kartu menaut ke halaman detail (UC15). */
const KartuProduk = {
  buat(barang) {
    const tautan = ListingUI.el('a', 'kartu-produk');
    tautan.href = `/barang?id=${encodeURIComponent(barang.idBarang)}`;
    tautan.setAttribute('aria-label', `${barang.judul}, ${ListingUI.uang(barang.harga)}`);

    const card = ListingUI.el('article', 'card');
    const media = ListingUI.el('div', 'card__media');
    if (barang.fotoUtama) {
      const img = ListingUI.el('img');
      img.src = barang.fotoUtama;
      img.alt = barang.judul || 'Foto barang';
      img.loading = 'lazy';
      media.append(img);
    } else {
      media.append(ListingUI.el('div', 'ph', 'Belum ada foto'));
    }

    const body = ListingUI.el('div', 'card__body');
    body.append(
      ListingUI.el('div', 'card__price', ListingUI.uang(barang.harga)),
      ListingUI.el('div', 'card__title', barang.judul || '-'),
      ListingUI.el('div', 'card__meta', `${barang.idLokasi || '-'} · ${barang.idKategori || '-'}`),
    );
    if (barang.namaPenjual) {
      body.append(ListingUI.el('div', 'card__meta kartu-produk__penjual', barang.namaPenjual));
    }

    card.append(media, body);
    tautan.append(card);
    return tautan;
  },
};
