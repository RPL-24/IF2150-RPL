const crypto = require('crypto');
const AppError = require('../utils/AppError');
const Pengguna = require('../models/Pengguna');
const { kirim } = require('../utils/respon');
const { kirimEmailResetPassword } = require('../utils/mailer');

const MIN_PANJANG_SANDI = 8;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Algo-C27-01, Algo-C27-03. Basis data hanya menyimpan hash token yang berlaku 1 jam,
 * sehingga tautan tidak bisa dipakai walau isi tabel bocor.
 */
async function lupaPassword(req, res) {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!Pengguna.POLA_EMAIL.test(email)) {
    throw new AppError(400, 'Format email tidak valid.');
  }
  const pengguna = await Pengguna.findByEmail(email);
  if (!pengguna) {
    throw new AppError(404, 'Email tidak terdaftar.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  await pengguna.simpanResetToken(hashToken(token));
  await kirimEmailResetPassword({ email: pengguna.email, token });
  return kirim(res, 200, 'Tautan atur ulang kata sandi telah dikirim ke email.');
}

/**
 * Algo-C27-02, Algo-C27-04. Token dibawa dari tautan e-mail. Setelah berhasil, token dihapus
 * dan seluruh sesi lama berakhir (Pengguna.setPassword menaikkan versi token).
 * confirm_password boleh tidak dikirim (ResetPasswordPage sudah mencocokkannya), tetapi bila
 * dikirim harus sama. Tautan yang tidak valid atau kedaluwarsa dijawab 404, sama seperti UC02.
 */
async function resetPassword(req, res) {
  const { token, password, confirm_password: konfirmasi } = req.body || {};
  if (typeof password !== 'string' || password.length < MIN_PANJANG_SANDI) {
    throw new AppError(400, 'Kata sandi baru minimal 8 karakter.');
  }
  if (konfirmasi !== undefined && password !== konfirmasi) {
    throw new AppError(400, 'Konfirmasi kata sandi tidak cocok.');
  }
  const pengguna = typeof token === 'string' && token !== ''
    ? await Pengguna.findByResetToken(hashToken(token))
    : null;
  if (!pengguna) {
    throw new AppError(404, 'Tautan atur ulang tidak valid atau sudah kedaluwarsa.');
  }

  await pengguna.setPassword(password);
  return kirim(res, 200, 'Kata sandi berhasil diganti. Silakan masuk dengan kata sandi baru.');
}

module.exports = { lupaPassword, resetPassword };
