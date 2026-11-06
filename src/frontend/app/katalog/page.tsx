import type { Metadata } from "next";
import { Suspense } from "react";
import { AppLayout } from "@/components/layout";
import DaftarListing from "@/components/katalog/DaftarListing";
import FormPencarian from "@/components/katalog/FormPencarian";
import PesanKatalog from "@/components/katalog/PesanKatalog";

export const metadata: Metadata = { title: "Katalog Makanan Surplus" };

export default function KatalogPage() {
  return (
    <AppLayout
      role="buyer"
      isAuthenticated
      title="What do you want to eat today?"
      showHeader
      headerClassName="bg-[#1bb0c7] px-5 pb-4 pt-8"
      bodyClassName="px-4 py-5 lg:px-6"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Suspense fallback={<PesanKatalog>Memuat katalog…</PesanKatalog>}>
          <div className="space-y-5">
            <FormPencarian />
            <DaftarListing />
          </div>
        </Suspense>
      </div>
    </AppLayout>
  );
}
