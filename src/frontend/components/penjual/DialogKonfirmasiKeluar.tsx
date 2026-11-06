"use client";

interface DialogKonfirmasiKeluarProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    }

    export default function DialogKonfirmasiKeluar({
    isOpen,
    onConfirm,
    onCancel,
    }: DialogKonfirmasiKeluarProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Konfirmasi Keluar</h3>
            <p className="mt-2 text-sm text-gray-600">
            Perubahan yang Anda buat belum disimpan. Apakah Anda yakin ingin keluar dari halaman ini?
            </p>

            <div className="mt-6 flex justify-end gap-3">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Lanjutkan Mengedit
            </button>
            <button
                type="button"
                onClick={onConfirm}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
                Tinggalkan Halaman
            </button>
            </div>
        </div>
        </div>
    );
}