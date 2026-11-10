"use server";

import { revalidatePath } from "next/cache";
import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { pesanErrorDb } from "@/lib/error-db";
import { createClient } from "@/lib/supabase/server";
import { filterKategori, getByStatus, getRincian } from "@/server/entities/Laporan";
import { Constants, type Enums, type TablesUpdate } from "@/types/database";

export type LaporanAntrean = NonNullable<Awaited<ReturnType<typeof getByStatus>>["data"]>[number];
export type LaporanRincian = NonNullable<Awaited<ReturnType<typeof getRincian>>["data"]>;

const SEMUA_KATEGORI = "semua";

function adalahKategori(nilai: string): nilai is Enums<"kategori_kerusakan"> {
  return (Constants.public.Enums.kategori_kerusakan as readonly string[]).includes(nilai);
}

async function verifikasiAkses() {
  return requireRole("admin");
}

async function perbaruiLaporanDiterima(idTiket: string, perubahan: TablesUpdate<"laporan">) {
  const { data, error } = await (await createClient())
    .from("laporan")
    .update(perubahan)
    .eq("id_tiket", idTiket)
    .eq("status", "diterima")
    .select("id");
  if (error) return gagal(pesanErrorDb(error));
  if (data.length === 0) return gagal("Laporan tidak ditemukan atau sudah diproses.");

  revalidatePath("/validasi");
  return ok(undefined);
}

export async function susunAntrean(ascending: boolean = false): Promise<ActionResult<LaporanAntrean[]>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;

  const { data, error } = await getByStatus(await createClient(), "diterima");
  if (error) return gagal(pesanErrorDb(error));

  const arah = ascending ? 1 : -1;
  return ok([...data].sort((a, b) => arah * (Date.parse(a.waktu_masuk) - Date.parse(b.waktu_masuk))));
}

export async function saringAntrean(
  kategori: string,
  ascending: boolean = false,
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

export async function setujuiLaporan(idTiket: string): Promise<ActionResult<undefined>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;

  if (idTiket.trim() === "") return gagal("ID tiket wajib diisi.");

  return perbaruiLaporanDiterima(idTiket.trim(), { status: "dikerjakan", tahap: "menunggu_eksekusi" });
}

export async function tolakLaporan(idTiket: string, alasan: string): Promise<ActionResult<undefined>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;

  if (idTiket.trim() === "") return gagal("ID tiket wajib diisi.");
  if (alasan.trim() === "") return gagal("Alasan penolakan wajib diisi.");

  return perbaruiLaporanDiterima(idTiket.trim(), { status: "ditolak", alasan_penolakan: alasan.trim() });
}
