import type { Context } from "hono";
import { permintaanTidakValid } from "./errors";

/** Parses a JSON object body or throws 400. */
export async function bacaBody(c: Context<any>): Promise<Record<string, unknown>> {
  try {
    const body = await c.req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("not an object");
    }
    return body as Record<string, unknown>;
  } catch {
    throw permintaanTidakValid("Body harus berupa JSON yang valid");
  }
}

/** Reads a positive integer query param with a fallback. */
export function angkaQuery(
  c: Context<any>,
  nama: string,
  bawaan: number,
  maks: number,
): number {
  const mentah = c.req.query(nama);
  if (!mentah) return bawaan;
  const nilai = Number.parseInt(mentah, 10);
  if (!Number.isFinite(nilai) || nilai < 0) return bawaan;
  return Math.min(nilai, maks);
}
