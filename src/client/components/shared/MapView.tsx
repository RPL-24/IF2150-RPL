"use client";

// Peta bersama (DPPL I01-12, I02-10..12, I03-12). Leaflet hanya jalan di browser → ssr:false.
// Pemakaian: lihat MapViewProps di PetaLeaflet.tsx.

import dynamic from "next/dynamic";

export type { MapViewProps, PenandaPeta } from "./PetaLeaflet";

export const MapView = dynamic(() => import("./PetaLeaflet"), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse rounded-md bg-gray-100" aria-label="Memuat peta" />,
});
