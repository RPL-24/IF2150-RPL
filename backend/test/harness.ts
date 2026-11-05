import Database from "better-sqlite3";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Minimal in-process D1 adapter backed by better-sqlite3.
 *
 * Mirrors the D1 API surface that drizzle-orm/d1 relies on:
 *   prepare(sql) -> { bind(...p), all(), raw(), run(), first() }
 *   batch([bound stmt]) -> [{ results: Row[] }]
 *
 * Note: Drizzle awaits `stmt.bind(...).raw()` directly, so `raw()` must resolve
 * to an array-of-arrays (not an object with an `all()` method).
 */
export interface D1Overrides {
  /** Rows that each `.all(...)` returns; unused in the default implementation. */
  rows?: unknown[];
}

export function buatDbUji(sqlOverride?: string): {
  D1: D1Database;
  raw: Database.Database;
  tutup: () => void;
} {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");

  const migrationDir = join(process.cwd(), "migrations");
  const files = readdirSync(migrationDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    db.exec(readFileSync(join(migrationDir, file), "utf8"));
  }
  if (sqlOverride) db.exec(sqlOverride);

  type Bound = {
    run: () => Promise<{ success: true; meta: Record<string, unknown> }>;
    all: () => Promise<{ success: true; results: unknown[] }>;
    raw: () => Promise<unknown[][]>;
    first: (kolom?: string) => Promise<unknown>;
    bind: (...params: unknown[]) => Bound;
    _stmt: Database.Statement;
  };

  const buatBound = (stmt: Database.Statement, params: unknown[]): Bound => ({
    _stmt: stmt,
    bind: (...next: unknown[]) => buatBound(stmt, next),
    run: async () => {
      const info = stmt.run(...(params as never[]));
      return {
        success: true,
        meta: { changes: info.changes, last_row_id: Number(info.lastInsertRowid) },
      };
    },
    all: async () => {
      // Real D1 returns { results: [] } for statements that produce no rows.
      if (!stmt.reader) {
        const info = stmt.run(...(params as never[]));
        return { success: true, results: [], meta: { changes: info.changes } } as never;
      }
      const results = stmt.all(...(params as never[]));
      return { success: true, results };
    },
    raw: async () => {
      if (!stmt.reader) {
        stmt.run(...(params as never[]));
        return [] as unknown[][];
      }
      return stmt.raw(true).all(...(params as never[])) as unknown[][];
    },
    first: async (kolom?: string) => {
      const row = stmt.get(...(params as never[])) as Record<string, unknown> | undefined;
      if (!row) return null;
      return kolom ? (row[kolom] ?? null) : row;
    },
  });

  const D1 = {
    prepare: (sql: string) => buatBound(db.prepare(sql), []),
    batch: async (stmts: Bound[]) => Promise.all(stmts.map((s) => s.all())),
    exec: async (sql: string) => {
      db.exec(sql);
      return { count: 0, duration: 0 };
    },
    dump: async () => new ArrayBuffer(0),
  } as unknown as D1Database;

  return { D1, raw: db, tutup: () => db.close() };
}

/** Inserts a user + session, returning the bearer token. */
export function buatSesiUji(
  db: Database.Database,
  opsi: {
    idPengguna: string;
    peran: "mahasiswa" | "administrator";
    token: string;
    nama?: string;
    email?: string;
    waktuLogin?: string;
    status?: "aktif" | "berakhir";
    tokenPush?: string | null;
  },
): string {
  db.prepare(
    "INSERT OR IGNORE INTO pengguna (id_pengguna, nama, email, google_id, peran) VALUES (?,?,?,?,?)",
  ).run(
    opsi.idPengguna,
    opsi.nama ?? `Nama ${opsi.idPengguna}`,
    opsi.email ?? `${opsi.idPengguna}@contoh.id`,
    `google-${opsi.idPengguna}`,
    opsi.peran,
  );
  if (opsi.peran === "mahasiswa") {
    db.prepare("INSERT OR IGNORE INTO mahasiswa (id_pengguna, nim) VALUES (?,?)").run(
      opsi.idPengguna,
      null,
    );
  }
  db.prepare(
    "INSERT INTO sesi_autentikasi (token, id_pengguna, waktu_login, status, token_push) VALUES (?,?,?,?,?)",
  ).run(
    opsi.token,
    opsi.idPengguna,
    opsi.waktuLogin ?? new Date().toISOString(),
    opsi.status ?? "aktif",
    opsi.tokenPush ?? null,
  );
  return opsi.token;
}

export const KUNCI_UJI = Buffer.alloc(32, 7).toString("base64");

export function envUji(D1: D1Database, extra: Record<string, unknown> = {}): Env {
  return {
    D1,
    KUNCI_TOKEN: KUNCI_UJI,
    GOOGLE_CLIENT_ID: "id-uji",
    GOOGLE_CLIENT_SECRET: "rahasia-uji",
    GOOGLE_REDIRECT_URI: "http://localhost/auth",
    API_BASE_URL: "http://localhost",
    ...extra,
  } as unknown as Env;
}
