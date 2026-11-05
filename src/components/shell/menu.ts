export type Peran = "WARGA" | "TEKNISI" | "PENGURUS";

export const NAMA_PERAN: Record<Peran, string> = {
  WARGA: "Warga",
  TEKNISI: "Teknisi",
  PENGURUS: "Pengurus",
};

export const NAMA_KOMUNITAS = "Komunitas Cempaka";

export const URL_KELUAR = "/api/akun/logout";

export interface ItemMenu {
  label: string;
  pendek: string;
  href: string;
  ikon: number;
}

export const MENU: Record<Peran, ItemMenu[]> = {
  WARGA: [
    { label: "Ringkasan", pendek: "Ringkasan", href: "/dashboard/warga", ikon: 0 },
    { label: "Tagihan", pendek: "Tagihan", href: "/dashboard/warga/tagihan", ikon: 1 },
    { label: "Laporan saya", pendek: "Laporan saya", href: "/dashboard/warga/laporan", ikon: 2 },
    { label: "Lapor gangguan", pendek: "Lapor", href: "/dashboard/warga/laporan/baru", ikon: 3 },
  ],
  TEKNISI: [
    { label: "Peringatan", pendek: "Peringatan", href: "/dashboard/teknisi", ikon: 0 },
    { label: "Performa panel", pendek: "Panel", href: "/dashboard/teknisi/panel", ikon: 1 },
    { label: "Tugas saya", pendek: "Tugas saya", href: "/dashboard/teknisi/tugas", ikon: 2 },
    { label: "Pemeliharaan", pendek: "Pemeliharaan", href: "/dashboard/teknisi/pemeliharaan", ikon: 3 },
  ],
  PENGURUS: [
    { label: "Analitik", pendek: "Analitik", href: "/dashboard/pengurus", ikon: 0 },
    { label: "Kalkulasi iuran", pendek: "Kalkulasi", href: "/dashboard/pengurus/iuran", ikon: 1 },
    { label: "Rekap iuran", pendek: "Rekap iuran", href: "/dashboard/pengurus/rekap", ikon: 2 },
    { label: "Persetujuan", pendek: "Persetujuan", href: "/dashboard/pengurus/persetujuan", ikon: 3 },
  ],
};

export const IKON = [
  "M4 10 12 3l8 7v10H4Z M9 20v-7h6v7",
  "M5 3h14v18H5z M8 8h8 M8 12h8 M8 16h5",
  "M5 4h14v16H5z M8 8h8 M8 12h5 M8 16h6",
  "M12 4v16 M4 12h16",
];

// Href terpanjang yang cocok yang aktif, supaya /laporan/baru tidak ikut menyalakan /laporan.
export function menuAktif(pathname: string, href: string, semua: string[]): boolean {
  const cocok = (h: string) => pathname === h || pathname.startsWith(h + "/");
  return cocok(href) && !semua.some((h) => h.length > href.length && cocok(h));
}
