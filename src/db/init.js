const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./database');

db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

const hash = (teks) => bcrypt.hashSync(teks, 10);

db.prepare(
  'INSERT OR IGNORE INTO Admin (nama, email, sandi) VALUES (?, ?, ?)'
).run('Admin Uji', 'admin@lawhub.test', hash('admin123'));

db.prepare(
  'INSERT OR IGNORE INTO Masyarakat (nama, nomorInduk, email, sandi) VALUES (?, ?, ?, ?)'
).run('Sisi Masyarakat', '3275000000000001', 'sisi@lawhub.test', hash('sisi947'));

db.prepare(
  `INSERT OR IGNORE INTO MitraPengacara
   (nama, email, sandiMitra, validitas, statusVerifikasi, tagKeahlian, spesialisasi, rekeningPencairan)
   VALUES (?, ?, ?, 1, 'terverifikasi', ?, ?, ?)`
).run('Ami Pengacara', 'ami@lawhub.test', hash('ami657'),
      'pidana,perdata', 'Hukum Pidana', 'BCA 1234567890');

// dummy SearchLaw
const jumlahPasal = db.prepare('SELECT COUNT(*) AS n FROM DasarHukum').get().n;
if (jumlahPasal === 0) {
  const tambahPasal = db.prepare(
    'INSERT INTO DasarHukum (namaPeraturan, nomorPasal, isiPasal) VALUES (?, ?, ?)'
  );
  tambahPasal.run('Peraturan Contoh A', 'Pasal 1', 'Isi pasal contoh pertama (data uji).');
  tambahPasal.run('Peraturan Contoh A', 'Pasal 2', 'Isi pasal contoh kedua (data uji).');
  tambahPasal.run('Peraturan Contoh B', 'Pasal 10', 'Isi pasal contoh tentang kontrak (data uji).');
}

console.log('Database siap.');