import { drizzle } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";
import * as schema from "../db/schema";
import { akhiriSesi, bacaSesi, peranPengguna } from "../db/queries";
import { BATAS_SESI_MS, type Peran } from "../config";
import type { Db } from "../db/queries";
import { gagalAuth, gagalPeran } from "../lib/errors";

export type AppEnv = {
  Bindings: Env;
  Variables: {
    db: Db;
    idPengguna: string;
    namaPengguna: string;
    peran: Peran;
    token: string;
  };
};

function ambilBearer(header: string | undefined): string | null {
  if (!header) return null;
  const [skema, nilai] = header.split(" ");
  if (!skema || skema.toLowerCase() !== "bearer" || !nilai) return null;
  return nilai.trim() || null;
}

/** Opens a Drizzle client once per request. */
export const withDb = createMiddleware<AppEnv>(async (c, next) => {
  c.set("db", drizzle(c.env.D1, { schema }));
  await next();
});

/**
 * `verifikasiToken` (Algo-002, Q-002/Q-003):
 * reads `Authorization: Bearer <token>`, rejects missing / ended / expired sessions,
 * and puts `idPengguna`, `namaPengguna`, `peran`, and `token` on the context.
 */
export const auth = createMiddleware<AppEnv>(async (c, next) => {
  const token = ambilBearer(c.req.header("Authorization"));
  if (!token) throw gagalAuth("Header Authorization Bearer tidak ditemukan");

  const db = c.get("db");
  const [sesi] = await bacaSesi(db, token);
  if (!sesi || sesi.status !== "aktif") throw gagalAuth();

  const umur = Date.now() - new Date(sesi.waktuLogin).getTime();
  if (!Number.isFinite(umur) || umur > BATAS_SESI_MS) {
    await akhiriSesi(db, token);
    throw gagalAuth("Sesi sudah kedaluwarsa, silakan masuk kembali");
  }

  const [akun] = await peranPengguna(db, sesi.idPengguna);
  if (!akun) throw gagalAuth();

  c.set("idPengguna", sesi.idPengguna);
  c.set("namaPengguna", akun.nama);
  c.set("peran", akun.peran);
  c.set("token", token);
  await next();
});

/** Guards a route to one `peran`. Mount after `auth`. */
export function requireRole(peran: Peran) {
  return createMiddleware<AppEnv>(async (c, next) => {
    if (c.get("peran") !== peran) throw gagalPeran(peran);
    await next();
  });
}
