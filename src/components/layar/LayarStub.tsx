import PageTitle from "@/components/shell/PageTitle";

export default function LayarStub({
  kode,
  uc,
  judul,
  deskripsi,
  id,
}: {
  kode: string;
  uc: string;
  judul: string;
  deskripsi: string;
  id?: string;
}) {
  return (
    <>
      <PageTitle judul={judul} deskripsi={deskripsi} />
      <div className="note">
        {kode} ({uc}){id ? `, id ${id}` : ""}: belum diimplementasikan.
      </div>
    </>
  );
}
