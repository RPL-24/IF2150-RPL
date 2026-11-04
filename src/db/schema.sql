CREATE TABLE IF NOT EXISTS Pengguna (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  kataSandi TEXT NOT NULL,
  peran TEXT NOT NULL CHECK (peran IN ('masyarakat', 'mitra', 'admin'))
);