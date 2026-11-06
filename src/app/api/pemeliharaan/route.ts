// UC08: POST /api/pemeliharaan. GET riwayat menyusul pada tugas Sab 7 Nov.
import { NextResponse } from "next/server";
import type { ApiGalat, FormPemeliharaan, KodeGalat } from "@/contracts";
import { GalatAuth } from "@/lib/auth/konteks";
import { wajibPeran } from "@/lib/auth/server";
import { repositoriPemeliharaan } from "@/modules/pemeliharaan/repository";
import { buatPemeliharaanService } from "@/modules/pemeliharaan/service";

const STATUS_HTTP: Record<KodeGalat, number> = {
  VALIDASI_GAGAL: 400,
  TIDAK_TERAUTENTIKASI: 401,
  TIDAK_BERWENANG: 403,
  TIDAK_DITEMUKAN: 404,
  KONFLIK: 409,
  DATA_BELUM_LENGKAP: 422,
  GAGAL_SIMPAN: 500,
  GAGAL_INTERNAL: 500,
};

function galat(kode: KodeGalat, pesan: string) {
  const isi: ApiGalat = { ok: false, kode, pesan };
  return NextResponse.json(isi, { status: STATUS_HTTP[kode] });
}

export async function POST(req: Request) {
  let idTeknisi: string;
  try {
    ({ idTeknisi } = await wajibPeran("TEKNISI"));
  } catch (e) {
    if (e instanceof GalatAuth) {
      return e.kode === "TIDAK_LOGIN"
        ? galat("TIDAK_TERAUTENTIKASI", "Silakan masuk terlebih dahulu.")
        : galat("TIDAK_BERWENANG", "Akses ditolak.");
    }
    console.error("[pemeliharaan] Gagal membaca sesi:", e);
    return galat("GAGAL_INTERNAL", "Terjadi kesalahan. Coba lagi.");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return galat("VALIDASI_GAGAL", "Format isian tidak valid.");
  }

  const service = buatPemeliharaanService(idTeknisi, repositoriPemeliharaan);
  const hasil = await service.simpanCatatan(body as FormPemeliharaan);
  return NextResponse.json(hasil, { status: hasil.ok ? 201 : STATUS_HTTP[hasil.kode] });
}
