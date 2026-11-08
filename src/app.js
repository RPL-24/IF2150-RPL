const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes');

const app = express();

// Middleware dasar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan aset statis Frontend (View MVC): /views/*.html dan /assets/*
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'public')));

// Mount seluruh route API di bawah /api
app.use('/api', apiRoutes);

function arahkanKeHalaman(halaman) {
  return (req, res) => {
    const posisiQuery = req.originalUrl.indexOf('?');
    const query = posisiQuery === -1 ? '' : req.originalUrl.slice(posisiQuery);
    res.redirect(`/views/${halaman}${query}`);
  };
}

// Halaman utama dan tautan pada e-mail
app.get('/', arahkanKeHalaman('LoginPage.html'));
app.get('/konfirmasi-registrasi', arahkanKeHalaman('KonfirmasiRegistrasiPage.html'));
app.get('/reset-password', arahkanKeHalaman('ResetPasswordPage.html'));

// Penanganan endpoint API yang tidak ditemukan (404)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) {
    console.error('[Server Error]:', err);
  }
  // Galat internal, misalnya dari basis data, tidak dikirim apa adanya ke klien
  res.status(status).json({
    success: false,
    message: status >= 500 ? 'Terjadi kesalahan internal pada server.' : err.message,
  });
});

module.exports = app;

