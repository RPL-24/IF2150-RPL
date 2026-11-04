"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ambilDetailKatalog, ApiError, type ListingKatalog } from "@/lib/api";
import DaftarListing from "./DaftarListing";
import FotoListing from "./FotoListing";
import PesanKatalog, { perluLogin, PesanPerluLogin } from "./PesanKatalog";
import TombolBeli from "./TombolBeli";
import { formatRupiah, formatWaktu } from "./format";

type State =
  | { untukId: string; status: "ok"; listing: ListingKatalog }
  | { untukId: string; status: "error"; pesan: string; tidakTersedia: boolean }
  | { untukId: string; status: "perluLogin" };

/** pilihListing + tampilkanDetail (Algo-C11-02, UC03). */
export default function DetailListing() {
  const { id } = useParams<{ id: string }>();
  const [hasil, setHasil] = useState<State | null>(null);
  // Hasil milik id lain (mis. pindah listing) dianggap masih memuat
  const state = hasil?.untukId === id ? hasil : { status: "memuat" as const };

  useEffect(() => {
    let aktif = true;
    ambilDetailKatalog(id)
      .then((listing) => aktif && setHasil({ untukId: id, status: "ok", listing }))
      .catch((e) => {
        if (!aktif) return;
        if (perluLogin(e)) return setHasil({ untukId: id, status: "perluLogin" });
        const status = e instanceof ApiError ? e.status : 0;
        setHasil({
          untukId: id,
          status: "error",
          pesan: status === 404 || status === 422 ? "Listing sudah tidak tersedia" : e instanceof ApiError ? e.message : "Gagal memuat detail listing",
          tidakTersedia: status === 404 || status === 422,
        });
      });
    return () => {
      aktif = false;
    };
  }, [id]);

  if (state.status === "memuat") return <PesanKatalog>Memuat detail listing…</PesanKatalog>;
  if (state.status === "perluLogin") return <PesanPerluLogin />;

  if (state.status === "error") {
    // Skenario alternatif UC03: listing sudah dihapus/habis → tampilkan pesan lalu daftar listing
    return (
      <div className="flex flex-col gap-6">
        <PesanKatalog jenis="error">{state.pesan}</PesanKatalog>
        {state.tidakTersedia && <DaftarListing />}
      </div>
    );
  }

  const { listing } = state;
  return (
    <article className="flex flex-col gap-6 md:flex-row">
      <FotoListing foto={listing.foto} alt={listing.nama_makanan} className="aspect-[4/3] w-full rounded-xl md:w-1/2" />
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">{listing.nama_makanan}</h1>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatRupiah(listing.harga)}</p>
        </div>
        {listing.deskripsi && <p className="text-zinc-700 dark:text-zinc-300">{listing.deskripsi}</p>}
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-zinc-500">Porsi</dt>
          <dd>{listing.porsi}</dd>
          <dt className="text-zinc-500">Kondisi</dt>
          <dd>{listing.kondisi}</dd>
          <dt className="text-zinc-500">Stok</dt>
          <dd>{listing.stok}</dd>
          <dt className="text-zinc-500">Batas kedaluwarsa</dt>
          <dd>{formatWaktu(listing.batas_kedaluwarsa)}</dd>
        </dl>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <TombolBeli idListing={listing.id_listing} />
          <Link href="/katalog" className="text-sm text-zinc-600 underline dark:text-zinc-400">
            Kembali ke katalog
          </Link>
        </div>
      </div>
    </article>
  );
}
