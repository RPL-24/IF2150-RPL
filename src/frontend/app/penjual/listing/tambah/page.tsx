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

  return <FormListing onSubmit={handleTambah} isEditing={false} />;
}