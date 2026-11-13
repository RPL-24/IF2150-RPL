-- =============================================================================
-- DATA UJI AWAL (SEED DATA) MASEHAT (IF2150 RPL K03-G04)
-- Seluruh data bersifat fiktif untuk keperluan pengujian fitur UC01 s.d. UC10
-- Password default seluruh akun uji: Password123!
-- =============================================================================

-- 1. Akun Pengguna (pengguna)
-- Hash di bawah hanya penanda akun uji; initDb.js menggantinya dengan hash bcrypt untuk Password123!
INSERT INTO pengguna (id_pengguna, username, email, password_hash, role, status_akun, token_konfirmasi)
VALUES
  (1, 'budi.pelajar@mahasehat.id', 'budi.pelajar@mahasehat.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5u4n2M1x0v8z5e7a9K1b2c3d', 'Pelajar', 'Aktif', NULL),
  (2, 'andi.siswa@mahasehat.id', 'andi.siswa@mahasehat.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5u4n2M1x0v8z5e7a9K1b2c3d', 'Pelajar', 'Belum Terverifikasi', 'TOKEN-WALI-ANDI-2026'),
  (3, 'santoso.wali@mahasehat.id', 'santoso.wali@mahasehat.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5u4n2M1x0v8z5e7a9K1b2c3d', 'OrangTuaWali', 'Aktif', NULL),
  (4, 'siti.psikolog@mahasehat.id', 'siti.psikolog@mahasehat.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5u4n2M1x0v8z5e7a9K1b2c3d', 'TenagaKesehatan', 'Aktif', NULL),
  (5, 'hendra.psikiater@mahasehat.id', 'hendra.psikiater@mahasehat.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5u4n2M1x0v8z5e7a9K1b2c3d', 'TenagaKesehatan', 'Aktif', NULL),
  (6, 'nadia.psikolog@mahasehat.id', 'nadia.psikolog@mahasehat.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5u4n2M1x0v8z5e7a9K1b2c3d', 'TenagaKesehatan', 'Aktif', NULL),
  (7, 'citra.pelajar@mahasehat.id', 'citra.pelajar@mahasehat.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5u4n2M1x0v8z5e7a9K1b2c3d', 'Pelajar', 'Aktif', NULL),
  (8, 'ratna.wali@mahasehat.id', 'ratna.wali@mahasehat.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5u4n2M1x0v8z5e7a9K1b2c3d', 'OrangTuaWali', 'Aktif', NULL);

SELECT setval('pengguna_id_pengguna_seq', (SELECT MAX(id_pengguna) FROM pengguna));

-- 2. Orang Tua / Wali (orang_tua_wali)
INSERT INTO orang_tua_wali (id_wali, id_pengguna, nama, email, nomor_telepon)
VALUES
  ('WALI-001', 3, 'Bapak Santoso Pratama', 'santoso.wali@mahasehat.id', '081234567890'),
  ('WALI-002', 8, 'Ibu Ratna Lestari', 'ratna.wali@mahasehat.id', '081234567891');

-- 3. Pelajar (pelajar)
INSERT INTO pelajar (id_pelajar, id_pengguna, id_wali, nama, tanggal_lahir, nomor_telepon, nomor_telepon_wali, email_wali, lokasi_saat_ini, status_darurat)
VALUES
  ('PLJ-001', 1, 'WALI-001', 'Budi Pratama', '2006-05-14', '081298765432', '081234567890', 'santoso.wali@mahasehat.id', '-6.8915,107.6107', FALSE),
  ('PLJ-002', 2, NULL, 'Andi Pratama', '2010-11-20', '081298765433', '081234567890', 'santoso.wali@mahasehat.id', NULL, FALSE),
  ('PLJ-003', 7, 'WALI-002', 'Citra Lestari', '2005-03-02', '081298765434', '081234567891', 'ratna.wali@mahasehat.id', NULL, FALSE);

-- 4. Fasilitas Kesehatan (fasilitas_kesehatan)
INSERT INTO fasilitas_kesehatan (id_fasilitas, nama_fasilitas, alamat, lokasi, estimasi_biaya)
VALUES
  ('FASKES-001', 'Klinik Kesehatan Mental Tenang', 'Jl. Contoh Damai No. 10, Kota Bandung', '-6.8915,107.6107', 75000),
  ('FASKES-002', 'Unit Psikiatri RS Harapan Sehat', 'Jl. Contoh Sehat No. 100, Kota Bandung', '-6.8942,107.6135', 250000),
  ('FASKES-003', 'Pusat Konseling Remaja Cerah', 'Jl. Contoh Cerah No. 148, Kota Bandung', '-6.8850,107.6138', 150000);

-- 5. Tenaga Kesehatan (tenaga_kesehatan)
INSERT INTO tenaga_kesehatan (id_tenaga_kesehatan, id_pengguna, id_fasilitas, nama, email, nomor_telepon, jenis_tenaga_kesehatan, nomor_str, lokasi)
VALUES
  ('NAKES-001', 4, 'FASKES-001', 'Siti Rahmawati, M.Psi., Psikolog', 'siti.psikolog@mahasehat.id', '081311112222', 'Psikolog', 'STR-PSI-2024001', 'Klinik Kesehatan Mental Tenang'),
  ('NAKES-002', 5, 'FASKES-002', 'dr. Hendra Wijaya, Sp.KJ', 'hendra.psikiater@mahasehat.id', '081333334444', 'Psikiater', 'STR-KJI-2023089', 'Unit Psikiatri RS Harapan Sehat'),
  ('NAKES-003', 6, 'FASKES-003', 'Nadia Kusuma, M.Psi., Psikolog', 'nadia.psikolog@mahasehat.id', '081355556666', 'Psikolog', 'STR-PSI-2025012', 'Pusat Konseling Remaja Cerah');

-- 6. Jadwal Konsultasi (jadwal_konsultasi)
INSERT INTO jadwal_konsultasi (id_jadwal, id_tenaga_kesehatan, id_pelajar, tanggal, waktu, status_ketersediaan, status_pengajuan, keluhan)
VALUES
  ('JDW-001', 'NAKES-001', NULL, CURRENT_DATE + 1, '09:00:00', TRUE, 'Belum Diajukan', NULL),
  ('JDW-002', 'NAKES-001', NULL, CURRENT_DATE + 1, '13:00:00', TRUE, 'Belum Diajukan', NULL),
  ('JDW-003', 'NAKES-001', 'PLJ-001', CURRENT_DATE + 2, '10:00:00', FALSE, 'Diajukan', 'Kesulitan fokus kuliah dan sering cemas menjelang ujian minggu depan.'),
  ('JDW-004', 'NAKES-002', NULL, CURRENT_DATE + 1, '10:00:00', TRUE, 'Belum Diajukan', NULL),
  ('JDW-005', 'NAKES-002', NULL, CURRENT_DATE + 2, '14:00:00', TRUE, 'Belum Diajukan', NULL),
  ('JDW-006', 'NAKES-003', NULL, CURRENT_DATE + 1, '15:00:00', TRUE, 'Belum Diajukan', NULL),
  ('JDW-007', 'NAKES-003', NULL, CURRENT_DATE + 3, '09:30:00', TRUE, 'Belum Diajukan', NULL);

-- 7. Riwayat Daily Check-In 5 Hari Terakhir (check_in)
INSERT INTO check_in (id_check_in, id_pelajar, tanggal_check_in, skala_mood, jam_tidur, jam_bangun, pola_makan, pemicu_stres, catatan_refleksi)
VALUES
  ('CHK-001', 'PLJ-001', CURRENT_DATE - 4, 4, '22:30:00', '06:00:00', 'Teratur', 'Tugas Akademik', NULL),
  ('CHK-002', 'PLJ-001', CURRENT_DATE - 3, 3, '23:30:00', '06:00:00', 'Teratur', 'Tugas Akademik, Ujian', NULL),
  ('CHK-003', 'PLJ-001', CURRENT_DATE - 2, 2, '01:00:00', '06:30:00', 'Kurang teratur', 'Ujian, Kurang Tidur', NULL),
  ('CHK-004', 'PLJ-001', CURRENT_DATE - 1, 3, '23:00:00', '06:00:00', 'Teratur', 'Tugas Akademik', NULL),
  ('CHK-005', 'PLJ-001', CURRENT_DATE,     4, '22:15:00', '05:45:00', 'Teratur', 'Tidak ada', NULL),
  -- Skenario UC08: mood rendah tiga hari beruntun, lalu empat hari tidak check-in
  ('CHK-101', 'PLJ-003', CURRENT_DATE - 6, 2, '02:00:00', '06:00:00', 'Kurang teratur', 'Keluarga', NULL),
  ('CHK-102', 'PLJ-003', CURRENT_DATE - 5, 1, '03:00:00', '06:30:00', 'Kurang teratur', 'Keluarga, Akademik', NULL),
  ('CHK-103', 'PLJ-003', CURRENT_DATE - 4, 2, '02:30:00', '06:00:00', 'Kurang teratur', 'Akademik', NULL);

