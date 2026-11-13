import { keluar } from "@/server/controllers/AuthController";

// Server Component cukup: form langsung memanggil Server Action, tanpa state.
export function TombolKeluar() {
  return (
    <form action={keluar}>
      <button type="submit" className="rounded-md border border-gray-300 px-3 py-1">
        Keluar
      </button>
    </form>
  );
}
