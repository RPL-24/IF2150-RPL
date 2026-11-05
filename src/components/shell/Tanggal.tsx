"use client";

// Dihitung di klien agar tanggal tidak membeku saat build.
export default function Tanggal() {
  const t = new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date());
  return <span suppressHydrationWarning>{t}</span>;
}
