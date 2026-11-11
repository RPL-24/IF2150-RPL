import { describe, expect, test } from "vitest";
import app from "./index";
import { buatDbUji, envUji } from "../test/harness";

describe("GET /health", () => {
  test("mengembalikan ok", async () => {
    const ctx = buatDbUji();
    const res = await app.fetch(
      new Request("http://sehati.test/health"),
      envUji(ctx.D1),
      {} as ExecutionContext,
    );
    const body = (await res.json()) as any;
    expect(body).toMatchObject({ ok: true });
    ctx.tutup();
  });
});

describe("GET /health/db", () => {
  test("mengembalikan ok dan pemeriksaan status terakhir", async () => {
    const ctx = buatDbUji(`
      INSERT INTO status_server (jenis, status_uptime, waktu_cek) VALUES
        ('website', 1, '2031-01-01T00:00:00Z'),
        ('server',  1, '2031-01-02T00:00:00Z');
    `);

    const res = await app.fetch(
      new Request("http://sehati.test/health/db"),
      envUji(ctx.D1),
      {} as ExecutionContext,
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.ok).toBe(true);
    expect(body.latest).toMatchObject({ jenis: "server", statusUptime: true });
    ctx.tutup();
  });

  test("ok walau belum ada pemeriksaan (latest null)", async () => {
    const ctx = buatDbUji();
    const res = await app.fetch(
      new Request("http://sehati.test/health/db"),
      envUji(ctx.D1),
      {} as ExecutionContext,
    );
    const body = (await res.json()) as any;
    expect(body).toMatchObject({ ok: true, latest: null });
    ctx.tutup();
  });
});
