import LayarI07 from "@/components/layar/LayarI07";

export default async function Halaman({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LayarI07 id={id} />;
}
