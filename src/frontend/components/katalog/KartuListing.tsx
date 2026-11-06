import Link from "next/link";
import type { ListingKatalog } from "@/lib/api";
import FotoListing from "./FotoListing";
import { formatRupiah } from "./format";

export default function KartuListing({ listing }: { listing: ListingKatalog }) {
  return (
    <Link
      href={`/katalog/${listing.id_listing}`}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-[#d7cfb5] bg-[#f7f0dc] p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="overflow-hidden rounded-[14px] border border-[#d7cfb5] bg-[#f5d7aa]">
        <FotoListing
          foto={listing.foto}
          alt={listing.nama_makanan}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[1.1rem] font-extrabold tracking-[-0.04em] text-[#0a8ea8] group-hover:text-[#0d7b96]">
            {listing.nama_makanan}
          </h2>
          <p className="mt-1 text-sm text-[#5c6460]">{listing.deskripsi || "Food surplus available now"}</p>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-[#ff4d57] px-2 py-1 text-white shadow-sm">
          <button
            type="button"
            aria-label={`Decrease quantity for ${listing.nama_makanan}`}
            className="flex h-7 w-7 items-center justify-center text-lg font-bold leading-none"
          >
            −
          </button>
          <span className="text-sm font-bold">1</span>
          <button
            type="button"
            aria-label={`Increase quantity for ${listing.nama_makanan}`}
            className="flex h-7 w-7 items-center justify-center text-lg font-bold leading-none"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-lg font-extrabold text-[#1a1a1a]">{formatRupiah(listing.harga)}</p>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#5e6a61]">
          stok {listing.stok}
        </span>
      </div>
    </Link>
  );
}
