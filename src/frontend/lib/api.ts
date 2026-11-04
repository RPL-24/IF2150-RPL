// API client bersama. Tiap fitur hanya menambah fungsi miliknya sendiri.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");

/** URL foto listing sesuai kontrak P2 ↔ P3: NEXT_PUBLIC_API_URL + "/" + foto. null jika tidak ada foto. */
export function urlFoto(foto: string | null | undefined): string | null {
  return foto ? `${API_URL}/${foto.replace(/^\/+/, "")}` : null;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Request ke "/api/..." diteruskan ke backend lewat rewrites di next.config.ts (same-origin),
// jadi cookie sesi httpOnly "session_token" dari login P1 ikut terkirim otomatis.
async function getJson<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { credentials: "same-origin", cache: "no-store" });
  } catch {
    throw new ApiError(0, "Tidak dapat terhubung ke server");
  }
  if (!res.ok) {
    let pesan = `Terjadi kesalahan pada server (HTTP ${res.status})`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") pesan = body.detail;
    } catch {}
    throw new ApiError(res.status, pesan);
  }
  return res.json() as Promise<T>;
}

// ---------- Katalog (P3: UC02, UC03) ----------

export type ListingKatalog = {
  id_listing: number;
  id_penjual: number;
  nama_makanan: string;
  deskripsi: string | null;
  porsi: string;
  kondisi: string;
  foto: string | null;
  harga: number;
  stok: number;
  batas_kedaluwarsa: string;
};

export function ambilDaftarKatalog(): Promise<ListingKatalog[]> {
  return getJson<ListingKatalog[]>("/api/katalog");
}

export function ambilDetailKatalog(idListing: number | string): Promise<ListingKatalog> {
  return getJson<ListingKatalog>(`/api/katalog/${encodeURIComponent(String(idListing))}`);
}
