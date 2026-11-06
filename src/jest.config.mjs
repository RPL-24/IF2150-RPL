// Jalankan dari folder src: npx jest
import nextJest from "next/jest.js";

const buatKonfigurasi = nextJest({ dir: "./" });

export default buatKonfigurasi({
  testEnvironment: "node", // Tes komponen menambahkan docblock @jest-environment jsdom.
  testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
});
