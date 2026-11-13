// Fungsi murni: ubah error Supabase/PostgREST jadi pesan Indonesia siap tampil (AGENTS.md bagian 9).
// Dipakai controller: `if (error) return gagal(pesanErrorDb(error));`

export const PESAN_UMUM = "Terjadi kesalahan. Coba lagi beberapa saat lagi.";

/** Cukup `PostgrestError` dari Supabase, atau objek apa pun yang punya `code`/`message`. */
export type ErrorDb = { code?: string; message?: string; details?: string | null };

export function pesanErrorDb(error: ErrorDb): string {
  switch (error.code) {
    case "P0001": // RAISE EXCEPTION dari trigger/RPC: pesannya sudah berbahasa Indonesia.
      return error.message?.trim() || PESAN_UMUM;
    case "23505": // unique_violation
      return `${error.message ?? ""} ${error.details ?? ""}`.includes("upvote")
        ? "Anda sudah mendukung laporan ini."
        : "Data yang sama sudah ada.";
    case "42501": // insufficient_privilege: RLS (insert/update ditolak) atau grant kolom
      return "Anda tidak memiliki akses untuk tindakan ini.";
    case "23514": // check_violation
      return "Data tidak valid.";
    default:
      return PESAN_UMUM;
  }
}
