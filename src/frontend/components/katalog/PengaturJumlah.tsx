"use client";

import type { ListingKatalog } from "@/lib/api";
import { useCart } from "@/lib/cart";

type Props = {
  listing: ListingKatalog;
  /** "kecil" untuk kartu katalog, "besar" untuk halaman detail. */
  ukuran?: "kecil" | "besar";
};

/**
 * PengaturJumlah — tombol +/− untuk menambah item ke keranjang (UC03/UC05).
 * Mulai dari 0: hanya tombol +. Klik + → masuk keranjang sebagai 1.
 * − hingga 0 → item keluar dari keranjang (tidak pernah negatif). Maks = stok.
 * Dipakai di kartu katalog maupun halaman detail, tanpa berpindah halaman.
 */
export default function PengaturJumlah({ listing, ukuran = "kecil" }: Props) {
  const { qtyDari, tambah, kurangi } = useCart();
  const qty = qtyDari(listing.id_listing);
  const stokHabis = listing.stok < 1;
  const besar = ukuran === "besar";

  if (qty === 0) {
    return (
      <button
        type="button"
        disabled={stokHabis}
        onClick={() => tambah(listing, 1)}
        aria-label={`Tambah ${listing.nama_makanan} ke keranjang`}
        className={
          besar
            ? "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff4d57] px-8 font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-40"
            : "flex h-8 w-11 items-center justify-center rounded-md bg-[#ff4d57] text-xl font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-40"
        }
      >
        {besar ? "+ Keranjang" : "+"}
      </button>
    );
  }

  return (
    <div
      className={
        besar
          ? "flex items-center gap-2 rounded-full bg-[#ff4d57] px-3 py-2 text-white shadow-sm"
          : "flex items-center gap-1 rounded-md bg-[#ff4d57] px-1 py-1 text-white shadow-sm"
      }
    >
      <button
        type="button"
        onClick={() => kurangi(listing.id_listing)}
        aria-label={`Kurangi ${listing.nama_makanan} dari keranjang`}
        className={
          besar
            ? "flex h-9 w-9 items-center justify-center text-2xl font-bold leading-none transition hover:brightness-110"
            : "flex h-7 w-7 items-center justify-center text-lg font-bold leading-none transition hover:brightness-110"
        }
      >
        −
      </button>
      <span
        data-testid={`qty-${listing.id_listing}`}
        className={
          besar
            ? "min-w-8 text-center text-lg font-bold"
            : "min-w-6 text-center text-sm font-bold"
        }
      >
        {qty}
      </span>
      <button
        type="button"
        disabled={qty >= listing.stok}
        onClick={() => tambah(listing, 1)}
        aria-label={`Tambah ${listing.nama_makanan} ke keranjang`}
        className={
          besar
            ? "flex h-9 w-9 items-center justify-center text-2xl font-bold leading-none transition hover:brightness-110 disabled:opacity-40"
            : "flex h-7 w-7 items-center justify-center text-lg font-bold leading-none transition hover:brightness-110 disabled:opacity-40"
        }
      >
        +
      </button>
    </div>
  );
}
