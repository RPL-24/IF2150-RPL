require('dotenv').config();
const path = require('path');
const Database = require('better-sqlite3');

const lokasi = path.resolve(__dirname, '..', process.env.DB_PATH || './db/lawhub.db');
const db = new Database(lokasi);
db.pragma('foreign_keys = ON');

module.exports = db;