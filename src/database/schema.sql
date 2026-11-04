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

-- C27 TokenVerifikasi: kode OTP 6 digit berlaku 15 menit (KF06, KF07)
CREATE TABLE IF NOT EXISTS token_verifikasi (
  id_token          UUID PRIMARY KEY,
  id_akun           UUID        NOT NULL REFERENCES akun (id_akun) ON DELETE CASCADE,
  kode              CHAR(6)     NOT NULL,
  waktu_buat        TIMESTAMPTZ NOT NULL,
  waktu_kedaluwarsa TIMESTAMPTZ NOT NULL,
  status_pakai      VARCHAR(10) NOT NULL DEFAULT 'Aktif'
                    CHECK (status_pakai IN ('Aktif', 'Terpakai', 'Hangus'))
);

CREATE INDEX IF NOT EXISTS token_verifikasi_id_akun ON token_verifikasi (id_akun, status_pakai);
