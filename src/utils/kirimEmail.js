const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return transporter;
}

/**
 * Mengirim e-mail teks lewat SMTP. Bila SMTP_HOST kosong, isi e-mail dicetak ke log server
 * sehingga alur dapat diuji tanpa akun SMTP.
 */
async function kirimEmail({ to, subject, text }) {
  if (!process.env.SMTP_HOST) {
    console.log(`[E-mail] Kepada: ${to}\n[E-mail] Subjek: ${subject}\n${text}\n`);
    return;
  }
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || 'MahaSehat <no-reply@mahasehat.id>',
    to,
    subject,
    text,
  });
}

function urlAplikasi() {
  return process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
}

module.exports = { kirimEmail, urlAplikasi };
