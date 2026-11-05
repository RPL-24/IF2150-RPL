"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KartuListingPenjual, {
    ListingMakananPenjual,
} from "@/components/penjual/KartuListingPenjual";
import DialogKonfirmasiHapus from "@/components/penjual/DialogKonfirmasiHapus";

export default function ListingPenjualPage() {
    const router = useRouter();
    const [listings, setListings] = useState<ListingMakananPenjual[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pesanError, setPesanError] = useState<string | null>(null);

    // State untuk dialog hapus
    const [selectedListing, setSelectedListing] = useState<ListingMakananPenjual | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // Fetch daftar listing penjual (tampilkanMenuListing)
    const ambilDaftarListing = async () => {
        setLoading(true);
        setPesanError(null);
        try {
        const res = await fetch("http://localhost:8000/api/listing/penjual", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
        });

        if (!res.ok) {
            throw new Error("Gagal mengambil daftar listing makanan.");
        }

        const data = await res.json();
        setListings(data);
        } catch (err: any) {
        setPesanError(err.message || "Terjadi kesalahan sistem");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        ambilDaftarListing();
    }, []);

    // Eksekusi Soft Delete (UC09)
    const handleKonfirmasiHapus = async () => {
        if (!selectedListing) return;

        setIsDeleting(true);
        try {
        const res = await fetch(
            `http://localhost:8000/api/listing/${selectedListing.id_listing}`,
            {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            }
        );

        if (!res.ok) {
            throw new Error("Gagal menghapus listing.");
        }

        // Refresh list setelah berhasil dihapus
        setSelectedListing(null);
        await ambilDaftarListing();
        } catch (err: any) {
        alert(err.message || "Gagal menghapus listing");
        } finally {
        setIsDeleting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Listing Makanan</h1>
                <p className="mt-1 text-sm text-gray-500">
                Daftar menu makanan yang Anda jual di SaveBite.
                </p>
            </div>
            <button
                onClick={() => router.push("/penjual/tambah")}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
            >
                + Tambah Listing
            </button>
            </div>

            {/* State Loading */}
            {loading && (
            <div className="py-12 text-center text-gray-500">
                Memuat daftar listing makanan...
            </div>
            )}

            {/* State Error */}
            {pesanError && (
            <div className="mt-6 rounded-md bg-red-50 p-4 text-red-700 text-sm">
                {pesanError}
            </div>
            )}

            {/* State Kosong (Toko belum punya listing) */}
            {!loading && !pesanError && listings.length === 0 && (
            <div className="py-16 text-center">
                <h3 className="text-lg font-medium text-gray-900">Belum ada listing makanan</h3>
                <p className="mt-1 text-sm text-gray-500">
                Mulai jual makanan penyelamatan Anda dengan menambahkan listing baru.
                </p>
                <button
                onClick={() => router.push("/penjual/tambah")}
                className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                Tambah Makanan Pertama
                </button>
            </div>
            )}

            {/* Grid Listing Makanan */}
            {!loading && !pesanError && listings.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((item) => (
                <KartuListingPenjual
                    key={item.id_listing}
                    listing={item}
                    onEdit={(id) => router.push(`/penjual/edit/${id}`)}
                    onHapus={(listing) => setSelectedListing(listing)}
                />
                ))}
            </div>
            )}

            {/* Pop-up Dialog Hapus */}
            <DialogKonfirmasiHapus
            isOpen={!!selectedListing}
            namaMakanan={selectedListing?.nama_makanan || ""}
            isDeleting={isDeleting}
            onConfirm={handleKonfirmasiHapus}
            onCancel={() => setSelectedListing(null)}
            />
        </div>
        </main>
    );
}