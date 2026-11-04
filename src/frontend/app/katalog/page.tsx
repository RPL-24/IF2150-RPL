import type { Metadata } from "next";
import DaftarListing from "@/components/katalog/DaftarListing";

export const metadata: Metadata = { title: "Katalog Makanan Surplus" };

// KatalogView (UC02): daftar listing yang tersedia
export default function KatalogPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Katalog Makanan Surplus</h1>
      <DaftarListing />
    </main>
  );
}
