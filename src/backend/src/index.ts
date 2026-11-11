import { desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import * as schema from "./db/schema";
import { AppError } from "./lib/errors";
import { withDb, type AppEnv } from "./middleware/auth";
import { authRoutes, meRoutes } from "./routes/auth";
import { affirmationRoutes, reminderRoutes } from "./routes/affirmation";
import {
  calendarRoutes,
  consultantRoutes,
  sessionRoutes,
  slotRoutes,
} from "./routes/consultation";
import { faqRoutes } from "./routes/faq";
import { questionRoutes } from "./routes/questions";
import { feedbackRoutes } from "./routes/feedback";
import { statusRoutes } from "./routes/status";
import { scheduled } from "./jobs/scheduler";

const app = new Hono<AppEnv>();

app.use("*", cors());
app.use("*", withDb);

app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(err.toJSON(), err.status as 400);
  }
  console.error("[unhandled]", err);
  return c.json(
    { error: { kode: "KESALAHAN_SERVER", pesan: "Terjadi kesalahan pada server" } },
    500,
  );
});

app.notFound((c) =>
  c.json({ error: { kode: "TIDAK_DITEMUKAN", pesan: "Rute tidak ditemukan" } }, 404),
);

/** Smoke test; not part of the DPPL, mirrors the existing `/health` contract. */
app.get("/health", (c) => c.json({ ok: true }));

app.get("/health/db", async (c) => {
  const db = drizzle(c.env.D1, { schema });
  const [latest] = await db
    .select()
    .from(schema.statusServer)
    .orderBy(desc(schema.statusServer.waktuCek))
    .limit(1);
  return c.json({ ok: true, latest: latest ?? null });
});

/* -------------------------------------------------------------------------- */
/* API surface — maps 1:1 onto DPPL2 BAB 5.25..5.32                          */
/* -------------------------------------------------------------------------- */

app.route("/api/auth", authRoutes);
app.route("/api", meRoutes); // GET /api/me

app.route("/api/affirmation", affirmationRoutes);
app.route("/api/reminders", reminderRoutes);

app.route("/api/calendar", calendarRoutes);
app.route("/api/consultants", consultantRoutes);
app.route("/api/slots", slotRoutes);
app.route("/api/sessions", sessionRoutes);

app.route("/api/faq", faqRoutes);
app.route("/api/questions", questionRoutes);
app.route("/api/feedback", feedbackRoutes);
app.route("/api/status", statusRoutes);

export default {
  fetch: app.fetch,
  scheduled,
} satisfies ExportedHandler<Env>;
