"use server";

import { revalidatePath } from "next/cache";
import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { pesanErrorDb } from "@/lib/error-db";
import { createClient } from "@/lib/supabase/server";
import * as Evaluasi from "@/server/entities/Evaluasi";
import { Constants, type Enums } from "@/types/database";

function adalahKeputusan(nilai: string): nilai is Enums<"keputusan_evaluasi"> {
  return (Constants.public.Enums.keputusan_evaluasi as readonly string[]).includes(nilai);
}

async function verifikasiAkses() {
  return requireRole("admin");
}

export async function ambilDaftarUntukEvaluasi(): Promise<ActionResult<Evaluasi.ItemSiapEvaluasi[]>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;

  const { data, error } = await Evaluasi.ambilDaftarSiapEvaluasi(await createClient());
  if (error) return gagal(pesanErrorDb(error));
  return ok(data);
}

export async function ambilDetailEvaluasi(idTiket: string): Promise<ActionResult<Evaluasi.DetailEvaluasi>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;

  if (idTiket.trim() === "") return gagal("ID tiket wajib diisi.");

  const { data, error } = await Evaluasi.ambilDetailEvaluasi(await createClient(), idTiket.trim());
  if (error) return gagal(pesanErrorDb(error));
  if (!data) return gagal("Laporan tidak ditemukan.");
  if (data.laporan.status !== "dikerjakan" || data.laporan.tahap !== "menunggu_evaluasi" || !data.hasilPerbaikan) {
    return gagal("Laporan ini tidak sedang menunggu evaluasi.");
  }
  return ok(data);
}

export async function simpanKeputusan(
  idTiket: string,
  idHasil: string,
  keputusan: Enums<"keputusan_evaluasi">,
  catatan?: string,
): Promise<ActionResult<undefined>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;

  if (idTiket.trim() === "" || idHasil.trim() === "") return gagal("Data evaluasi tidak lengkap.");
  if (!adalahKeputusan(keputusan)) return gagal("Keputusan evaluasi tidak valid.");

  const catatanBersih = catatan?.trim() ?? "";
  if (keputusan !== "selesai" && catatanBersih === "") {
    return gagal("Catatan evaluasi wajib diisi untuk keputusan ini.");
  }

  const supabase = await createClient();
  const { data: idLaporan, error: errorLaporan } = await Evaluasi.cariIdLaporan(supabase, idTiket.trim());
  if (errorLaporan) return gagal(pesanErrorDb(errorLaporan));
  if (!idLaporan) return gagal("Laporan tidak ditemukan.");

  const { error } = await Evaluasi.simpanEvaluasi(supabase, {
    id_laporan: idLaporan,
    id_hasil: idHasil.trim(),
    id_admin: akses.data.id,
    keputusan,
    catatan: catatanBersih === "" ? null : catatanBersih,
  });
  if (error) return gagal(pesanErrorDb(error));

  revalidatePath("/evaluasi");
  return ok(undefined);
}
