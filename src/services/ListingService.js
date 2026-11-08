const crypto = require('crypto');
const Barang = require('../models/Barang');
const FotoBarang = require('../models/FotoBarang');
const Listing = require('../models/ListingPenjual');
const referensi = require('../models/ReferensiListing');
const storage = require('../penyimpanan/PenyimpananBerkas');
function gagal(status, pesan) { throw Object.assign(new Error(pesan), { status }); }
function milik(barang, akun) {
  if (!barang) gagal(404, 'Listing tidak ditemukan atau telah dihapus.');
  if (barang.idPenjual !== akun) gagal(403, 'Anda bukan pemilik listing ini.');
  if (barang.status === 'Dinonaktifkan') gagal(409, 'Listing dinonaktifkan oleh admin.');
  return barang;
}
function validasiData(body = {}) {
  const data = Object.fromEntries(['judul', 'harga', 'deskripsiKondisi', 'idKategori', 'idLokasi'].map(k => [k, typeof body[k] === 'string' ? body[k].trim() : body[k]]));
  if (typeof data.judul !== 'string' || !data.judul || data.judul.length > 80) gagal(400, 'Judul wajib diisi, maksimum 80 karakter.');
  if (typeof data.deskripsiKondisi !== 'string' || !data.deskripsiKondisi || data.deskripsiKondisi.length > 1000) gagal(400, 'Deskripsi wajib diisi, maksimum 1000 karakter.');
  if (!/^\d+(\.\d{1,2})?$/.test(String(data.harga)) || !Number.isFinite(Number(data.harga)) || Number(data.harga) <= 0 || Number(data.harga) > 9999999999.99) gagal(400, 'Harga harus berupa angka positif, maksimum Rp9.999.999.999,99.');
  data.harga = Number(data.harga);
  if (!referensi.kategori.includes(data.idKategori)) gagal(400, 'Kategori wajib dipilih dari daftar.');
  if (!referensi.lokasi.includes(data.idLokasi)) gagal(400, 'Lokasi titik temu COD wajib dipilih.');
  return data;
}
function validasiFoto(files) {
  for (const f of files) {
    const png = f.buffer?.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const jpg = f.buffer?.[0] === 255 && f.buffer?.[1] === 216 && f.buffer?.[2] === 255;
    const ext = (f.originalname || '').split('.').pop().toLowerCase();
    if (!FotoBarang.validasiUkuran(f.size) || !(png && ext === 'png' && f.mimetype === 'image/png' || jpg && ['jpg','jpeg'].includes(ext) && f.mimetype === 'image/jpeg')) gagal(400, 'Foto harus JPG/PNG yang valid, maksimum 5 MB per foto.');
    // Nama berkas penyimpanan hanya menggunakan ekstensi yang sudah diverifikasi.
    f.format = png ? 'png' : 'jpg';
  }
}
class ListingService {
  static async get(id, akun) {
    const barang = milik(await Barang.cariById(id), akun);
    return { barang, daftarFoto: await FotoBarang.getGaleri(id), ...referensi };
  }
  static async simpan(id, akun, body = {}, files = []) {
    const data = validasiData(body);
    validasiFoto(files);
    let urutan;
    try { urutan = JSON.parse(body.urutanFoto || '[]'); } catch { gagal(400, 'Urutan foto tidak valid.'); }
    if (!Array.isArray(urutan) || urutan.length < 1 || urutan.length > 5 || urutan.some(x => typeof x !== 'string') || new Set(urutan).size !== urutan.length) gagal(400, 'Sertakan 1–5 foto, tanpa duplikasi.');
    const idBarang = id || crypto.randomUUID();
    let pathBaru = [], pathHapus = [];
    try {
      await Listing.transaksi(async client => {
        if (!await Listing.akunAktif(akun, client)) gagal(403, 'Akun harus terverifikasi dan tidak diblokir.');
        let lama = [];
        if (id) {
          milik(await Listing.kunci(id, client), akun);
          lama = await FotoBarang.getGaleri(id, client);
        }
        const validKeys = new Set([...lama.map(f => f.idFoto), ...files.map((_,i) => `baru:${i}`)]);
        if (urutan.some(key => !validKeys.has(key)) || files.some((_,i) => !urutan.includes(`baru:${i}`))) gagal(400, 'Foto atau urutan foto tidak sesuai listing.');
        pathBaru = await storage.simpan(idBarang, files);
        if (pathBaru === null) { pathBaru = []; gagal(500, 'Foto gagal disimpan. Silakan coba lagi.'); }
        const baru = files.map((f,i) => ({ namaBerkas: f.originalname, format: f.format, ukuran: f.size, pathBerkas: pathBaru[i] }));
        const foto = urutan.map(key => key.startsWith('baru:') ? baru[Number(key.slice(5))] : lama.find(f => f.idFoto === key));
        pathHapus = lama.filter(f => !urutan.includes(f.idFoto)).map(f => f.pathBerkas);
        if (id) await Listing.update(id, data, client);
        else await Barang.simpan({ ...data, idBarang, idPenjual: akun }, new Date(), client);
        await Listing.galeri(idBarang, foto, client);
      });
    } catch (err) { await storage.hapus(pathBaru); throw err; }
    await storage.hapus(pathHapus);
    return { idBarang };
  }
  static async hapus(id, akun) {
    let foto;
    await Listing.transaksi(async client => {
      if (!await Listing.akunAktif(akun, client)) gagal(403, 'Akun tidak aktif.');
      milik(await Listing.kunci(id, client), akun);
      foto = await FotoBarang.getGaleri(id, client);
      await Barang.hapus(id, client); // metadata foto dihapus oleh ON DELETE CASCADE
    });
    await storage.hapus(foto.map(f => f.pathBerkas));
  }
  static async status(id, akun, asal, tujuan) {
    if (!(asal === 'Tersedia' && tujuan === 'Terjual' || asal === 'Terjual' && tujuan === 'Tersedia')) gagal(400, 'Perubahan status tidak valid.');
    await Listing.transaksi(async client => {
      if (!await Listing.akunAktif(akun, client)) gagal(403, 'Akun tidak aktif.');
      milik(await Listing.kunci(id, client), akun);
      if (!await Listing.setStatus(id, akun, asal, tujuan, client)) gagal(409, 'Status listing sudah berubah. Muat ulang daftar listing.');
    });
  }
}
module.exports = { ListingService, validasiData, validasiFoto };
