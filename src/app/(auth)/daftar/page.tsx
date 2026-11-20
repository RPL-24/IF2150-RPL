import { FormDaftar } from "@/client/components/shared/FormDaftar";
import { nextAman } from "@/lib/navigasi";

export default async function Page({ searchParams }: PageProps<"/daftar">) {
  const { next } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-semibold">Daftar</h1>
      <FormDaftar next={nextAman(typeof next === "string" ? next : null)} />
    </main>
  );
}
