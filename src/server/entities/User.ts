// C01 · User (kelas entity DPPL). Pemilik: Peran F.
// Nama fungsi mengikuti nama operasi di DPPL.
// Dipakai lib/auth.ts (getCurrentUser). getIdUser/getRole = field `id`/`role` pada UserAktif;
// isWarga/isAdmin/isEksekutor = requireRole(...) di lib/auth.ts.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/** C01 muatProfil (Algo-001): profil + peran akun. `data` null bila profil tidak ada / tidak terlihat. */
export async function muatProfil(supabase: SupabaseClient<Database>, idUser: string) {
  return supabase.from("profiles").select("id, nama, role").eq("id", idUser).maybeSingle();
}
