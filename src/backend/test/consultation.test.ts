import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import app from "../src/index";
import { buatDbUji, buatSesiUji } from "./harness";
import { json, minta } from "./util";

const SLOT_1 = "2031-06-01T03:00:00Z";
const SLOT_1_END = "2031-06-01T04:00:00Z";
/** The seeded slots are in 2031, outside the default window (now to +30 days). */
const JALUR_KALENDER = "/api/calendar?dari=2031-05-31T00:00:00Z&sampai=2031-06-08T00:00:00Z";

function seedJadwal(ctx: ReturnType<typeof buatDbUji>) {
  ctx.raw.exec(`
    INSERT INTO konsultan (id_konsultan, nama, spesialisasi) VALUES
      ('k1', 'Dr. Raisa', 'Psikologi Klinis'),
      ('k2', 'Bagas, M.Pd.', 'Konseling');
    INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status) VALUES
      ('j1', 'k1', '${SLOT_1}', '${SLOT_1_END}', 'tersedia'),
      ('j2', 'k1', '2031-06-02T03:00:00Z', '2031-06-02T04:00:00Z', 'tersedia');
  `);
}

describe("ConsultationController — daftar & slot (C-29)", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let mhs: string;
  let admin: string;

  beforeEach(() => {
    ctx = buatDbUji();
    seedJadwal(ctx);
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
  });
  afterEach(() => ctx.tutup());

  test("GET /api/consultants terurut berdasarkan nama (Q-012)", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/consultants", token: mhs }));
    expect(body.consultants.map((k: any) => k.idKonsultan)).toEqual(["k2", "k1"]);
  });

  test("GET /api/consultants/:id/slots mengembalikan slot mendatang (Q-014)", async () => {
    const body = await json(
      await minta(app, ctx.D1, { path: "/api/consultants/k1/slots", token: mhs }),
    );
    expect(body.slots.map((s: any) => s.idJadwal)).toEqual(["j1", "j2"]);
    expect(body.slots[0]).toHaveProperty("waktuSelesai");
  });

  test("GET slots menyembunyikan semua slot pada hari yang sudah memiliki sesi Sehati", async () => {
    ctx.raw.exec(`
      INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status, id_mahasiswa)
      VALUES ('j-lama', 'k2', '2031-06-01T06:00:00Z', '2031-06-01T07:00:00Z', 'terpesan', 'mhs');
    `);
    const body = await json(await minta(app, ctx.D1, { path: "/api/consultants/k1/slots", token: mhs }));
    expect(body.slots.map((s: any) => s.idJadwal)).toEqual(["j2"]);
  });

  test("GET /api/consultants/:id/slots 404 untuk konsultan tak dikenal (Q-019)", async () => {
    const res = await minta(app, ctx.D1, { path: "/api/consultants/k9/slots", token: mhs });
    expect(res.status).toBe(404);
  });

  test("GET /api/sessions/next null bila belum ada pesanan (Q-042)", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/sessions/next", token: mhs }));
    expect(body.session).toBeNull();
  });

  test("POST /api/slots membuat slot baru (201)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots",
      token: admin,
      body: {
        idKonsultan: "k2",
        waktu: "2031-07-01T01:00:00Z",
        waktuSelesai: "2031-07-01T02:00:00Z",
      },
    });
    expect(res.status).toBe(201);
    const body = await json(res);
    const baris = ctx.raw
      .prepare("SELECT status FROM jadwal_konsultasi WHERE id_jadwal = ?")
      .get(body.idJadwal) as { status: string };
    expect(baris.status).toBe("tersedia");
  });

  test("POST /api/slots menolak konsultan tak terdaftar", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots",
      token: admin,
      body: { idKonsultan: "k9", waktu: SLOT_1, waktuSelesai: SLOT_1_END },
    });
    expect(res.status).toBe(422);
  });

  test("POST /api/slots menolak rentang terbalik", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots",
      token: admin,
      body: { idKonsultan: "k1", waktu: SLOT_1_END, waktuSelesai: SLOT_1 },
    });
    expect(res.status).toBe(422);
  });

  test("POST /api/slots 409 bila tumpang tindih slot konsultan sama (Q-020)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots",
      token: admin,
      body: {
        idKonsultan: "k1",
        waktu: "2031-06-01T03:30:00Z",
        waktuSelesai: "2031-06-01T04:30:00Z",
      },
    });
    expect(res.status).toBe(409);
    expect((await json(res)).error.kode).toBe("JADWAL_BENTROK");
  });

  test("slot konsultan berbeda boleh beririsan", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots",
      token: admin,
      body: {
        idKonsultan: "k2",
        waktu: "2031-06-01T03:30:00Z",
        waktuSelesai: "2031-06-01T04:30:00Z",
      },
    });
    expect(res.status).toBe(201);
  });

  test("mahasiswa tidak boleh membuat slot (403)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots",
      token: mhs,
      body: { idKonsultan: "k1", waktu: SLOT_1, waktuSelesai: SLOT_1_END },
    });
    expect(res.status).toBe(403);
  });

  test("PATCH /api/slots/:id mengubah jendela (Q-027)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PATCH",
      path: "/api/slots/j2",
      token: admin,
      body: { waktu: "2031-06-02T05:00:00Z", waktuSelesai: "2031-06-02T06:00:00Z" },
    });
    expect(res.status).toBe(200);

    const baris = ctx.raw
      .prepare("SELECT waktu, waktu_selesai FROM jadwal_konsultasi WHERE id_jadwal = 'j2'")
      .get() as { waktu: string; waktu_selesai: string };
    // Timestamps are canonicalised through Date#toISOString before persisting.
    expect(baris.waktu).toBe("2031-06-02T05:00:00.000Z");
    expect(baris.waktu_selesai).toBe("2031-06-02T06:00:00.000Z");
  });

  test("PATCH /api/slots/:id 404 untuk slot tak dikenal", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PATCH",
      path: "/api/slots/tidak-ada",
      token: admin,
      body: { waktu: SLOT_1, waktuSelesai: SLOT_1_END },
    });
    expect(res.status).toBe(404);
  });

  test("PATCH /api/slots/:id 409 bila hasil edit bertabrakan (Q-020)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PATCH",
      path: "/api/slots/j2",
      token: admin,
      body: { waktu: "2031-06-01T03:30:00Z", waktuSelesai: "2031-06-01T04:30:00Z" },
    });
    expect(res.status).toBe(409);
  });
});

describe("Algo-022 pemesanan sesi (mahasiswa)", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let mhs: string;
  let mhs2: string;
  let fetchAsli: typeof fetch;

  beforeEach(() => {
    ctx = buatDbUji();
    seedJadwal(ctx);
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    mhs2 = buatSesiUji(ctx.raw, { idPengguna: "mhs2", peran: "mahasiswa", token: "tm2" });
    fetchAsli = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = fetchAsli;
    vi.restoreAllMocks();
    ctx.tutup();
  });

  test("memesan slot tersedia -> terpesan (Q-028)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots/j1/book",
      token: mhs,
    });
    expect(res.status).toBe(200);

    const baris = ctx.raw
      .prepare("SELECT status, id_mahasiswa FROM jadwal_konsultasi WHERE id_jadwal = 'j1'")
      .get() as { status: string; id_mahasiswa: string };
    expect(baris).toEqual({ status: "terpesan", id_mahasiswa: "mhs" });
  });

  test("memesan dua kali -> 409 SLOT_SUDAH_DIPESAN", async () => {
    await minta(app, ctx.D1, { method: "POST", path: "/api/slots/j1/book", token: mhs });
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots/j1/book",
      token: mhs,
    });
    expect(res.status).toBe(409);
    expect((await json(res)).error.kode).toBe("SLOT_SUDAH_DIPESAN");
  });

  test("mahasiswa lain tidak bisa mengambil slot yang sudah dipesan", async () => {
    await minta(app, ctx.D1, { method: "POST", path: "/api/slots/j1/book", token: mhs });
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots/j1/book",
      token: mhs2,
    });
    expect(res.status).toBe(409);
  });

  test("dua mahasiswa bersamaan: hanya satu yang berhasil memesan slot yang sama", async () => {
    const hasil = await Promise.all([
      minta(app, ctx.D1, { method: "POST", path: "/api/slots/j1/book", token: mhs }),
      minta(app, ctx.D1, { method: "POST", path: "/api/slots/j1/book", token: mhs2 }),
    ]);
    expect(hasil.map((r) => r.status).sort()).toEqual([200, 409]);
    const baris = ctx.raw
      .prepare("SELECT status, id_mahasiswa FROM jadwal_konsultasi WHERE id_jadwal = 'j1'")
      .get() as { status: string; id_mahasiswa: string };
    expect(baris.status).toBe("terpesan");
    expect(["mhs", "mhs2"]).toContain(baris.id_mahasiswa);
  });

  test("slot tak dikenal -> 404", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots/tidak-ada/book",
      token: mhs,
    });
    expect(res.status).toBe(404);
  });

  test("409 bila mahasiswa sudah punya sesi lain yang beririsan (Q-011)", async () => {
    ctx.raw.exec(`
      INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status, id_mahasiswa)
      VALUES ('j-lama', 'k2', '2031-06-01T03:15:00Z', '2031-06-01T03:45:00Z', 'terpesan', 'mhs');
    `);

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots/j1/book",
      token: mhs,
    });
    expect(res.status).toBe(409);
    expect((await json(res)).error.kode).toBe("JADWAL_BENTROK");
  });

  test("menolak sesi lain pada hari yang sama meskipun jam tidak bertumpang tindih", async () => {
    ctx.raw.exec(`
      INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status, id_mahasiswa)
      VALUES ('j-lama', 'k2', '2031-06-01T08:00:00Z', '2031-06-01T09:00:00Z', 'terpesan', 'mhs');
    `);
    const res = await minta(app, ctx.D1, { method: "POST", path: "/api/slots/j1/book", token: mhs });
    expect(res.status).toBe(409);
    expect((await json(res)).error.kode).toBe("JADWAL_BENTROK");
  });

  test("override Google tidak melewati larangan sesi Sehati pada hari yang sama", async () => {
    ctx.raw.exec(`
      INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status, id_mahasiswa)
      VALUES ('j-lama', 'k2', '2031-06-01T08:00:00Z', '2031-06-01T09:00:00Z', 'terpesan', 'mhs');
    `);
    const res = await minta(app, ctx.D1, {
      method: "POST", path: "/api/slots/j1/book", token: mhs, body: { overrideGoogle: true },
    });
    expect(res.status).toBe(409);
    expect((await json(res)).error.kode).toBe("JADWAL_BENTROK");
  });

  test("409 bila Google Calendar menyatakan sibuk (Algo-010)", async () => {
    // Give the student an unexpired Google token so the freeBusy path is used.
    const { enkripsiAES256GCM } = await import("../src/lib/crypto");
    const { KUNCI_UJI } = await import("./harness");
    const enc = await enkripsiAES256GCM("ya29.akses", KUNCI_UJI);
    ctx.raw
      .prepare(
        "INSERT INTO token_google (id_pengguna, access_token, refresh_token, kedaluwarsa) VALUES (?,?,?,?)",
      )
      .run("mhs", enc, null, new Date(Date.now() + 3600_000).toISOString());

    globalThis.fetch = vi.fn(async (input: any) => {
      const url = String(input?.url ?? input);
      if (url.includes("freeBusy")) {
        return new Response(
          JSON.stringify({ calendars: { primary: { busy: [{ start: SLOT_1, end: SLOT_1_END }] } } }),
          { status: 200 },
        );
      }
      return new Response("{}", { status: 200 });
    }) as any;

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots/j1/book",
      token: mhs,
    });
    expect(res.status).toBe(409);
    expect((await json(res)).error.kode).toBe("GOOGLE_CALENDAR_CONFLICT");

    // The slot must remain available.
    const baris = ctx.raw
      .prepare("SELECT status FROM jadwal_konsultasi WHERE id_jadwal = 'j1'")
      .get() as { status: string };
    expect(baris.status).toBe("tersedia");
  });

  test("override melewati konflik Google Calendar tetapi tetap menyimpan sesi Sehati", async () => {
    const { enkripsiAES256GCM } = await import("../src/lib/crypto");
    const { KUNCI_UJI } = await import("./harness");
    const enc = await enkripsiAES256GCM("ya29.akses", KUNCI_UJI);
    ctx.raw.prepare("INSERT INTO token_google (id_pengguna, access_token, refresh_token, kedaluwarsa) VALUES (?,?,?,?)")
      .run("mhs", enc, null, new Date(Date.now() + 3600_000).toISOString());
    globalThis.fetch = vi.fn(async (input: any) => {
      if (String(input?.url ?? input).includes("freeBusy")) {
        return new Response(JSON.stringify({ calendars: { primary: { busy: [{ start: SLOT_1, end: SLOT_1_END }] } } }), { status: 200 });
      }
      return new Response("{}", { status: 200 });
    }) as any;
    const res = await minta(app, ctx.D1, { method: "POST", path: "/api/slots/j1/book", token: mhs, body: { overrideGoogle: true } });
    expect(res.status).toBe(200);
    const row = ctx.raw.prepare("SELECT status, id_mahasiswa FROM jadwal_konsultasi WHERE id_jadwal = 'j1'").get() as any;
    expect(row).toEqual({ status: "terpesan", id_mahasiswa: "mhs" });
  });

  test("pesanan muncul di /api/sessions/next", async () => {
    await minta(app, ctx.D1, { method: "POST", path: "/api/slots/j1/book", token: mhs });
    const body = await json(await minta(app, ctx.D1, { path: "/api/sessions/next", token: mhs }));
    expect(body.session).toMatchObject({
      idJadwal: "j1",
      nama: "Dr. Raisa",
      spesialisasi: "Psikologi Klinis",
    });
  });

  test("administrator tidak boleh memesan sesi (403)", async () => {
    const admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/slots/j1/book",
      token: admin,
    });
    expect(res.status).toBe(403);
  });
});

describe("CalendarController — Algo-011 gabungkanJadwal", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let mhs: string;
  let fetchAsli: typeof fetch;

  beforeEach(() => {
    ctx = buatDbUji();
    seedJadwal(ctx);
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    fetchAsli = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = fetchAsli;
    vi.restoreAllMocks();
    ctx.tutup();
  });

  test("menggabungkan event Google dan slot konsultasi, terurut", async () => {
    const { enkripsiAES256GCM } = await import("../src/lib/crypto");
    const { KUNCI_UJI } = await import("./harness");
    const enc = await enkripsiAES256GCM("ya29.akses", KUNCI_UJI);
    ctx.raw
      .prepare(
        "INSERT INTO token_google (id_pengguna, access_token, refresh_token, kedaluwarsa) VALUES (?,?,?,?)",
      )
      .run("mhs", enc, null, new Date(Date.now() + 3600_000).toISOString());

    globalThis.fetch = vi.fn(async (input: any) => {
      const url = String(input?.url ?? input);
      if (url.includes("/events")) {
        return new Response(
          JSON.stringify({
            items: [
              {
                summary: "Kuliah",
                start: { dateTime: "2031-06-01T01:00:00Z" },
                end: { dateTime: "2031-06-01T02:00:00Z" },
              },
            ],
          }),
          { status: 200 },
        );
      }
      return new Response("{}", { status: 200 });
    }) as any;

    const body = await json(
      await minta(app, ctx.D1, { path: JALUR_KALENDER, token: mhs }),
    );

    expect(body.peringatan).toBeUndefined();
    const judul = body.events.map((e: any) => e.judul);
    expect(judul).toContain("Kuliah");
    expect(judul).toContain("Slot konsultasi tersedia");
    // Sorted ascending by start time.
    const mulai = body.events.map((e: any) => e.mulai);
    expect([...mulai].sort()).toEqual(mulai);
  });

  test("hanya sesi milik sendiri yang tampil; slot hari yang sama hilang (issue #11)", async () => {
    buatSesiUji(ctx.raw, { idPengguna: "mhs2", peran: "mahasiswa", token: "tm2" });
    ctx.raw.exec(`
      UPDATE jadwal_konsultasi SET status = 'terpesan', id_mahasiswa = 'mhs' WHERE id_jadwal = 'j1';
      INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status, id_mahasiswa) VALUES
        ('j3', 'k2', '2031-06-01T07:00:00Z', '2031-06-01T08:00:00Z', 'tersedia', NULL),
        ('j4', 'k2', '2031-06-03T03:00:00Z', '2031-06-03T04:00:00Z', 'terpesan', 'mhs2');
    `);
    globalThis.fetch = vi.fn(async () => new Response("boom", { status: 500 })) as any;

    const body = await json(await minta(app, ctx.D1, { path: JALUR_KALENDER, token: mhs }));
    const kons = body.events.filter((e: any) => e.idJadwal);
    // j1 is mine and j2 (another day) is open; j3 (same day as j1) and j4 (booked by mhs2) are gone.
    expect(kons.map((e: any) => e.idJadwal)).toEqual(["j1", "j2"]);
    expect(kons[0]).toMatchObject({ milikSaya: true, konsultan: "Dr. Raisa", sumber: "terpesan" });
    expect(kons[1]).toMatchObject({ milikSaya: false, konsultan: "Dr. Raisa", sumber: "tersedia" });
  });

  test("Google gagal -> tetap mengembalikan slot + peringatan", async () => {
    const { enkripsiAES256GCM } = await import("../src/lib/crypto");
    const { KUNCI_UJI } = await import("./harness");
    const enc = await enkripsiAES256GCM("ya29.akses", KUNCI_UJI);
    ctx.raw
      .prepare(
        "INSERT INTO token_google (id_pengguna, access_token, refresh_token, kedaluwarsa) VALUES (?,?,?,?)",
      )
      .run("mhs", enc, null, new Date(Date.now() + 3600_000).toISOString());

    globalThis.fetch = vi.fn(async () => new Response("boom", { status: 500 })) as any;

    const res = await minta(app, ctx.D1, { path: JALUR_KALENDER, token: mhs });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.peringatan).toBeTruthy();
    expect(body.events.every((e: any) => e.sumber !== "google")).toBe(true);
  });
});
