"use client";

import { useRouter } from "next/navigation";
import FormListing from "@/components/penjual/FormListing";
import { tambahListing, DataListingPayload } from "@/lib/api";

export default function PageTambahListing() {
  const router = useRouter();

  const handleTambah = async (data: DataListingPayload) => {
    await tambahListing(data);
    router.push("/penjual/listing");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <FormListing onSubmit={handleTambah} isEditing={false} />
    </div>
  );
}