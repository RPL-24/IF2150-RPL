"use client";

import { HALAMAN_LOGIN } from "@/lib/auth/konteks";
import { URL_KELUAR } from "./menu";

// Logout membalas JSON, jadi arahkan ke halaman masuk dari klien setelah cookie dihapus.
export default function TombolKeluar() {
  async function keluar() {
    try {
      await fetch(URL_KELUAR, { method: "POST" });
    } finally {
      window.location.assign(HALAMAN_LOGIN);
    }
  }
  return (
    <button type="button" className="btn link" onClick={keluar}>
      Keluar ke Masuk
    </button>
  );
}
