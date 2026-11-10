"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ScanPembayaranPage() {
  // useParams butuh runtime → dibungkus Suspense agar prerendering tidak macet.
  return (
    <Suspense fallback={null}>
      <KontenScan />
    </Suspense>
  );
}

function KontenScan() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [pesan, setPesan] = useState("Mengonfirmasi pembayaran demo…");

  useEffect(() => {
    let masihAktif = true;
    fetch(`/api/pembayaran/scan/${encodeURIComponent(token)}`, { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Pembayaran tidak dapat dikonfirmasi.");
        if (data.status === "LUNAS") {
          router.replace("/pembayaran/scan-sukses");
          return;
        }
        throw new Error(data.status === "BATAL" ? "Batas waktu pembayaran telah lewat." : "Pembayaran tidak dapat dikonfirmasi.");
      })
      .catch((error: unknown) => {
        if (masihAktif) setPesan(error instanceof Error ? error.message : "Pembayaran tidak dapat dikonfirmasi.");
      });
    return () => { masihAktif = false; };
  }, [router, token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e6e0c8] px-5 py-10">
      <section className="w-full max-w-md rounded-[18px] border border-[#d7d0b4] bg-[#f7f0dc] p-7 text-center shadow-sm">
        <h1 className="text-2xl font-black text-[#1b8ca3]">Konfirmasi pembayaran</h1>
        <p role="status" className="mt-3 text-[#5d625b]">{pesan}</p>
        {pesan !== "Mengonfirmasi pembayaran demo…" && (
          <button type="button" onClick={() => router.push("/")} className="mt-6 rounded-xl bg-[#f25f4b] px-6 py-3 font-bold text-white shadow-sm">
            Kembali ke halaman utama
          </button>
        )}
      </section>
    </main>
  );
}
