import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // samakan dengan alias "@/*" di tsconfig.json
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Uji integrasi menembak Supabase production: JANGAN pernah ikut `npm test` / CI.
    // Jalankan terpisah lewat `npm run test:integration` (vitest.integration.config.mts).
    exclude: ["**/node_modules/**", "**/*.int.test.ts", "tests/integration/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.int.test.ts", "src/types/**", "src/**/*.d.ts"],
    },
  },
});
