"use client";

interface DialogKonfirmasiHapusProps {
    isOpen: boolean;
    namaMakanan: string;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    }

    export default function DialogKonfirmasiHapus({
    isOpen,
    namaMakanan,
    isDeleting,
    onConfirm,
    onCancel,
    }: DialogKonfirmasiHapusProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Konfirmasi Hapus Listing</h3>
            <p className="mt-2 text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus listing makanan{" "}
            <span className="font-semibold text-gray-900">&ldquo;{namaMakanan}&rdquo;</span>? Tindakan ini akan menonaktifkan listing dari katalog pembeli.
            </p>

            <div className="mt-6 flex justify-end gap-3">
            <button
                type="button"
                onClick={onCancel}
                disabled={isDeleting}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
                Batal
            </button>
            <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </button>
            </div>
        </div>
        </div>
    );
}