import { afterEach, beforeEach, describe, expect, test } from "vitest";
import app from "../src/index";
import { buatDbUji, buatSesiUji } from "./harness";
import { json, minta } from "./util";

describe("AffirmationController (C-26) / Algo-028", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let mhs: string;

  beforeEach(() => {
    ctx = buatDbUji();
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
  });
  afterEach(() => ctx.tutup());

  test("GET /api/affirmation null bila belum diatur", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/affirmation", token: mhs }));
    expect(body.affirmation).toBeNull();
  });

  test("PUT pertama membuat baris baru dengan KONTEN_BAWAAN (Q-023)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/affirmation/time",
      token: mhs,
      body: { waktu: "07:30" },
    });
    expect(res.status).toBe(200);

    const baris = ctx.raw
      .prepare("SELECT konten, waktu_kirim FROM daily_affirmation WHERE id_mahasiswa = 'mhs'")
      .get() as { konten: string; waktu_kirim: string };
    expect(baris.waktu_kirim).toBe("07:30");
    expect(baris.konten.length).toBeGreaterThan(0);
  });

  test("PUT kedua mengubah baris yang sama, bukan menambah (Q-022)", async () => {
    await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/affirmation/time",
      token: mhs,
      body: { waktu: "07:30" },
    });
    await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/affirmation/time",
      token: mhs,
      body: { waktu: "09:15" },
    });

    const jumlah = ctx.raw.prepare("SELECT COUNT(*) AS n FROM daily_affirmation").get() as {
      n: number;
    };
    expect(jumlah.n).toBe(1);

    const body = await json(await minta(app, ctx.D1, { path: "/api/affirmation", token: mhs }));
    expect(body.affirmation.waktuKirim).toBe("09:15");
  });

  test("menolak format waktu salah (Algo-023)", async () => {
    for (const waktu of ["7:30", "24:00", "abc", "", 730]) {
      const res = await minta(app, ctx.D1, {
        method: "PUT",
        path: "/api/affirmation/time",
        token: mhs,
        body: { waktu },
      });
      expect(res.status).toBe(422);
    }
  });

  test("administrator ditolak (403)", async () => {
    const admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    const res = await minta(app, ctx.D1, { path: "/api/affirmation", token: admin });
    expect(res.status).toBe(403);
  });

  test("DELETE menghentikan pengiriman lalu GET kembali null (I-04-03)", async () => {
    await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/affirmation/time",
      token: mhs,
      body: { waktu: "07:30" },
    });

    const res = await minta(app, ctx.D1, { method: "DELETE", path: "/api/affirmation", token: mhs });
    expect(res.status).toBe(200);
    expect(await json(res)).toEqual({ ok: true });

    const jumlah = ctx.raw.prepare("SELECT COUNT(*) AS n FROM daily_affirmation").get() as {
      n: number;
    };
    expect(jumlah.n).toBe(0);

    const body = await json(await minta(app, ctx.D1, { path: "/api/affirmation", token: mhs }));
    expect(body.affirmation).toBeNull();
  });

  test("DELETE tanpa afirmasi tetap 200 (idempoten)", async () => {
    const res = await minta(app, ctx.D1, { method: "DELETE", path: "/api/affirmation", token: mhs });
    expect(res.status).toBe(200);
  });

  test("DELETE oleh administrator ditolak (403)", async () => {
    const admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    const res = await minta(app, ctx.D1, {
      method: "DELETE",
      path: "/api/affirmation",
      token: admin,
    });
    expect(res.status).toBe(403);
  });
});

describe("ReminderController (C-27) / Algo-028", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let mhs: string;

  beforeEach(() => {
    ctx = buatDbUji();
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
  });
  afterEach(() => ctx.tutup());

  test("GET /api/reminders selalu mengembalikan tiga jenis", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/reminders", token: mhs }));
    expect(body.reminders).toEqual([
      { jenis: "makan", waktu: null },
      { jenis: "tidur", waktu: null },
      { jenis: "olahraga", waktu: null },
    ]);
  });

  test("PUT per jenis membuat lalu mengubah baris (Q-024/Q-025/Q-026)", async () => {
    await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/reminders/makan",
      token: mhs,
      body: { waktu: "12:00" },
    });
    await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/reminders/makan",
      token: mhs,
      body: { waktu: "12:30" },
    });
    await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/reminders/tidur",
      token: mhs,
      body: { waktu: "22:00" },
    });

    const baris = ctx.raw
      .prepare("SELECT jenis, waktu FROM reminder WHERE id_mahasiswa = 'mhs' ORDER BY jenis")
      .all() as { jenis: string; waktu: string }[];
    expect(baris).toEqual([
      { jenis: "makan", waktu: "12:30" },
      { jenis: "tidur", waktu: "22:00" },
    ]);

    const body = await json(await minta(app, ctx.D1, { path: "/api/reminders", token: mhs }));
    expect(body.reminders).toEqual([
      { jenis: "makan", waktu: "12:30" },
      { jenis: "tidur", waktu: "22:00" },
      { jenis: "olahraga", waktu: null },
    ]);
  });

  test("menolak jenis di luar enum", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/reminders/mandi",
      token: mhs,
      body: { waktu: "07:00" },
    });
    expect(res.status).toBe(422);
  });

  test("menolak waktu tidak valid", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/reminders/makan",
      token: mhs,
      body: { waktu: "25:00" },
    });
    expect(res.status).toBe(422);
  });
});
