import { PenugasanPage } from "@/client/views/PenugasanPage";
import { doSorting } from "@/server/controllers/PenugasanController";

export default async function Page() {
  const hasilAwal = await doSorting();
  return <PenugasanPage hasilAwal={hasilAwal}/>;
}
