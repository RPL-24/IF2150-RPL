import { EvaluasiPage } from "@/client/views/EvaluasiPage";
import { ambilDaftarUntukEvaluasi } from "@/server/controllers/EvaluasiController";

export default async function Page() {
  const hasilAwal = await ambilDaftarUntukEvaluasi();
  return <EvaluasiPage hasilAwal={hasilAwal} />;
}
