"use client";

import Link from "next/link";
import type { ListingKatalog } from "@/lib/api";
import PengaturJumlah from "./PengaturJumlah";
import FotoListing from "./FotoListing";
import { formatRupiah } from "./format";

function StoreIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9.5 4.5 4h15L21 9.5" />
      <path d="M3 9.5h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0v-2Z" />
      <path d="M5 12.6V20h14v-7.4" />
    </svg>
  );
}

export default function KartuListing({ listing }: { listing: ListingKatalog }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[18px] border border-[#d7cfb5] bg-[#f7f0dc] p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/katalog/${listing.id_listing}`} className="block">
        <div className="overflow-hidden rounded-[14px] border border-[#d7cfb5] bg-[#f5d7aa]">
          <FotoListing
            foto={listing.foto}
            alt={listing.nama_makanan}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-[1.1rem] font-extrabold tracking-[-0.04em] text-[#0a8ea8] group-hover:text-[#0d7b96]">
            {listing.nama_makanan}
          </h2>
          <p className="mt-1 text-sm text-[#5c6460]">{listing.deskripsi || "Food surplus available now"}</p>
          <div className="mt-2 rounded-lg bg-[#e0ece9] px-2.5 py-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2a6a5b]">
              <StoreIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {listing.nama_toko}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-[#4e5f56]">
              {listing.alamat_toko || "Lokasi toko belum tersedia"}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-lg font-extrabold text-[#1a1a1a]">{formatRupiah(listing.harga)}</p>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#5e6a61]">
          stok {listing.stok}
        </span>
      </div>

      {/* Pengatur jumlah di luar Link: klik +/− tidak boleh ikut membuka halaman detail. */}
      <div className="mt-3 flex items-center justify-end">
        <PengaturJumlah listing={listing} />
      </div>
    </article>
  );
}
