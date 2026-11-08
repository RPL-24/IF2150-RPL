// I01-11 (tombol lokasi), I01-12 (peta), I01-13 (alert luar wilayah).
// Peta masih PLACEHOLDER. nanti diganti <MapView> dari components/shared setelah tersedia
// <MapViewr> dari shared, dan dilarang membuat sendiri. Komponen itu tunggu dibikin dipta
// Menampilkan Bagian Status, Tombol “Gunakan Lokasi Saat Ini”, Kotak “Click peta untuk pilih lokasi”, Alert merah
type Props = {
  diLuarWilayah: boolean;
  onGunakanLokasi: () => void;
};

export function AreaLokasi({ diLuarWilayah, onGunakanLokasi }: Props) {
  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold">Lokasi</span>
      <button
        type="button"
        onClick={onGunakanLokasi}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 py-2.5 text-sm font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400"
      >
        <IkonTarget />
        Gunakan Lokasi Saat Ini
      </button>
      <div className="relative h-28 rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
        <span className="absolute right-2 top-2 rounded-full bg-background px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300 shadow-sm">
          Click peta untuk pilih lokasi
        </span>
      </div>
      {diLuarWilayah && (
        <p
          role="alert"
          className="flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          <IkonPeringatan />
          Lokasi di luar daerah penanganan. Pilih titik di dalam batas kota.
        </p>
      )}
    </div>
  );
}

function IkonTarget() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

function IkonPeringatan() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}