import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { buatDbUji, buatSesiUji } from "./harness";
import { jamMenitWib, scheduled } from "../src/jobs/scheduler";

/** Builds the `scheduled()` event/context pair the Worker would receive. */
function konteks() {
  let selesai: Promise<unknown> = Promise.resolve();
  const ctx = {
    waitUntil: (p: Promise<unknown>) => {
      selesai = p;
    },
    passThroughOnException: () => {},
  } as unknown as ExecutionContext;
  return { ctx, tunggu: () => selesai };
}

function siapkanAfirmasiJatuhTempo(ctx: ReturnType<typeof buatDbUji>, tokenPush?: string) {
  const token = buatSesiUji(ctx.raw, {
    idPengguna: "mhs",
    peran: "mahasiswa",
    token: "tm",
    tokenPush: tokenPush ?? null,
  });
  ctx.raw
    .prepare(
      "INSERT INTO daily_affirmation (id_affirmation, id_mahasiswa, konten, waktu_kirim) VALUES (?,?,?,?)",
    )
    .run("a1", "mhs", "Semangat hari ini!", jamMenitWib());
  return token;
}

describe("Algo-005 kirimAfirmasi (cron)", () => {
  let fetchAsli: typeof fetch;

  beforeEach(() => {
    fetchAsli = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = fetchAsli;
    vi.restoreAllMocks();
  });

  test("mencatat Notifikasi untuk afirmasi yang jatuh tempo (Q-004/Q-006)", async () => {
    const ctx = buatDbUji();
    siapkanAfirmasiJatuhTempo(ctx);

    globalThis.fetch = vi.fn(async (input: any) => {
      const url = String(input?.url ?? input);
      if (url.includes("/health")) return new Response("ok", { status: 200 });
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }) as any;

    const { ctx: ectx, tunggu } = konteks();
    await scheduled({} as any, { ...ctx, D1: ctx.D1 } as any, ectx);
    await tunggu();

    const rows = ctx.raw
      .prepare("SELECT id_mahasiswa, id_affirmation, id_reminder, isi FROM notifikasi")
      .all() as any[];
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      id_mahasiswa: "mhs",
      id_affirmation: "a1",
      id_reminder: null,
      isi: "Semangat hari ini!",
    });
    ctx.tutup();
  });

  test("tidak melakukan apa pun bila jam tidak cocok", async () => {
    const ctx = buatDbUji();
    buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    ctx.raw
      .prepare(
        "INSERT INTO daily_affirmation (id_affirmation, id_mahasiswa, konten, waktu_kirim) VALUES (?,?,?,?)",
      )
      .run("a1", "mhs", "nanti", "00:01");

    globalThis.fetch = vi.fn(async () => new Response("{}", { status: 200 })) as any;

    const { ctx: ectx, tunggu } = konteks();
    await scheduled({} as any, { ...ctx, D1: ctx.D1 } as any, ectx);
    await tunggu();

    const n = ctx.raw.prepare("SELECT COUNT(*) AS n FROM notifikasi").get() as { n: number };
    // Unless the test runs exactly at 00:01 WIB, nothing is recorded.
    expect(n.n).toBe(jamMenitWib() === "00:01" ? 1 : 0);
    ctx.tutup();
  });

  test("mengirim push ke sesi aktif dengan token perangkat (Q-007)", async () => {
    const ctx = buatDbUji();
    siapkanAfirmasiJatuhTempo(ctx, "ExpoPushToken[hp-1]");

    const dikirim: any[] = [];
    globalThis.fetch = vi.fn(async (input: any, init?: any) => {
      const url = String(input?.url ?? input);
      if (url.includes("exp.host")) {
        dikirim.push(JSON.parse(init.body));
        return new Response(JSON.stringify({ data: [{ status: "ok" }] }), { status: 200 });
      }
      return new Response("ok", { status: 200 });
    }) as any;

    const { ctx: ectx, tunggu } = konteks();
    await scheduled({} as any, { ...ctx, D1: ctx.D1 } as any, ectx);
    await tunggu();

    expect(dikirim).toHaveLength(1);
    expect(dikirim[0][0]).toMatchObject({ to: "ExpoPushToken[hp-1]", body: "Semangat hari ini!" });
    ctx.tutup();
  });

  test("mengosongkan token yang ditolak DeviceNotRegistered (Q-008)", async () => {
    const ctx = buatDbUji();
    siapkanAfirmasiJatuhTempo(ctx, "ExpoPushToken[mati]");

    globalThis.fetch = vi.fn(async (input: any) => {
      const url = String(input?.url ?? input);
      if (url.includes("exp.host")) {
        return new Response(
          JSON.stringify({
            data: [{ status: "error", details: { error: "DeviceNotRegistered" } }],
          }),
          { status: 200 },
        );
      }
      return new Response("ok", { status: 200 });
    }) as any;

    const { ctx: ectx, tunggu } = konteks();
    await scheduled({} as any, { ...ctx, D1: ctx.D1 } as any, ectx);
    await tunggu();

    const sesi = ctx.raw
      .prepare("SELECT token_push FROM sesi_autentikasi WHERE token = 'tm'")
      .get() as { token_push: string | null };
    expect(sesi.token_push).toBeNull();
    ctx.tutup();
  });

  test("mengirim push dalam batch maksimal 100 pesan", async () => {
    const ctx = buatDbUji();
    for (let i = 0; i < 150; i++) {
      buatSesiUji(ctx.raw, {
        idPengguna: `mhs${i}`,
        peran: "mahasiswa",
        token: `tm${i}`,
        tokenPush: `ExpoPushToken[hp-${i}]`,
      });
      ctx.raw
        .prepare(
          "INSERT INTO daily_affirmation (id_affirmation, id_mahasiswa, konten, waktu_kirim) VALUES (?,?,?,?)",
        )
        .run(`a${i}`, `mhs${i}`, "halo", jamMenitWib());
    }

    const ukuranBatch: number[] = [];
    globalThis.fetch = vi.fn(async (input: any, init?: any) => {
      const url = String(input?.url ?? input);
      if (url.includes("exp.host")) {
        const body = JSON.parse(init.body);
        ukuranBatch.push(body.length);
        return new Response(JSON.stringify({ data: body.map(() => ({ status: "ok" })) }), {
          status: 200,
        });
      }
      return new Response("ok", { status: 200 });
    }) as any;

    const { ctx: ectx, tunggu } = konteks();
    await scheduled({} as any, { ...ctx, D1: ctx.D1 } as any, ectx);
    await tunggu();

    expect(ukuranBatch).toEqual([100, 50]);
    ctx.tutup();
  });
});

describe("Algo-007 kirimPengingat (cron)", () => {
  afterEach(() => vi.restoreAllMocks());

  test("memakai teks pengingat sesuai jenis dan mencatat Notifikasi (Q-005)", async () => {
    const ctx = buatDbUji();
    buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    ctx.raw
      .prepare("INSERT INTO reminder (id_reminder, id_mahasiswa, jenis, waktu) VALUES (?,?,?,?)")
      .run("r1", "mhs", "olahraga", jamMenitWib());

    globalThis.fetch = vi.fn(async (input: any) => {
      const url = String(input?.url ?? input);
      if (url.includes("/health")) return new Response("ok", { status: 200 });
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }) as any;

    const { ctx: ectx, tunggu } = konteks();
    await scheduled({} as any, { ...ctx, D1: ctx.D1 } as any, ectx);
    await tunggu();

    const row = ctx.raw
      .prepare("SELECT id_reminder, id_affirmation, isi FROM notifikasi")
      .get() as any;
    expect(row.id_reminder).toBe("r1");
    expect(row.id_affirmation).toBeNull();
    expect(row.isi).toMatch(/olahraga/i);
    ctx.tutup();
  });
});

describe("Algo-021 cekStatusServer (cron)", () => {
  let fetchAsli: typeof fetch;
  beforeEach(() => {
    fetchAsli = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = fetchAsli;
    vi.restoreAllMocks();
  });

  test("mencatat status website dan server (Q-018)", async () => {
    const ctx = buatDbUji();
    globalThis.fetch = vi.fn(async () => new Response("ok", { status: 200 })) as any;

    const { ctx: ectx, tunggu } = konteks();
    await scheduled(
      {} as any,
      { D1: ctx.D1, API_BASE_URL: "https://sehati.test" } as any,
      ectx,
    );
    await tunggu();

    const rows = ctx.raw
      .prepare("SELECT jenis, status_uptime FROM status_server ORDER BY jenis")
      .all() as { jenis: string; status_uptime: number }[];
    expect(rows).toEqual([
      { jenis: "server", status_uptime: 1 },
      { jenis: "website", status_uptime: 1 },
    ]);
    ctx.tutup();
  });

  test("mencatat down ketika probe gagal atau non-2xx", async () => {
    const ctx = buatDbUji();
    globalThis.fetch = vi.fn(async () => new Response("gagal", { status: 503 })) as any;

    const { ctx: ectx, tunggu } = konteks();
    await scheduled(
      {} as any,
      { D1: ctx.D1, API_BASE_URL: "https://sehati.test" } as any,
      ectx,
    );
    await tunggu();

    const rows = ctx.raw
      .prepare("SELECT status_uptime FROM status_server")
      .all() as { status_uptime: number }[];
    expect(rows.every((r) => r.status_uptime === 0)).toBe(true);
    ctx.tutup();
  });

  test("tanpa API_BASE_URL tetap mencatat pemeriksaan (down)", async () => {
    const ctx = buatDbUji();
    globalThis.fetch = vi.fn(async () => new Response("ok", { status: 200 })) as any;

    const { ctx: ectx, tunggu } = konteks();
    await scheduled({} as any, { D1: ctx.D1 } as any, ectx);
    await tunggu();

    const n = ctx.raw.prepare("SELECT COUNT(*) AS n FROM status_server").get() as { n: number };
    expect(n.n).toBe(2);
    ctx.tutup();
  });
});
