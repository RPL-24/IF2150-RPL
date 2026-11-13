import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { BERANDA_ROLE } from "@/lib/constants";

// Beranda: arahkan sesuai role. Tanpa user (atau profil hilang) → /status (publik),
// BUKAN /login, supaya tidak loop dengan proxy yang melempar user ber-token dari /login ke /.
export default async function Home() {
  const user = await getCurrentUser();
  redirect(user ? BERANDA_ROLE[user.role] : "/status");
}
