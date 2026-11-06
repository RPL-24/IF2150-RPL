import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { ajukanPertanyaan } from "../db/queries";
import { gagalValidasi } from "../lib/errors";
import { bacaBody } from "../lib/http";
import { auth, requireRole, type AppEnv } from "../middleware/auth";

/** PengajuanPertanyaan routes (C-30 `kirimPertanyaan`, UC-12). */
export const questionRoutes = new Hono<AppEnv>();

questionRoutes.use("*", auth, requireRole("mahasiswa"));

/** UC-12 — Algo-026 `validasiInput` then Q-040. */
questionRoutes.post("/", async (c) => {
  const body = await bacaBody(c);
  const isi = body.isi ?? body.isiPertanyaan;

  if (typeof isi !== "string" || isi.trim().length === 0) {
    throw gagalValidasi("isi pertanyaan wajib diisi");
  }

  const idPertanyaan = randomUUID();
  await ajukanPertanyaan(c.get("db"), {
    idPertanyaan, // Q-040
    idMahasiswa: c.get("idPengguna"),
    isiPertanyaan: isi.trim(),
  });

  return c.json({ ok: true, idPertanyaan }, 201);
});
