// globalSetup test integrasi: membuat ulang basis data uji dari database/schema.sql dan
// mengisi dokumen legal versi 1.0, sehingga setiap putaran test mulai dari keadaan yang sama.
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const DOKUMEN_LEGAL = require('../../database/seedDokumenLegal');

module.exports = async () => {
  const namaDb = process.env.DB_NAME_UJI || 'itbeli_uji';
  if (!/_uji$/.test(namaDb)) throw new Error(`Basis data uji harus berakhiran _uji, bukan ${namaDb}.`);

  const koneksi = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'itbeli',
    password: process.env.DB_PASSWORD,
  };

  const admin = new Client({ ...koneksi, database: 'postgres' });
  await admin.connect();
  await admin.query(`DROP DATABASE IF EXISTS ${namaDb} WITH (FORCE)`);
  await admin.query(`CREATE DATABASE ${namaDb}`);
  await admin.end();

  const uji = new Client({ ...koneksi, database: namaDb });
  await uji.connect();
  const skema = fs.readFileSync(path.join(__dirname, '..', '..', 'database', 'schema.sql'), 'utf8').replace(/^﻿/, '');
  await uji.query(skema);
  for (const d of DOKUMEN_LEGAL) {
    await uji.query(
      `INSERT INTO dokumen_legal (id_dokumen, jenis_dokumen, judul, isi, klausa_privasi_pesan,
                                  versi, tanggal_berlaku, status_publikasi, tautan)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, $7)`,
      [d.jenis, d.judul, d.isi, d.klausa, d.versi, d.tanggalBerlaku, d.tautan],
    );
  }
  await uji.end();
};
