// app/api/iuran/periode/route.ts
import { NextResponse } from "next/server";
import { GalatAuth } from "@/lib/auth/konteks";
import { wajibSesi } from "@/lib/auth/server";
import { repositoriIuran } from "@/modules/iuran/repository";
import { buatIuranService } from "@/modules/iuran/service";
import { responGalat, STATUS_HTTP } from "../_utils";

export async function GET() {
  let sesi;
  try {
    sesi = await wajibSesi();
  } catch (e) {
    if (e instanceof GalatAuth) {
      return e.kode === "TIDAK_LOGIN"
        ? responGalat("TIDAK_TERAUTENTIKASI", "Silakan masuk terlebih dahulu.")
        : responGalat("TIDAK_BERWENANG", "Akses ditolak.");
    }
    return responGalat("GAGAL_INTERNAL", "Terjadi kesalahan. Coba lagi.");
  }

  const service = buatIuranService(sesi, repositoriIuran);
  const hasil = await service.daftarPeriode();
  return NextResponse.json(hasil, { status: hasil.ok ? 200 : STATUS_HTTP[hasil.kode] });
}