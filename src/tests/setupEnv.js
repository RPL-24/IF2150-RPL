// Nilai khusus pengujian, bukan rahasia yang dipakai saat aplikasi berjalan
process.env.JWT_SECRET = 'secret-khusus-pengujian-minimal-32-karakter';
process.env.AES_SECRET_KEY = 'kunci-khusus-pengujian-32-karakter';
process.env.SMTP_HOST = '';
process.env.APP_URL = 'http://localhost:3000';
process.env.NOTIF_RETRY_DELAY_MS = '0';
process.env.MAIL_LOG_SENYAP = 'true';

// Test integrasi menghapus isi basis data, sehingga hanya memakai TEST_DATABASE_URL
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
