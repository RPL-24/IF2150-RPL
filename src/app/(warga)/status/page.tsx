import { StatusLaporanPage } from "@/client/views/StatusLaporanPage";
import { getCurrentUser } from "@/lib/auth";
import { ambilLaporanPublik, ambilRiwayatWarga } from "@/server/controllers/StatusController";

export default async function Page() {
  const user = await getCurrentUser();
  const warga = user?.role === "warga";
  const riwayatAwal = warga ? await ambilRiwayatWarga() : null;
  const petaAwal = warga ? null : await ambilLaporanPublik();

  return (
    <StatusLaporanPage
      key={user?.id ?? "publik"}
      peran={user?.role ?? null}
      riwayatAwal={riwayatAwal}
      petaAwal={petaAwal}
    />
  );
}
