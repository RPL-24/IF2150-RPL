import { HasilPerbaikanForm } from "@/client/views/HasilPerbaikanForm";
import { bukaLaporan } from "@/server/controllers/PenugasanController";

type Props = { params: Promise<{ idTiket: string }> };

export default async function Page({ params }: Props) {
  const { idTiket } = await params;
  const hasilTiket = await bukaLaporan(idTiket);
  return <HasilPerbaikanForm hasilTiket={hasilTiket} />;
}
