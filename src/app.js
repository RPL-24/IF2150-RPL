// Penyusunan aplikasi Express: route API (Controller) dan berkas View statis.
const fs = require('fs');
const path = require('path');
const express = require('express');
const akunRoutes = require('./routes/akunRoutes');
const dokumenLegalRoutes = require('./routes/dokumenLegalRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const moderasiRoutes = require('./routes/moderasiRoutes');
const barangRoutes = require('./routes/barangRoutes');
const percakapanRoutes = require('./routes/percakapanRoutes');
const notifikasiRoutes = require('./routes/notifikasiRoutes');
const katalogRoutes = require('./routes/katalogRoutes');

const DIR_VIEWS = path.join(__dirname, 'views');
const DIR_HALAMAN = path.join(DIR_VIEWS, 'pages');
const DIR_UPLOADS = path.join(__dirname, 'uploads');

const app = express();
app.use(express.json());

// ───────────── API (satu baris per modul) ─────────────
app.use('/api/akun', akunRoutes);
app.use('/api/dokumen-legal', dokumenLegalRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/admin', moderasiRoutes);
app.use('/api/barang', barangRoutes);
app.use('/api/percakapan', percakapanRoutes);
app.use('/api/notifikasi', notifikasiRoutes);
app.use('/api/katalog', katalogRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ sukses: false, pesan: 'Endpoint tidak ditemukan.' });
});

// ───────────── View & Berkas Statis ─────────────
// Beranda adalah katalog (modul C); selama katalog belum ada, arahkan ke profil (profil menangani sesi login).
app.get('/', (req, res) => {
  const adaKatalog = fs.existsSync(path.join(DIR_HALAMAN, 'katalog.html'));
  res.redirect(adaKatalog ? '/katalog' : '/profil');
});

app.use('/uploads', express.static(DIR_UPLOADS));
app.use(express.static(DIR_HALAMAN, { extensions: ['html'] })); // /masuk → pages/masuk.html
app.use(express.static(DIR_VIEWS)); // /css, /js

// ───────────── Penanganan galat ─────────────
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ sukses: false, pesan: 'Format data tidak valid.' });
  }
  console.error(err);
  res.status(500).json({ sukses: false, pesan: 'Terjadi galat pada server. Coba lagi nanti.' });
});

module.exports = app;
