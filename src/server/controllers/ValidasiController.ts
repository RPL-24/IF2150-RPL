"use server";

import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { pesanErrorDb } from "@/lib/error-db";
import { createClient } from "@/lib/supabase/server";
import { filterKategori, getByStatus, getRincian } from "@/server/entities/Laporan";
import { Constants, type Enums } from "@/types/database";

export type LaporanAntrean = NonNullable<Awaited<ReturnType<typeof getByStatus>>["data"]>[number];
export type LaporanRincian = NonNullable<Awaited<ReturnType<typeof getRincian>>["data"]>;

const SEMUA_KATEGORI = "semua";

function adalahKategori(nilai: string): nilai is Enums<"kategori_kerusakan"> {
  return (Constants.public.Enums.kategori_kerusakan as readonly string[]).includes(nilai);
}

async function verifikasiAkses() {
  return requireRole("admin");
}

export async function susunAntrean(ascending: boolean = true): Promise<ActionResult<LaporanAntrean[]>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;

  const { data, error } = await getByStatus(await createClient(), "diterima");
  if (error) return gagal(pesanErrorDb(error));

  const arah = ascending ? 1 : -1;
  return ok([...data].sort((a, b) => arah * (Date.parse(a.waktu_masuk) - Date.parse(b.waktu_masuk))));
}

export async function saringAntrean(
  kategori: string,
  ascending: boolean = true,
): Promise<ActionResult<LaporanAntrean[]>> {
  const antrean = await susunAntrean(ascending);
  if (!antrean.ok) return antrean;

  const pilihan = kategori.trim().toLowerCase();
  if (pilihan === "" || pilihan === SEMUA_KATEGORI) return antrean;
  if (!adalahKategori(pilihan)) return gagal("Kategori tidak valid.");

  return ok(filterKategori(antrean.data, pilihan));
}

export async function ambilRincianLaporan(idTiket: string): Promise<ActionResult<LaporanRincian>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;

  if (idTiket.trim() === "") return gagal("ID tiket wajib diisi.");

  const { data, error } = await getRincian(await createClient(), idTiket.trim());
  if (error) return gagal(pesanErrorDb(error));
  if (!data) return gagal("Laporan tidak ditemukan.");
  return ok(data);
}
