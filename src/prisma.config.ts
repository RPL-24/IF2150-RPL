// Prisma 7 ke atas membaca URL koneksi dari sini, bukan dari schema.prisma.
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
