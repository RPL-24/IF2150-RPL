// globalSetup uji integrasi: jalan sekali sebelum & sesudah seluruh file *.int.test.ts.
import type { TestProject } from "vitest/node";
import { hitungSisa } from "./pelacak";
import { ENV_WAJIB, PENANDA } from "./supabase";

export async function setup(project: TestProject) {
  // Env dari .env.local (loadEnv di vitest.integration.config.mts) diteruskan ke proses utama,
  // supaya hitungSisa() di sini bisa membuat client admin.
  for (const [k, v] of Object.entries(project.config.env)) process.env[k] ??= v;

  const kosong = ENV_WAJIB.filter((k) => !process.env[k]);
  if (kosong.length > 0) {
    throw new Error(
      `Uji integrasi DIBATALKAN: env berikut kosong di .env.local:\n  ${kosong.join("\n  ")}\n` +
        "Lihat .env.example dan src/README.md bagian Pengujian.",
    );
  }

  const sisaAwal = await hitungSisa();
  if (sisaAwal !== 0) console.warn(`⚠ Sebelum tes sudah ada ${sisaAwal} laporan ${PENANDA} sisa run sebelumnya.`);

  return async () => {
    const sisa = await hitungSisa();
    if (sisa === 0) console.log(`✓ Sisa data ${PENANDA}: 0 laporan.`);
    else console.warn(`\n⚠⚠ PERINGATAN: masih ada ${sisa} laporan ${PENANDA} di database. Bersihkan manual (lihat src/README.md).\n`);
  };
}
