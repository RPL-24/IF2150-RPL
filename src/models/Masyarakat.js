const db = require('../db/database');

exports.buat = ({ nama, username, noHp, email, sandiHash}) =>
    db.prepare(
        'INSERT INTO Masyarakat (nama, username, noHp, email, sandi) VALUES (?, ?, ?, ?, ?)'
    ).run(nama, username, noHp, email, sandiHash);

    exports.IsUsnAda = (username) =>
        !!db.prepare('SELECT 1 FROM Masyarakat WHERE username = ?').get(username);