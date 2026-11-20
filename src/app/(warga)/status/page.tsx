import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { StatusLaporanPage } from "@/client/views/StatusLaporanPage";
import { gagal } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/auth";
import { ambilDetailStatus, ambilLaporanPublik, ambilRiwayatWarga } from "@/server/controllers/StatusController";

export default async function Page({ searchParams }: PageProps<"/status">) {
  const { tiket } = await searchParams;
  const user = await getCurrentUser();
  const warga = user?.role === "warga";
  const adaTautanTiket = tiket !== undefined;
  const tiketAwal = typeof tiket === "string" ? tiket : null;

  if (!user && adaTautanTiket) {
    const query = new URLSearchParams();
    for (const nilai of typeof tiket === "string" ? [tiket] : tiket) query.append("tiket", nilai);
    redirect(`/login?next=${encodeURIComponent(`/status?${query.toString()}`)}`);
  }

  // C16 bukaTautanNotifikasi: lonceng shared sudah menerjemahkan notifikasi menjadi ?tiket=.
  // C22 tetap memverifikasi format, role, dan akses RLS saat membaca detail tiket pribadi.
  const [riwayatAwal, petaAwal, detailAwal] = await Promise.all([
    warga ? ambilRiwayatWarga() : null,
    !warga && !adaTautanTiket ? ambilLaporanPublik() : null,
    !adaTautanTiket ? null : !warga ? gagal("Riwayat laporan hanya tersedia untuk akun warga.")
      : tiketAwal === null ? gagal("Format ID tiket tidak valid.") : ambilDetailStatus(tiketAwal),
  ]);
  // Dibuat setelah pembacaan request, hanya di server. Navigasi ke notifikasi yang sama
  // juga harus membuka ulang detail, bukan mempertahankan tab/pilihan dari state lama.
  const identitasTautan = adaTautanTiket ? randomUUID() : null;

  return (
    <StatusLaporanPage
      key={JSON.stringify([user?.id ?? "publik", tiket ?? null, identitasTautan])}
      peran={user?.role ?? null}
      riwayatAwal={riwayatAwal}
      petaAwal={petaAwal}
      tiketAwal={tiketAwal}
      detailAwal={detailAwal}
    />
  );
}
