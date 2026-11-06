import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { daftarFaq, hapusFaq, tambahFaq, ubahFaq } from "../db/queries";
import { gagalValidasi, tidakDitemukan } from "../lib/errors";
import { bacaBody } from "../lib/http";
import { auth, requireRole, type AppEnv } from "../middleware/auth";

export const faqRoutes = new Hono<AppEnv>();

faqRoutes.use("*", auth);

/**
 * C-30 `tampilkanFAQ()` / `cariFAQ(kataKunci)` — Algo-017 / Q-015.
 * `?q=` is optional; a blank keyword lists every FAQ.
 */
faqRoutes.get("/", async (c) => {
  const daftar = await daftarFaq(c.get("db"), c.req.query("q"));
  return c.json({ faq: daftar });
});

/** C-30 `tambahFAQ` — Algo-026 then Q-035. */
faqRoutes.post("/", requireRole("administrator"), async (c) => {
  const body = await bacaBody(c);
  const { pertanyaan, jawaban } = body;

  if (
    typeof pertanyaan !== "string" ||
    typeof jawaban !== "string" ||
    pertanyaan.trim().length === 0 ||
    jawaban.trim().length === 0
  ) {
    throw gagalValidasi("pertanyaan dan jawaban wajib diisi");
  }

  const idFaq = randomUUID();
  await tambahFaq(c.get("db"), {
    idFaq, // Q-035
    pertanyaan: pertanyaan.trim(),
    jawaban: jawaban.trim(),
  });

  return c.json({ ok: true, idFaq }, 201);
});

/** C-30 `ubahFAQ` — Algo-026 then Q-036. */
faqRoutes.put("/:id", requireRole("administrator"), async (c) => {
  const idFaq = c.req.param("id");
  const body = await bacaBody(c);
  const { pertanyaan, jawaban } = body;

  if (
    typeof pertanyaan !== "string" ||
    typeof jawaban !== "string" ||
    pertanyaan.trim().length === 0 ||
    jawaban.trim().length === 0
  ) {
    throw gagalValidasi("pertanyaan dan jawaban wajib diisi");
  }

  const hasil = await ubahFaq(c.get("db"), {
    idFaq, // Q-036
    pertanyaan: pertanyaan.trim(),
    jawaban: jawaban.trim(),
  });
  if ((hasil.meta?.changes ?? 0) === 0) throw tidakDitemukan("FAQ tidak ditemukan");

  return c.json({ ok: true, idFaq });
});

/** C-30 `hapusFAQ` — Q-037. */
faqRoutes.delete("/:id", requireRole("administrator"), async (c) => {
  const idFaq = c.req.param("id");
  const hasil = await hapusFaq(c.get("db"), idFaq); // Q-037
  if ((hasil.meta?.changes ?? 0) === 0) throw tidakDitemukan("FAQ tidak ditemukan");
  return c.json({ ok: true, idFaq });
});
