import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import app from "../src/index";
import { buatDbUji, buatSesiUji, envUji, KUNCI_UJI } from "./harness";
import { json, jwtPalsu, minta } from "./util";
import { dekripsiAES256GCM } from "../src/lib/crypto";
import { BATAS_SESI_MS } from "../src/config";

describe("Algo-002 verifikasiToken", () => {
  let ctx: ReturnType<typeof buatDbUji>;

  beforeEach(() => {
    ctx = buatDbUji();
  });
  afterEach(() => ctx.tutup());

  test("menolak permintaan tanpa header Authorization", async () => {
    const res = await minta(app, ctx.D1, { path: "/api/me" });
    expect(res.status).toBe(401);
    expect((await json(res)).error.kode).toBe("TIDAK_TERAUTENTIKASI");
  });

  test("menolak skema selain Bearer", async () => {
    const res = await minta(app, ctx.D1, {
      path: "/api/me",
      headers: { Authorization: "Basic abc" },
    });
    expect(res.status).toBe(401);
  });

  test("menolak token yang tidak dikenal", async () => {
    const res = await minta(app, ctx.D1, { path: "/api/me", token: "entah" });
    expect(res.status).toBe(401);
  });

  test("menolak sesi berstatus berakhir", async () => {
    const token = buatSesiUji(ctx.raw, {
      idPengguna: "u1",
      peran: "mahasiswa",
      token: "tok",
      status: "berakhir",
    });
    const res = await minta(app, ctx.D1, { path: "/api/me", token });
    expect(res.status).toBe(401);
  });

  test("menolak dan mengakhiri sesi kedaluwarsa (BATAS_SESI)", async () => {
    const lama = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();
    const token = buatSesiUji(ctx.raw, {
      idPengguna: "u1",
      peran: "mahasiswa",
      token: "tok-lama",
      waktuLogin: lama,
    });

    const res = await minta(app, ctx.D1, { path: "/api/me", token });
    expect(res.status).toBe(401);

    // Q-003 already ran: status flips to 'berakhir'.
    const sesi = ctx.raw
      .prepare("SELECT status FROM sesi_autentikasi WHERE token = ?")
      .get(token) as { status: string };
    expect(sesi.status).toBe("berakhir");
  });

  test("masih menerima sesi yang belum melewati BATAS_SESI", async () => {
    const hampir = new Date(Date.now() - BATAS_SESI_MS + 60_000).toISOString();
    const token = buatSesiUji(ctx.raw, {
      idPengguna: "u1",
      peran: "mahasiswa",
      token: "tok-hampir",
      waktuLogin: hampir,
    });

    const res = await minta(app, ctx.D1, { path: "/api/me", token });
    expect(res.status).toBe(200);
    const sesi = ctx.raw
      .prepare("SELECT status FROM sesi_autentikasi WHERE token = ?")
      .get(token) as { status: string };
    expect(sesi.status).toBe("aktif");
  });

  test("menerima sesi aktif dan mengembalikan identitas", async () => {
    const token = buatSesiUji(ctx.raw, {
      idPengguna: "u1",
      peran: "administrator",
      token: "tok",
      nama: "Admin Uji",
    });
    const res = await minta(app, ctx.D1, { path: "/api/me", token });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body).toMatchObject({ idPengguna: "u1", peran: "administrator", nama: "Admin Uji" });
  });
});

describe("requireRole", () => {
  test("menolak mahasiswa pada rute administrator", async () => {
    const ctx = buatDbUji();
    const token = buatSesiUji(ctx.raw, { idPengguna: "m", peran: "mahasiswa", token: "t" });

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/faq",
      token,
      body: { pertanyaan: "a", jawaban: "b" },
    });
    expect(res.status).toBe(403);
    expect((await json(res)).error.kode).toBe("PERAN_TIDAK_DIIZINKAN");
    ctx.tutup();
  });

  test("menolak administrator pada rute mahasiswa", async () => {
    const ctx = buatDbUji();
    const token = buatSesiUji(ctx.raw, { idPengguna: "a", peran: "administrator", token: "t" });

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/feedback",
      token,
      body: { isi: "x" },
    });
    expect(res.status).toBe(403);
    ctx.tutup();
  });
});

describe("logout (Q-003)", () => {
  test("mengakhiri sesi sehingga token tidak bisa dipakai lagi", async () => {
    const ctx = buatDbUji();
    const token = buatSesiUji(ctx.raw, { idPengguna: "u1", peran: "mahasiswa", token: "t" });

    const keluar = await minta(app, ctx.D1, { method: "POST", path: "/api/auth/logout", token });
    expect(keluar.status).toBe(200);

    const lagi = await minta(app, ctx.D1, { path: "/api/me", token });
    expect(lagi.status).toBe(401);
    ctx.tutup();
  });
});

describe("Algo-003 daftarkanPerangkat", () => {
  test("menyimpan token push pada sesi aktif (Q-034)", async () => {
    const ctx = buatDbUji();
    const token = buatSesiUji(ctx.raw, { idPengguna: "u1", peran: "mahasiswa", token: "t" });

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/auth/device",
      token,
      body: { tokenPush: "ExpoPushToken[perangkat-1]" },
    });
    expect(res.status).toBe(200);

    const sesi = ctx.raw
      .prepare("SELECT token_push FROM sesi_autentikasi WHERE token = ?")
      .get(token) as { token_push: string };
    expect(sesi.token_push).toBe("ExpoPushToken[perangkat-1]");
    ctx.tutup();
  });

  test("mengakhiri sesi lain pada perangkat yang sama (Q-033)", async () => {
    const ctx = buatDbUji();
    const lama = buatSesiUji(ctx.raw, {
      idPengguna: "u1",
      peran: "mahasiswa",
      token: "t-lama",
      tokenPush: "ExpoPushToken[hp-sama]",
    });
    const baru = buatSesiUji(ctx.raw, {
      idPengguna: "u1",
      peran: "mahasiswa",
      token: "t-baru",
      tokenPush: "ExpoPushToken[hp-sama]",
    });

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/auth/device",
      token: baru,
      body: { tokenPush: "ExpoPushToken[hp-sama]" },
    });
    expect(res.status).toBe(200);

    const s = ctx.raw
      .prepare("SELECT status FROM sesi_autentikasi WHERE token = ?")
      .get(lama) as { status: string };
    expect(s.status).toBe("berakhir");
    ctx.tutup();
  });

  test("menolak token push yang tidak sesuai pola", async () => {
    const ctx = buatDbUji();
    const token = buatSesiUji(ctx.raw, { idPengguna: "u1", peran: "mahasiswa", token: "t" });

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/auth/device",
      token,
      body: { tokenPush: "device-token-biasa" },
    });
    expect(res.status).toBe(422);
    expect((await json(res)).error.kode).toBe("VALIDASI_GAGAL");
    ctx.tutup();
  });
});

describe("Algo-001 autentikasiPengguna (login Google)", () => {
  let fetchAsli: typeof fetch;

  beforeEach(() => {
    fetchAsli = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = fetchAsli;
    vi.restoreAllMocks();
  });

  function tiruGoogle(profil: { sub: string; email: string; name: string }) {
    globalThis.fetch = vi.fn(async (input: any) => {
      const url = String(input?.url ?? input);
      if (url.includes("oauth2.googleapis.com/token")) {
        return new Response(
          JSON.stringify({
            access_token: "ya29.akses",
            refresh_token: "1//refresh",
            expires_in: 3600,
            id_token: jwtPalsu(profil),
          }),
          { status: 200 },
        );
      }
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
  }

  test("mendaftarkan pengguna baru, membuat sesi, dan mengenkripsi token", async () => {
    const ctx = buatDbUji();
    tiruGoogle({ sub: "g-1", email: "13525052@std.stei.itb.ac.id", name: "Daniel" });

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/auth/google",
      body: { kodeOtorisasi: "kode-abc" },
    });

    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.token).toMatch(/^[0-9a-f]{64}$/);
    expect(body.pengguna).toMatchObject({ peran: "mahasiswa", nama: "Daniel" });

    // Q-029/Q-030: pengguna + mahasiswa rows, nim derived from campus email.
    const mhs = ctx.raw
      .prepare("SELECT nim FROM mahasiswa WHERE id_pengguna = ?")
      .get(body.pengguna.idPengguna) as { nim: string | null };
    expect(mhs.nim).toBe("13525052");

    // Q-032: Google tokens are stored encrypted, never plaintext.
    const tok = ctx.raw
      .prepare("SELECT access_token, refresh_token FROM token_google WHERE id_pengguna = ?")
      .get(body.pengguna.idPengguna) as { access_token: string; refresh_token: string };
    expect(tok.access_token).not.toBe("ya29.akses");
    expect(await dekripsiAES256GCM(tok.access_token, KUNCI_UJI)).toBe("ya29.akses");
    expect(await dekripsiAES256GCM(tok.refresh_token, KUNCI_UJI)).toBe("1//refresh");

    // The issued session token works.
    const me = await minta(app, ctx.D1, { path: "/api/me", token: body.token });
    expect(me.status).toBe(200);
    ctx.tutup();
  });

  test("login kedua memakai akun yang sama (tidak duplikat)", async () => {
    const ctx = buatDbUji();
    tiruGoogle({ sub: "g-2", email: "orang@gmail.com", name: "Bukan Kampus" });

    const pertama = await json(
      await minta(app, ctx.D1, {
        method: "POST",
        path: "/api/auth/google",
        body: { code: "kode-1" },
      }),
    );
    const kedua = await json(
      await minta(app, ctx.D1, {
        method: "POST",
        path: "/api/auth/google",
        body: { code: "kode-2" },
      }),
    );

    expect(kedua.pengguna.idPengguna).toBe(pertama.pengguna.idPengguna);
    const jumlah = ctx.raw.prepare("SELECT COUNT(*) AS n FROM pengguna").get() as { n: number };
    expect(jumlah.n).toBe(1);
    ctx.tutup();
  });

  test("email non-kampus menghasilkan nim NULL", async () => {
    const ctx = buatDbUji();
    tiruGoogle({ sub: "g-3", email: "saya@gmail.com", name: "Umum" });

    const body = await json(
      await minta(app, ctx.D1, {
        method: "POST",
        path: "/api/auth/google",
        body: { kodeOtorisasi: "k" },
      }),
    );
    const mhs = ctx.raw
      .prepare("SELECT nim FROM mahasiswa WHERE id_pengguna = ?")
      .get(body.pengguna.idPengguna) as { nim: string | null };
    expect(mhs.nim).toBeNull();
    ctx.tutup();
  });

  test("email mahasiswa.itb.ac.id juga menghasilkan nim", async () => {
    const ctx = buatDbUji();
    tiruGoogle({ sub: "g-4", email: "18222001@mahasiswa.itb.ac.id", name: "Mahasiswa ITB" });

    const body = await json(
      await minta(app, ctx.D1, {
        method: "POST",
        path: "/api/auth/google",
        body: { kodeOtorisasi: "k" },
      }),
    );
    const mhs = ctx.raw
      .prepare("SELECT nim FROM mahasiswa WHERE id_pengguna = ?")
      .get(body.pengguna.idPengguna) as { nim: string | null };
    expect(mhs.nim).toBe("18222001");
    ctx.tutup();
  });

  test("akun administrator yang sudah ada tidak didaftarkan ulang sebagai mahasiswa", async () => {
    const ctx = buatDbUji();
    ctx.raw
      .prepare(
        "INSERT INTO pengguna (id_pengguna, nama, email, google_id, peran) VALUES (?,?,?,?,?)",
      )
      .run("adm-1", "Admin", "admin@itb.ac.id", "g-adm", "administrator");
    tiruGoogle({ sub: "g-adm", email: "admin@itb.ac.id", name: "Admin" });

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/auth/google",
      body: { kodeOtorisasi: "k" },
    });
    expect(res.status).toBe(200);
    expect((await json(res)).pengguna).toMatchObject({ idPengguna: "adm-1", peran: "administrator" });

    const jumlah = ctx.raw.prepare("SELECT COUNT(*) AS n FROM pengguna").get() as { n: number };
    expect(jumlah.n).toBe(1);
    const mhs = ctx.raw.prepare("SELECT * FROM mahasiswa WHERE id_pengguna = 'adm-1'").get();
    expect(mhs).toBeUndefined();
    ctx.tutup();
  });

  test("menolak kode yang ditukar gagal oleh Google", async () => {
    const ctx = buatDbUji();
    globalThis.fetch = vi.fn(async () => new Response("{}", { status: 400 })) as any;

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/auth/google",
      body: { kodeOtorisasi: "kode-buruk" },
    });
    expect(res.status).toBe(401);
    ctx.tutup();
  });

  test("menolak body tanpa kodeOtorisasi", async () => {
    const ctx = buatDbUji();
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/auth/google",
      body: {},
    });
    expect(res.status).toBe(422);
    ctx.tutup();
  });

  test("menolak body bukan JSON", async () => {
    const ctx = buatDbUji();
    const res = await app.fetch(
      new Request("http://sehati.test/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "bukan json",
      }),
      { D1: ctx.D1, KUNCI_TOKEN: KUNCI_UJI } as any,
      {} as any,
    );
    expect(res.status).toBe(400);
    ctx.tutup();
  });
});

describe("login Google dari aplikasi (mulai + callback)", () => {
  let ctx: ReturnType<typeof buatDbUji>;

  beforeEach(() => {
    ctx = buatDbUji();
  });
  afterEach(() => ctx.tutup());

  const KEMBALI = "exp://10.0.0.5:8081/--/";

  test("mulai mengalihkan ke Google dengan deep link aplikasi di state", async () => {
    const res = await minta(app, ctx.D1, {
      path: `/api/auth/google/mulai?kembali=${encodeURIComponent(KEMBALI)}`,
    });
    expect(res.status).toBe(302);

    const tujuan = new URL(res.headers.get("Location")!);
    expect(tujuan.origin + tujuan.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(tujuan.searchParams.get("client_id")).toBe("id-uji");
    expect(tujuan.searchParams.get("redirect_uri")).toBe("http://localhost/auth");
    expect(tujuan.searchParams.get("response_type")).toBe("code");
    expect(tujuan.searchParams.get("access_type")).toBe("offline");
    expect(tujuan.searchParams.get("scope")).toContain("openid");
    expect(tujuan.searchParams.get("state")).toBe(KEMBALI);
  });

  test.each(["https://jahat.example/curi", "javascript:alert(1)", "bukan-url", ""])(
    "mulai menolak kembali = %j",
    async (kembali) => {
      const res = await minta(app, ctx.D1, {
        path: `/api/auth/google/mulai?kembali=${encodeURIComponent(kembali)}`,
      });
      expect(res.status).toBe(400);
    },
  );

  test("callback meneruskan code ke deep link aplikasi", async () => {
    const res = await minta(app, ctx.D1, {
      path: `/api/auth/google/callback?code=kode-123&state=${encodeURIComponent("sehati://masuk")}`,
    });
    expect(res.status).toBe(302);
    const tujuan = new URL(res.headers.get("Location")!);
    expect(tujuan.protocol).toBe("sehati:");
    expect(tujuan.host).toBe("masuk");
    expect(tujuan.searchParams.get("code")).toBe("kode-123");
  });

  /**
   * Regression: `Linking.createURL('/')` used to produce `sehati:///`, which parses
   * but has an empty host. Android routes intents by `scheme://host`, so the browser
   * found no app and the login ended silently after the callback. These must 400.
   */
  test.each(["sehati:///", "sehati://", "sehati:/", "sehati:"]) (
    "menolak deep link tanpa host: state = %j",
    async (kembali) => {
      const res = await minta(app, ctx.D1, {
        path: `/api/auth/google/callback?code=kode-123&state=${encodeURIComponent(kembali)}`,
      });
      expect(res.status).toBe(400);
    },
  );

  test.each(["sehati:///", "sehati://", "sehati:"]) (
    "menolak deep link tanpa host: kembali = %j",
    async (kembali) => {
      const res = await minta(app, ctx.D1, {
        path: `/api/auth/google/mulai?kembali=${encodeURIComponent(kembali)}`,
      });
      expect(res.status).toBe(400);
    },
  );

  test.each([
    "sehati://masuk",
    "sehati://callback/masuk",
    "exp://10.0.0.5:8081/--/masuk",
    "exps://192.168.1.10:8081/--/masuk",
  ])("menerima deep link berhost: %j", async (kembali) => {
    const res = await minta(app, ctx.D1, {
      path: `/api/auth/google/mulai?kembali=${encodeURIComponent(kembali)}`,
    });
    expect(res.status).toBe(302);
    expect(new URL(res.headers.get("Location")!).searchParams.get("state")).toBe(kembali);
  });

  test("callback meneruskan error saat pengguna membatalkan", async () => {
    const res = await minta(app, ctx.D1, {
      path: `/api/auth/google/callback?error=access_denied&state=${encodeURIComponent(KEMBALI)}`,
    });
    expect(res.status).toBe(302);
    const tujuan = new URL(res.headers.get("Location")!);
    expect(tujuan.searchParams.get("error")).toBe("access_denied");
    expect(tujuan.searchParams.has("code")).toBe(false);
  });

  test("callback menolak state yang bukan deep link aplikasi", async () => {
    const res = await minta(app, ctx.D1, {
      path: `/api/auth/google/callback?code=kode-123&state=${encodeURIComponent("https://jahat.example")}`,
    });
    expect(res.status).toBe(400);
  });
});

describe("login demo (MODE_DEMO)", () => {
  let ctx: ReturnType<typeof buatDbUji>;

  beforeEach(() => {
    ctx = buatDbUji();
    // Same accounts as seed/seed.sql, without their dev sessions.
    for (const [idPengguna, peran] of [
      ["seed-usr-mhs", "mahasiswa"],
      ["seed-usr-adm", "administrator"],
    ] as const) {
      buatSesiUji(ctx.raw, { idPengguna, peran, token: `lama-${idPengguna}` });
    }
  });
  afterEach(() => ctx.tutup());

  const demo = (body: unknown, modeDemo: string | null = "1") =>
    app.fetch(
      new Request("http://sehati.test/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
      envUji(ctx.D1, modeDemo === null ? {} : { MODE_DEMO: modeDemo }),
      {} as ExecutionContext,
    );

  test.each([null, "0", "true"])("tidak tersedia saat MODE_DEMO = %j", async (mode) => {
    const res = await demo({ peran: "mahasiswa" }, mode);
    expect(res.status).toBe(404);
  });

  test.each([
    ["mahasiswa", "seed-usr-mhs"],
    ["administrator", "seed-usr-adm"],
  ])("masuk sebagai akun seed %s dengan sesi baru yang bisa dipakai", async (peran, idPengguna) => {
    const res = await demo({ peran });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.pengguna).toMatchObject({ idPengguna, peran });
    expect(body.token).toMatch(/^[0-9a-f]{64}$/);

    const me = await minta(app, ctx.D1, { path: "/api/me", token: body.token });
    expect(me.status).toBe(200);
    expect((await json(me)).idPengguna).toBe(idPengguna);
  });

  test("menolak peran yang tidak dikenal", async () => {
    const res = await demo({ peran: "konsultan" });
    expect(res.status).toBe(422);
  });

  test("404 bila akun seed belum ada", async () => {
    ctx.raw.prepare("DELETE FROM pengguna WHERE id_pengguna = 'seed-usr-adm'").run();
    const res = await demo({ peran: "administrator" });
    expect(res.status).toBe(404);
    expect((await json(res)).error.pesan).toContain("seed");
  });
});
