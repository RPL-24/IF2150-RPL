"use client";

import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FilterHarga from "./FilterHarga";
import SearchBar from "./SearchBar";
import { adaPencarian, bacaPencarian } from "./pencarian";

/**
 * Form cari & filter harga (UC04). Submit = GET /katalog?kata_kunci=&harga_min=&harga_maks=,
 * lalu DaftarListing membaca URL dan menjalankan kirimPencarian.
 */
export default function FormPencarian() {
  const searchParams = useSearchParams();
  const pencarian = bacaPencarian(searchParams);

  return (
    // key: isi ulang defaultValue saat URL berubah (mis. tombol back / reset)
    <Form
      key={searchParams.toString()}
      action="/katalog"
      role="search"
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <SearchBar defaultValue={pencarian.kataKunci} />
      <FilterHarga hargaMin={pencarian.hargaMin} hargaMaks={pencarian.hargaMaks} />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 sm:flex-none"
        >
          Cari
        </button>
        {adaPencarian(pencarian) && (
          <Link
            href="/katalog"
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-medium hover:bg-zinc-50 sm:flex-none dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Reset
          </Link>
        )}
      </div>
    </Form>
  );
}
