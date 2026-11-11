/**
 * Runtime configuration, read from Worker bindings/env.
 * Source: M8 DPPL2 Algo-001 (KUNCI_TOKEN, DOMAIN_KAMPUS), Algo-002 (BATAS_SESI),
 * Algo-027 (Google OAuth client), Algo-028 (KONTEN_BAWAAN).
 */

/** App session lifetime in ms (Algo-002: `waktu sekarang - sesi.waktu_login > BATAS_SESI`). */
export const BATAS_SESI_HARI = 30;
export const BATAS_SESI_MS = BATAS_SESI_HARI * 24 * 60 * 60 * 1000; // 30 days in ms

/** Domains whose local-part becomes `mahasiswa.nim` (Algo-001). */
export const DOMAIN_KAMPUS = ["std.stei.itb.ac.id", "mahasiswa.itb.ac.id"] as const;

/** Default affirmation content on first set (Algo-028 / Q-023 "KONTEN_BAWAAN"). */
export const KONTEN_BAWAAN =
  "Hari ini kamu sudah melakukan yang terbaik. Tarik napas, dan beri dirimu ruang untuk beristirahat.";

export type JenisReminder = "makan" | "tidur" | "olahraga";
export type JenisStatus = "website" | "server";
export type Peran = "mahasiswa" | "administrator";

/**
 * Seeded accounts (`seed/seed.sql`) that demo login signs in as, so assistants can
 * try both roles without a campus Google account. Only active when `MODE_DEMO=1`.
 */
export const AKUN_DEMO: Record<Peran, string> = {
  mahasiswa: "seed-usr-mhs",
  administrator: "seed-usr-adm",
};

/** True when the Worker var `MODE_DEMO` is `"1"`. Off by default. */
export function modeDemoAktif(env: Env): boolean {
  return read(env, "MODE_DEMO") === "1";
}

export const JENIS_REMINDER: readonly JenisReminder[] = ["makan", "tidur", "olahraga"];
export const JENIS_STATUS: readonly JenisStatus[] = ["website", "server"];

/** Push copy per `jenis` (Algo-007 `teksPengingat(jenis)`). */
export const TEKS_PENGINGAT: Record<JenisReminder, string> = {
  makan: "Waktunya makan. Jangan lewati asupan hari ini.",
  tidur: "Waktunya tidur. Tubuhmu butuh istirahat yang cukup.",
  olahraga: "Waktunya olahraga. Gerakkan tubuhmu sebentar, ya.",
};

export interface AppConfig {
  /** 32-byte AES-256-GCM key, base64 (KUNCI_TOKEN). */
  kunciToken: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  /** Base URL of this API; used by `cekStatusServer` (Algo-021). */
  apiBaseUrl: string;
}

function read(env: Env, name: string): string | undefined {
  const value = (env as unknown as Record<string, unknown>)[name];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function required(env: Env, name: string): string {
  const value = read(env, name);
  if (!value) throw new Error(`Missing required binding/env: ${name}`);
  return value;
}

export function bacaConfig(env: Env): AppConfig {
  return {
    kunciToken: required(env, "KUNCI_TOKEN"),
    googleClientId: required(env, "GOOGLE_CLIENT_ID"),
    googleClientSecret: required(env, "GOOGLE_CLIENT_SECRET"),
    googleRedirectUri: required(env, "GOOGLE_REDIRECT_URI"),
    apiBaseUrl: read(env, "API_BASE_URL") ?? "",
  };
}

/** Derives `mahasiswa.nim` from a campus email, or `null` (Algo-001). */
export function nimDariEmail(email: string): string | null {
  const [local, domain] = email.toLowerCase().split("@");
  if (!local || !domain) return null;
  return (DOMAIN_KAMPUS as readonly string[]).includes(domain) ? local : null;
}
