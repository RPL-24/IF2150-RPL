// Pemanggilan API iuran dari komponen klien. Kegagalan jaringan atau respons bukan JSON menjadi ApiGalat biasa.
import type { ApiRespons } from "@/contracts";

const GAGAL_KONEKSI: ApiRespons<never> = { ok: false, kode: "GAGAL_INTERNAL", pesan: "Koneksi gagal. Coba lagi." };

export async function panggil<T>(url: string, init?: RequestInit): Promise<ApiRespons<T>> {
  try {
    const res = await fetch(url, init);
    return (await res.json()) as ApiRespons<T>;
  } catch {
    return GAGAL_KONEKSI;
  }
}

export const kirimPeriode = <T,>(url: string, idPeriode: string) =>
  panggil<T>(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idPeriode }) });

export const ambilDenganPeriode = <T,>(url: string, idPeriode: string) =>
  panggil<T>(`${url}?idPeriode=${encodeURIComponent(idPeriode)}`);
