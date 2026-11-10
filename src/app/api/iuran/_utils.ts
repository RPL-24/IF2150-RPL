// src/app/api/iuran/_utils.ts
import { NextResponse } from "next/server";
import type { ApiGalat, KodeGalat } from "@/contracts";

export const STATUS_HTTP: Record<KodeGalat, number> = {
  VALIDASI_GAGAL: 400,
  TIDAK_TERAUTENTIKASI: 401,
  TIDAK_BERWENANG: 403,
  TIDAK_DITEMUKAN: 404,
  KONFLIK: 409,
  DATA_BELUM_LENGKAP: 422,
  GAGAL_SIMPAN: 500,
  GAGAL_INTERNAL: 500,
};

export function responGalat(kode: KodeGalat, pesan: string) {
  const isi: ApiGalat = { ok: false, kode, pesan };
  return NextResponse.json(isi, { status: STATUS_HTTP[kode] });
}