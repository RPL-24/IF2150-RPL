-- =============================================================================
-- SKEMA BASIS DATA MASEHAT (IF2150 RPL K03-G04)
-- Mengacu pada Dokumen DPPL (M8) Kelas C01 s.d. C29
-- =============================================================================

-- Hapus tabel lama jika ada (urutan memperhatikan foreign key)
DROP TABLE IF EXISTS notifikasi_darurat CASCADE;
DROP TABLE IF EXISTS jadwal_konsultasi CASCADE;
DROP TABLE IF EXISTS check_in CASCADE;
DROP TABLE IF EXISTS riwayat_kesehatan CASCADE;
DROP TABLE IF EXISTS tenaga_kesehatan CASCADE;
DROP TABLE IF EXISTS fasilitas_kesehatan CASCADE;
DROP TABLE IF EXISTS pelajar CASCADE;
DROP TABLE IF EXISTS orang_tua_wali CASCADE;
DROP TABLE IF EXISTS pengguna CASCADE;

-- 1. Tabel Pengguna (Kelas C01 - Pengguna)
CREATE TABLE pengguna (
    id_pengguna SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('Pelajar', 'OrangTuaWali', 'TenagaKesehatan')),
    status_akun VARCHAR(30) NOT NULL CHECK (status_akun IN ('Aktif', 'Belum Terverifikasi', 'Ditolak')),
    versi_token INTEGER NOT NULL DEFAULT 0,
    token_konfirmasi VARCHAR(255) NULL,
    reset_token VARCHAR(255) NULL,
    reset_token_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Orang Tua / Wali (Kelas C03 - OrangTuaWali)
CREATE TABLE orang_tua_wali (
    id_wali VARCHAR(50) PRIMARY KEY,
    id_pengguna INTEGER UNIQUE REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nomor_telepon VARCHAR(30) NOT NULL
);

-- 3. Tabel Pelajar (Kelas C02 - Pelajar)
CREATE TABLE pelajar (
    id_pelajar VARCHAR(50) PRIMARY KEY,
    id_pengguna INTEGER UNIQUE REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
    id_wali VARCHAR(50) NULL REFERENCES orang_tua_wali(id_wali) ON DELETE SET NULL,
    nama VARCHAR(150) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    nomor_telepon VARCHAR(30) NOT NULL,
    nomor_telepon_wali VARCHAR(30) NULL,
    email_wali VARCHAR(100) NULL,
    lokasi_saat_ini VARCHAR(100) NULL,
    status_darurat BOOLEAN NOT NULL DEFAULT FALSE
);

-- 4. Tabel Riwayat Kesehatan (Kelas C05 - RiwayatKesehatan)
-- Menyimpan riwayat kesehatan awal dalam bentuk terenkripsi AES-256 (KNF01)
CREATE TABLE riwayat_kesehatan (
    id_riwayat SERIAL PRIMARY KEY,
    id_pelajar VARCHAR(50) NOT NULL REFERENCES pelajar(id_pelajar) ON DELETE CASCADE,
    riwayat_kesehatan TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Fasilitas Kesehatan (Kelas C08 - FasilitasKesehatan)
-- Lokasi disimpan dalam format koordinat "lat,lng" untuk kalkulasi jarak (UC05)
CREATE TABLE fasilitas_kesehatan (
    id_fasilitas VARCHAR(50) PRIMARY KEY,
    nama_fasilitas VARCHAR(150) NOT NULL,
    alamat TEXT NULL,
    lokasi VARCHAR(100) NOT NULL,
    estimasi_biaya DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- 6. Tabel Tenaga Kesehatan (Kelas C04 - TenagaKesehatan)
CREATE TABLE tenaga_kesehatan (
    id_tenaga_kesehatan VARCHAR(50) PRIMARY KEY,
    id_pengguna INTEGER UNIQUE REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
    id_fasilitas VARCHAR(50) NULL REFERENCES fasilitas_kesehatan(id_fasilitas) ON DELETE SET NULL,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nomor_telepon VARCHAR(30) NOT NULL,
    jenis_tenaga_kesehatan VARCHAR(50) NOT NULL,
    nomor_str VARCHAR(100) NULL,
    lokasi VARCHAR(150) NOT NULL
);

-- 7. Tabel Daily Check-In (Kelas C06 - CheckIn)
-- Kolom catatan_refleksi disimpan terenkripsi AES-256 (KNF01)
CREATE TABLE check_in (
    id_check_in VARCHAR(50) PRIMARY KEY,
    id_pelajar VARCHAR(50) NOT NULL REFERENCES pelajar(id_pelajar) ON DELETE CASCADE,
    tanggal_check_in DATE NOT NULL DEFAULT CURRENT_DATE,
    skala_mood INTEGER NOT NULL CHECK (skala_mood BETWEEN 1 AND 5),
    jam_tidur TIME NOT NULL,
    jam_bangun TIME NOT NULL,
    pola_makan VARCHAR(255) NOT NULL,
    pemicu_stres VARCHAR(255) NULL,
    catatan_refleksi TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Satu pelajar satu check-in per hari. Indeks ini juga mempercepat grafik & laporan (Q-C02-01, KNF04)
CREATE UNIQUE INDEX idx_check_in_pelajar_tanggal ON check_in (id_pelajar, tanggal_check_in DESC);

-- 8. Tabel Jadwal Konsultasi (Kelas C09 - JadwalKonsultasi)
CREATE TABLE jadwal_konsultasi (
    id_jadwal VARCHAR(50) PRIMARY KEY,
    id_tenaga_kesehatan VARCHAR(50) NOT NULL REFERENCES tenaga_kesehatan(id_tenaga_kesehatan) ON DELETE CASCADE,
    id_pelajar VARCHAR(50) NULL REFERENCES pelajar(id_pelajar) ON DELETE SET NULL,
    tanggal DATE NOT NULL,
    waktu TIME NOT NULL,
    status_ketersediaan BOOLEAN NOT NULL DEFAULT TRUE,
    status_pengajuan VARCHAR(30) NOT NULL DEFAULT 'Belum Diajukan'
        CHECK (status_pengajuan IN ('Belum Diajukan', 'Diajukan', 'Disetujui', 'Rescheduled')),
    keluhan TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indeks pencarian jadwal tersedia sesuai Q-C04-03
CREATE INDEX idx_jadwal_nakes_tanggal_waktu ON jadwal_konsultasi (id_tenaga_kesehatan, tanggal, waktu);

-- 9. Tabel Notifikasi Darurat (Kelas C24 - NotifikasiDaruratController)
CREATE TABLE notifikasi_darurat (
    id VARCHAR(50) PRIMARY KEY,
    id_pelajar VARCHAR(50) NOT NULL REFERENCES pelajar(id_pelajar) ON DELETE CASCADE,
    id_wali VARCHAR(50) NULL REFERENCES orang_tua_wali(id_wali) ON DELETE SET NULL,
    email_tujuan VARCHAR(100) NULL,
    ringkasan_kondisi TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Menunggu Pengiriman'
        CHECK (status IN ('Menunggu Pengiriman', 'Terkirim', 'Gagal Terkirim', 'Diterima')),
    jumlah_percobaan INTEGER NOT NULL DEFAULT 0,
    waktu_kirim TIMESTAMP NULL,
    waktu_konfirmasi TIMESTAMP NULL,
    status_tindak_lanjut VARCHAR(50) NOT NULL DEFAULT 'Belum Ditindaklanjuti',
    waktu_tindak_lanjut TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Satu pelajar hanya punya satu notifikasi darurat yang belum ditindaklanjuti
CREATE UNIQUE INDEX idx_notifikasi_aktif_per_pelajar ON notifikasi_darurat (id_pelajar)
    WHERE status_tindak_lanjut = 'Belum Ditindaklanjuti';
