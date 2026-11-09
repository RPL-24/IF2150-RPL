/**
 * Validation predicates for class `Validasi` (C-33).
 * Source: Algo-023..Algo-026.
 */

export const POLA_WAKTU = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
export const POLA_EXPO_TOKEN = /^Expo(nent)?PushToken\[.+\]$/;

/** Algo-023: `validasiWaktu` — "HH:MM". */
export function validasiWaktu(waktu: unknown): waktu is string {
  return typeof waktu === "string" && POLA_WAKTU.test(waktu);
}

/** Algo-026: `validasiInput` — every required string is non-empty and not whitespace-only. */
export function validasiInput(isi: (unknown)[]): boolean {
  return isi.every(
    (teks) => typeof teks === "string" && teks.trim().length > 0,
  );
}

/** Algo-003 device token shape check, part of `daftarkanPerangkat`. */
export function validasiTokenPush(tokenPush: unknown): tokenPush is string {
  return typeof tokenPush === "string" && POLA_EXPO_TOKEN.test(tokenPush);
}

/** Shared ISO-8601 date-time parse; used by `validasiJadwal` (Algo-025). */
export function parseIso8601(nilai: unknown): Date | null {
  if (typeof nilai !== "string" || nilai.trim().length === 0) return null;
  const waktu = new Date(nilai);
  if (Number.isNaN(waktu.getTime())) return null;
  // Require a full timestamp (T separator) so bare dates are rejected.
  if (!/T\d{2}:\d{2}/.test(nilai)) return null;
  return waktu;
}

/**
 * Algo-025 `validasiJadwal`, minus the database checks that need the request context.
 * Returns the parsed bounds when the window is well-formed.
 */
export function validasiRentangJadwal(
  waktu: unknown,
  waktuSelesai: unknown,
): { mulai: Date; selesai: Date } | null {
  const mulai = parseIso8601(waktu);
  const selesai = parseIso8601(waktuSelesai);
  if (!mulai || !selesai) return null;
  if (selesai.getTime() <= mulai.getTime()) return null;
  return { mulai, selesai };
}

/** Escapes LIKE wildcards with `!` per Algo-017. */
export function escapeLikePattern(kataKunci: string): string {
  return kataKunci.replace(/[!%_]/g, (ch) => `!${ch}`);
}
