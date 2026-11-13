import { LaporPage } from "@/client/views/LaporPage";
import { requireRoleOrRedirect } from "@/lib/auth";
// file routing untuk URL /lapor. File ini berjalan di server.
// mengecek siapa yang membuka halaman. Kalau belum login, pengguna diarahkan ke /login

export default async function Page() {
  const user = await requireRoleOrRedirect("warga");
  // idUser dibutuhkan unggahMedia() untuk path berkas laporan/{idUser}/...
  return <LaporPage idUser={user.id} />;
}
