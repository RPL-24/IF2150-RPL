import { redirect } from "next/navigation";
import { HALAMAN_LOGIN, type KonteksSesi, type Peran } from "@/lib/auth/konteks";
import { getSesi } from "@/lib/auth/server";

// Layar menolak peran lain dengan mengarahkan ke login; API tetap memeriksa ulang di server.
export async function sesiLayar<P extends Peran>(peran: P): Promise<Extract<KonteksSesi, { peran: P }>> {
  const sesi = await getSesi();
  if (sesi?.peran !== peran) redirect(HALAMAN_LOGIN);
  return sesi as Extract<KonteksSesi, { peran: P }>;
}
