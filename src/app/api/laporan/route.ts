// UC03: POST /api/laporan.
import { NextResponse } from "next/server";
import { buatLaporanController } from "@/modules/laporan";
import { ambilSesi, responGalat, responHasil } from "./_utils";

export async function POST(req: Request) {
  const sesi = await ambilSesi();
  if (sesi instanceof NextResponse) return sesi;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return responGalat("VALIDASI_GAGAL", "Format isian tidak valid.");
  }
  return responHasil(await buatLaporanController(sesi).kirimLaporan(body), 201);
}
