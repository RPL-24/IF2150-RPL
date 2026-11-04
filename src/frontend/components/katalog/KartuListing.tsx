import Link from "next/link";
import type { ListingKatalog } from "@/lib/api";
import FotoListing from "./FotoListing";
import { formatRupiah, formatWaktu } from "./format";

/** Kartu listing di daftar katalog: foto, nama, harga, stok, batas kedaluwarsa (UC02). */
export default function KartuListing({ listing }: { listing: ListingKatalog }) {
  return (
    <Link
      href={`/katalog/${listing.id_listing}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <FotoListing foto={listing.foto} alt={listing.nama_makanan} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h2 className="font-semibold group-hover:underline">{listing.nama_makanan}</h2>
        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatRupiah(listing.harga)}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Stok: {listing.stok}</p>
        <p className="mt-auto pt-2 text-xs text-zinc-500">Ambil sebelum {formatWaktu(listing.batas_kedaluwarsa)}</p>
      </div>
    </Link>
  );
}
