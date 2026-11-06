import { redirect } from "next/navigation";
import PageTitle from "@/components/shell/PageTitle";
import { Alert, Card } from "@/components/ui";
import { HALAMAN_LOGIN } from "@/lib/auth/konteks";
import { getSesi } from "@/lib/auth/server";
import { repositoriPemeliharaan } from "@/modules/pemeliharaan/repository";
import type { PerangkatRingkas } from "@/modules/pemeliharaan/service";
import FormPemeliharaan from "./FormPemeliharaan";

export default async function LayarI12() {
  const sesi = await getSesi();
  if (sesi?.peran !== "TEKNISI") redirect(HALAMAN_LOGIN);

  let perangkat: PerangkatRingkas[] | null = null;
  try {
    perangkat = await repositoriPemeliharaan.daftarPerangkatTeknisi(sesi.idTeknisi);
  } catch (galat) {
    console.error("[pemeliharaan] Gagal memuat perangkat:", galat);
  }

  return (
    <>
      <PageTitle judul="Pencatatan pemeliharaan" deskripsi="Simpan jejak tindakan dan hasil perawatan." />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 24,
          alignItems: "start",
        }}
      >
        <Card>
          <h2 style={{ marginBottom: 16 }}>Catatan baru</h2>
          {perangkat === null && <Alert nada="bahaya">Daftar perangkat gagal dimuat. Muat ulang halaman ini.</Alert>}
          {perangkat?.length === 0 && <Alert>Anda belum memiliki perangkat yang ditugaskan.</Alert>}
          {perangkat && perangkat.length > 0 && <FormPemeliharaan perangkat={perangkat} />}
        </Card>
        <Card>
          <h2 style={{ marginBottom: 12 }}>Jejak perawatan perangkat</h2>
          <p>Catat tindakan dan hasil pemeriksaan agar kondisi perangkat dapat ditinjau kembali.</p>
        </Card>
      </div>
    </>
  );
}
