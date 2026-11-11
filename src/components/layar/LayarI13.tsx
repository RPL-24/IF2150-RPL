import PageTitle from "@/components/shell/PageTitle";
import AnalitikKomunal from "@/modules/iuran/ui/AnalitikKomunal";

export default function LayarI13() {
  return (
    <>
      <PageTitle judul="Analitik komunal" deskripsi="Pemakaian air dan energi dalam satu periode." />
      <AnalitikKomunal />
    </>
  );
}
