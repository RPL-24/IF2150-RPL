// src/app/api/iuran/rekapitulasi/route.ts
import { NextResponse } from "next/server";
import { GalatAuth } from "@/lib/auth/konteks";
import { wajibPeran } from "@/lib/auth/server";
import { repositoriIuran } from "@/modules/iuran/repository";
import { buatIuranService } from "@/modules/iuran/service";
import { responGalat, STATUS_HTTP } from "../_utils";

export async function POST(req: Request) {
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

  let body: { idPeriode?: string };
  try {
    body = await req.json();
  } catch {
    return responGalat("VALIDASI_GAGAL", "Format isian tidak valid.");
  }

  const service = buatIuranService(sesi, repositoriIuran);
  const hasil = await service.buatRekapitulasi(body.idPeriode ?? "");
  return NextResponse.json(hasil, { status: hasil.ok ? 200 : STATUS_HTTP[hasil.kode] });
}