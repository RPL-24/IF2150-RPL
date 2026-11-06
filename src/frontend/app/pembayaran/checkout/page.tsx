"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../api";

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
      const trx = await api<{ id_transaksi: number }>("/pembayaran/checkout", {
        method: "POST",
        body: JSON.stringify({ id_listing: idListing, jumlah }),
      });
      router.push(`/pembayaran/${trx.id_transaksi}`);
    } catch (e) {
      setPesan((e as Error).message);
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Checkout</h1>
      <label className="block mt-4">
        Jumlah porsi
        <input
          type="number"
          min={1}
          value={jumlah}
          onChange={(e) => setJumlah(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </label>
      {pesan && <p className="text-red-600 mt-2">{pesan}</p>}
      <button
        disabled={loading}
        onClick={submit}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? "Memproses..." : "Lanjut ke pembayaran"}
      </button>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutForm />
    </Suspense>
  );
}