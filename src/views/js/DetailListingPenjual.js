// Tujuan setelah menyimpan I-07. Detail khusus pemilik, bukan implementasi UC15 publik.
document.addEventListener('DOMContentLoaded', async () => {
  if (!await ListingUI.mulai()) return;
  try {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) throw new Error('ID listing belum diberikan.');
    const { barang: b, daftarFoto } = await ListingUI.api('GET',`/api/barang/${encodeURIComponent(id)}`);
    for (const [key,teks] of Object.entries({judul:b.judul,harga:ListingUI.uang(b.harga),kategori:b.idKategori,lokasi:b.idLokasi,status:b.status,deskripsi:b.deskripsiKondisi})) document.getElementById(`detail-${key}`).textContent = teks;
    const utama = document.getElementById('foto-utama'); utama.src = daftarFoto[0]?.pathBerkas || ''; utama.alt = b.judul;
    daftarFoto.forEach((f,i) => {
      const button = ListingUI.el('button'); button.setAttribute('aria-label',`Lihat foto ${i+1}`);
      const img = ListingUI.el('img'); img.src = f.pathBerkas; img.alt = `Foto ${i+1}`; button.append(img);
      button.onclick = () => { utama.src = f.pathBerkas; }; document.getElementById('galeri').append(button);
    });
    document.getElementById('ubah').href = `/listing-form?id=${encodeURIComponent(id)}`;
    document.getElementById('detail').hidden = false;
  } catch (err) { ListingUI.galat(err.message); }
});
