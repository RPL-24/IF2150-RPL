-- 001_init.sql — skema awal SILEMBUR (starter).
-- Sumber: DPPL2 BAB 4-5 (atribut kelas + query Q-001..Q-013) dengan penyesuaian gap G1/G2.
-- JANGAN diubah setelah di-merge ke main; perubahan skema = file migrasi baru (lihat migrate.js).
-- Indeks performa (selain PK/FK/UNIQUE) sengaja belum dibuat: ditambahkan P5 setelah profiling (M9 B.2.1).

-- C01 Pelapor, C02 Admin, C03 PemerintahDaerah -> satu tabel dengan kolom peran (model Pengguna, DPPL 2.3)
CREATE TABLE pengguna (
  id_pengguna     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE,
  nama            TEXT NOT NULL,                      -- namaPelapor / namaAdmin
  password_hash   TEXT,                               -- NULL jika hanya login Google
  google_sub      TEXT UNIQUE,                        -- ID akun Google Sign-In
  peran           TEXT NOT NULL CHECK (peran IN ('PELAPOR', 'ADMIN', 'PEMDA')),
  nama_instansi   TEXT,                               -- C03 namaInstansi
  wilayah_kerja   TEXT,                               -- C03 wilayahKerja
  jumlah_laporan  INTEGER NOT NULL DEFAULT 0,         -- C01 jumlahLaporan (Algo-001)
  dibuat_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C06 Fasilitas
CREATE TABLE fasilitas (
  id_fasilitas               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama_fasilitas             TEXT NOT NULL,
  kategori                   TEXT NOT NULL CHECK (kategori IN ('Jalan Berlubang', 'Lampu Jalan Mati', 'Pohon Tumbang', 'Lainnya')),
  lokasi_fasilitas           TEXT NOT NULL,          -- alamat yang dapat dibaca
  latitude                   NUMERIC(9, 6) NOT NULL,
  longitude                  NUMERIC(9, 6) NOT NULL,
  wilayah                    TEXT NOT NULL,          -- kecamatan
  jumlah_kerusakan_berulang  INTEGER NOT NULL DEFAULT 0, -- Algo-007 / Q-007
  kandidat_evaluasi          BOOLEAN NOT NULL DEFAULT FALSE, -- KF14
  dibuat_pada                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C04 Laporan (+ FK id_pelapor, id_fasilitas, id_laporan_induk: gap G1)
CREATE TABLE laporan (
  id_laporan          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_pelapor          INTEGER NOT NULL REFERENCES pengguna (id_pengguna),
  id_fasilitas        INTEGER REFERENCES fasilitas (id_fasilitas),
  id_laporan_induk    INTEGER REFERENCES laporan (id_laporan),   -- terisi jika status 'Digabung' (Q-013)
  foto_laporan        TEXT NOT NULL,                             -- kunci/URL foto dari CloudStorageAdapter
  deskripsi_laporan   TEXT NOT NULL CHECK (char_length(deskripsi_laporan) BETWEEN 1 AND 300),
  kategori_kerusakan  TEXT NOT NULL CHECK (kategori_kerusakan IN ('Jalan Berlubang', 'Lampu Jalan Mati', 'Pohon Tumbang', 'Lainnya')),
  tanggal_laporan     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status_laporan      TEXT NOT NULL DEFAULT 'Menunggu Verifikasi'
                      CHECK (status_laporan IN ('Menunggu Verifikasi', 'Perlu Revisi', 'Ditolak',
                                                'Terverifikasi', 'Diproses', 'Selesai', 'Digabung')),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (id_laporan_induk IS NULL OR id_laporan_induk <> id_laporan)
);

-- C05 Lokasi (agregasi Laporan, 1:1)
CREATE TABLE lokasi (
  id_laporan  INTEGER PRIMARY KEY REFERENCES laporan (id_laporan) ON DELETE CASCADE,
  koordinat   TEXT NOT NULL,                 -- "lat,lng" (atribut koordinat: String di DPPL)
  latitude    NUMERIC(9, 6) NOT NULL,
  longitude   NUMERIC(9, 6) NOT NULL,
  wilayah     TEXT NOT NULL,                 -- getWilayah()
  alamat      TEXT,
  sumber      TEXT NOT NULL DEFAULT 'GPS' CHECK (sumber IN ('GPS', 'MANUAL'))  -- KF03
);

-- C08 SkorPrioritas (komposisi Laporan, 1:0..1; dibuat saat laporan disetujui, Q-008)
CREATE TABLE skor_prioritas (
  id_laporan          INTEGER PRIMARY KEY REFERENCES laporan (id_laporan) ON DELETE CASCADE,
  jumlah_pelapor      INTEGER NOT NULL DEFAULT 1,
  lama_menunggu       INTEGER NOT NULL DEFAULT 0,   -- hari
  frekuensi_berulang  INTEGER NOT NULL DEFAULT 0,
  skor                INTEGER NOT NULL DEFAULT 0,
  dihitung_pada       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C07 Verifikasi
CREATE TABLE verifikasi (
  id_verifikasi     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_laporan        INTEGER NOT NULL REFERENCES laporan (id_laporan) ON DELETE CASCADE,
  id_admin          INTEGER NOT NULL REFERENCES pengguna (id_pengguna),
  keputusan         TEXT NOT NULL CHECK (keputusan IN ('Disetujui', 'Ditolak', 'Revisi')),
  catatan_alasan    TEXT NOT NULL DEFAULT '',
  waktu_verifikasi  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C09 RiwayatStatus (terhubung ke fasilitas lewat laporan.id_fasilitas, KF22)
CREATE TABLE riwayat_status (
  id_riwayat           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_laporan           INTEGER NOT NULL REFERENCES laporan (id_laporan) ON DELETE CASCADE,
  id_pengguna          INTEGER REFERENCES pengguna (id_pengguna),   -- siapa yang mengubah (NULL = sistem)
  status_lama          TEXT,
  status_baru          TEXT NOT NULL,
  deskripsi_perubahan  TEXT NOT NULL,
  tanggal_perubahan    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C10 Notifikasi
CREATE TABLE notifikasi (
  id_notifikasi  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_laporan     INTEGER NOT NULL REFERENCES laporan (id_laporan) ON DELETE CASCADE,
  id_pelapor     INTEGER NOT NULL REFERENCES pengguna (id_pengguna),
  isi_pesan      TEXT NOT NULL CHECK (isi_pesan <> ''),
  dibaca         BOOLEAN NOT NULL DEFAULT FALSE,
  waktu_kirim    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indeks untuk foreign key (PostgreSQL tidak membuatnya otomatis).
CREATE INDEX idx_laporan_pelapor   ON laporan (id_pelapor);
CREATE INDEX idx_laporan_fasilitas ON laporan (id_fasilitas);
CREATE INDEX idx_laporan_induk     ON laporan (id_laporan_induk);
CREATE INDEX idx_verifikasi_laporan ON verifikasi (id_laporan);
CREATE INDEX idx_riwayat_laporan   ON riwayat_status (id_laporan);
CREATE INDEX idx_notifikasi_pelapor ON notifikasi (id_pelapor);
