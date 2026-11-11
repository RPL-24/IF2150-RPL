// UC07: GET /api/laporan/tugas/{id}. Tugas yang bukan milik sesi dan ID yang tidak ada sama-sama 404.
import { NextResponse } from "next/server";
import { buatLaporanController } from "@/modules/laporan";
import { ambilSesi, responHasil } from "../../_utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sesi = await ambilSesi();
  if (sesi instanceof NextResponse) return sesi;
  const { id } = await params;
  return responHasil(await buatLaporanController(sesi).detailTugas(id));
}
