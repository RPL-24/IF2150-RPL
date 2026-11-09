import { KATEGORI } from "@/lib/constants";
import type { Kategori } from "@/server/entities/ListTugas";

export const SEMUA_KATEGORI = "semua";

export type PilihanKategori = Kategori | typeof SEMUA_KATEGORI;

type Props = {
    nilai: PilihanKategori;
    onSelect: (nilai: PilihanKategori) => void;
    disabled?: boolean;
}

export function FilterKategori({nilai, onSelect, disabled = false}: Props) {
    return (
        <label className="block text-sm font-medium">
            Kategori
            <select
                value={nilai}
                disabled={disabled}
                onChange={(e) => onSelect(e.target.value as PilihanKategori)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-base disabled:opacity-60"
            >
                <option>
                    Semua kategori
                </option>
                {Object.entries(KATEGORI).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </label>
    );
}