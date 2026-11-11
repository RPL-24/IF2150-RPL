import PageTitle from "@/components/shell/PageTitle";
import KalkulasiIuran from "@/modules/iuran/ui/KalkulasiIuran";

export default function LayarI14() {
  return (
    <>
      <PageTitle judul="Kalkulasi dan finalisasi iuran" deskripsi="Hitung dan finalkan iuran periode." />
      <KalkulasiIuran />
    </>
  );
}
