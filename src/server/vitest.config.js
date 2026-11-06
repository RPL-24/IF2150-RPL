import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: ['./tests/setup/globalSetup.js'],
    // Semua file test berbagi satu basis data silembur_test -> jalankan berurutan.
    fileParallelism: false,
    testTimeout: 15_000,
    env: { NODE_ENV: 'test' },
  },
});
