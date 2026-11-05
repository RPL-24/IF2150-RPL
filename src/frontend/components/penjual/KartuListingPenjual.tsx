"use client";

export interface ListingMakananPenjual {
    id_listing: number;
    nama_makanan: string;
    porsi: string;
    kondisi: string;
    harga: number;
    stok: number;
    batas_kedaluwarsa: string;
    foto?: string | null;
    aktif: boolean;
    }

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
    const isExpired = new Date(listing.batas_kedaluwarsa) <= new Date();

    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        <div className="relative h-48 w-full bg-gray-100">
            {listing.foto ? (
            <img
                src={`http://localhost:8000${listing.foto}`}
                alt={listing.nama_makanan}
                className="h-full w-full object-cover"
            />
            ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
                Tidak ada foto
            </div>
            )}
            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                listing.aktif && listing.stok > 0 && !isExpired
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
            >
                {!listing.aktif
                ? "Nonaktif"
                : isExpired
                ? "Kedaluwarsa"
                : listing.stok === 0
                ? "Stok Habis"
                : "Tersedia"}
            </span>
            </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
            <h3 className="font-bold text-gray-900 text-lg">{listing.nama_makanan}</h3>
            <p className="text-sm text-gray-500">Porsi: {listing.porsi} | Kondisi: {listing.kondisi}</p>
            
            <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-600">
                Rp {listing.harga.toLocaleString("id-ID")}
            </span>
            <span className="text-sm text-gray-600">Stok: {listing.stok}</span>
            </div>

            <p className="mt-2 text-xs text-gray-400">
            Kedaluwarsa: {new Date(listing.batas_kedaluwarsa).toLocaleString("id-ID")}
            </p>

            <div className="mt-6 flex gap-2">
            <button
                onClick={() => onEdit(listing.id_listing)}
                className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Edit
            </button>
            <button
                onClick={() => onHapus(listing)}
                className="flex-1 rounded-md bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
                Hapus
            </button>
            </div>
        </div>
        </div>
    );
}