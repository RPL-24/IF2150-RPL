// UC07: PATCH /api/laporan/tugas/{id}/status dengan body { "status": "SEDANG_DIPERBAIKI" }.
import { NextResponse } from "next/server";
import { buatLaporanController } from "@/modules/laporan";
import { ambilSesi, responGalat, responHasil } from "../../../_utils";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sesi = await ambilSesi();
  if (sesi instanceof NextResponse) return sesi;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return responGalat("VALIDASI_GAGAL", "Format isian tidak valid.");
  }
  const status = typeof body === "object" && body !== null ? (body as { status?: unknown }).status : undefined;
  const { id } = await params;
  return responHasil(await buatLaporanController(sesi).perbaruiStatus(id, status));
}
