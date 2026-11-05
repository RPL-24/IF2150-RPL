import LayarI11 from "@/components/layar/LayarI11";

export default async function Halaman({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LayarI11 id={id} />;
}
