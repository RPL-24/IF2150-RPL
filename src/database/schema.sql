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

-- ───────────── Modul E: Laporan & Moderasi ─────────────

-- C36 Laporan
CREATE TABLE IF NOT EXISTS laporan (
  id_laporan         UUID PRIMARY KEY,
  id_pelapor         UUID         NOT NULL REFERENCES akun (id_akun) ON DELETE CASCADE,
  objek_dilaporkan   VARCHAR(255) NOT NULL,
  jenis_pelanggaran  VARCHAR(50)  NOT NULL
                     CHECK (jenis_pelanggaran IN ('Penipuan', 'Konten tidak pantas', 'Bug atau masalah teknis')),
  teks_alasan        TEXT         NOT NULL,
  waktu_lapor        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  status_penanganan  VARCHAR(20)  NOT NULL DEFAULT 'Baru'
                     CHECK (status_penanganan IN ('Baru', 'Diproses', 'Selesai')),
  waktu_perubahan    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS laporan_id_pelapor ON laporan (id_pelapor);
CREATE INDEX IF NOT EXISTS laporan_status_penanganan ON laporan (status_penanganan);
CREATE INDEX IF NOT EXISTS laporan_waktu_lapor ON laporan (waktu_lapor DESC);

-- C37 BuktiLaporan
CREATE TABLE IF NOT EXISTS bukti_laporan (
  id_bukti     UUID PRIMARY KEY,
  id_laporan   UUID         NOT NULL REFERENCES laporan (id_laporan) ON DELETE CASCADE,
  nama_berkas  VARCHAR(255) NOT NULL,
  path_berkas  VARCHAR(500) NOT NULL
);

CREATE INDEX IF NOT EXISTS bukti_laporan_id_laporan ON bukti_laporan (id_laporan);

-- C38 LogAudit (KF48, KF49: append-only)
CREATE TABLE IF NOT EXISTS log_audit (
  id_log          UUID PRIMARY KEY,
  id_laporan      UUID         NOT NULL REFERENCES laporan (id_laporan) ON DELETE CASCADE,
  waktu           TIMESTAMPTZ  NOT NULL DEFAULT now(),
  identitas_aktor VARCHAR(150) NOT NULL,
  tindakan        TEXT         NOT NULL
);

CREATE INDEX IF NOT EXISTS log_audit_id_laporan ON log_audit (id_laporan);

-- C39 LogAdmin
CREATE TABLE IF NOT EXISTS log_admin (
  id_log_admin   UUID PRIMARY KEY,
  id_admin       UUID         NOT NULL REFERENCES akun (id_akun) ON DELETE CASCADE,
  jenis_tindakan VARCHAR(50)  NOT NULL,
  objek_ditindak VARCHAR(255) NOT NULL,
  waktu          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  alasan         TEXT         NOT NULL
);

CREATE INDEX IF NOT EXISTS log_admin_id_admin ON log_admin (id_admin);
