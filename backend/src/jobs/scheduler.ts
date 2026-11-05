import { drizzle } from "drizzle-orm/d1";
import { randomUUID } from "node:crypto";
import * as schema from "../db/schema";
import {
  afirmasiJatuhTempo,
  ambilTokenPush,
  catatNotifikasi,
  catatStatus,
  hapusTokenPush,
  reminderJatuhTempo,
} from "../db/queries";
import { TEKS_PENGINGAT, type JenisStatus } from "../config";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const BATCH_SIZE = 100;

/** WIB (UTC+7) "HH:MM", the format stored in `daily_affirmation.waktu_kirim` / `reminder.waktu`. */
export function jamMenitWib(sekarang = new Date()): string {
  const wib = new Date(sekarang.getTime() + 7 * 60 * 60 * 1000);
  return `${String(wib.getUTCHours()).padStart(2, "0")}:${String(wib.getUTCMinutes()).padStart(2, "0")}`;
}

interface PesanExpo {
  to: string;
  title: string;
  body: string;
  sound?: "default";
}

/**
 * Algo-008 `kirimNotifikasi` — sends via the Expo Push API in batches of ≤100
 * and clears tokens Expo rejects with `DeviceNotRegistered` (Q-008).
 */
export async function kirimPush(db: ReturnType<typeof drizzle<typeof schema>>, pesan: PesanExpo[]) {
  for (let i = 0; i < pesan.length; i += BATCH_SIZE) {
    const batch = pesan.slice(i, i + BATCH_SIZE);
    const respons = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });
    if (respons.status !== 200) continue;

    const data = (await respons.json()) as {
      data?: { status?: string; details?: { error?: string } }[];
    };
    for (const [index, hasil] of (data.data ?? []).entries()) {
      if (hasil.status === "error" && hasil.details?.error === "DeviceNotRegistered") {
        const token = batch[index]?.to;
        if (token) await hapusTokenPush(db, token);
      }
    }
  }
}

/** Algo-005 `kirimAfirmasi` — runs every minute. */
async function jalankanAfirmasi(env: Env, db: ReturnType<typeof drizzle<typeof schema>>) {
  const jamMenit = jamMenitWib();
  const daftar = await afirmasiJatuhTempo(db, jamMenit); // Q-004
  if (daftar.length === 0) return;

  const pesan: PesanExpo[] = [];
  for (const a of daftar) {
    const tokens = await ambilTokenPush(db, a.idMahasiswa); // Q-007
    for (const { tokenPush } of tokens) {
      if (tokenPush) pesan.push({ to: tokenPush, title: "Afirmasi hari ini", body: a.konten });
    }
    await catatNotifikasi(db, {
      idNotifikasi: randomUUID(), // Q-006
      idMahasiswa: a.idMahasiswa,
      idAffirmation: a.idAffirmation,
      idReminder: null,
      isi: a.konten,
      waktuKirim: new Date().toISOString(),
    });
  }

  if (pesan.length > 0) await kirimPush(db, pesan);
  console.log(`[cron] afirmasi ${jamMenit}: ${daftar.length} pengingat`);
}

/** Algo-007 `kirimPengingat` — runs every minute. */
async function jalankanPengingat(env: Env, db: ReturnType<typeof drizzle<typeof schema>>) {
  const jamMenit = jamMenitWib();
  const daftar = await reminderJatuhTempo(db, jamMenit); // Q-005
  if (daftar.length === 0) return;

  const pesan: PesanExpo[] = [];
  for (const r of daftar) {
    const isi = TEKS_PENGINGAT[r.jenis];
    const tokens = await ambilTokenPush(db, r.idMahasiswa); // Q-007
    for (const { tokenPush } of tokens) {
      if (tokenPush) pesan.push({ to: tokenPush, title: "Pengingat kesehatan", body: isi });
    }
    await catatNotifikasi(db, {
      idNotifikasi: randomUUID(), // Q-006
      idMahasiswa: r.idMahasiswa,
      idAffirmation: null,
      idReminder: r.idReminder,
      isi,
      waktuKirim: new Date().toISOString(),
    });
  }

  if (pesan.length > 0) await kirimPush(db, pesan);
  console.log(`[cron] pengingat ${jamMenit}: ${daftar.length} pengingat`);
}

/**
 * Algo-021 `cekStatusServer` — probes the website and server endpoints
 * (5 s timeout) and records a `status_server` row (Q-018).
 */
async function jalankanCekStatus(env: Env, db: ReturnType<typeof drizzle<typeof schema>>) {
  const origin = (env as unknown as Record<string, string | undefined>).API_BASE_URL ?? "";
  const target: Record<JenisStatus, string> = {
    website: origin ? `${origin}/health` : "",
    server: origin ? `${origin}/health` : "",
  };

  for (const jenis of Object.keys(target) as JenisStatus[]) {
    const alamat = target[jenis];
    let up = false;
    if (alamat) {
      try {
        const respons = await fetch(alamat, {
          method: "GET",
          signal: AbortSignal.timeout(5000),
        });
        up = respons.status >= 200 && respons.status <= 299;
      } catch {
        up = false;
      }
    }
    await catatStatus(db, {
      jenis,
      statusUptime: up,
      waktuCek: new Date().toISOString(), // Q-018
    });
  }
}

/** Cloudflare Cron Trigger entrypoint. */
export async function scheduled(
  _event: ScheduledController,
  env: Env,
  ctx: ExecutionContext,
) {
  const db = drizzle(env.D1, { schema });
  ctx.waitUntil(
    (async () => {
      await jalankanAfirmasi(env, db);
      await jalankanPengingat(env, db);
      await jalankanCekStatus(env, db);
    })(),
  );
}
