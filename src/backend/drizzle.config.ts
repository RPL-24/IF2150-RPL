import { defineConfig } from "drizzle-kit";

// `drizzle-kit generate` needs no credentials: it diffs schema.ts and writes SQL
// into ./migrations, which is also wrangler's default migrations_dir.
// Credentials below are only used by `drizzle-kit studio` / `push` against remote D1.
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
