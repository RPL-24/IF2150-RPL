// C15 KatalogController
// Menyajikan katalog listing (UC13), hasil pencarian dan penyaringan (UC14),
// serta detail satu listing untuk pembeli (UC15).
const Barang = require('../models/Barang');
const PencarianController = require('./PencarianController');
const FilterController = require('./FilterController');

const ok = (res, data, pesan, status = 200) => res.status(status).json({ sukses: true, data, pesan });

function galatTidakDitemukan() {
  const galat = new Error('Listing tidak ditemukan atau sudah tidak tersedia.');
  galat.status = 404;
  return galat;
}

// GET /api/katalog?q=&kategori=&hargaMin=&hargaMaks=&lokasi=&urut=&halaman=
async function getProduk(req, res) {
  const filter = FilterController.validasiFilter(req.query);
  const { kataKunci, daftarKata } = PencarianController.siapkanPencarian(req.query.q);
  const { batas, offset } = FilterController.hitungPaginasi(filter.halaman);

  const { daftar, total } = await Barang.getKatalog({
    daftarKata,
    kategori: filter.kategori,
    lokasi: filter.lokasi,
    hargaMin: filter.hargaMin,
    hargaMaks: filter.hargaMaks,
    urut: filter.urut,
    batas,
    offset,
  });

  const totalHalaman = Math.max(1, Math.ceil(total / FilterController.UKURAN_HALAMAN));
  const pesan = daftar.length === 0 ? 'Barang tidak ditemukan.' : undefined; // I-05b

  return ok(
    res,
    {
      daftar,
      paginasi: {
        halaman: filter.halaman,
        totalHalaman,
        totalItem: total,
        ukuranHalaman: FilterController.UKURAN_HALAMAN,
      },
      kriteria: { kataKunci, ...filter },
    },
    pesan,
  );
}

// GET /api/katalog/:id
async function getDetailProduk(req, res) {
  const barang = await Barang.getDetailKatalog(req.params.id);
  if (!barang) throw galatTidakDitemukan();

  // Tombol Hubungi Penjual dan Laporkan disembunyikan untuk listing milik sendiri.
  barang.milikSendiri = Boolean(req.akun && req.akun.idAkun === barang.idPenjual);
  return ok(res, barang);
}

module.exports = { getProduk, getDetailProduk };
