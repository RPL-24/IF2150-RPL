const db = require('../db/database');

exports.cariByEmail = (email) =>
  db.prepare('SELECT * FROM Pengguna WHERE email = ?').get(email);