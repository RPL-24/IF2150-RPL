import type { Enums } from "@/types/database";

export { BATAS_WILAYAH } from "./batas-wilayah";

// Label persis DPPL Bab 6 I01-03. Untuk dropdown: Object.entries(KATEGORI) → [value, label].
export const KATEGORI = {
  jalan_berlubang: "Jalan berlubang",
  lampu_jalan_mati: "Lampu jalan mati",
  saluran_air_tersumbat: "Saluran air tersumbat",
  trotoar_rusak: "Trotoar rusak",
  rambu_marka_rusak: "Rambu / marka rusak",
} as const satisfies Record<Enums<"kategori_kerusakan">, string>;

// DPPL I02-06.
export const STATUS_LABEL = {
  diterima: "Diterima",
  ditolak: "Ditolak",
  dikerjakan: "Dikerjakan",
  berhasil: "Berhasil",
} as const satisfies Record<Enums<"status_laporan">, string>;

// Tidak ada di DPPL; label turunan dari nama enum.
export const TAHAP_LABEL = {
  menunggu_eksekusi: "Menunggu eksekusi",
  menunggu_evaluasi: "Menunggu evaluasi",
} as const satisfies Record<Enums<"tahap_penanganan">, string>;

// DPPL I02-11: Diterima biru, Dikerjakan kuning, Berhasil hijau. Ditolak tidak disebut → merah.
export const STATUS_WARNA = {
  diterima: "bg-blue-100 text-blue-800",
  ditolak: "bg-red-100 text-red-800",
  dikerjakan: "bg-yellow-100 text-yellow-800",
  berhasil: "bg-green-100 text-green-800",
} as const satisfies Record<Enums<"status_laporan">, string>;

// Warna penanda peta (hex, untuk CircleMarker Leaflet), senada dengan STATUS_WARNA (I02-11, I02-12).
export const STATUS_WARNA_PETA = {
  diterima: "#2563eb",
  ditolak: "#dc2626",
  dikerjakan: "#eab308",
  berhasil: "#16a34a",
} as const satisfies Record<Enums<"status_laporan">, string>;

// Pusat peta awal: Kota Bandung (Alun-alun).
export const PUSAT_PETA: [number, number] = [-6.9175, 107.6191];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (I01-05, I01-08)

export const FORMAT_FOTO = {
  jpg: "image/jpeg",
  png: "image/png",
} as const;

export const FORMAT_VIDEO = {
  mp4: "video/mp4",
  mov: "video/quicktime",
  mkv: "video/x-matroska",
} as const;

export const RADIUS_DUPLIKAT_M = 20; // KF05

export const BERANDA_ROLE = {
  warga: "/lapor",
  admin: "/validasi",
  eksekutor: "/tugas",
} as const satisfies Record<Enums<"peran_user">, string>;
