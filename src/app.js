const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes');

const app = express();

// Middleware dasar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan aset statis Frontend (View MVC: HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Mount seluruh route API di bawah /api
app.use('/api', apiRoutes);

// Route halaman utama (Redirect ke halaman login / dashboard)
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).json({
        success: true,
        message: 'MahaSehat Server aktif. Antarmuka web tersedia di folder src/public.',
      });
    }
  });
});

// Penanganan endpoint API yang tidak ditemukan (404)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.',
  });
});

module.exports = app;

