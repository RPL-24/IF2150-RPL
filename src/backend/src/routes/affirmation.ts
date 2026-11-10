import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import {
  ambilAfirmasi,
  buatAfirmasi,
  buatReminder,
  cariAfirmasiId,
  cariReminder,
  daftarReminder,
  hapusAfirmasi,
  ubahWaktuAfirmasi,
  ubahWaktuReminder,
} from "../db/queries";
import { JENIS_REMINDER, KONTEN_BAWAAN, type JenisReminder } from "../config";
import { gagalValidasi } from "../lib/errors";
import { bacaBody } from "../lib/http";
import { validasiWaktu } from "../lib/validasi";
import { auth, requireRole, type AppEnv } from "../middleware/auth";

export const affirmationRoutes = new Hono<AppEnv>();
/** Reminder routes live under `/api/reminders`. */
export const reminderRoutes = new Hono<AppEnv>();

affirmationRoutes.use("*", auth, requireRole("mahasiswa"));
reminderRoutes.use("*", auth, requireRole("mahasiswa"));

/** C-26 `ambilAfirmasiHariIni()` — Q-041. */
affirmationRoutes.get("/", async (c) => {
  const [afirmasi] = await ambilAfirmasi(c.get("db"), c.get("idPengguna"));
  return c.json({ affirmation: afirmasi ?? null });
});

/**
 * C-26 `submitWaktuPengiriman(waktu)`:
 * Algo-023 `validasiWaktu` -> Algo-028 `simpanWaktuKirim` (Q-021 then Q-022 or Q-023).
 */
affirmationRoutes.put("/time", async (c) => {
  const body = await bacaBody(c);
  const waktu = body.waktu;

  if (!validasiWaktu(waktu)) {
    throw gagalValidasi("waktu harus berformat HH:MM (contoh: 07:30)");
  }

  const db = c.get("db");
  const idMahasiswa = c.get("idPengguna");

  const [baris] = await cariAfirmasiId(db, idMahasiswa); // Q-021
  if (baris) {
    await ubahWaktuAfirmasi(db, { waktu, idAffirmation: baris.idAffirmation }); // Q-022
  } else {
    await buatAfirmasi(db, {
      idAffirmation: randomUUID(), // Q-023
      idMahasiswa,
      konten: KONTEN_BAWAAN,
      waktu,
    });
  }

  return c.json({ ok: true, waktuKirim: waktu });
});

/**
 * I-04-03 "Kirim afirmasi harian" toggle off: deletes the row so the daily
 * send stops. Idempotent — deleting when none exists still succeeds.
 */
affirmationRoutes.delete("/", async (c) => {
  await hapusAfirmasi(c.get("db"), c.get("idPengguna"));
  return c.json({ ok: true });
});

/** C-27 `tampilkanOpsiReminder()` — the student's reminders per `jenis`. */
reminderRoutes.get("/", async (c) => {
  const baris = await daftarReminder(c.get("db"), c.get("idPengguna"));
  const tersimpan = new Map(baris.map((r) => [r.jenis, r.waktu]));

  return c.json({
    reminders: JENIS_REMINDER.map((jenis) => ({
      jenis,
      waktu: tersimpan.get(jenis) ?? null,
    })),
  });
});

/**
 * C-27 `submitWaktuPengiriman(waktu)` per `jenis`:
 * Algo-023 -> Algo-028 (Q-024 then Q-025 or Q-026).
 */
reminderRoutes.put("/:jenis", async (c) => {
  const jenis = c.req.param("jenis") as JenisReminder;
  if (!JENIS_REMINDER.includes(jenis)) {
    throw gagalValidasi(`jenis harus salah satu dari: ${JENIS_REMINDER.join(", ")}`);
  }

  const body = await bacaBody(c);
  const waktu = body.waktu;
  if (!validasiWaktu(waktu)) {
    throw gagalValidasi("waktu harus berformat HH:MM (contoh: 07:30)");
  }

  const db = c.get("db");
  const idMahasiswa = c.get("idPengguna");

  const [baris] = await cariReminder(db, idMahasiswa, jenis); // Q-024
  if (baris) {
    await ubahWaktuReminder(db, { waktu, idReminder: baris.idReminder }); // Q-025
  } else {
    await buatReminder(db, {
      idReminder: randomUUID(), // Q-026
      idMahasiswa,
      jenis,
      waktu,
    });
  }

  return c.json({ ok: true, jenis, waktu });
});
