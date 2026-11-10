import type { AppConfig } from "../config";
import { dekripsiAES256GCM, enkripsiAES256GCM } from "./crypto";
import { gagalUpstream, gagalAuth } from "./errors";
import {
  bacaTokenGoogle,
  perbaruiAccessToken,
  type Db,
} from "../db/queries";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3";

/** Identity for login plus read access for the integrated calendar (UC-03, Algo-009/010). */
const SCOPE_GOOGLE = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.readonly",
].join(" ");

/**
 * Google's consent-screen URL. `state` is echoed back to the redirect URI.
 * `access_type=offline` + `prompt=consent` make Google return a refresh token,
 * which `ambilTokenValid` needs once the access token expires.
 */
export function buatUrlOtorisasi(cfg: AppConfig, state: string): string {
  const url = new URL(GOOGLE_AUTH_URL);
  url.search = new URLSearchParams({
    client_id: cfg.googleClientId,
    redirect_uri: cfg.googleRedirectUri,
    response_type: "code",
    scope: SCOPE_GOOGLE,
    access_type: "offline",
    prompt: "select_account consent",
    state,
  }).toString();
  return url.toString();
}

/* -------------------------------------------------------------------------- */
/* GoogleAuthService (C-34) — Algo-027                                        */
/* -------------------------------------------------------------------------- */

export interface KredensialGoogle {
  accessToken: string;
  refreshToken: string | null;
  /** Absolute expiry, ISO-8601. */
  kedaluwarsa: string;
  profil: { googleId: string; nama: string; email: string };
}

/** Decodes the payload of a Google `id_token` (JWT) without re-verifying it. */
function bacaPayloadIdToken(idToken: string): {
  sub?: string;
  name?: string;
  email?: string;
} {
  const parts = idToken.split(".");
  if (parts.length < 2) return {};
  const payload = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
  const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
  try {
    return JSON.parse(atob(padded)) as { sub?: string; name?: string; email?: string };
  } catch {
    return {};
  }
}

/**
 * `GoogleAuthService.validasi(kodeOtorisasi)` — Algo-027.
 * Exchanges the authorization code for tokens at Google's token endpoint.
 * Returns `null` when Google rejects the code.
 */
export async function validasiKodeOtorisasi(
  kodeOtorisasi: string,
  cfg: AppConfig,
): Promise<KredensialGoogle | null> {
  const body = new URLSearchParams({
    code: kodeOtorisasi,
    client_id: cfg.googleClientId,
    client_secret: cfg.googleClientSecret,
    redirect_uri: cfg.googleRedirectUri,
    grant_type: "authorization_code",
  });

  const respons = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (respons.status !== 200) return null;

  const data = (await respons.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    id_token?: string;
  };
  if (!data.access_token) return null;

  const profil = data.id_token ? bacaPayloadIdToken(data.id_token) : {};
  if (!profil.sub || !profil.email) {
    throw gagalAuth("Token Google tidak memuat identitas pengguna");
  }

  const kedaluwarsa = new Date(
    Date.now() + (data.expires_in ?? 3600) * 1000,
  ).toISOString();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    kedaluwarsa,
    profil: {
      googleId: profil.sub,
      nama: profil.name ?? profil.email.split("@")[0] ?? "Pengguna Sehati",
      email: profil.email,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* GoogleCalendarService (C-08) — Algo-009 ambilTokenValid                    */
/* -------------------------------------------------------------------------- */

/** Returns a usable Google access token, refreshing it when expired (Q-009/Q-010). */
export async function ambilTokenValid(
  db: Db,
  idPengguna: string,
  cfg: AppConfig,
): Promise<string> {
  const [baris] = await bacaTokenGoogle(db, idPengguna);
  if (!baris) throw gagalAuth("Akun belum menghubungkan Google Calendar");

  const access = await dekripsiAES256GCM(baris.accessToken, cfg.kunciToken);
  if (Date.now() < new Date(baris.kedaluwarsa).getTime()) return access;

  if (!baris.refreshToken) {
    throw gagalAuth("Access token Google kedaluwarsa dan tidak ada refresh token");
  }
  const refresh = await dekripsiAES256GCM(baris.refreshToken, cfg.kunciToken);

  const respons = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
      client_id: cfg.googleClientId,
      client_secret: cfg.googleClientSecret,
    }),
  });
  if (respons.status !== 200) {
    throw gagalUpstream("Gagal memperbarui access token Google");
  }

  const baru = (await respons.json()) as { access_token: string; expires_in?: number };
  const kedaluwarsa = new Date(Date.now() + (baru.expires_in ?? 3600) * 1000).toISOString();
  await perbaruiAccessToken(db, {
    accessToken: await enkripsiAES256GCM(baru.access_token, cfg.kunciToken),
    kedaluwarsa,
    idPengguna,
  });
  return baru.access_token;
}

export interface EventGoogle {
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

/** `ambilKalender()` — Algo-009. Throws 502 when Google fails. */
export async function ambilEventGoogle(
  accessToken: string,
  timeMin: string,
  timeMax: string,
): Promise<EventGoogle[]> {
  const url = new URL(`${CALENDAR_BASE}/calendars/primary/events`);
  url.searchParams.set("timeMin", timeMin);
  url.searchParams.set("timeMax", timeMax);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");

  const respons = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (respons.status !== 200) {
    throw gagalUpstream("Gagal mengambil event Google Calendar");
  }
  const data = (await respons.json()) as { items?: EventGoogle[] };
  return data.items ?? [];
}

/** `cekBentrokJadwal(jadwal)` — Algo-010. True when the user is busy in the window. */
export async function cekBentrokGoogle(
  accessToken: string,
  waktu: string,
  waktuSelesai: string,
): Promise<boolean> {
  const respons = await fetch(`${CALENDAR_BASE}/freeBusy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: waktu,
      timeMax: waktuSelesai,
      items: [{ id: "primary" }],
    }),
  });
  if (respons.status !== 200) {
    throw gagalUpstream("Gagal memeriksa bentrok Google Calendar");
  }
  const data = (await respons.json()) as {
    calendars?: Record<string, { busy?: unknown[] }>;
  };
  return (data.calendars?.primary?.busy?.length ?? 0) > 0;
}
