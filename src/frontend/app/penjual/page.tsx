"use client";

import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";

export default function SellerDashboardPage() {
  const router = useRouter();

  return (
    <AppLayout
      role="seller"
      isAuthenticated
      title="Seller Dashboard"
      showHeader
      headerClassName="bg-[#1bb0c7] px-5 pb-5 pt-8"
      bodyClassName="bg-[#e6e0c8] px-4 py-5"
    >
      <div className="rounded-[18px] bg-[#f7f0dc] p-5 shadow-sm">
        <p className="text-sm uppercase tracking-[0.12em] text-[#60756b]">
          Kelola toko Anda
        </p>
        <h3 className="mt-2 text-2xl font-black text-[#1a8ca1]">
          Listing makanan
        </h3>
        <p className="mt-2 text-sm text-[#60756b]">
          Tambahkan, perbarui, dan nonaktifkan listing makanan surplus Anda.
        </p>
        <button
          type="button"
          onClick={() => router.push("/penjual/listing")}
          className="mt-5 rounded-lg bg-[#1a8ca1] px-4 py-2 text-sm font-bold text-white hover:bg-[#14798b]"
        >
          Kelola Listing
        </button>
      </div>
    </AppLayout>
  );
}
