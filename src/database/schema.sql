-- Skema basis data ITBELI.
-- Setiap tabel diturunkan dari atribut kelas Model pada Tabel 4.1 DPPL.
-- Aman dijalankan berulang (npm run db:init).

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Modul A: Akun & Otentikasi â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

-- C40 DokumenLegal: Kebijakan Privasi dan Ketentuan Penggunaan (KF13, KF38, KF39)
CREATE TABLE IF NOT EXISTS dokumen_legal (
  id_dokumen           UUID PRIMARY KEY,
  jenis_dokumen        VARCHAR(30)  NOT NULL
                       CHECK (jenis_dokumen IN ('kebijakan-privasi', 'ketentuan-penggunaan')),
  judul                VARCHAR(150) NOT NULL,
  isi                  TEXT         NOT NULL,
  klausa_privasi_pesan TEXT,
  versi                VARCHAR(10)  NOT NULL,
  tanggal_berlaku      DATE         NOT NULL,
  status_publikasi     BOOLEAN      NOT NULL DEFAULT TRUE,
  tautan               VARCHAR(200) NOT NULL,
  UNIQUE (jenis_dokumen, versi)
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Modul E: Laporan & Moderasi â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

-- ── Modul B: Katalog & Listing ──────────────────────────────

-- C29 Barang (KF16, KF17, KF21, KF50)
CREATE TABLE IF NOT EXISTS barang (
  id_barang         UUID PRIMARY KEY,
  id_penjual        UUID          NOT NULL REFERENCES akun (id_akun) ON DELETE CASCADE,
  judul             VARCHAR(150)  NOT NULL,
  harga             NUMERIC(12,2) NOT NULL,
  deskripsi_kondisi TEXT          NOT NULL,
  id_kategori       VARCHAR(50),
  id_lokasi         VARCHAR(50),
  status            VARCHAR(20)   NOT NULL DEFAULT 'Tersedia'
                    CHECK (status IN ('Tersedia', 'Terjual', 'Dinonaktifkan')),
  waktu_unggah      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  waktu_ubah        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS barang_id_penjual ON barang (id_penjual);
CREATE INDEX IF NOT EXISTS barang_status ON barang (status);

-- C30 FotoBarang (KF17, KF21, KF23, KF50)
CREATE TABLE IF NOT EXISTS foto_barang (
  id_foto     UUID PRIMARY KEY,
  id_barang   UUID         NOT NULL REFERENCES barang (id_barang) ON DELETE CASCADE,
  nama_berkas VARCHAR(255) NOT NULL,
  format      VARCHAR(10)  NOT NULL,
  ukuran      BIGINT       NOT NULL,
  urutan      INT          NOT NULL,
  path_berkas VARCHAR(500) NOT NULL
);

CREATE INDEX IF NOT EXISTS foto_barang_id_barang ON foto_barang (id_barang);