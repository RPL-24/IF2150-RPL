import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts", "src/**/*.test.ts"],
    environment: "node",
    // better-sqlite3 is a native module; keep it on the Node side.
    pool: "forks",
    testTimeout: 20_000,
  },
});
