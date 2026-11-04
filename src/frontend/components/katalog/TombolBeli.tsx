import Link from "next/link";

// Kontrak P3 → P4: route halaman checkout. Ubah di sini saja jika P4 memakai route lain.
export function ruteCheckout(idListing: number): string {
  return `/checkout?idListing=${idListing}`;
}

export default function TombolBeli({ idListing }: { idListing: number }) {
  return (
    <Link
      href={ruteCheckout(idListing)}
      className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 font-medium text-white transition hover:bg-emerald-700"
    >
      Beli
    </Link>
  );
}
