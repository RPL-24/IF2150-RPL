import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { BERANDA_ROLE } from "@/lib/constants";
import { muatProfil } from "@/server/entities/User";
import type { Enums } from "@/types/database";

// Hanya untuk kode server (Server Component, Server Action, Route Handler).

export type UserAktif = { id: string; nama: string; role: Enums<"peran_user"> };

/** User yang sedang login + profilnya; null jika belum login. Sekali per request. */
export const getCurrentUser = cache(async (): Promise<UserAktif | null> => {
  const supabase = await createClient();
  // getClaims() memverifikasi JWT. JANGAN pakai getSession() untuk keputusan akses.
  const { data } = await supabase.auth.getClaims();
  const id = data?.claims.sub;
  if (!id) return null;

  const { data: profil } = await muatProfil(supabase, id);
  return profil;
});

/** Untuk verifikasiAkses() di Server Action. */
export async function requireRole(
  ...roles: Enums<"peran_user">[]
): Promise<ActionResult<UserAktif>> {
  const user = await getCurrentUser();
  if (!user) return gagal("Silakan masuk terlebih dahulu.");
  if (!roles.includes(user.role)) return gagal("Anda tidak memiliki akses ke fitur ini.");
  return ok(user);
}

/** Untuk layout/page: redirect jika belum login atau role tidak cocok. */
export async function requireRoleOrRedirect(...roles: Enums<"peran_user">[]): Promise<UserAktif> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(BERANDA_ROLE[user.role]);
  return user;
}
