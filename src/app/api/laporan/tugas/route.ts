// UC07: GET /api/laporan/tugas (tugas milik teknisi sesi).
import { NextResponse } from "next/server";
import { buatLaporanController } from "@/modules/laporan";
import { ambilSesi, responHasil } from "../_utils";

export async function GET() {
  const sesi = await ambilSesi();
  if (sesi instanceof NextResponse) return sesi;
  return responHasil(await buatLaporanController(sesi).daftarPenugasan());
}
