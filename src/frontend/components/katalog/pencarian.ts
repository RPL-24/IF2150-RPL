// Nama query param di URL /katalog sama dengan query param backend GET /api/katalog.
export const PARAM_KATA_KUNCI = "kata_kunci";
export const PARAM_HARGA_MIN = "harga_min";
export const PARAM_HARGA_MAKS = "harga_maks";

export type Pencarian = {
  kataKunci: string | null;
  hargaMin: number | null;
  hargaMaks: number | null;
  /** true jika harga di URL bukan bilangan bulat (mis. ?harga_min=abc) */
  hargaTidakValid: boolean;
};

type BacaParam = { get(nama: string): string | null };

function bacaHarga(nilai: string | null): number | null | undefined {
  const s = nilai?.trim();
  if (!s) return null;
  return /^-?\d+$/.test(s) ? Number(s) : undefined;
}

/** Baca kata kunci & rentang harga dari URL. Field kosong berarti filter tidak dipakai. */
export function bacaPencarian(params: BacaParam): Pencarian {
  const hargaMin = bacaHarga(params.get(PARAM_HARGA_MIN));
  const hargaMaks = bacaHarga(params.get(PARAM_HARGA_MAKS));
  return {
    kataKunci: params.get(PARAM_KATA_KUNCI)?.trim() || null,
    hargaMin: hargaMin ?? null,
    hargaMaks: hargaMaks ?? null,
    hargaTidakValid: hargaMin === undefined || hargaMaks === undefined,
  };
}

export function adaPencarian(p: Pencarian): boolean {
  return p.kataKunci !== null || p.hargaMin !== null || p.hargaMaks !== null || p.hargaTidakValid;
}
