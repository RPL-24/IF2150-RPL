import { NextResponse } from "next/server";
import type { ApiGalat, ApiRespons, KodeGalat } from "@/contracts";
import { GalatAuth, type KonteksSesi } from "@/lib/auth/konteks";
import { getSesi } from "@/lib/auth/server";

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

export function responGalat(kode: KodeGalat, pesan: string) {
  const isi: ApiGalat = { ok: false, kode, pesan };
  return NextResponse.json(isi, { status: STATUS_HTTP[kode] });
}

// Hasil service apa adanya: `sukses` menentukan kode HTTP bila ok.
export function responHasil<T>(hasil: ApiRespons<T>, sukses = 200) {
  return NextResponse.json(hasil, { status: hasil.ok ? sukses : STATUS_HTTP[hasil.kode] });
}

// Sesi dibaca di server; peran tiap operasi diperiksa ulang oleh LaporanController.
export async function ambilSesi(): Promise<KonteksSesi | NextResponse> {
  try {
    const sesi = await getSesi();
    return sesi ?? responGalat("TIDAK_TERAUTENTIKASI", "Silakan masuk terlebih dahulu.");
  } catch (e) {
    if (e instanceof GalatAuth) return responGalat("TIDAK_TERAUTENTIKASI", "Silakan masuk terlebih dahulu.");
    console.error("[laporan] Gagal membaca sesi:", e);
    return responGalat("GAGAL_INTERNAL", "Terjadi kesalahan. Coba lagi.");
  }
}
