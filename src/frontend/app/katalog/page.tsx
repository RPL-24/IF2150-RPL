import type { Metadata } from "next";
import { Suspense } from "react";
import DaftarListing from "@/components/katalog/DaftarListing";
import FormPencarian from "@/components/katalog/FormPencarian";
import PesanKatalog from "@/components/katalog/PesanKatalog";

export const metadata: Metadata = { title: "Katalog Makanan Surplus" };

// KatalogView (UC02 + UC04): kolom cari & filter harga, lalu daftar listing yang tersedia.
// Suspense wajib karena useSearchParams baru diketahui saat request (cacheComponents).
export default function KatalogPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Katalog Makanan Surplus</h1>
      <Suspense fallback={<PesanKatalog>Memuat katalog…</PesanKatalog>}>
        <FormPencarian />
        <DaftarListing />
      </Suspense>
    </main>
  );
}
