import type { Metadata } from "next";
import { Suspense } from "react";
import { AppLayout } from "@/components/layout";
import DetailListing from "@/components/katalog/DetailListing";
import PesanKatalog from "@/components/katalog/PesanKatalog";

export const metadata: Metadata = { title: "Detail Listing" };

export default function DetailListingPage() {
  return (
    <AppLayout
      role="buyer"
      isAuthenticated
      title="Detail Listing"
      showHeader
      theme="green"
      headerClassName="px-5 pb-4 pt-8"
      bodyClassName="px-4 py-5 lg:px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <Suspense fallback={<PesanKatalog>Memuat detail listing…</PesanKatalog>}>
          <DetailListing />
        </Suspense>
      </div>
    </AppLayout>
  );
}
