"use client";

import { ListingPenjual, urlFoto } from "@/lib/api";

export type ListingMakananPenjual = ListingPenjual;

interface KartuListingPenjualProps {
  listing: ListingMakananPenjual;
  onEdit: (id: number) => void;
  onHapus: (listing: ListingMakananPenjual) => void;
}

export default function KartuListingPenjual({
  listing,
  onEdit,
  onHapus,
}: KartuListingPenjualProps) {
  const fotoUrl = urlFoto(listing.foto);

  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] border border-[#d8cfb4] bg-[#f7f0dc] p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="relative h-[90px] w-[112px] overflow-hidden rounded-xl border border-[#d8cfb4] bg-[#f4d7ab]">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={listing.nama_makanan}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#5d655f]">No photo</div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onHapus(listing)}
          className="text-2xl font-black text-[#ef5a61]"
          aria-label={`Delete ${listing.nama_makanan}`}
        >
          ×
        </button>
      </div>

      <div className="mt-3 flex-1">
        <h3 className="text-[1.2rem] font-extrabold tracking-[-0.04em] text-[#0b8ea8]">
          {listing.nama_makanan}
        </h3>
        <p className="mt-1 text-sm text-[#58635b]">{listing.porsi} · {listing.kondisi}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-lg font-extrabold text-[#1a1a1a]">
            Rp. {listing.harga.toLocaleString("id-ID")}
          </p>

          <p className="text-sm font-semibold text-[#58635b]">
            Stok: {listing.stok}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#d9d1b5] pt-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase ${
            listing.tersedia
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {listing.draft ? "Draf" : listing.tersedia ? "Tersedia" : "Tidak Tersedia"}
        </span>

        <button
          type="button"
          onClick={() => onEdit(listing.id_listing)}
          className="rounded-md border border-[#d6cfb6] bg-white px-3 py-2 text-sm font-medium text-[#496864] hover:bg-[#f3efe6]"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
