// Config KHUSUS uji integrasi (menembak Supabase PRODUCTION). Tidak dipakai CI.
// Jalankan manual: npm run test:integration. Aturan pakai: src/README.md bagian "Pengujian".
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.int.test.ts"],
    // Prefix "" = muat SEMUA variabel dari .env, .env.local, dst. (bukan hanya VITE_*).
    env: loadEnv("test", process.cwd(), ""),
    globalSetup: ["tests/integration/helpers/global-setup.ts"],
    // Satu file pada satu waktu supaya data tes antar-file tidak saling ganggu.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
