CREATE TABLE `daily_affirmation` (
	`id_affirmation` text PRIMARY KEY NOT NULL,
	`id_mahasiswa` text NOT NULL,
	`konten` text NOT NULL,
	`waktu_kirim` text NOT NULL,
	FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa`(`id_pengguna`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_affirmation_mhs` ON `daily_affirmation` (`id_mahasiswa`);--> statement-breakpoint
CREATE TABLE `faq` (
	`id_faq` text PRIMARY KEY NOT NULL,
	`pertanyaan` text NOT NULL,
	`jawaban` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `jadwal_konsultasi` (
	`id_jadwal` text PRIMARY KEY NOT NULL,
	`id_konsultan` text NOT NULL,
	`waktu` text NOT NULL,
	`waktu_selesai` text NOT NULL,
	`status` text DEFAULT 'tersedia' NOT NULL,
	`id_mahasiswa` text,
	FOREIGN KEY (`id_konsultan`) REFERENCES `konsultan`(`id_konsultan`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa`(`id_pengguna`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "jadwal_status_check" CHECK("jadwal_konsultasi"."status" IN ('tersedia', 'terpesan')),
	CONSTRAINT "jadwal_waktu_check" CHECK("jadwal_konsultasi"."waktu_selesai" > "jadwal_konsultasi"."waktu"),
	CONSTRAINT "jadwal_status_mahasiswa_check" CHECK(("jadwal_konsultasi"."status" = 'terpesan') = ("jadwal_konsultasi"."id_mahasiswa" IS NOT NULL))
);
--> statement-breakpoint
CREATE INDEX `idx_jadwal_waktu` ON `jadwal_konsultasi` (`id_konsultan`,`waktu`,`waktu_selesai`);--> statement-breakpoint
CREATE INDEX `idx_jadwal_mhs` ON `jadwal_konsultasi` (`id_mahasiswa`);--> statement-breakpoint
CREATE UNIQUE INDEX `jadwal_konsultan_waktu_unique` ON `jadwal_konsultasi` (`id_konsultan`,`waktu`);--> statement-breakpoint
CREATE TABLE `konsultan` (
	`id_konsultan` text PRIMARY KEY NOT NULL,
	`nama` text NOT NULL,
	`spesialisasi` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mahasiswa` (
	`id_pengguna` text PRIMARY KEY NOT NULL,
	`nim` text,
	FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id_pengguna`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mahasiswa_nim_unique` ON `mahasiswa` (`nim`);--> statement-breakpoint
CREATE TABLE `notifikasi` (
	`id_notifikasi` text PRIMARY KEY NOT NULL,
	`id_mahasiswa` text NOT NULL,
	`id_affirmation` text,
	`id_reminder` text,
	`isi` text NOT NULL,
	`waktu_kirim` text NOT NULL,
	FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa`(`id_pengguna`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_affirmation`) REFERENCES `daily_affirmation`(`id_affirmation`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_reminder`) REFERENCES `reminder`(`id_reminder`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "notifikasi_sumber_check" CHECK(("notifikasi"."id_affirmation" IS NOT NULL) + ("notifikasi"."id_reminder" IS NOT NULL) = 1)
);
--> statement-breakpoint
CREATE INDEX `idx_notifikasi_mhs` ON `notifikasi` (`id_mahasiswa`);--> statement-breakpoint
CREATE TABLE `pengajuan_pertanyaan` (
	`id_pertanyaan` text PRIMARY KEY NOT NULL,
	`id_mahasiswa` text NOT NULL,
	`isi_pertanyaan` text NOT NULL,
	FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa`(`id_pengguna`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pengguna` (
	`id_pengguna` text PRIMARY KEY NOT NULL,
	`nama` text NOT NULL,
	`email` text NOT NULL,
	`google_id` text NOT NULL,
	`peran` text NOT NULL,
	CONSTRAINT "pengguna_peran_check" CHECK("pengguna"."peran" IN ('mahasiswa', 'administrator'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pengguna_email_unique` ON `pengguna` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `pengguna_google_id_unique` ON `pengguna` (`google_id`);--> statement-breakpoint
CREATE TABLE `reminder` (
	`id_reminder` text PRIMARY KEY NOT NULL,
	`id_mahasiswa` text NOT NULL,
	`jenis` text NOT NULL,
	`waktu` text NOT NULL,
	FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa`(`id_pengguna`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "reminder_jenis_check" CHECK("reminder"."jenis" IN ('makan', 'tidur', 'olahraga'))
);
--> statement-breakpoint
CREATE INDEX `idx_reminder_mhs` ON `reminder` (`id_mahasiswa`);--> statement-breakpoint
CREATE TABLE `sesi_autentikasi` (
	`token` text PRIMARY KEY NOT NULL,
	`id_pengguna` text NOT NULL,
	`waktu_login` text NOT NULL,
	`status` text NOT NULL,
	`token_push` text,
	FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id_pengguna`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "sesi_status_check" CHECK("sesi_autentikasi"."status" IN ('aktif', 'berakhir'))
);
--> statement-breakpoint
CREATE INDEX `idx_sesi_pengguna` ON `sesi_autentikasi` (`id_pengguna`);--> statement-breakpoint
CREATE INDEX `idx_sesi_push` ON `sesi_autentikasi` (`token_push`);--> statement-breakpoint
CREATE TABLE `status_server` (
	`id_status` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jenis` text NOT NULL,
	`status_uptime` integer NOT NULL,
	`waktu_cek` text NOT NULL,
	CONSTRAINT "status_jenis_check" CHECK("status_server"."jenis" IN ('website', 'server')),
	CONSTRAINT "status_uptime_check" CHECK("status_server"."status_uptime" IN (0, 1))
);
--> statement-breakpoint
CREATE INDEX `idx_status_jenis_waktu` ON `status_server` (`jenis`,`waktu_cek`);--> statement-breakpoint
CREATE TABLE `token_google` (
	`id_pengguna` text PRIMARY KEY NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`kedaluwarsa` text NOT NULL,
	FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id_pengguna`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `umpan_balik` (
	`id_umpan_balik` text PRIMARY KEY NOT NULL,
	`id_mahasiswa` text NOT NULL,
	`isi` text NOT NULL,
	`tanggapan` text,
	`id_administrator` text,
	FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa`(`id_pengguna`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_administrator`) REFERENCES `pengguna`(`id_pengguna`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_umpan_balik_mhs` ON `umpan_balik` (`id_mahasiswa`);