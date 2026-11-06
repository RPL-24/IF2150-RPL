import { afterEach, beforeEach, describe, expect, test } from "vitest";
import app from "../src/index";
import { buatDbUji, buatSesiUji } from "./harness";
import { json, minta } from "./util";

describe("FAQ (C-30)", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let admin: string;
  let mhs: string;

  beforeEach(() => {
    ctx = buatDbUji(`
      INSERT INTO faq (id_faq, pertanyaan, jawaban) VALUES
        ('f1', 'Apa itu Sehati?', 'Aplikasi kesehatan mental.'),
        ('f2', 'Cara pesan sesi?', 'Buka menu konsultasi.'),
        ('f3', 'Diskon 100%?', 'Tidak ada diskon.');
    `);
    admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
  });
  afterEach(() => ctx.tutup());

  test("GET /api/faq mengembalikan seluruh FAQ terurut (Q-015)", async () => {
    const res = await minta(app, ctx.D1, { path: "/api/faq", token: mhs });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.faq.map((f: any) => f.idFaq)).toEqual(["f1", "f2", "f3"]);
  });

  test("GET /api/faq?q= mencari pertanyaan maupun jawaban (Algo-017)", async () => {
    const res = await minta(app, ctx.D1, { path: "/api/faq?q=pesan", token: mhs });
    const body = await json(res);
    expect(body.faq.map((f: any) => f.idFaq)).toEqual(["f2"]);
  });

  test("pencarian meng-escape wildcard LIKE", async () => {
    // '100%' must match literally, not act as a wildcard.
    const kena = await json(await minta(app, ctx.D1, { path: "/api/faq?q=100%25", token: mhs }));
    expect(kena.faq.map((f: any) => f.idFaq)).toEqual(["f3"]);

    // A bare '%' is escaped, so it matches only text containing '%'.
    const kosong = await json(await minta(app, ctx.D1, { path: "/api/faq?q=_", token: mhs }));
    expect(kosong.faq).toEqual([]);
  });

  test("keyword kosong menampilkan semua", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/faq?q=%20%20", token: mhs }));
    expect(body.faq).toHaveLength(3);
  });

  test("POST /api/faq membuat FAQ baru (Q-035)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/faq",
      token: admin,
      body: { pertanyaan: "Baru?", jawaban: "Ya." },
    });
    expect(res.status).toBe(201);
    const body = await json(res);
    expect(body.idFaq).toBeTruthy();

    const baris = ctx.raw
      .prepare("SELECT pertanyaan FROM faq WHERE id_faq = ?")
      .get(body.idFaq) as { pertanyaan: string };
    expect(baris.pertanyaan).toBe("Baru?");
  });

  test("POST /api/faq menolak isian kosong (Algo-026)", async () => {
    for (const body of [
      { pertanyaan: "", jawaban: "x" },
      { pertanyaan: "x", jawaban: "   " },
      { pertanyaan: "x" },
    ]) {
      const res = await minta(app, ctx.D1, { method: "POST", path: "/api/faq", token: admin, body });
      expect(res.status).toBe(422);
    }
  });

  test("PUT /api/faq/:id mengubah FAQ (Q-036)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/faq/f1",
      token: admin,
      body: { pertanyaan: "Apa itu Sehati? (revisi)", jawaban: "Jawaban baru." },
    });
    expect(res.status).toBe(200);

    const baris = ctx.raw.prepare("SELECT jawaban FROM faq WHERE id_faq = 'f1'").get() as {
      jawaban: string;
    };
    expect(baris.jawaban).toBe("Jawaban baru.");
  });

  test("PUT /api/faq/:id mengembalikan 404 untuk id tak dikenal", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/faq/tidak-ada",
      token: admin,
      body: { pertanyaan: "a", jawaban: "b" },
    });
    expect(res.status).toBe(404);
  });

  test("DELETE /api/faq/:id menghapus FAQ (Q-037)", async () => {
    const res = await minta(app, ctx.D1, { method: "DELETE", path: "/api/faq/f2", token: admin });
    expect(res.status).toBe(200);
    const jumlah = ctx.raw.prepare("SELECT COUNT(*) AS n FROM faq").get() as { n: number };
    expect(jumlah.n).toBe(2);
  });

  test("DELETE /api/faq/:id 404 untuk id tak dikenal", async () => {
    const res = await minta(app, ctx.D1, {
      method: "DELETE",
      path: "/api/faq/tidak-ada",
      token: admin,
    });
    expect(res.status).toBe(404);
  });
});

describe("PengajuanPertanyaan (UC-12)", () => {
  test("POST /api/questions menyimpan pertanyaan (Q-040)", async () => {
    const ctx = buatDbUji();
    const mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/questions",
      token: mhs,
      body: { isi: "Bagaimana cara ganti konsultan?" },
    });
    expect(res.status).toBe(201);

    const baris = ctx.raw
      .prepare("SELECT isi_pertanyaan, id_mahasiswa FROM pengajuan_pertanyaan")
      .get() as { isi_pertanyaan: string; id_mahasiswa: string };
    expect(baris.isi_pertanyaan).toBe("Bagaimana cara ganti konsultan?");
    expect(baris.id_mahasiswa).toBe("mhs");
    ctx.tutup();
  });

  test("menolak pertanyaan kosong", async () => {
    const ctx = buatDbUji();
    const mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/questions",
      token: mhs,
      body: { isi: "   " },
    });
    expect(res.status).toBe(422);
    ctx.tutup();
  });

  test("administrator tidak boleh mengajukan pertanyaan", async () => {
    const ctx = buatDbUji();
    const admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/questions",
      token: admin,
      body: { isi: "x" },
    });
    expect(res.status).toBe(403);
    ctx.tutup();
  });
});
