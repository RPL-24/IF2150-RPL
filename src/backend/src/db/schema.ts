import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

/**
 * Sehati - Cloudflare D1 (SQLite) schema.
 * Source: DPPL K01_G04, BAB 5.37 "Skema Basis Data".
 *
 * Conventions (from the DPPL):
 * - Primary keys are TEXT (e.g. UUID), except `status_server` (INTEGER autoincrement).
 * - DateTime is stored as ISO 8601 text, Time as "HH:MM" text.
 * - Boolean is stored as INTEGER 0/1.
 * - D1 enforces foreign keys by default, so no PRAGMA is needed here.
 */

// Pengguna (C-01), Mahasiswa (C-02), Administrator (C-03)
export const pengguna = sqliteTable("pengguna", {
  idPengguna: text("id_pengguna").primaryKey(),
  nama: text("nama").notNull(),
  email: text("email").notNull().unique(),
  googleId: text("google_id").notNull().unique(),
  peran: text("peran", { enum: ["mahasiswa", "administrator"] }).notNull(),
}, (t) => [
  check("pengguna_peran_check", sql`${t.peran} IN ('mahasiswa', 'administrator')`),
]);

export const mahasiswa = sqliteTable("mahasiswa", {
  idPengguna: text("id_pengguna")
    .primaryKey()
    .references(() => pengguna.idPengguna, { onDelete: "cascade" }),
  // Derived from the campus email; NULL if the email is not a campus email.
  nim: text("nim").unique(),
});

// SesiAutentikasi (C-04)
export const sesiAutentikasi = sqliteTable("sesi_autentikasi", {
  token: text("token").primaryKey(),
  idPengguna: text("id_pengguna")
    .notNull()
    .references(() => pengguna.idPengguna, { onDelete: "cascade" }),
  waktuLogin: text("waktu_login").notNull(),
  status: text("status", { enum: ["aktif", "berakhir"] }).notNull(),
  // Expo push token of the device running this session.
  tokenPush: text("token_push"),
}, (t) => [
  check("sesi_status_check", sql`${t.status} IN ('aktif', 'berakhir')`),
  index("idx_sesi_pengguna").on(t.idPengguna),
  index("idx_sesi_push").on(t.tokenPush),
]);

// Google tokens (GoogleAuthService C-34, GoogleCalendarService C-08).
// access_token / refresh_token are AES-256-GCM ciphertext (base64 of IV + ciphertext + tag).
export const tokenGoogle = sqliteTable("token_google", {
  idPengguna: text("id_pengguna")
    .primaryKey()
    .references(() => pengguna.idPengguna, { onDelete: "cascade" }),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  kedaluwarsa: text("kedaluwarsa").notNull(),
});

// DailyAffirmation (C-05)
export const dailyAffirmation = sqliteTable("daily_affirmation", {
  idAffirmation: text("id_affirmation").primaryKey(),
  idMahasiswa: text("id_mahasiswa")
    .notNull()
    .references(() => mahasiswa.idPengguna, { onDelete: "cascade" }),
  konten: text("konten").notNull(),
  waktuKirim: text("waktu_kirim").notNull(),
}, (t) => [
  index("idx_affirmation_mhs").on(t.idMahasiswa),
]);

// Reminder (C-06)
export const reminder = sqliteTable("reminder", {
  idReminder: text("id_reminder").primaryKey(),
  idMahasiswa: text("id_mahasiswa")
    .notNull()
    .references(() => mahasiswa.idPengguna, { onDelete: "cascade" }),
  jenis: text("jenis", { enum: ["makan", "tidur", "olahraga"] }).notNull(),
  waktu: text("waktu").notNull(), // "HH:MM"
}, (t) => [
  check("reminder_jenis_check", sql`${t.jenis} IN ('makan', 'tidur', 'olahraga')`),
  index("idx_reminder_mhs").on(t.idMahasiswa),
]);

// Notifikasi (C-07)
// Exactly one of id_affirmation or id_reminder is set.
export const notifikasi = sqliteTable("notifikasi", {
  idNotifikasi: text("id_notifikasi").primaryKey(),
  idMahasiswa: text("id_mahasiswa")
    .notNull()
    .references(() => mahasiswa.idPengguna, { onDelete: "cascade" }),
  idAffirmation: text("id_affirmation").references(
    () => dailyAffirmation.idAffirmation,
    { onDelete: "cascade" },
  ),
  idReminder: text("id_reminder").references(() => reminder.idReminder, {
    onDelete: "cascade",
  }),
  isi: text("isi").notNull(),
  waktuKirim: text("waktu_kirim").notNull(),
}, (t) => [
  check(
    "notifikasi_sumber_check",
    sql`(${t.idAffirmation} IS NOT NULL) + (${t.idReminder} IS NOT NULL) = 1`,
  ),
  index("idx_notifikasi_mhs").on(t.idMahasiswa),
]);

// Konsultan (C-10)
export const konsultan = sqliteTable("konsultan", {
  idKonsultan: text("id_konsultan").primaryKey(),
  nama: text("nama").notNull(),
  spesialisasi: text("spesialisasi").notNull(),
});

// JadwalKonsultasi (C-11)
export const jadwalKonsultasi = sqliteTable("jadwal_konsultasi", {
  idJadwal: text("id_jadwal").primaryKey(),
  idKonsultan: text("id_konsultan")
    .notNull()
    .references(() => konsultan.idKonsultan, { onDelete: "cascade" }),
  waktu: text("waktu").notNull(), // start, ISO 8601
  waktuSelesai: text("waktu_selesai").notNull(), // end, ISO 8601
  status: text("status", { enum: ["tersedia", "terpesan"] })
    .notNull()
    .default("tersedia"),
  idMahasiswa: text("id_mahasiswa").references(() => mahasiswa.idPengguna, {
    onDelete: "set null",
  }),
}, (t) => [
  unique("jadwal_konsultan_waktu_unique").on(t.idKonsultan, t.waktu),
  check("jadwal_status_check", sql`${t.status} IN ('tersedia', 'terpesan')`),
  check("jadwal_waktu_check", sql`${t.waktuSelesai} > ${t.waktu}`),
  check(
    "jadwal_status_mahasiswa_check",
    sql`(${t.status} = 'terpesan') = (${t.idMahasiswa} IS NOT NULL)`,
  ),
  index("idx_jadwal_waktu").on(t.idKonsultan, t.waktu, t.waktuSelesai),
  index("idx_jadwal_mhs").on(t.idMahasiswa),
]);

// FAQ (C-12)
export const faq = sqliteTable("faq", {
  idFaq: text("id_faq").primaryKey(),
  pertanyaan: text("pertanyaan").notNull(),
  jawaban: text("jawaban").notNull(),
});

// PengajuanPertanyaan (C-13)
export const pengajuanPertanyaan = sqliteTable("pengajuan_pertanyaan", {
  idPertanyaan: text("id_pertanyaan").primaryKey(),
  idMahasiswa: text("id_mahasiswa")
    .notNull()
    .references(() => mahasiswa.idPengguna, { onDelete: "cascade" }),
  isiPertanyaan: text("isi_pertanyaan").notNull(),
});

// UmpanBalik (C-14)
export const umpanBalik = sqliteTable("umpan_balik", {
  idUmpanBalik: text("id_umpan_balik").primaryKey(),
  idMahasiswa: text("id_mahasiswa")
    .notNull()
    .references(() => mahasiswa.idPengguna, { onDelete: "cascade" }),
  isi: text("isi").notNull(),
  tanggapan: text("tanggapan"),
  // Must reference a user with peran = 'administrator'; enforced by the server.
  idAdministrator: text("id_administrator").references(
    () => pengguna.idPengguna,
    { onDelete: "set null" },
  ),
}, (t) => [
  index("idx_umpan_balik_mhs").on(t.idMahasiswa),
]);

// StatusServer (C-15)
export const statusServer = sqliteTable("status_server", {
  idStatus: integer("id_status").primaryKey({ autoIncrement: true }),
  jenis: text("jenis", { enum: ["website", "server"] }).notNull(),
  statusUptime: integer("status_uptime", { mode: "boolean" }).notNull(),
  waktuCek: text("waktu_cek").notNull(),
}, (t) => [
  check("status_jenis_check", sql`${t.jenis} IN ('website', 'server')`),
  check("status_uptime_check", sql`${t.statusUptime} IN (0, 1)`),
  // SQLite can scan this index backwards, so it also serves ORDER BY waktu_cek DESC.
  index("idx_status_jenis_waktu").on(t.jenis, t.waktuCek),
]);

/* -------------------------------------------------------------------------- */
/* Relations (for db.query.* relational queries)                              */
/* -------------------------------------------------------------------------- */

export const penggunaRelations = relations(pengguna, ({ one, many }) => ({
  mahasiswa: one(mahasiswa, {
    fields: [pengguna.idPengguna],
    references: [mahasiswa.idPengguna],
  }),
  sesi: many(sesiAutentikasi),
  tokenGoogle: one(tokenGoogle, {
    fields: [pengguna.idPengguna],
    references: [tokenGoogle.idPengguna],
  }),
  tanggapanUmpanBalik: many(umpanBalik),
}));

export const mahasiswaRelations = relations(mahasiswa, ({ one, many }) => ({
  pengguna: one(pengguna, {
    fields: [mahasiswa.idPengguna],
    references: [pengguna.idPengguna],
  }),
  affirmations: many(dailyAffirmation),
  reminders: many(reminder),
  notifikasi: many(notifikasi),
  jadwal: many(jadwalKonsultasi),
  pengajuanPertanyaan: many(pengajuanPertanyaan),
  umpanBalik: many(umpanBalik),
}));

export const sesiAutentikasiRelations = relations(sesiAutentikasi, ({ one }) => ({
  pengguna: one(pengguna, {
    fields: [sesiAutentikasi.idPengguna],
    references: [pengguna.idPengguna],
  }),
}));

export const tokenGoogleRelations = relations(tokenGoogle, ({ one }) => ({
  pengguna: one(pengguna, {
    fields: [tokenGoogle.idPengguna],
    references: [pengguna.idPengguna],
  }),
}));

export const dailyAffirmationRelations = relations(
  dailyAffirmation,
  ({ one, many }) => ({
    mahasiswa: one(mahasiswa, {
      fields: [dailyAffirmation.idMahasiswa],
      references: [mahasiswa.idPengguna],
    }),
    notifikasi: many(notifikasi),
  }),
);

export const reminderRelations = relations(reminder, ({ one, many }) => ({
  mahasiswa: one(mahasiswa, {
    fields: [reminder.idMahasiswa],
    references: [mahasiswa.idPengguna],
  }),
  notifikasi: many(notifikasi),
}));

export const notifikasiRelations = relations(notifikasi, ({ one }) => ({
  mahasiswa: one(mahasiswa, {
    fields: [notifikasi.idMahasiswa],
    references: [mahasiswa.idPengguna],
  }),
  affirmation: one(dailyAffirmation, {
    fields: [notifikasi.idAffirmation],
    references: [dailyAffirmation.idAffirmation],
  }),
  reminder: one(reminder, {
    fields: [notifikasi.idReminder],
    references: [reminder.idReminder],
  }),
}));

export const konsultanRelations = relations(konsultan, ({ many }) => ({
  jadwal: many(jadwalKonsultasi),
}));

export const jadwalKonsultasiRelations = relations(jadwalKonsultasi, ({ one }) => ({
  konsultan: one(konsultan, {
    fields: [jadwalKonsultasi.idKonsultan],
    references: [konsultan.idKonsultan],
  }),
  mahasiswa: one(mahasiswa, {
    fields: [jadwalKonsultasi.idMahasiswa],
    references: [mahasiswa.idPengguna],
  }),
}));

export const pengajuanPertanyaanRelations = relations(
  pengajuanPertanyaan,
  ({ one }) => ({
    mahasiswa: one(mahasiswa, {
      fields: [pengajuanPertanyaan.idMahasiswa],
      references: [mahasiswa.idPengguna],
    }),
  }),
);

export const umpanBalikRelations = relations(umpanBalik, ({ one }) => ({
  mahasiswa: one(mahasiswa, {
    fields: [umpanBalik.idMahasiswa],
    references: [mahasiswa.idPengguna],
  }),
  administrator: one(pengguna, {
    fields: [umpanBalik.idAdministrator],
    references: [pengguna.idPengguna],
  }),
}));

/* -------------------------------------------------------------------------- */
/* Inferred types                                                             */
/* -------------------------------------------------------------------------- */

export type Pengguna = typeof pengguna.$inferSelect;
export type NewPengguna = typeof pengguna.$inferInsert;
export type Mahasiswa = typeof mahasiswa.$inferSelect;
export type SesiAutentikasi = typeof sesiAutentikasi.$inferSelect;
export type TokenGoogle = typeof tokenGoogle.$inferSelect;
export type DailyAffirmation = typeof dailyAffirmation.$inferSelect;
export type Reminder = typeof reminder.$inferSelect;
export type Notifikasi = typeof notifikasi.$inferSelect;
export type Konsultan = typeof konsultan.$inferSelect;
export type JadwalKonsultasi = typeof jadwalKonsultasi.$inferSelect;
export type Faq = typeof faq.$inferSelect;
export type PengajuanPertanyaan = typeof pengajuanPertanyaan.$inferSelect;
export type UmpanBalik = typeof umpanBalik.$inferSelect;
export type StatusServer = typeof statusServer.$inferSelect;
