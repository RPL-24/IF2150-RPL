import { PARAM_KATA_KUNCI } from "./pencarian";

/** Kolom kata kunci nama makanan (UC04). */
export default function SearchBar({ defaultValue }: { defaultValue?: string | null }) {
  return (
    <label className="flex flex-1 flex-col gap-1 text-sm">
      <span className="font-medium">Cari makanan</span>
      <input
        type="search"
        name={PARAM_KATA_KUNCI}
        defaultValue={defaultValue ?? ""}
        placeholder="Contoh: nasi goreng"
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}
