// src/app/api/iuran/analitik/route.ts
import { NextResponse } from "next/server";
import { GalatAuth } from "@/lib/auth/konteks";
import { wajibPeran } from "@/lib/auth/server";
import { repositoriIuran } from "@/modules/iuran/repository";
import { buatIuranService } from "@/modules/iuran/service";
import { responGalat, STATUS_HTTP } from "../_utils";

export async function GET(req: Request) {
  let sesi;
  try {
    sesi = await wajibPeran("PENGURUS");
  } catch (e) {
    if (e instanceof GalatAuth) {
      return e.kode === "TIDAK_LOGIN"
        ? responGalat("TIDAK_TERAUTENTIKASI", "Silakan masuk terlebih dahulu.")
        : responGalat("TIDAK_BERWENANG", "Akses ditolak.");
    }
    return responGalat("GAGAL_INTERNAL", "Terjadi kesalahan. Coba lagi.");
  }

  const { searchParams } = new URL(req.url);
  const idPeriode = searchParams.get("idPeriode") ?? "";

  const service = buatIuranService(sesi, repositoriIuran);
  const hasil = await service.analisisPemakaian(idPeriode);
  return NextResponse.json(hasil, { status: hasil.ok ? 200 : STATUS_HTTP[hasil.kode] });
}