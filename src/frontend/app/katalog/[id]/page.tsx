import type { Metadata } from "next";
import { Suspense } from "react";
import DetailListing from "@/components/katalog/DetailListing";
import PesanKatalog from "@/components/katalog/PesanKatalog";

export const metadata: Metadata = { title: "Detail Listing" };

// KatalogView (UC03): detail satu listing + tombol beli ke checkout P4.
// Suspense wajib karena useParams di DetailListing baru diketahui saat request (cacheComponents).
export default function DetailListingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Suspense fallback={<PesanKatalog>Memuat detail listing…</PesanKatalog>}>
        <DetailListing />
      </Suspense>
    </main>
  );
}
