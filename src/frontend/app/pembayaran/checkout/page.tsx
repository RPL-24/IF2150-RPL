"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout";
import { ApiError, checkoutPembayaran } from "@/lib/api";

function CheckoutForm() {
  const router = useRouter();
  const idListing = Number(useSearchParams().get("listing"));
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setPesan("");
    try {
      const trx = await checkoutPembayaran(idListing, jumlah);
      router.push(`/pembayaran/${trx.id_transaksi}`);
    } catch (e) {
      setPesan(e instanceof ApiError ? e.message : "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <AppLayout
      role="buyer"
      isAuthenticated
      title="Checkout"
      showHeader
      headerClassName="bg-[#1bb0c7] px-5 pb-5 pt-8"
      bodyClassName="bg-[#e6e0c8] px-4 py-5"
    >
      <label className="block text-lg font-medium">
        Jumlah porsi
        <input
          type="number"
          min={1}
          value={jumlah}
          onChange={(e) => setJumlah(Number(e.target.value))}
          className="mt-2 w-full rounded-md border border-[#d7d0b4] bg-[#f7f0dc] p-3"
        />
      </label>
      {pesan && <p className="mt-3 text-red-600">{pesan}</p>}
      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className="mt-6 w-full rounded-md bg-[#f25f4b] px-4 py-4 text-xl font-black text-white shadow-sm disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Lanjut ke pembayaran"}
      </button>
    </AppLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutForm />
    </Suspense>
  );
}