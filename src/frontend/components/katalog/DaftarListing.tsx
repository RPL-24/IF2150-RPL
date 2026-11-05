"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ambilDaftarKatalog, ApiError, cariKatalog, type ListingKatalog } from "@/lib/api";
import KartuListing from "./KartuListing";
import PesanKatalog, { perluLogin, PesanPerluLogin } from "./PesanKatalog";
import { adaPencarian, bacaPencarian } from "./pencarian";

type Hasil = { kunci: string; daftar: ListingKatalog[] | null; error: string | null; harusLogin: boolean };

/**
 * tampilkanDaftar (Algo-C11-01) + kirimPencarian (Algo-C11-03).
 * Tanpa parameter di URL → semua listing tersedia (UC02); dengan kata kunci/harga → UC04.
 */
export default function DaftarListing() {
  const searchParams = useSearchParams();
  const kunci = searchParams.toString();
  const [hasil, setHasil] = useState<Hasil | null>(null);

  const pencarian = bacaPencarian(searchParams);
  const mencari = adaPencarian(pencarian);

  useEffect(() => {
    const p = bacaPencarian(new URLSearchParams(kunci));
    if (p.hargaTidakValid) return; // ditangani saat render, tidak perlu ke server
    let aktif = true;
    (adaPencarian(p) ? cariKatalog(p) : ambilDaftarKatalog())
      .then((daftar) => aktif && setHasil({ kunci, daftar, error: null, harusLogin: false }))
      .catch((e) => {
        if (!aktif) return;
        setHasil({
          kunci,
          daftar: null,
          error: e instanceof ApiError ? e.message : "Gagal memuat katalog",
          harusLogin: perluLogin(e),
        });
      });
    return () => {
      aktif = false;
    };
  }, [kunci]);

  // Hasil milik URL sebelumnya dianggap belum dimuat
  const terkini = hasil?.kunci === kunci ? hasil : null;

  if (pencarian.hargaTidakValid) return <PesanKatalog jenis="error">Rentang harga tidak valid</PesanKatalog>;
  if (terkini?.harusLogin) return <PesanPerluLogin />;
  if (terkini?.error) return <PesanKatalog jenis="error">{terkini.error}</PesanKatalog>;
  if (!terkini?.daftar) return <PesanKatalog>{mencari ? "Mencari listing…" : "Memuat katalog…"}</PesanKatalog>;

  const daftar = terkini.daftar;
  if (daftar.length === 0) {
    if (!mencari) return <PesanKatalog>Belum ada makanan surplus yang tersedia</PesanKatalog>;
    return (
      <PesanKatalog>
        {pencarian.kataKunci
          ? "Makanan dengan kata kunci tersebut tidak ditemukan"
          : "Tidak ada makanan pada rentang harga tersebut"}
      </PesanKatalog>
    );
  }

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
