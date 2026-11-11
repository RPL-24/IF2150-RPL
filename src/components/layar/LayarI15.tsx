import PageTitle from "@/components/shell/PageTitle";
import RekapIuran from "@/modules/iuran/ui/RekapIuran";

export default function LayarI15() {
  return (
    <>
      <PageTitle judul="Rekapitulasi iuran" deskripsi="Rekap iuran dan ekspor." />
      <RekapIuran />
    </>
  );
}
