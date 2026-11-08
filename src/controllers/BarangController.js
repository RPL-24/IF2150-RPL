const Barang = require('../models/Barang');
const referensi = require('../models/ReferensiListing');
const { ListingService } = require('../services/ListingService');
const ok = (res, data, pesan, status = 200) => res.status(status).json({ sukses: true, data, pesan });
module.exports = {
  getDataFormulir: (req, res) => ok(res, referensi),
  getListingSaya: async (req, res) => ok(res, await Barang.getListingPenjual(req.akun.idAkun)),
  getBarang: async (req, res) => ok(res, await ListingService.get(req.params.id, req.akun.idAkun)),
  buatBarang: async (req, res) => ok(res, await ListingService.simpan(null, req.akun.idAkun, req.body, req.files), 'Listing berhasil dibuat', 201),
  updateBarang: async (req, res) => ok(res, await ListingService.simpan(req.params.id, req.akun.idAkun, req.body, req.files), 'Listing berhasil diubah'),
  deleteBarang: async (req, res) => { await ListingService.hapus(req.params.id, req.akun.idAkun); ok(res, null, 'Listing berhasil dihapus'); },
  ubahStatusBarang: async (req, res) => { await ListingService.status(req.params.id, req.akun.idAkun, req.body?.statusAsal, req.body?.statusTujuan); ok(res, null, 'Status listing berhasil diubah'); },
};
