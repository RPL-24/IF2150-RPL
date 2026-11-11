import PageTitle from "@/components/shell/PageTitle";
import TagihanWarga from "@/modules/iuran/ui/TagihanWarga";

export default function LayarI04() {
  return (
    <>
      <PageTitle judul="Tagihan iuran final" deskripsi="Tagihan final milik Anda." />
      <TagihanWarga />
    </>
  );
}
