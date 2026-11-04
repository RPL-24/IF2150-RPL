-- Skema basis data ITBELI.
-- Setiap tabel diturunkan dari atribut kelas Model pada Tabel 4.1 DPPL.
-- Aman dijalankan berulang (npm run db:init).

-- ───────────── Modul A: Akun & Otentikasi ─────────────

-- C23 Akun (beserta spesialisasi C24 Pembeli, C25 Penjual, C26 Admin melalui kolom peran)
CREATE TABLE IF NOT EXISTS akun (
  id_akun          UUID PRIMARY KEY,
  nama             VARCHAR(100) NOT NULL,
  nim              VARCHAR(20)  NOT NULL,
  email            VARCHAR(150) NOT NULL,
  kata_sandi_hash  VARCHAR(100) NOT NULL,
  status_akun      VARCHAR(30)  NOT NULL DEFAULT 'Belum Terverifikasi'
                   CHECK (status_akun IN ('Belum Terverifikasi', 'Terverifikasi', 'Diblokir')),
  status_blokir    BOOLEAN      NOT NULL DEFAULT FALSE,
  peran            VARCHAR(10)  NOT NULL DEFAULT 'Pengguna'
                   CHECK (peran IN ('Pengguna', 'Admin')),
  setuju_kebijakan BOOLEAN      NOT NULL,
  waktu_daftar     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Surel unik tanpa membedakan huruf besar/kecil (KF05, Algo-026)
CREATE UNIQUE INDEX IF NOT EXISTS akun_email_unik ON akun (LOWER(email));

-- C28 SesiLogin
CREATE TABLE IF NOT EXISTS sesi_login (
  id_sesi           UUID PRIMARY KEY,
  id_akun           UUID         NOT NULL REFERENCES akun (id_akun) ON DELETE CASCADE,
  token             VARCHAR(128) NOT NULL UNIQUE,
  waktu_mulai       TIMESTAMPTZ  NOT NULL,
  waktu_kedaluwarsa TIMESTAMPTZ  NOT NULL,
  status_aktif      BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS sesi_login_id_akun ON sesi_login (id_akun);
