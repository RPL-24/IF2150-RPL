"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";
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
        } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
        setPesanError(message);
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
        } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal menghapus listing";
        alert(message);
        } finally {
        setIsDeleting(false);
        }
    };

    return (
        <AppLayout
            role="seller"
            isAuthenticated
            title="Kelola Listing Makanan"
            showHeader
            headerClassName="bg-[#1bb0c7] px-5 pb-5 pt-8"
            bodyClassName="px-4 py-5 lg:px-6"
        >
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#d8cfb4] pb-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.12em] text-[#5b6d6a]">Penjual</p>
                        <p className="mt-1 text-sm text-[#476362]">
                            Daftar menu yang Anda jual di SaveBite.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/penjual/tambah")}
                        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
                    >
                        + Tambah Listing
                    </button>
                </div>

                {loading && (
                    <div className="py-12 text-center text-gray-500">
                        Memuat daftar listing makanan...
                    </div>
                )}

                {pesanError && (
                    <div className="mt-6 rounded-md bg-red-50 p-4 text-red-700 text-sm">
                        {pesanError}
                    </div>
                )}

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

                {!loading && !pesanError && listings.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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

                <DialogKonfirmasiHapus
                    isOpen={!!selectedListing}
                    namaMakanan={selectedListing?.nama_makanan || ""}
                    isDeleting={isDeleting}
                    onConfirm={handleKonfirmasiHapus}
                    onCancel={() => setSelectedListing(null)}
                />
            </div>
        </AppLayout>
    );
}