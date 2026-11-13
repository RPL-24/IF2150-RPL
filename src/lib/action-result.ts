// Bentuk balikan semua Server Action (AGENTS.md bagian 9).
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function gagal(error: string): ActionResult<never> {
  return { ok: false, error };
}
