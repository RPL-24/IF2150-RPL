import { FormMasuk } from "@/client/components/shared/FormMasuk";
import { nextAman } from "@/lib/navigasi";

export default async function Page({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-semibold">Masuk</h1>
      <FormMasuk next={nextAman(typeof next === "string" ? next : null)} />
    </main>
  );
}
