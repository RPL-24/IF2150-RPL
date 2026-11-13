import sqlite3
from contextlib import contextmanager
from . import config

SCHEMA = """
CREATE TABLE IF NOT EXISTS polisi(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    nama TEXT NOT NULL,
    lat REAL NOT NULL, 
    lon REAL NOT NULL, 
    tersedia INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS sos(
    id TEXT PRIMARY KEY, 
    client_id TEXT UNIQUE NOT NULL, 
    nama TEXT, 
    lat REAL,
    lon REAL, 
    status TEXT NOT NULL DEFAULT 'dikirim', 
    reply TEXT, 
    polisi_id INTEGER REFERENCES polisi(id),
    created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS rekaman(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    sos_id TEXT NOT NULL REFERENCES sos(id),
    path TEXT NOT NULL,
    created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS laporan(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    token TEXT UNIQUE NOT NULL,
    client_id TEXT UNIQUE NOT NULL,
    mode TEXT NOT NULL,
    payload_enc BLOB NOT NULL,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'baru',
    catatan TEXT,
    pesan_pelapor TEXT,
    updated_at TEXT);
CREATE TABLE IF NOT EXISTS layanan(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    nama TEXT NOT NULL, 
    jenis TEXT NOT NULL,
    lat REAL NOT NULL, 
    lon REAL NOT NULL, 
    kontak TEXT, 
    alamat TEXT, 
    fasilitas TEXT);
CREATE INDEX IF NOT EXISTS idx_layanan_lat_lon ON layanan(lat, lon);
"""

@contextmanager
def conn():
    c = sqlite3.connect(config.DB_PATH)
    c.row_factory = sqlite3.Row
    try:
        yield c
        c.commit()
    finally:
        c.close()

MIGRASI = [("laporan", "status", "TEXT NOT NULL DEFAULT 'baru'"), 
           ("laporan", "catatan", "TEXT"), 
           ("laporan", "pesan_pelapor", "TEXT"), 
           ("laporan", "updated_at", "TEXT"),
           ("layanan", "alamat", "TEXT"), 
           ("layanan", "fasilitas", "TEXT")]

def init_db():
    with conn() as c:
        c.executescript(SCHEMA)
        for tabel, kolom, ddl in MIGRASI:
            if kolom not in {r[1] for r in c.execute(f"PRAGMA table_info({tabel})")}:
                c.execute(f"ALTER TABLE {tabel} ADD COLUMN {kolom} {ddl}")