"use client";

// Implementasi peta Leaflet. JANGAN diimpor langsung: pakai <MapView> (dibungkus next/dynamic ssr:false,
// karena Leaflet mengakses `window` saat diimpor).

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Polygon, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { BATAS_WILAYAH, PUSAT_PETA, STATUS_WARNA_PETA } from "@/lib/constants";
import { getKoordinat, type Koordinat } from "@/server/entities/Lokasi";
import type { Enums } from "@/types/database";

export type PenandaPeta = {
  id: string;
  latitude: number;
  longitude: number;
  status: Enums<"status_laporan">;
  /** Teks tooltip saat penanda disentuh/di-hover, mis. ID tiket. */
  label?: string;
};

export type MapViewProps = {
  /** Penanda laporan, warna sesuai status (I02-12). */
  markers?: PenandaPeta[];
  /** Klik penanda (I02-12). */
  onPilihMarker?: (id: string) => void;
  /** Penanda yang sedang dipilih, digambar lebih besar. */
  idTerpilih?: string | null;
  /** Mode pilih lokasi (I01-12): klik peta → koordinat. Cek batas wilayah dilakukan pemanggil (Lokasi.dalamWilayah). */
  onPilihTitik?: (koordinat: Koordinat) => void;
  /** Titik yang dipilih/dikunci (I01-11, I01-12). Peta bergeser ke titik ini saat berubah. */
  titikTerpilih?: Koordinat | null;
  /** Tinggi peta, nilai CSS (default "300px"). */
  tinggi?: string;
};

// Cincin luar "seluruh dunia" dengan lubang = batas kota → area luar kota diarsir (I01-12).
const DUNIA: [number, number][] = [
  [-85, -180],
  [-85, 180],
  [85, 180],
  [85, -180],
];
const BATAS = BATAS_WILAYAH.map(([lat, lng]): [number, number] => [lat, lng]);

export default function PetaLeaflet({
  markers = [],
  onPilihMarker,
  idTerpilih,
  onPilihTitik,
  titikTerpilih,
  tinggi = "300px",
}: MapViewProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-md" style={{ height: tinggi }}>
      <MapContainer center={titikTerpilih ? getKoordinat(titikTerpilih) : PUSAT_PETA} zoom={12} className="h-full w-full">
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <Polygon positions={[DUNIA, BATAS]} pathOptions={{ stroke: false, fillColor: "#6b7280", fillOpacity: 0.35 }}>
          <Tooltip sticky>Luar batas kota</Tooltip>
        </Polygon>
        <Polygon positions={BATAS} pathOptions={{ color: "#1d4ed8", weight: 2, fill: false }} interactive={false} />

        {markers.map((m) => {
          const terpilih = m.id === idTerpilih;
          return (
            <CircleMarker
              key={m.id}
              center={getKoordinat(m)}
              radius={terpilih ? 12 : 8}
              bubblingMouseEvents={false}
              pathOptions={{ color: "#ffffff", weight: 2, fillColor: STATUS_WARNA_PETA[m.status], fillOpacity: 1 }}
              eventHandlers={onPilihMarker ? { click: () => onPilihMarker(m.id) } : undefined}
            >
              {m.label && <Tooltip>{m.label}</Tooltip>}
            </CircleMarker>
          );
        })}

        {titikTerpilih && (
          <CircleMarker
            center={getKoordinat(titikTerpilih)}
            radius={10}
            interactive={false}
            pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#dc2626", fillOpacity: 1 }}
          />
        )}
        <IkutiTitik titik={titikTerpilih} />
        {onPilihTitik && <KlikPeta onPilihTitik={onPilihTitik} />}
      </MapContainer>
      {onPilihTitik && (
        <p className="pointer-events-none absolute top-2 left-1/2 z-[1000] -translate-x-1/2 rounded bg-white/90 px-2 py-1 text-xs text-gray-900 shadow">
          Click peta untuk pilih lokasi
        </p>
      )}
    </div>
  );
}

function KlikPeta({ onPilihTitik }: { onPilihTitik: (k: Koordinat) => void }) {
  useMapEvents({ click: (e) => onPilihTitik({ latitude: e.latlng.lat, longitude: e.latlng.lng }) });
  return null;
}

function IkutiTitik({ titik }: { titik?: Koordinat | null }) {
  const map = useMap();
  const lat = titik?.latitude;
  const lng = titik?.longitude;
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) map.panTo([lat, lng]);
  }, [map, lat, lng]);
  return null;
}
