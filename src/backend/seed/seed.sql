-- Sehati local seed data (FICTIONAL, dev only). Never run this against remote D1.
-- Run after migrations:  npm run db:migrate:local && npm run db:seed:local
-- Safe to re-run: it deletes its own rows (by fixed ids) before inserting.

-- ---------------------------------------------------------------------------
-- 0. Clean previous seed rows (children first; D1 enforces foreign keys)
-- ---------------------------------------------------------------------------
DELETE FROM jadwal_konsultasi WHERE id_jadwal LIKE 'seed-jdw-%';
DELETE FROM konsultan         WHERE id_konsultan LIKE 'seed-kon-%';
DELETE FROM faq               WHERE id_faq LIKE 'seed-faq-%';
DELETE FROM pengguna          WHERE id_pengguna IN ('seed-usr-mhs', 'seed-usr-adm');
-- pengguna delete cascades to mahasiswa, sesi_autentikasi, token_google,
-- daily_affirmation, reminder, notifikasi, pengajuan_pertanyaan, umpan_balik (mahasiswa side).

-- ---------------------------------------------------------------------------
-- 1. Accounts: 1 mahasiswa + 1 administrator
--    google_id values are fake, so Google login will NOT work for these rows;
--    use the dev session tokens in section 2 instead.
-- ---------------------------------------------------------------------------
INSERT INTO pengguna (id_pengguna, nama, email, google_id, peran) VALUES
  ('seed-usr-mhs', 'Mahasiswa Uji',      '13599001@std.stei.itb.ac.id', 'seed-google-mahasiswa',    'mahasiswa'),
  ('seed-usr-adm', 'Administrator Uji',  'admin.uji@example.com',       'seed-google-administrator', 'administrator');

INSERT INTO mahasiswa (id_pengguna, nim) VALUES
  ('seed-usr-mhs', '13599001');

-- ---------------------------------------------------------------------------
-- 2. Dev sessions so you can call the API without the Google flow:
--      Authorization: Bearer dev-token-mahasiswa
--      Authorization: Bearer dev-token-administrator
--    waktu_login = now, so they last until BATAS_SESI after each re-seed.
-- ---------------------------------------------------------------------------
INSERT INTO sesi_autentikasi (token, id_pengguna, waktu_login, status) VALUES
  ('dev-token-mahasiswa',     'seed-usr-mhs', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), 'aktif'),
  ('dev-token-administrator', 'seed-usr-adm', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), 'aktif');

-- ---------------------------------------------------------------------------
-- 3. Konsultan (4)
-- ---------------------------------------------------------------------------
INSERT INTO konsultan (id_konsultan, nama, spesialisasi) VALUES
  ('seed-kon-1', 'Dr. Raisa Wibowo, M.Psi.',   'Psikologi Klinis'),
  ('seed-kon-2', 'Bagas Pratama, M.Pd.',       'Konseling Akademik'),
  ('seed-kon-3', 'Laras Anggraini, S.Psi.',    'Manajemen Stres dan Kecemasan'),
  ('seed-kon-4', 'Dimas Kurniawan, M.Psi.',    'Kesehatan Tidur dan Gaya Hidup');

-- ---------------------------------------------------------------------------
-- 4. Slots: next 3 days x 3 one-hour slots per konsultan (relative to today, UTC).
--    Start times are 02:00Z, 04:00Z, 06:00Z = 09:00, 11:00, 13:00 WIB.
-- ---------------------------------------------------------------------------
WITH
  days(d) AS (VALUES (1), (2), (3)),
  hrs(h)  AS (VALUES (2), (4), (6))
INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status, id_mahasiswa)
SELECT
  'seed-jdw-' || substr(k.id_konsultan, -1) || '-' || days.d || '-' || hrs.h,
  k.id_konsultan,
  strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'start of day', '+' || days.d || ' days', '+' || hrs.h       || ' hours'),
  strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'start of day', '+' || days.d || ' days', '+' || (hrs.h + 1) || ' hours'),
  'tersedia',
  NULL
FROM konsultan k
CROSS JOIN days
CROSS JOIN hrs
WHERE k.id_konsultan LIKE 'seed-kon-%';

-- One slot already booked by the test mahasiswa, so "sesi berikutnya" and the
-- booked/clash paths have data. (status and id_mahasiswa change together: CHECK constraint.)
UPDATE jadwal_konsultasi
SET status = 'terpesan', id_mahasiswa = 'seed-usr-mhs'
WHERE id_jadwal = 'seed-jdw-1-1-4' AND status = 'tersedia';

-- ---------------------------------------------------------------------------
-- 5. Sample FAQ
-- ---------------------------------------------------------------------------
INSERT INTO faq (id_faq, pertanyaan, jawaban) VALUES
  ('seed-faq-1', 'Apa itu Sehati?',
   'Sehati adalah aplikasi pendamping kesehatan mental mahasiswa: afirmasi harian, pengingat kesehatan, kalender terintegrasi, dan pemesanan sesi konsultasi.'),
  ('seed-faq-2', 'Bagaimana cara memesan sesi konsultasi?',
   'Buka menu Konsultasi, pilih konsultan, lalu pilih slot yang tersedia. Sesi yang sudah dipesan akan muncul di kalender dan beranda.'),
  ('seed-faq-3', 'Apakah data konsultasi saya terjaga kerahasiaannya?',
   'Hanya kamu dan konsultan yang bersangkutan yang dapat melihat sesi yang kamu pesan. Token Google kamu disimpan terenkripsi.'),
  ('seed-faq-4', 'Bisakah saya mengubah atau membatalkan sesi yang sudah dipesan?',
   'Perubahan jadwal dilakukan oleh administrator. Hubungi administrator melalui form umpan balik atau pengajuan pertanyaan.'),
  ('seed-faq-5', 'Bagaimana cara mengubah waktu pengingat dan afirmasi harian?',
   'Buka menu Afirmasi atau Pengingat, pilih waktu pengiriman yang kamu inginkan, lalu simpan. Notifikasi dikirim ke perangkat yang terdaftar.'),
  ('seed-faq-6', 'Saya sedang dalam keadaan darurat. Apa yang harus dilakukan?',
   'Sehati bukan layanan darurat. Jika kamu atau orang di sekitarmu dalam bahaya, segera hubungi layanan darurat setempat atau orang terdekat yang dapat membantu.');
