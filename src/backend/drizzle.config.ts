import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "drizzle-kit";

// Node 20.12+ can load .env itself; Bun already does. Ignore if unavailable.
try {
  process.loadEnvFile?.();
} catch { }

/**
 * DB_TARGET=local  (default)  -> wrangler's local D1 sqlite file (.wrangler/state)
 * DB_TARGET=remote            -> Cloudflare D1 over HTTP (needs CLOUDFLARE_* env vars)
 *
 * `drizzle-kit generate` needs neither, so it works with no env set.
 */
const target = process.env.DB_TARGET === "remote" ? "remote" : "local";

const base = {
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./migrations",
} as const;

function findLocalDb(): string | undefined {
  // Explicit override wins (e.g. you used `wrangler --persist-to`, or have several DBs).
  const override = process.env.LOCAL_DB_PATH;
  if (override) return override;

  const dir = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject";
  if (!existsSync(dir)) return undefined;

  // Miniflare names files by a hash of the database id, so pick the newest one.
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sqlite") && f !== "metadata.sqlite")
    .map((f) => join(dir, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);

  return files[0];
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `DB_TARGET=remote needs ${name}. Set it in .env (see .env.example).`,
    );
  }
  return value;
}

export default defineConfig(
  target === "remote"
    ? {
      ...base,
      driver: "d1-http",
      dbCredentials: {
        accountId: requireEnv("CLOUDFLARE_ACCOUNT_ID"),
        databaseId: requireEnv("CLOUDFLARE_DATABASE_ID"),
        token: requireEnv("CLOUDFLARE_D1_TOKEN"),
      },
    }
    : (() => {
      const url = findLocalDb();
      if (url) console.log(`[drizzle] local D1 file: ${url}`);
      return url ? { ...base, dbCredentials: { url } } : base;
    })(),
);
