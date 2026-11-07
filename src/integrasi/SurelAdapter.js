// C43 SurelAdapter – pengirim surel melalui SMTP.
// Saat pengembangan, SMTP diarahkan ke Mailpit (docker-compose.yml).
const nodemailer = require('nodemailer');
const config = require('../config/env');

class SurelAdapter {
  constructor(hostSmtp, portSmtp, alamatPengirim, user, pass) {
    this.hostSmtp = hostSmtp;
    this.portSmtp = portSmtp;
    this.alamatPengirim = alamatPengirim;
    this.transporter = nodemailer.createTransport({
      host: hostSmtp,
      port: portSmtp,
      secure: portSmtp === 465, // 465 = TLS langsung; 587 memakai STARTTLS
      auth: user ? { user, pass } : undefined,
    });
  }

  // Mengembalikan false bila pengiriman gagal, supaya pemanggil dapat menampilkan pesan.
  async kirimSurel(tujuan, subjek, isi) {
    try {
      await this.transporter.sendMail({ from: this.alamatPengirim, to: tujuan, subject: subjek, text: isi });
      return true;
    } catch (galat) {
      console.error(`Gagal mengirim surel ke ${tujuan}:`, galat.message);
      return false;
    }
  }
}

const { host, port, pengirim, user, pass } = config.smtp;
module.exports = new SurelAdapter(host, port, pengirim, user, pass);
