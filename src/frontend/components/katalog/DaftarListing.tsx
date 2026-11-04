"use client";

import { useEffect, useState } from "react";
import { ambilDaftarKatalog, ApiError, type ListingKatalog } from "@/lib/api";
import KartuListing from "./KartuListing";
import PesanKatalog, { perluLogin, PesanPerluLogin } from "./PesanKatalog";

/** tampilkanDaftar (Algo-C11-01): ambil listing tersedia lalu tampilkan sebagai kartu. */
export default function DaftarListing() {
  const [daftar, setDaftar] = useState<ListingKatalog[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [harusLogin, setHarusLogin] = useState(false);

  useEffect(() => {
    let aktif = true;
    ambilDaftarKatalog()
      .then((data) => aktif && setDaftar(data))
      .catch((e) => {
        if (!aktif) return;
        setHarusLogin(perluLogin(e));
        setError(e instanceof ApiError ? e.message : "Gagal memuat katalog");
      });
    return () => {
      aktif = false;
    };
  }, []);

  if (harusLogin) return <PesanPerluLogin />;
  if (error) return <PesanKatalog jenis="error">{error}</PesanKatalog>;
  if (daftar === null) return <PesanKatalog>Memuat katalog…</PesanKatalog>;
  if (daftar.length === 0) return <PesanKatalog>Belum ada makanan surplus yang tersedia</PesanKatalog>;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {daftar.map((listing) => (
        <li key={listing.id_listing}>
          <KartuListing listing={listing} />
        </li>
      ))}
    </ul>
  );
}
