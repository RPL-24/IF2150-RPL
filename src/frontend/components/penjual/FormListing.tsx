"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DataListingPayload, uploadFotoListing, urlFoto } from "@/lib/api";
import { AppLayout } from "@/components/layout";
import DialogKonfirmasiKeluar from "./DialogKonfirmasiKeluar";

interface FormListingProps {
    initialData?: DataListingPayload;
    onSubmit: (data: DataListingPayload) => Promise<void>;
    isEditing?: boolean;
    }

    export default function FormListing({ initialData, onSubmit, isEditing = false }: FormListingProps) {
    const router = useRouter();

    const [namaMakanan, setNamaMakanan] = useState(initialData?.nama_makanan ?? "");
    const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi ?? "");
    const [porsi, setPorsi] = useState(initialData?.porsi ?? "1 Porsi");
    const [kondisi, setKondisi] = useState(initialData?.kondisi ?? "Sangat Baik");
    const [harga, setHarga] = useState<number | "">(initialData?.harga ?? "");
    const [stok, setStok] = useState<number | "">(initialData?.stok ?? "");
    const [batasKedaluwarsa, setBatasKedaluwarsa] = useState(
        initialData?.batas_kedaluwarsa ? initialData.batas_kedaluwarsa.slice(0, 16) : ""
    );
    
    const fotoPath = initialData?.foto || null;
    const [fotoPreview, setFotoPreview] = useState<string | null>(urlFoto(initialData?.foto));
    const [fileFoto, setFileFoto] = useState<File | null>(null);

    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    // Mencegah navigasi tab/reload tidak sengaja jika form sudah diubah
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (isDirty) {
            e.preventDefault();
            e.returnValue = "";
        }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        return () => {
            if (fotoPreview?.startsWith("blob:")) URL.revokeObjectURL(fotoPreview);
        };
    }, [fotoPreview]);

    // Validasi Input (Kelas Validasi)
    const validasiListing = (): string[] => {
        const errs: string[] = [];
        if (!namaMakanan.trim()) errs.push("Nama makanan wajib diisi.");
        if (!deskripsi.trim()) errs.push("Deskripsi wajib diisi.");
        if (deskripsi.length > 3000) errs.push("Deskripsi maksimal 3000 karakter.");
        if (!porsi.trim()) errs.push("Informasi porsi wajib diisi.");
        if (!kondisi.trim()) errs.push("Kondisi makanan wajib diisi.");
        if (harga === "" || Number(harga) < 0) errs.push("Harga harus bernilai non-negatif.");
        if (stok === "" || Number(stok) < 0) errs.push("Stok harus bernilai non-negatif.");
        if (!fotoPath && !fileFoto) errs.push("Foto makanan wajib diunggah.");
        if (!batasKedaluwarsa) {
        errs.push("Batas kedaluwarsa wajib diisi.");
        } else {
        const selectedDate = new Date(batasKedaluwarsa);
        if (selectedDate <= new Date()) {
            errs.push("Batas kedaluwarsa harus di waktu mendatang.");
        }
        }
        return errs;
    };

    const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi Ukuran (Maks 10 MB) dan Ekstensi
        if (file.size > 10 * 1024 * 1024) {
        setErrors(["Ukuran foto berkas maksimal 10 MB"]);
        return;
        }
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setErrors(["Format foto harus berupa PNG atau JPG"]);
        return;
        }

        setFileFoto(file);
        setFotoPreview(URL.createObjectURL(file));
        setIsDirty(true);
        setErrors([]);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validasiListing();
        if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
        }

        setIsSubmitting(true);
        setErrors([]);

        try {
        let finalFotoPath = fotoPath;
        if (fileFoto) {
            finalFotoPath = await uploadFotoListing(fileFoto);
        }
        if (!finalFotoPath) {
            throw new Error("Foto makanan wajib diunggah.");
        }

        const payload: DataListingPayload = {
            nama_makanan: namaMakanan.trim(),
            deskripsi: deskripsi.trim(),
            porsi: porsi.trim(),
            kondisi: kondisi.trim(),
            harga: Number(harga),
            stok: Number(stok),
            batas_kedaluwarsa: new Date(batasKedaluwarsa).toISOString(),
            foto: finalFotoPath,
        };

        await onSubmit(payload);
        setIsDirty(false);
        } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.";
        setErrors([message]);
        } finally {
        setIsSubmitting(false);
        }
    };

    const handleBatalClick = () => {
        if (isDirty) {
        setShowExitModal(true);
        } else {
        router.push("/penjual/listing");
        }
    };

    const isFormValid = validasiListing().length === 0;

    return (
        <AppLayout
            role="seller"
            isAuthenticated
            title={
                <h1 className="text-xl font-bold tracking-normal text-white">
                    {isEditing ? "Edit Product" : "Add Product"}
                </h1>
            }
            headerClassName="bg-[#1bb0c7] px-5 pb-5 pt-8"
            bodyClassName="bg-[#e6e0c8] px-4 py-6 sm:px-6"
        >
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 rounded-2xl bg-[#f7f0dc] p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-bold text-[#264b4d]">Product details</h2>

            {/* Pesan Error Validasi */}
            {errors.length > 0 && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <h4 className="text-sm font-semibold text-red-800">Gagal menyimpan data:</h4>
                <ul className="mt-1 list-disc pl-5 text-sm text-red-700">
                {errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                ))}
                </ul>
            </div>
            )}

            {/* Foto produk berada di bagian atas sesuai UI-06 */}
            <div>
            <p className="block text-sm font-bold text-[#264b4d]">
                Product Photo* <span className="font-normal text-[#60756b]">(PNG/JPG, maks. 10 MB)</span>
            </p>
            <label
                htmlFor="foto-listing"
                className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#ef5a61] bg-white/60 px-4 py-5 text-center text-sm font-semibold text-[#d84b54] hover:bg-white"
            >
                <span className="text-2xl leading-none" aria-hidden="true">+</span>
                <span>{fileFoto ? fileFoto.name : "Add Photo"}</span>
                <input
                    id="foto-listing"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    aria-label="Product Photo"
                    onChange={handleFotoChange}
                    className="sr-only"
                />
            </label>
            {fotoPreview && (
                <div className="mt-3">
                <img src={fotoPreview} alt="Product photo preview" className="h-32 w-32 rounded-xl border border-[#d8cfb4] object-cover" />
                </div>
            )}
            </div>

            {/* Nama Makanan */}
            <div>
            <label htmlFor="nama-makanan" className="block text-sm font-bold text-[#264b4d]">Product Name *</label>
            <input
                id="nama-makanan"
                type="text"
                value={namaMakanan}
                onChange={(e) => { setNamaMakanan(e.target.value); setIsDirty(true); }}
                className="mt-1 w-full rounded-xl border border-[#d8cfb4] bg-white/80 px-4 py-3 text-[#264b4d] shadow-sm focus:border-[#1a8ca1] focus:outline-none focus:ring-2 focus:ring-[#1a8ca1]/20"
                placeholder="Enter product name"
                required
            />
            </div>

            {/* Porsi & Kondisi */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label htmlFor="porsi" className="block text-sm font-bold text-[#264b4d]">Porsi *</label>
                <input
                id="porsi"
                type="text"
                value={porsi}
                onChange={(e) => { setPorsi(e.target.value); setIsDirty(true); }}
                className="mt-1 w-full rounded-xl border border-[#d8cfb4] bg-white/80 px-4 py-3 text-[#264b4d] shadow-sm focus:border-[#1a8ca1] focus:outline-none focus:ring-2 focus:ring-[#1a8ca1]/20"
                placeholder="Contoh: 1 Porsi / 500gr"
                required
                />
            </div>

            <div>
                <label htmlFor="kondisi" className="block text-sm font-bold text-[#264b4d]">Kondisi *</label>
                <select
                id="kondisi"
                value={kondisi}
                onChange={(e) => { setKondisi(e.target.value); setIsDirty(true); }}
                className="mt-1 w-full rounded-xl border border-[#d8cfb4] bg-white/80 px-4 py-3 text-[#264b4d] shadow-sm focus:border-[#1a8ca1] focus:outline-none focus:ring-2 focus:ring-[#1a8ca1]/20"
                >
                <option value="Sangat Baik">Sangat Baik</option>
                <option value="Baik">Baik</option>
                <option value="Layak Konsumsi">Layak Konsumsi</option>
                </select>
            </div>
            </div>

            {/* Harga & Stok */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label htmlFor="harga" className="block text-sm font-bold text-[#264b4d]">Price (Rp) *</label>
                <input
                id="harga"
                type="number"
                min="0"
                value={harga}
                onChange={(e) => { setHarga(e.target.value === "" ? "" : Number(e.target.value)); setIsDirty(true); }}
                className="mt-1 w-full rounded-xl border border-[#d8cfb4] bg-white/80 px-4 py-3 text-[#264b4d] shadow-sm focus:border-[#1a8ca1] focus:outline-none focus:ring-2 focus:ring-[#1a8ca1]/20"
                required
                />
            </div>

            <div>
                <label htmlFor="stok" className="block text-sm font-bold text-[#264b4d]">Stock *</label>
                <input
                id="stok"
                type="number"
                min="0"
                value={stok}
                onChange={(e) => { setStok(e.target.value === "" ? "" : Number(e.target.value)); setIsDirty(true); }}
                className="mt-1 w-full rounded-xl border border-[#d8cfb4] bg-white/80 px-4 py-3 text-[#264b4d] shadow-sm focus:border-[#1a8ca1] focus:outline-none focus:ring-2 focus:ring-[#1a8ca1]/20"
                required
                />
            </div>
            </div>

            {/* Deskripsi */}
            <div>
            <label htmlFor="deskripsi" className="block text-sm font-bold text-[#264b4d]">
                Description * <span className="font-normal text-[#60756b]">{deskripsi.length}/3000</span>
            </label>
            <textarea
                id="deskripsi"
                value={deskripsi}
                onChange={(e) => { setDeskripsi(e.target.value); setIsDirty(true); }}
                rows={3}
                maxLength={3000}
                className="mt-1 w-full rounded-xl border border-[#d8cfb4] bg-white/80 px-4 py-3 text-[#264b4d] shadow-sm focus:border-[#1a8ca1] focus:outline-none focus:ring-2 focus:ring-[#1a8ca1]/20"
                placeholder="Describe the product"
                required
            />
            </div>

            {/* Batas Kedaluwarsa */}
            <div>
            <label htmlFor="batas-kedaluwarsa" className="block text-sm font-bold text-[#264b4d]">Expiry Date *</label>
            <input
                id="batas-kedaluwarsa"
                type="datetime-local"
                value={batasKedaluwarsa}
                onChange={(e) => { setBatasKedaluwarsa(e.target.value); setIsDirty(true); }}
                className="mt-1 w-full rounded-xl border border-[#d8cfb4] bg-white/80 px-4 py-3 text-[#264b4d] shadow-sm focus:border-[#1a8ca1] focus:outline-none focus:ring-2 focus:ring-[#1a8ca1]/20"
                required
            />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-[#d9d1b5] pt-5">
            <button
                type="button"
                onClick={handleBatalClick}
                disabled={isSubmitting}
                className="rounded-xl border border-[#d8cfb4] bg-white px-4 py-3 text-sm font-semibold text-[#496864] hover:bg-[#f3efe6]"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="rounded-xl bg-[#1a8ca1] px-5 py-3 text-sm font-bold text-white hover:bg-[#14798b] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Show"}
            </button>
            </div>
        </form>

        <DialogKonfirmasiKeluar
            isOpen={showExitModal}
            onConfirm={() => router.push("/penjual/listing")}
            onCancel={() => setShowExitModal(false)}
        />
        </AppLayout>
    );
}