// UC04: GET /api/laporan/{id}. ID milik pihak lain dan ID yang tidak ada menghasilkan 404 yang sama.
import { NextResponse } from "next/server";
import { buatLaporanController } from "@/modules/laporan";
import { ambilSesi, responHasil } from "../_utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sesi = await ambilSesi();
  if (sesi instanceof NextResponse) return sesi;
  const { id } = await params;
  return responHasil(await buatLaporanController(sesi).detailMilikWarga(id));
}
