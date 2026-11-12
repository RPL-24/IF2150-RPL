import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import {
  ambilSlot,
  ambilSesiBerikutnya,
  buatJadwal,
  daftarKonsultan,
  jadwalKonsultan,
  konsultanAda,
  pesanSlot,
  semuaJadwal,
  sesiTumpangTindih,
  slotKonsultanTumpang,
  ubahJadwal,
} from "../db/queries";
import { bacaConfig } from "../config";
import {
  bentrokJadwal,
  gagalValidasi,
  slotSudahDipesan,
  tidakDitemukan,
} from "../lib/errors";
import { bacaBody } from "../lib/http";
import { validasiRentangJadwal } from "../lib/validasi";
import {
  ambilKalender,
  cekBentrokJadwal,
  type EventGoogle,
} from "../lib/google";
import { auth, requireRole, type AppEnv } from "../middleware/auth";
import { gabungkanJadwal } from "../lib/kalender";

export const calendarRoutes = new Hono<AppEnv>();

/* -------------------------------------------------------------------------- */
/* CalendarController (C-28) — Algo-009 / Algo-011                            */
/* -------------------------------------------------------------------------- */


/** C-28 `tampilkanCalendar()` — UC-03. Google failure degrades to slots only. */
calendarRoutes.get("/", auth, requireRole("mahasiswa"), async (c) => {
  const db = c.get("db");
  const cfg = bacaConfig(c.env);

  const timeMin = c.req.query("dari") ?? new Date().toISOString();
  const timeMax =
    c.req.query("sampai") ?? new Date(Date.now() + 30 * 86_400_000).toISOString();
  const rentang = validasiRentangJadwal(timeMin, timeMax);
  if (!rentang) {
    throw gagalValidasi("Parameter dari dan sampai harus berupa ISO-8601 valid dengan sampai > dari");
  }
  const dari = rentang.mulai.toISOString();
  const sampai = rentang.selesai.toISOString();

  const jadwal = await semuaJadwal(db, dari, sampai); // Q-013

  let google: EventGoogle[] = [];
  let mode: "google" | "mock" = "mock";
  let peringatan: string | undefined;
  try {
    const hasilGoogle = await ambilKalender(db, c.get("idPengguna"), cfg, dari, sampai); // Algo-009
    google = hasilGoogle.events;
    mode = hasilGoogle.mode;
  } catch (error) {
    // CalendarView.showErrorMessage() offers a Refresh action instead of failing hard.
    peringatan =
      error instanceof Error ? error.message : "Gagal mengambil event Google Calendar";
  }

  return c.json({
    events: gabungkanJadwal(google, jadwal),
    mode,
    peringatan,
  });
});

/* -------------------------------------------------------------------------- */
/* ConsultationController (C-29) — UC-04 / UC-05                              */
/* -------------------------------------------------------------------------- */

export const consultantRoutes = new Hono<AppEnv>();
export const slotRoutes = new Hono<AppEnv>();
export const sessionRoutes = new Hono<AppEnv>();

/** C-29 `tampilkanOpsiKonsultasi()` — Q-012. */
consultantRoutes.get("/", auth, async (c) => {
  const daftar = await daftarKonsultan(c.get("db"));
  return c.json({ consultants: daftar });
});

/** C-29 `submitKonsultan(konsultan)` — Algo-024 then Algo-015 (Q-019, Q-014). */
consultantRoutes.get("/:id/slots", auth, async (c) => {
  const db = c.get("db");
  const idKonsultan = c.req.param("id");

  const [ada] = await konsultanAda(db, idKonsultan); // Q-019
  if (!ada) throw tidakDitemukan("Konsultan tidak ditemukan");

  const sekarang = new Date().toISOString();
  const slots = await jadwalKonsultan(db, idKonsultan, sekarang); // Q-014
  return c.json({ slots });
});

/** C-29 `ambilSesiBerikutnya()` — Q-042, for the beranda card. */
sessionRoutes.get("/next", auth, requireRole("mahasiswa"), async (c) => {
  const [sesi] = await ambilSesiBerikutnya(
    c.get("db"),
    c.get("idPengguna"),
    new Date().toISOString(),
  );
  return c.json({ session: sesi ?? null });
});

/**
 * UC-04 — Algo-022 student branch + Algo-012 `jadwalBentrok` + Algo-029 Q-028.
 *  1. slot must exist and still be available
 *  2. Google Calendar free/busy clash  -> 409 JADWAL_BENTROK
 *  3. another booked session overlaps  -> 409 JADWAL_BENTROK (Q-011)
 *  4. Q-028 with `status = 'tersedia'`; 0 rows updated means someone else won the race
 */
slotRoutes.post("/:id/book", auth, requireRole("mahasiswa"), async (c) => {
  const db = c.get("db");
  const cfg = bacaConfig(c.env);
  const idJadwal = c.req.param("id");
  const idMahasiswa = c.get("idPengguna");

  const [slot] = await ambilSlot(db, idJadwal);
  if (!slot) throw tidakDitemukan("Slot jadwal tidak ditemukan");
  if (slot.status !== "tersedia") throw slotSudahDipesan();

  // Algo-012 step 1: Google Calendar free/busy (Algo-010), including token refresh.
  const bentrokGoogle = await cekBentrokJadwal(
    db,
    idMahasiswa,
    cfg,
    slot.waktu,
    slot.waktuSelesai,
  );
  if (bentrokGoogle) throw bentrokJadwal("Jadwal bentrok dengan event Google Calendar Anda");

  // Algo-012 step 2: another booked session overlap (Q-011).
  const [tumpang] = await sesiTumpangTindih(db, {
    idMahasiswa,
    waktu: slot.waktu,
    waktuSelesai: slot.waktuSelesai,
  });
  if (tumpang) throw bentrokJadwal("Anda sudah memiliki sesi lain pada waktu tersebut");

  // Algo-029 student branch: Q-028 guarded by `status = 'tersedia'`.
  const hasil = await pesanSlot(db, { idJadwal, idMahasiswa });
  const terubah = hasil.meta?.changes ?? 0;
  if (terubah !== 1) throw slotSudahDipesan();

  return c.json({ ok: true, idJadwal, status: "terpesan" });
});

/**
 * UC-05 — administrator creates a slot.
 * Algo-024 + Algo-025 `validasiJadwal` (Q-019, Q-020), then insert.
 */
slotRoutes.post("/", auth, requireRole("administrator"), async (c) => {
  const body = await bacaBody(c);
  const idKonsultan = body.idKonsultan;
  if (typeof idKonsultan !== "string" || idKonsultan.trim().length === 0) {
    throw gagalValidasi("idKonsultan wajib diisi");
  }

  const rentang = validasiRentangJadwal(body.waktu, body.waktuSelesai);
  if (!rentang) {
    throw gagalValidasi("waktu dan waktuSelesai harus ISO-8601 valid dengan selesai > mulai");
  }

  const db = c.get("db");

  const [ada] = await konsultanAda(db, idKonsultan); // Q-019
  if (!ada) throw gagalValidasi("Konsultan tidak terdaftar");

  const idJadwal = randomUUID();
  const [tumpang] = await slotKonsultanTumpang(db, {
    idKonsultan, // Q-020
    idJadwal,
    waktu: rentang.mulai.toISOString(),
    waktuSelesai: rentang.selesai.toISOString(),
  });
  if (tumpang) throw bentrokJadwal("Slot bertumpang tindih dengan jadwal konsultan lain");

  await buatJadwal(db, {
    idJadwal,
    idKonsultan,
    waktu: rentang.mulai.toISOString(),
    waktuSelesai: rentang.selesai.toISOString(),
    status: "tersedia",
  });

  return c.json({ ok: true, idJadwal }, 201);
});

/**
 * UC-05 — Algo-022 administrator branch: Algo-025 `validasiJadwal`
 * then Algo-029 Q-027.
 */
slotRoutes.patch("/:id", auth, requireRole("administrator"), async (c) => {
  const idJadwal = c.req.param("id");
  const body = await bacaBody(c);
  const db = c.get("db");

  const [slot] = await ambilSlot(db, idJadwal);
  if (!slot) throw tidakDitemukan("Slot jadwal tidak ditemukan");

  const rentang = validasiRentangJadwal(
    body.waktu ?? slot.waktu,
    body.waktuSelesai ?? slot.waktuSelesai,
  );
  if (!rentang) {
    throw gagalValidasi("waktu dan waktuSelesai harus ISO-8601 valid dengan selesai > mulai");
  }

  const [tumpang] = await slotKonsultanTumpang(db, {
    idKonsultan: slot.idKonsultan, // Q-020
    idJadwal,
    waktu: rentang.mulai.toISOString(),
    waktuSelesai: rentang.selesai.toISOString(),
  });
  if (tumpang) throw bentrokJadwal("Slot bertumpang tindih dengan jadwal konsultan lain");

  await ubahJadwal(db, {
    idJadwal, // Q-027
    waktu: rentang.mulai.toISOString(),
    waktuSelesai: rentang.selesai.toISOString(),
  });

  return c.json({ ok: true, idJadwal });
});
