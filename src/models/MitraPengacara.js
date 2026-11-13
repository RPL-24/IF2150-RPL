const db = require('../db/database');

exports.IsUsnAda = (username) =>
    !!db.prepare('SELECT 1 FROM MitraPengacara WHERE username = ?').get(username);

const simpan = db.transaction((data, daftarDokumen) => {
    const hasil = db.prepare(
        `INSERT INTO MitraPengacara (nama, username, namaFirma, email, sandiMitra)
        VALUES (?, ?, ?, ?, ?)`
    ).run(data.nama, data.username, data.namaFirma, data.email, data.sandiHash);

    const tambahDokumen = db.prepare(
        `INSERT INTO DokumenLegalitas (idMitra, jenisDokumen, namaBerkas, lokasiBerkas)
        VALUES (?, ?, ?, ?)`
    );
    for ( const d of daftarDokumen){
        tambahDokumen.run(hasil.lastInsertRowid, d.jenis, d.namaAsli, d.namaTersimpan);
    }
});

exports.daftar = simpan;