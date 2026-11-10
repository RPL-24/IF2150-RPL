import { and, desc, eq, gt, gte, lt, ne, or, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../db/schema";

export type Db = DrizzleD1Database<typeof schema> & { $client: D1Database };

/**
 * Data-access helpers, each annotated with the Q-xxx IDs it implements.
 * Source: M8 DPPL2 BAB 5.34 (GoogleAuthService), 5.35 (CloudflareD1Database),
 * and the Algo-0xx algorithm listings under each class.
 */

/* -------------------------------------------------------------------------- */
/* Pengguna / Mahasiswa / Sesi                                                */
/* -------------------------------------------------------------------------- */

/** Identity + role of one account, used by the auth middleware after Q-002. */
export function peranPengguna(db: Db, idPengguna: string) {
  return db
    .select({
      idPengguna: schema.pengguna.idPengguna,
      nama: schema.pengguna.nama,
      email: schema.pengguna.email,
      peran: schema.pengguna.peran,
    })
    .from(schema.pengguna)
    .where(eq(schema.pengguna.idPengguna, idPengguna))
    .limit(1);
}

/** Q-001 — find account by google_id. */
export function cariPenggunaGoogleId(db: Db, googleId: string) {
  return db
    .select({ idPengguna: schema.pengguna.idPengguna, peran: schema.pengguna.peran })
    .from(schema.pengguna)
    .where(eq(schema.pengguna.googleId, googleId))
    .limit(1);
}

/** Q-002 — read session by token. */
export function bacaSesi(db: Db, token: string) {
  return db
    .select({
      idPengguna: schema.sesiAutentikasi.idPengguna,
      waktuLogin: schema.sesiAutentikasi.waktuLogin,
      status: schema.sesiAutentikasi.status,
    })
    .from(schema.sesiAutentikasi)
    .where(eq(schema.sesiAutentikasi.token, token))
    .limit(1);
}

/** Q-003 — end a session. */
export function akhiriSesi(db: Db, token: string) {
  return db
    .update(schema.sesiAutentikasi)
    .set({ status: "berakhir" })
    .where(eq(schema.sesiAutentikasi.token, token));
}

/** Q-029 + Q-030 in one batch — register the user and its mahasiswa row. */
export async function daftarPengguna(
  db: Db,
  data: { idPengguna: string; nama: string; email: string; googleId: string; nim: string | null },
) {
  // Q-029 + Q-030 must run as one batch; Q-030 is INSERT ... SELECT, so both are
  // issued through the raw D1 client rather than the query builder.
  const d1 = db.$client;
  await d1.batch([
    d1
      .prepare(
        `INSERT INTO pengguna (id_pengguna, nama, email, google_id, peran)
         VALUES (?, ?, ?, ?, 'mahasiswa')
         ON CONFLICT (google_id) DO NOTHING`,
      )
      .bind(data.idPengguna, data.nama, data.email, data.googleId),
    d1
      .prepare(
        `INSERT INTO mahasiswa (id_pengguna, nim)
         SELECT id_pengguna, ? FROM pengguna
         WHERE id_pengguna = ? AND peran = 'mahasiswa'`,
      )
      .bind(data.nim, data.idPengguna),
  ]);
}

/** Q-031 — create a session. */
export function buatSesi(
  db: Db,
  data: { token: string; idPengguna: string; waktuLogin: string },
) {
  return db.insert(schema.sesiAutentikasi).values({
    token: data.token,
    idPengguna: data.idPengguna,
    waktuLogin: data.waktuLogin,
    status: "aktif",
  });
}

/** Q-033 (end other sessions on this device) + Q-034 (attach push token), batched. */
export async function daftarPerangkat(db: Db, data: { tokenPush: string; token: string }) {
  // Q-033 + Q-034 as one batch.
  const d1 = db.$client;
  await d1.batch([
    d1
      .prepare(
        "UPDATE sesi_autentikasi SET status = 'berakhir' WHERE token_push = ? AND token <> ?",
      )
      .bind(data.tokenPush, data.token),
    d1
      .prepare(
        "UPDATE sesi_autentikasi SET token_push = ? WHERE token = ? AND status = 'aktif'",
      )
      .bind(data.tokenPush, data.token),
  ]);
}

/** Q-007 — active push tokens of one recipient. */
export function ambilTokenPush(db: Db, idPengguna: string) {
  return db
    .selectDistinct({ tokenPush: schema.sesiAutentikasi.tokenPush })
    .from(schema.sesiAutentikasi)
    .where(
      and(
        eq(schema.sesiAutentikasi.idPengguna, idPengguna),
        eq(schema.sesiAutentikasi.status, "aktif"),
        sql`${schema.sesiAutentikasi.tokenPush} IS NOT NULL`,
      ),
    );
}

/** Q-008 — drop a push token Expo rejected. */
export function hapusTokenPush(db: Db, tokenPush: string) {
  return db
    .update(schema.sesiAutentikasi)
    .set({ tokenPush: null })
    .where(eq(schema.sesiAutentikasi.tokenPush, tokenPush));
}

/* -------------------------------------------------------------------------- */
/* Google tokens                                                              */
/* -------------------------------------------------------------------------- */

/** Q-009 — read encrypted Google tokens. */
export function bacaTokenGoogle(db: Db, idPengguna: string) {
  return db
    .select({
      accessToken: schema.tokenGoogle.accessToken,
      refreshToken: schema.tokenGoogle.refreshToken,
      kedaluwarsa: schema.tokenGoogle.kedaluwarsa,
    })
    .from(schema.tokenGoogle)
    .where(eq(schema.tokenGoogle.idPengguna, idPengguna))
    .limit(1);
}

/** Q-032 — upsert encrypted Google tokens, keeping the old refresh token when none is sent. */
export function simpanTokenGoogle(
  db: Db,
  data: { idPengguna: string; accessToken: string; refreshToken: string | null; kedaluwarsa: string },
) {
  return db
    .insert(schema.tokenGoogle)
    .values(data)
    .onConflictDoUpdate({
      target: schema.tokenGoogle.idPengguna,
      set: {
        accessToken: data.accessToken,
        refreshToken: sql`COALESCE(${data.refreshToken}, ${schema.tokenGoogle.refreshToken})`,
        kedaluwarsa: data.kedaluwarsa,
      },
    });
}

/** Q-010 — store a refreshed access token. */
export function perbaruiAccessToken(
  db: Db,
  data: { accessToken: string; kedaluwarsa: string; idPengguna: string },
) {
  return db
    .update(schema.tokenGoogle)
    .set({ accessToken: data.accessToken, kedaluwarsa: data.kedaluwarsa })
    .where(eq(schema.tokenGoogle.idPengguna, data.idPengguna));
}

/* -------------------------------------------------------------------------- */
/* Afirmasi & pengingat                                                       */
/* -------------------------------------------------------------------------- */

/** Q-021 — find the student's affirmation row. */
export function cariAfirmasiId(db: Db, idMahasiswa: string) {
  return db
    .select({ idAffirmation: schema.dailyAffirmation.idAffirmation })
    .from(schema.dailyAffirmation)
    .where(eq(schema.dailyAffirmation.idMahasiswa, idMahasiswa))
    .limit(1);
}

/** Q-022 — update an existing affirmation's send time. */
export function ubahWaktuAfirmasi(db: Db, data: { waktu: string; idAffirmation: string }) {
  return db
    .update(schema.dailyAffirmation)
    .set({ waktuKirim: data.waktu })
    .where(eq(schema.dailyAffirmation.idAffirmation, data.idAffirmation));
}

/** Q-023 — create an affirmation with the default content. */
export function buatAfirmasi(
  db: Db,
  data: { idAffirmation: string; idMahasiswa: string; konten: string; waktu: string },
) {
  return db.insert(schema.dailyAffirmation).values({
    idAffirmation: data.idAffirmation,
    idMahasiswa: data.idMahasiswa,
    konten: data.konten,
    waktuKirim: data.waktu,
  });
}

/** Q-041 — the student's affirmation (beranda card). */
export function ambilAfirmasi(db: Db, idMahasiswa: string) {
  return db
    .select({
      idAffirmation: schema.dailyAffirmation.idAffirmation,
      konten: schema.dailyAffirmation.konten,
      waktuKirim: schema.dailyAffirmation.waktuKirim,
    })
    .from(schema.dailyAffirmation)
    .where(eq(schema.dailyAffirmation.idMahasiswa, idMahasiswa))
    .limit(1);
}

/** Deletes the student's affirmation (I-04-03 toggle off). Not in the DPPL. */
export function hapusAfirmasi(db: Db, idMahasiswa: string) {
  return db
    .delete(schema.dailyAffirmation)
    .where(eq(schema.dailyAffirmation.idMahasiswa, idMahasiswa));
}

/** Q-024 — find the student's reminder of one `jenis`. */
export function cariReminder(db: Db, idMahasiswa: string, jenis: string) {
  return db
    .select({ idReminder: schema.reminder.idReminder })
    .from(schema.reminder)
    .where(
      and(
        eq(schema.reminder.idMahasiswa, idMahasiswa),
        eq(schema.reminder.jenis, jenis as "makan" | "tidur" | "olahraga"),
      ),
    )
    .limit(1);
}

/** Q-025 — update a reminder's time. */
export function ubahWaktuReminder(db: Db, data: { waktu: string; idReminder: string }) {
  return db
    .update(schema.reminder)
    .set({ waktu: data.waktu })
    .where(eq(schema.reminder.idReminder, data.idReminder));
}

/** Q-026 — create a reminder. */
export function buatReminder(
  db: Db,
  data: {
    idReminder: string;
    idMahasiswa: string;
    jenis: "makan" | "tidur" | "olahraga";
    waktu: string;
  },
) {
  return db.insert(schema.reminder).values(data);
}

/** All reminders of one student (ReminderController.tampilkanOpsiReminder). */
export function daftarReminder(db: Db, idMahasiswa: string) {
  return db
    .select({
      idReminder: schema.reminder.idReminder,
      jenis: schema.reminder.jenis,
      waktu: schema.reminder.waktu,
    })
    .from(schema.reminder)
    .where(eq(schema.reminder.idMahasiswa, idMahasiswa));
}

/** Q-004 — affirmations due this minute (cron). */
export function afirmasiJatuhTempo(db: Db, jamMenit: string) {
  return db
    .select({
      idAffirmation: schema.dailyAffirmation.idAffirmation,
      idMahasiswa: schema.dailyAffirmation.idMahasiswa,
      konten: schema.dailyAffirmation.konten,
    })
    .from(schema.dailyAffirmation)
    .where(eq(schema.dailyAffirmation.waktuKirim, jamMenit));
}

/** Q-005 — reminders due this minute (cron). */
export function reminderJatuhTempo(db: Db, jamMenit: string) {
  return db
    .select({
      idReminder: schema.reminder.idReminder,
      idMahasiswa: schema.reminder.idMahasiswa,
      jenis: schema.reminder.jenis,
    })
    .from(schema.reminder)
    .where(eq(schema.reminder.waktu, jamMenit));
}

/** Q-006 — record a notification. */
export function catatNotifikasi(
  db: Db,
  data: {
    idNotifikasi: string;
    idMahasiswa: string;
    idAffirmation: string | null;
    idReminder: string | null;
    isi: string;
    waktuKirim: string;
  },
) {
  return db.insert(schema.notifikasi).values(data);
}

/* -------------------------------------------------------------------------- */
/* Konsultan & jadwal                                                         */
/* -------------------------------------------------------------------------- */

/** Q-012 — all consultants. */
export function daftarKonsultan(db: Db) {
  return db
    .select({
      idKonsultan: schema.konsultan.idKonsultan,
      nama: schema.konsultan.nama,
      spesialisasi: schema.konsultan.spesialisasi,
    })
    .from(schema.konsultan)
    .orderBy(schema.konsultan.nama);
}

/** Q-019 — is this consultant registered? */
export function konsultanAda(db: Db, idKonsultan: string) {
  return db
    .select({ ada: sql<number>`1` })
    .from(schema.konsultan)
    .where(eq(schema.konsultan.idKonsultan, idKonsultan))
    .limit(1);
}

/** Q-013 — every slot (for the merged calendar). */
export function semuaJadwal(db: Db) {
  return db
    .select({
      idJadwal: schema.jadwalKonsultasi.idJadwal,
      idKonsultan: schema.jadwalKonsultasi.idKonsultan,
      waktu: schema.jadwalKonsultasi.waktu,
      waktuSelesai: schema.jadwalKonsultasi.waktuSelesai,
      status: schema.jadwalKonsultasi.status,
    })
    .from(schema.jadwalKonsultasi)
    .orderBy(schema.jadwalKonsultasi.waktu);
}

/** Q-014 — upcoming slots of one consultant. */
export function jadwalKonsultan(db: Db, idKonsultan: string, sekarang: string) {
  return db
    .select({
      idJadwal: schema.jadwalKonsultasi.idJadwal,
      waktu: schema.jadwalKonsultasi.waktu,
      waktuSelesai: schema.jadwalKonsultasi.waktuSelesai,
      status: schema.jadwalKonsultasi.status,
    })
    .from(schema.jadwalKonsultasi)
    .where(
      and(
        eq(schema.jadwalKonsultasi.idKonsultan, idKonsultan),
        gte(schema.jadwalKonsultasi.waktu, sekarang),
      ),
    )
    .orderBy(schema.jadwalKonsultasi.waktu);
}

/** One slot by id (needed to resolve the clash window before booking). */
export function ambilSlot(db: Db, idJadwal: string) {
  return db
    .select({
      idJadwal: schema.jadwalKonsultasi.idJadwal,
      idKonsultan: schema.jadwalKonsultasi.idKonsultan,
      waktu: schema.jadwalKonsultasi.waktu,
      waktuSelesai: schema.jadwalKonsultasi.waktuSelesai,
      status: schema.jadwalKonsultasi.status,
      idMahasiswa: schema.jadwalKonsultasi.idMahasiswa,
    })
    .from(schema.jadwalKonsultasi)
    .where(eq(schema.jadwalKonsultasi.idJadwal, idJadwal))
    .limit(1);
}

/** Q-011 — does the student already have an overlapping booked session? */
export function sesiTumpangTindih(
  db: Db,
  data: { idMahasiswa: string; waktu: string; waktuSelesai: string },
) {
  return db
    .select({ ada: sql<number>`1` })
    .from(schema.jadwalKonsultasi)
    .where(
      and(
        eq(schema.jadwalKonsultasi.idMahasiswa, data.idMahasiswa),
        eq(schema.jadwalKonsultasi.status, "terpesan"),
        lt(schema.jadwalKonsultasi.waktu, data.waktuSelesai),
        gt(schema.jadwalKonsultasi.waktuSelesai, data.waktu),
      ),
    )
    .limit(1);
}

/** Q-020 — does a slot overlap another slot of the same consultant? */
export function slotKonsultanTumpang(
  db: Db,
  data: { idKonsultan: string; idJadwal: string; waktu: string; waktuSelesai: string },
) {
  return db
    .select({ ada: sql<number>`1` })
    .from(schema.jadwalKonsultasi)
    .where(
      and(
        eq(schema.jadwalKonsultasi.idKonsultan, data.idKonsultan),
        ne(schema.jadwalKonsultasi.idJadwal, data.idJadwal),
        lt(schema.jadwalKonsultasi.waktu, data.waktuSelesai),
        gt(schema.jadwalKonsultasi.waktuSelesai, data.waktu),
      ),
    )
    .limit(1);
}

/** Q-027 — administrator edits a slot's window. */
export function ubahJadwal(
  db: Db,
  data: { idJadwal: string; waktu: string; waktuSelesai: string },
) {
  return db
    .update(schema.jadwalKonsultasi)
    .set({ waktu: data.waktu, waktuSelesai: data.waktuSelesai })
    .where(eq(schema.jadwalKonsultasi.idJadwal, data.idJadwal));
}

/** Q-028 — student books a still-available slot; 0 rows affected means it was taken. */
export function pesanSlot(db: Db, data: { idJadwal: string; idMahasiswa: string }) {
  return db
    .update(schema.jadwalKonsultasi)
    .set({ status: "terpesan", idMahasiswa: data.idMahasiswa })
    .where(
      and(
        eq(schema.jadwalKonsultasi.idJadwal, data.idJadwal),
        eq(schema.jadwalKonsultasi.status, "tersedia"),
      ),
    );
}

/** Insert a new slot (JadwalKonsultasi.simpanJadwal). */
export function buatJadwal(
  db: Db,
  data: {
    idJadwal: string;
    idKonsultan: string;
    waktu: string;
    waktuSelesai: string;
    status: "tersedia";
  },
) {
  return db.insert(schema.jadwalKonsultasi).values(data);
}

/** Q-042 — the student's nearest booked session (beranda card). */
export function ambilSesiBerikutnya(db: Db, idMahasiswa: string, sekarang: string) {
  return db
    .select({
      idJadwal: schema.jadwalKonsultasi.idJadwal,
      waktu: schema.jadwalKonsultasi.waktu,
      waktuSelesai: schema.jadwalKonsultasi.waktuSelesai,
      nama: schema.konsultan.nama,
      spesialisasi: schema.konsultan.spesialisasi,
    })
    .from(schema.jadwalKonsultasi)
    .innerJoin(
      schema.konsultan,
      eq(schema.konsultan.idKonsultan, schema.jadwalKonsultasi.idKonsultan),
    )
    .where(
      and(
        eq(schema.jadwalKonsultasi.idMahasiswa, idMahasiswa),
        eq(schema.jadwalKonsultasi.status, "terpesan"),
        gte(schema.jadwalKonsultasi.waktu, sekarang),
      ),
    )
    .orderBy(schema.jadwalKonsultasi.waktu)
    .limit(1);
}

/* -------------------------------------------------------------------------- */
/* FAQ & pertanyaan                                                           */
/* -------------------------------------------------------------------------- */

const escapePattern = (s: string) => s.replace(/[!%_]/g, (ch) => `!${ch}`);

/** Q-015 — keyword search; blank keyword lists everything. */
export async function daftarFaq(db: Db, kataKunci?: string) {
  if (kataKunci && kataKunci.trim().length > 0) {
    const pola = `%${escapePattern(kataKunci.trim())}%`;
    return db
      .select({
        idFaq: schema.faq.idFaq,
        pertanyaan: schema.faq.pertanyaan,
        jawaban: schema.faq.jawaban,
      })
      .from(schema.faq)
      .where(
        or(
          sql`${schema.faq.pertanyaan} LIKE ${pola} ESCAPE '!'`,
          sql`${schema.faq.jawaban} LIKE ${pola} ESCAPE '!'`,
        ),
      )
      .orderBy(schema.faq.pertanyaan);
  }
  return db
    .select({
      idFaq: schema.faq.idFaq,
      pertanyaan: schema.faq.pertanyaan,
      jawaban: schema.faq.jawaban,
    })
    .from(schema.faq)
    .orderBy(schema.faq.pertanyaan);
}

/** Q-035 — add FAQ. */
export function tambahFaq(
  db: Db,
  data: { idFaq: string; pertanyaan: string; jawaban: string },
) {
  return db.insert(schema.faq).values(data);
}

/** Q-036 — update FAQ. */
export function ubahFaq(
  db: Db,
  data: { idFaq: string; pertanyaan: string; jawaban: string },
) {
  return db
    .update(schema.faq)
    .set({ pertanyaan: data.pertanyaan, jawaban: data.jawaban })
    .where(eq(schema.faq.idFaq, data.idFaq));
}

/** Q-037 — delete FAQ. */
export function hapusFaq(db: Db, idFaq: string) {
  return db.delete(schema.faq).where(eq(schema.faq.idFaq, idFaq));
}

/** Q-040 — submit a question outside the FAQ. */
export function ajukanPertanyaan(
  db: Db,
  data: { idPertanyaan: string; idMahasiswa: string; isiPertanyaan: string },
) {
  return db.insert(schema.pengajuanPertanyaan).values(data);
}

/* -------------------------------------------------------------------------- */
/* Umpan balik                                                                */
/* -------------------------------------------------------------------------- */

/** Q-038 — submit feedback. */
export function kirimUmpanBalik(
  db: Db,
  data: { idUmpanBalik: string; idMahasiswa: string; isi: string },
) {
  return db.insert(schema.umpanBalik).values(data);
}

/** Q-016 — feedback list newest first, with the student's name. */
export function daftarUmpanBalik(db: Db, limit = 100, offset = 0) {
  return db
    .select({
      idUmpanBalik: schema.umpanBalik.idUmpanBalik,
      namaMahasiswa: schema.pengguna.nama,
      isi: schema.umpanBalik.isi,
      tanggapan: schema.umpanBalik.tanggapan,
    })
    .from(schema.umpanBalik)
    .innerJoin(schema.pengguna, eq(schema.pengguna.idPengguna, schema.umpanBalik.idMahasiswa))
    .orderBy(desc(sql`${schema.umpanBalik}.rowid`))
    .limit(limit)
    .offset(offset);
}

/** Q-039 — administrator response. */
export function tanggapiUmpanBalik(
  db: Db,
  data: { idUmpanBalik: string; tanggapan: string; idAdministrator: string },
) {
  return db
    .update(schema.umpanBalik)
    .set({ tanggapan: data.tanggapan, idAdministrator: data.idAdministrator })
    .where(eq(schema.umpanBalik.idUmpanBalik, data.idUmpanBalik));
}

/* -------------------------------------------------------------------------- */
/* Status server                                                              */
/* -------------------------------------------------------------------------- */

/** Q-017 — latest check of one `jenis`. */
export function statusTerakhir(db: Db, jenis: "website" | "server") {
  return db
    .select({
      jenis: schema.statusServer.jenis,
      statusUptime: schema.statusServer.statusUptime,
      waktuCek: schema.statusServer.waktuCek,
    })
    .from(schema.statusServer)
    .where(eq(schema.statusServer.jenis, jenis))
    .orderBy(desc(schema.statusServer.waktuCek))
    .limit(1);
}

/** Q-018 — record one status check. */
export function catatStatus(
  db: Db,
  data: { jenis: "website" | "server"; statusUptime: boolean; waktuCek: string },
) {
  return db.insert(schema.statusServer).values(data);
}
