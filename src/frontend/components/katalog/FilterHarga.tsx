import { PARAM_HARGA_MAKS, PARAM_HARGA_MIN } from "./pencarian";

const kelasInput =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 sm:w-36 dark:border-zinc-700 dark:bg-zinc-900";

/** tampilkanPilihanHarga: kolom harga minimum & maksimum (UC04). Kosong = tanpa batas. */
export default function FilterHarga({
  hargaMin,
  hargaMaks,
}: {
  hargaMin?: number | null;
  hargaMaks?: number | null;
}) {
  return (
    <fieldset className="flex gap-2 text-sm">
      <legend className="sr-only">Rentang harga</legend>
      <label className="flex flex-1 flex-col gap-1">
        <span className="font-medium">Harga min (Rp)</span>
        <input
          type="number"
          name={PARAM_HARGA_MIN}
          min={0}
          step={1}
          inputMode="numeric"
          defaultValue={hargaMin ?? ""}
          placeholder="0"
          className={kelasInput}
        />
      </label>
      <label className="flex flex-1 flex-col gap-1">
        <span className="font-medium">Harga maks (Rp)</span>
        <input
          type="number"
          name={PARAM_HARGA_MAKS}
          min={0}
          step={1}
          inputMode="numeric"
          defaultValue={hargaMaks ?? ""}
          placeholder="Tanpa batas"
          className={kelasInput}
        />
      </label>
    </fieldset>
  );
}
