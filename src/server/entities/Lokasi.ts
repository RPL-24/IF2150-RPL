// C03 · Lokasi (kelas entity DPPL). Pemilik: Peran F.
// Nama fungsi mengikuti nama operasi di DPPL.
// Fungsi murni: JANGAN impor lib/supabase/* di file ini (dipakai juga di client).

import { BATAS_WILAYAH } from "@/lib/batas-wilayah";

export type Koordinat = { latitude: number; longitude: number };

/**
 * Cek apakah titik berada di dalam polygon batas wilayah (ray casting, aturan even-odd).
 * Polygon berformat [lat, lng]. Operasi tambahan di luar DPPL (lihat docs/implementasi/perubahan-dppl.md).
 */
export function dalamWilayah(
  titik: Koordinat,
  polygon: ReadonlyArray<readonly [number, number]> = BATAS_WILAYAH,
): boolean {
  const x = titik.longitude;
  const y = titik.latitude;
  let dalam = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [yi, xi] = polygon[i];
    const [yj, xj] = polygon[j];
    const memotongGarisY = yi > y !== yj > y;
    if (!memotongGarisY) continue;

    const xPotong = xi + ((y - yi) * (xj - xi)) / (yj - yi);
    if (x < xPotong) dalam = !dalam;
  }

  return dalam;
}

const RADIUS_BUMI_M = 6_371_000;

/** Jarak dua titik di permukaan bumi dalam meter (rumus haversine). Operasi DPPL C03. */
export function hitungJarak(a: Koordinat, b: Koordinat): number {
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLng = (b.longitude - a.longitude) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * RADIUS_BUMI_M * Math.asin(Math.sqrt(h));
}
