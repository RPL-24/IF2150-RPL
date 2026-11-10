const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }
  if (!process.env.SMTP_HOST) {
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

/**
 * Mengirim tautan konfirmasi registrasi ke e-mail orang tua/wali (UC01, Algo-C11-02).
 * Bila SMTP belum dikonfigurasi, tautan hanya dicatat di log agar alur lokal tetap bisa diuji.
 */
async function kirimEmailKonfirmasiWali({ emailWali, namaPelajar, token }) {
  const tautan = `${process.env.APP_URL || 'http://localhost:3000'}/konfirmasi-registrasi?token=${token}`;
  const pengirim = process.env.SMTP_FROM || 'MahaSehat <no-reply@mahasehat.id>';
  const isi = `Konfirmasi registrasi akun MahaSehat untuk ${namaPelajar}:\n${tautan}`;

  const pengangkut = getTransporter();
  if (!pengangkut) {
    console.log(`[Mail] Konfirmasi untuk ${emailWali}: ${tautan}`);
    return;
  }

  await pengangkut.sendMail({
    from: pengirim,
    to: emailWali,
    subject: 'Konfirmasi Registrasi Akun MahaSehat',
    text: isi,
  });
}

/**
 * Mengirim tautan reset password (UC09 skenario alternatif, Algo-C27-01).
 * Bila SMTP belum dikonfigurasi, tautan hanya dicatat di log agar alur lokal tetap bisa diuji.
 */
async function kirimEmailResetPassword({ email, token }) {
  const tautan = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const pengangkut = getTransporter();
  if (!pengangkut) {
    console.log(`[Mail] Reset password untuk ${email}: ${tautan}`);
    return;
  }

  await pengangkut.sendMail({
    from: process.env.SMTP_FROM || 'MahaSehat <no-reply@mahasehat.id>',
    to: email,
    subject: 'Atur Ulang Kata Sandi MahaSehat',
    text: `Buka tautan berikut untuk mengatur ulang kata sandi. Tautan berlaku 1 jam.\n${tautan}`,
  });
}

module.exports = { kirimEmailKonfirmasiWali, kirimEmailResetPassword };
