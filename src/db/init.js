const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./database');

db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

const tambah = db.prepare(
  'INSERT OR IGNORE INTO Pengguna (nama, email, kataSandi, peran) VALUES (?, ?, ?, ?)'
);
tambah.run('Admin Uji', 'admin@lawhub.test', bcrypt.hashSync('admin123', 10), 'admin');
tambah.run('Sisi Masyarakat', 'sisi@lawhub.test', bcrypt.hashSync('sisi947', 10), 'masyarakat');
tambah.run('Ami Pengacara', 'sari@lawhub.test', bcrypt.hashSync('ami657', 10), 'mitra');

console.log('Database siap.');