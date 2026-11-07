// Pemetaan HTTP /api/admin/* ke ModerasiController
const express = require('express');
const ModerasiController = require('../controllers/ModerasiController');
const Otorisasi = require('../pendukung/Otorisasi');
const Barang = require('../models/Barang');
const Akun = require('../models/Akun');

const router = express.Router();

// Seluruh rute moderasi dilindungi oleh verifikasi peran Admin (KF56)
router.use(Otorisasi.wajibAdmin);

// GET /api/admin/laporan/statistik - Mengambil statistik laporan untuk kartu metrik dasbor
router.get('/laporan/statistik', async (req, res) => {
  try {
    const statistik = await ModerasiController.getStatistik(req.token);
    if (!statistik) {
      return res.status(403).json({
        sukses: false,
        pesan: 'Akses ditolak. Pengguna bukan admin.',
      });
    }
    res.json({
      sukses: true,
      data: statistik,
    });
  } catch (galat) {
    console.error('Galat route /api/admin/laporan/statistik:', galat);
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi galat pada server saat mengambil statistik laporan.',
    });
  }
});

// GET /api/admin/laporan - Mengambil seluruh laporan atau disaring berdasarkan status (KF45, KF46, KF56)
router.get('/laporan', async (req, res) => {
  try {
    const { status } = req.query;
    let daftar;

    if (status && status !== 'Semua') {
      daftar = await ModerasiController.filterByStatus(req.token, status);
    } else {
      daftar = await ModerasiController.getAllLaporan(req.token);
    }

    if (daftar === null) {
      return res.status(403).json({
        sukses: false,
        pesan: 'Akses ditolak. Pengguna bukan admin.',
      });
    }

    res.json({
      sukses: true,
      data: daftar,
    });
  } catch (galat) {
    console.error('Galat route /api/admin/laporan:', galat);
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi galat pada server saat mengambil daftar laporan.',
    });
  }
});

// GET /api/admin/laporan/:id - Mengambil rincian informasi satu laporan (KF45, KF56)
router.get('/laporan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await ModerasiController.getDetailLaporan(req.token, id);

    if (detail === null) {
      return res.status(404).json({
        sukses: false,
        pesan: 'Laporan tidak ditemukan.',
      });
    }

    res.json({
      sukses: true,
      data: detail,
    });
  } catch (galat) {
    console.error(`Galat route /api/admin/laporan/${req.params.id}:`, galat);
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi galat pada server saat mengambil detail laporan.',
    });
  }
});

// PATCH /api/admin/laporan/:id/status - Memperbarui status penanganan laporan (KF47, KF48)
router.patch('/laporan/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Baru', 'Diproses', 'Selesai'].includes(status)) {
      return res.status(400).json({
        sukses: false,
        pesan: 'Status penanganan tidak valid. Pilih: Baru, Diproses, atau Selesai.',
      });
    }

    const berhasil = await ModerasiController.ubahStatusLaporan(req.token, id, status);
    if (!berhasil) {
      return res.status(400).json({
        sukses: false,
        pesan: 'Gagal memperbarui status laporan.',
      });
    }

    res.json({
      sukses: true,
      pesan: `Status laporan berhasil diperbarui menjadi ${status}.`,
    });
  } catch (galat) {
    console.error(`Galat route PATCH /api/admin/laporan/${req.params.id}/status:`, galat);
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi galat pada server saat memperbarui status laporan.',
    });
  }
});

// DELETE /api/admin/laporan/:id/barang/:idBarang - Menghapus listing yang dilaporkan (KF50, KF52, KF55, KF56)
router.delete('/laporan/:id/barang/:idBarang', async (req, res) => {
  try {
    const { id, idBarang } = req.params;
    const { alasan } = req.body || {};

    if (!alasan || typeof alasan !== 'string' || !alasan.trim()) {
      return res.status(400).json({
        sukses: false,
        pesan: 'Alasan penghapusan wajib diisi.',
      });
    }

    const barang = await Barang.cariById(idBarang);
    if (!barang) {
      return res.status(404).json({
        sukses: false,
        pesan: 'Listing barang tidak ditemukan.',
      });
    }

    const berhasil = await ModerasiController.hapusListingDilaporkan(
      req.token,
      id,
      idBarang,
      alasan.trim(),
    );

    if (!berhasil) {
      return res.status(400).json({
        sukses: false,
        pesan: 'Gagal menghapus listing yang dilaporkan.',
      });
    }

    res.json({
      sukses: true,
      pesan: 'Listing berhasil dihapus dan tindakan moderasi telah dicatat.',
    });
  } catch (galat) {
    console.error(`Galat route DELETE /api/admin/laporan/${req.params.id}/barang/${req.params.idBarang}:`, galat);
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi galat pada server saat menghapus listing.',
    });
  }
});

// POST /api/admin/akun/:idAkun/blokir - Memblokir akun pengguna (KF51, KF52, KF53, KF54, KF55, KF56, Algo-023)
router.post('/akun/:idAkun/blokir', async (req, res) => {
  try {
    const { idAkun } = req.params;
    const { idLaporan, alasan } = req.body || {};

    if (!alasan || typeof alasan !== 'string' || !alasan.trim()) {
      return res.status(400).json({
        sukses: false,
        pesan: 'Alasan pemblokiran wajib diisi.',
      });
    }

    const akunSasaran = await Akun.cariById(idAkun);
    if (!akunSasaran) {
      return res.status(404).json({
        sukses: false,
        pesan: 'Akun sasaran tidak ditemukan.',
      });
    }

    const berhasil = await ModerasiController.blokirAkun(
      req.token,
      idLaporan || null,
      idAkun,
      alasan.trim(),
    );

    if (!berhasil) {
      return res.status(400).json({
        sukses: false,
        pesan: 'Gagal memblokir akun pengguna.',
      });
    }

    res.json({
      sukses: true,
      pesan: 'Akun berhasil diblokir, seluruh listing dinonaktifkan, dan sesi pengguna telah dicabut.',
    });
  } catch (galat) {
    console.error(`Galat route POST /api/admin/akun/${req.params.idAkun}/blokir:`, galat);
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi galat pada server saat memblokir akun.',
    });
  }
});

// POST /api/admin/laporan/:id/akun/:idAkun/blokir - Memblokir akun dari konteks laporan
router.post('/laporan/:id/akun/:idAkun/blokir', async (req, res) => {
  try {
    const { id, idAkun } = req.params;
    const { alasan } = req.body || {};

    if (!alasan || typeof alasan !== 'string' || !alasan.trim()) {
      return res.status(400).json({
        sukses: false,
        pesan: 'Alasan pemblokiran wajib diisi.',
      });
    }

    const akunSasaran = await Akun.cariById(idAkun);
    if (!akunSasaran) {
      return res.status(404).json({
        sukses: false,
        pesan: 'Akun sasaran tidak ditemukan.',
      });
    }

    const berhasil = await ModerasiController.blokirAkun(
      req.token,
      id,
      idAkun,
      alasan.trim(),
    );

    if (!berhasil) {
      return res.status(400).json({
        sukses: false,
        pesan: 'Gagal memblokir akun pengguna.',
      });
    }

    res.json({
      sukses: true,
      pesan: 'Akun berhasil diblokir, seluruh listing dinonaktifkan, dan sesi pengguna telah dicabut.',
    });
  } catch (galat) {
    console.error(`Galat route POST /api/admin/laporan/${req.params.id}/akun/${req.params.idAkun}/blokir:`, galat);
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi galat pada server saat memblokir akun.',
    });
  }
});

module.exports = router;
