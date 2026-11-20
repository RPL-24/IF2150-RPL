import { HasilPerbaikanForm } from "@/client/views/HasilPerbaikanForm";
import { requireRoleOrRedirect } from "@/lib/auth";
import { bukaLaporan } from "@/server/controllers/PenugasanController";

type Props = { params: Promise<{ idTiket: string }> };

export default async function Page({ params }: Props) {
  const { idTiket } = await params;
  const user = await requireRoleOrRedirect("eksekutor");
  const hasilTiket = await bukaLaporan(idTiket);
  return <HasilPerbaikanForm hasilTiket={hasilTiket} idUser={user.id} />;
}
