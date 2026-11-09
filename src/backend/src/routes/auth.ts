import type { Context } from "hono";
import { randomBytes, randomUUID } from "node:crypto";
import { Hono } from "hono";
import {
  akhiriSesi,
  buatSesi,
  cariPenggunaGoogleId,
  daftarPengguna,
  daftarPerangkat,
  peranPengguna,
  simpanTokenGoogle,
  type Db,
} from "../db/queries";
import { AKUN_DEMO, bacaConfig, modeDemoAktif, nimDariEmail, type Peran } from "../config";
import { enkripsiAES256GCM } from "../lib/crypto";
import { permintaanTidakValid, gagalAuth, gagalValidasi, tidakDitemukan } from "../lib/errors";
import { validasiTokenPush } from "../lib/validasi";
import { buatUrlOtorisasi, validasiKodeOtorisasi } from "../lib/google";
import { auth, type AppEnv } from "../middleware/auth";

export const authRoutes = new Hono<AppEnv>();

/**
 * App deep-link schemes the login may return to: `sehati:` for the built APK,
 * `exp:`/`exps:` for Expo Go during development. Anything else is refused so the
 * callback cannot be used as an open redirect that leaks the authorization code.
 */
const SKEMA_KEMBALI = ["sehati:", "exp:", "exps:"];

function urlKembaliValid(kembali: unknown): URL | null {
  if (typeof kembali !== "string") return null;
  try {
    const url = new URL(kembali);
    return SKEMA_KEMBALI.includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

/**
 * Starts the Google login for the mobile app (LoginView.isiLoginPage).
 * Google only redirects to http(s) URIs, so the app opens this route in an auth
 * browser with `?kembali=<app deep link>`; the deep link travels in `state`.
 */
authRoutes.get("/google/mulai", (c) => {
  const kembali = urlKembaliValid(c.req.query("kembali"));
  if (!kembali) throw permintaanTidakValid("Parameter kembali harus berupa deep link aplikasi");
  return c.redirect(buatUrlOtorisasi(bacaConfig(c.env), kembali.toString()));
});

/**
 * `GOOGLE_REDIRECT_URI` points here. Forwards Google's `code` (or `error`) to the
 * app's deep link, which then calls `POST /api/auth/google` with the code.
 */
authRoutes.get("/google/callback", (c) => {
  const kembali = urlKembaliValid(c.req.query("state"));
  if (!kembali) throw permintaanTidakValid("State login Google tidak valid");

  const kode = c.req.query("code");
  if (kode) kembali.searchParams.set("code", kode);
  else kembali.searchParams.set("error", c.req.query("error") ?? "tidak_ada_kode");
  return c.redirect(kembali.toString());
});
/** Mounted at `/api`, so this router owns `GET /api/me`. */
export const meRoutes = new Hono<AppEnv>();

async function bacaBody(c: Context<AppEnv>): Promise<Record<string, unknown>> {
  try {
    const body = await c.req.json();
    if (!body || typeof body !== "object") throw new Error("not an object");
    return body as Record<string, unknown>;
  } catch {
    throw permintaanTidakValid("Body harus berupa JSON yang valid");
  }
}

/**
 * UC-11 — Algo-001 `autentikasiPengguna` (AuthController.kirimData, C-25).
 * Google code exchange -> auto-register on first login -> create session ->
 * store encrypted Google tokens -> return the app session token.
 */
authRoutes.post("/google", async (c) => {
  const body = await bacaBody(c);
  const kode = body.kodeOtorisasi ?? body.code;

  if (typeof kode !== "string" || kode.trim().length === 0) {
    throw gagalValidasi("kodeOtorisasi wajib diisi");
  }

  const cfg = bacaConfig(c.env);
  const kredensial = await validasiKodeOtorisasi(kode.trim(), cfg);
  if (!kredensial) throw gagalAuth("Kode otorisasi Google tidak valid");

  const db: Db = c.get("db");
  const { googleId, nama, email } = kredensial.profil;

  // Q-001
  let [pengguna] = await cariPenggunaGoogleId(db, googleId);

  if (!pengguna) {
    // Algo-001: automatic registration on first login.
    const idPengguna = randomUUID();
    await daftarPengguna(db, { idPengguna, nama, email, googleId, nim: nimDariEmail(email) });
    // Read back; concurrent first logins are safe thanks to ON CONFLICT DO NOTHING.
    [pengguna] = await cariPenggunaGoogleId(db, googleId);
    if (!pengguna) throw new Error("Gagal mendaftarkan pengguna baru");
  }

  const token = randomBytes(32).toString("hex");
  const waktuLogin = new Date().toISOString();

  // Q-031
  await buatSesi(db, { token, idPengguna: pengguna.idPengguna, waktuLogin });

  // Q-032 — tokens are AES-256-GCM encrypted before they touch D1.
  await simpanTokenGoogle(db, {
    idPengguna: pengguna.idPengguna,
    accessToken: await enkripsiAES256GCM(kredensial.accessToken, cfg.kunciToken),
    refreshToken: kredensial.refreshToken
      ? await enkripsiAES256GCM(kredensial.refreshToken, cfg.kunciToken)
      : null,
    kedaluwarsa: kredensial.kedaluwarsa,
  });

  return c.json({
    token,
    waktuLogin,
    pengguna: { idPengguna: pengguna.idPengguna, nama, email, peran: pengguna.peran },
  });
});

/**
 * Demo login (not in the DPPL; see M9 report B.1). Signs in as a seeded account
 * without Google. Disabled unless `MODE_DEMO=1`, and then answers 404 like any
 * unknown route so it does not exist on a normal deployment.
 */
authRoutes.post("/demo", async (c) => {
  if (!modeDemoAktif(c.env)) throw tidakDitemukan("Rute tidak ditemukan");

  const body = await bacaBody(c);
  const peran = body.peran;
  if (peran !== "mahasiswa" && peran !== "administrator") {
    throw gagalValidasi("peran harus 'mahasiswa' atau 'administrator'");
  }

  const db: Db = c.get("db");
  const [pengguna] = await peranPengguna(db, AKUN_DEMO[peran as Peran]);
  if (!pengguna || pengguna.peran !== peran) {
    throw tidakDitemukan("Akun demo belum ada. Jalankan seed basis data terlebih dahulu.");
  }

  const token = randomBytes(32).toString("hex");
  const waktuLogin = new Date().toISOString();
  await buatSesi(db, { token, idPengguna: pengguna.idPengguna, waktuLogin }); // Q-031

  return c.json({ token, waktuLogin, pengguna });
});

/** `logout()` — Q-003. */
authRoutes.post("/logout", auth, async (c) => {
  await akhiriSesi(c.get("db"), c.get("token"));
  return c.json({ ok: true });
});

/**
 * Algo-003 `daftarkanPerangkat` (Q-033 then Q-034), called after login
 * once notification permission is granted.
 */
authRoutes.post("/device", auth, async (c) => {
  const body = await bacaBody(c);
  const tokenPush = body.tokenPush ?? body.token_push;

  if (!validasiTokenPush(tokenPush)) {
    throw gagalValidasi("tokenPush harus berupa Expo push token");
  }

  await daftarPerangkat(c.get("db"), { tokenPush, token: c.get("token") });
  return c.json({ ok: true });
});

/** Current identity; lets the client pick the student or admin UI. */
meRoutes.get("/me", auth, async (c) => {
  const [akun] = await peranPengguna(c.get("db"), c.get("idPengguna"));
  if (!akun) throw gagalAuth();
  return c.json(akun);
});
