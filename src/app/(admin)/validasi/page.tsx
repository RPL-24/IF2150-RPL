import { ValidasiPage } from "@/client/views/ValidasiPage";
import { susunAntrean } from "@/server/controllers/ValidasiController";

export default async function Page() {
  const hasilAwal = await susunAntrean();
  return <ValidasiPage hasilAwal={hasilAwal} />;
}
