// Seed data uji LaporKota. Pemilik: Peran F.
// Jalankan: npm run seed  (opsi: --reset)
// Memakai SUPABASE_SECRET_KEY (melewati RLS) — HANYA untuk script ini, jangan dipakai di kode aplikasi.

import { createClient } from "@supabase/supabase-js";
import type { Database, Enums, TablesInsert } from "../src/types/database";
import { dalamWilayah, type Koordinat } from "../src/server/entities/Lokasi";

type Peran = Enums<"peran_user">;
type Kategori = Enums<"kategori_kerusakan">;
type Status = Enums<"status_laporan">;
type Tahap = Enums<"tahap_penanganan">;
type Keputusan = Enums<"keputusan_evaluasi">;

// Baris insert dengan SEMUA key wajib ada (null eksplisit). supabase-js (defaultToNull) mengirim NULL untuk
// key yang hilang di salah satu objek bulk, jadi semua objek dalam satu array harus punya key yang sama.
type Lengkap<T extends keyof Database["public"]["Tables"], Tanpa extends string = never> = Required<
  Omit<TablesInsert<T>, Tanpa>
>;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error(
    "✗ NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SECRET_KEY wajib diisi di .env.local sebelum menjalankan seed.",
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const RESET = process.argv.includes("--reset");

// ── AKUN ─────────────────────────────────────────────────────────────────

// Akun uji; password sama untuk semua (ditulis di README).
const PASSWORD_SEED = "LaporKota2026!";

const ID_WARGA1 = "00000000-0000-4000-a000-000000000001";
const ID_WARGA2 = "00000000-0000-4000-a000-000000000002";
const ID_ADMIN = "00000000-0000-4000-a000-000000000003";
const ID_EKSEKUTOR = "00000000-0000-4000-a000-000000000004";

// UUID tetap supaya data seed bisa saling merujuk dan seed bisa dijalankan ulang.
const AKUN_SEED = [
  { id: ID_WARGA1, email: "warga1@laporkota.test", nama: "Rina Wulandari", role: "warga" },
  { id: ID_WARGA2, email: "warga2@laporkota.test", nama: "Budi Santoso", role: "warga" },
  { id: ID_ADMIN, email: "admin@laporkota.test", nama: "Admin Dinas PU", role: "admin" },
  { id: ID_EKSEKUTOR, email: "eksekutor@laporkota.test", nama: "Eko Prasetyo", role: "eksekutor" },
  // Akun pendukung (dipakai untuk upvote).
  { id: "00000000-0000-4000-a000-000000000005", email: "warga3@laporkota.test", nama: "Siti Rahmawati", role: "warga" },
  { id: "00000000-0000-4000-a000-000000000006", email: "warga4@laporkota.test", nama: "Dewi Lestari", role: "warga" },
  { id: "00000000-0000-4000-a000-000000000007", email: "warga5@laporkota.test", nama: "Agus Setiawan", role: "warga" },
  { id: "00000000-0000-4000-a000-000000000008", email: "warga6@laporkota.test", nama: "Fitri Handayani", role: "warga" },
  { id: "00000000-0000-4000-a000-000000000009", email: "warga7@laporkota.test", nama: "Andi Saputra", role: "warga" },
  { id: "00000000-0000-4000-a000-000000000010", email: "warga8@laporkota.test", nama: "Yusuf Hidayat", role: "warga" },
] as const satisfies ReadonlyArray<{ id: string; email: string; nama: string; role: Peran }>;

const ID_WARGA: readonly string[] = AKUN_SEED.filter((a) => a.role === "warga").map((a) => a.id);

async function siapkanAkun(): Promise<void> {
  console.log("\n[akun]");

  for (const akun of AKUN_SEED) {
    // Key 'nama' dibaca trigger handle_new_user() untuk mengisi profiles.nama.
    const { error } = await supabase.auth.admin.createUser({
      id: akun.id,
      email: akun.email,
      password: PASSWORD_SEED,
      email_confirm: true,
      user_metadata: { nama: akun.nama },
    });

    if (!error) {
      console.log(`  ✓ ${akun.email} (dibuat)`);
      continue;
    }
    if (error.code !== "email_exists") {
      throw new Error(`Gagal membuat ${akun.email}: ${error.message}`);
    }

    // Email sudah terdaftar: pastikan pemiliknya user dengan id seed yang sama.
    const { data, error: errorCari } = await supabase.auth.admin.getUserById(akun.id);
    const tidakAda = errorCari?.status === 404 || errorCari?.code === "user_not_found";
    if (errorCari && !tidakAda) {
      throw new Error(`Gagal mengecek ${akun.email}: ${errorCari.message}`);
    }
    if (tidakAda || !data.user) {
      throw new Error(
        `Email ${akun.email} dipakai user lain dengan id berbeda dari seed. ` +
          `Hapus user ${akun.email} manual di dashboard Auth lalu jalankan ulang.`,
      );
    }
    if (data.user.email !== akun.email) {
      throw new Error(
        `User dengan id seed ${akun.id} terdaftar dengan email ${data.user.email ?? "(kosong)"}, bukan ${akun.email}. ` +
          `Hapus user tersebut manual di dashboard Auth lalu jalankan ulang.`,
      );
    }
    console.log(`  • ${akun.email} (sudah ada)`);
  }

  // profiles dibuat otomatis oleh trigger handle_new_user (role default 'warga'); naikkan role selain warga.
  for (const akun of AKUN_SEED) {
    if (akun.role === "warga") continue;
    const { data, error } = await supabase
      .from("profiles")
      .update({ role: akun.role })
      .eq("id", akun.id)
      .select("id");
    if (error) throw new Error(`Gagal mengubah role ${akun.email}: ${error.message}`);
    // 0 baris tidak melempar error, jadi cek jumlahnya.
    if (data.length !== 1) {
      throw new Error(`Gagal mengubah role ${akun.email}: ${data.length} baris profiles terubah (harus 1).`);
    }
  }

  // Verifikasi akhir: semua profil ada dan role-nya sesuai.
  const ids = AKUN_SEED.map((a) => a.id);
  const { data: profil, error } = await supabase.from("profiles").select("id, role").in("id", ids);
  if (error) throw new Error(`Gagal memverifikasi profiles: ${error.message}`);

  const roleById = new Map(profil.map((p) => [p.id, p.role]));
  const salah = AKUN_SEED.filter((a) => roleById.get(a.id) !== a.role).map(
    (a) => `${a.email} (harus ${a.role}, ditemukan ${roleById.get(a.id) ?? "tidak ada"})`,
  );
  if (profil.length !== AKUN_SEED.length || salah.length > 0) {
    throw new Error(
      `Verifikasi profiles gagal: ${profil.length}/${AKUN_SEED.length} profil ditemukan. ` +
        `Tidak sesuai: ${salah.join(", ") || "-"}`,
    );
  }
  console.log(`  ✓ ${profil.length} profil terverifikasi`);
}

// ── HELPER ───────────────────────────────────────────────────────────────

// Kode tabel: 1 laporan, 2 hasil_perbaikan, 3 evaluasi, 4 upvote, 5 riwayat_status, 6 notifikasi.
function uuidSeed(kodeTabel: number, n: number): string {
  return `${kodeTabel}0000000-0000-4000-a000-${String(n).padStart(12, "0")}`;
}

// Waktu `hari` hari lalu pada jam `jam` (waktu lokal). hari >= 1 supaya selalu di masa lalu.
function hariLalu(hari: number, jam: number): string {
  const d = new Date();
  d.setDate(d.getDate() - hari);
  d.setHours(jam, 0, 0, 0);
  return d.toISOString();
}

function tambahJam(iso: string, jam: number): string {
  return new Date(Date.parse(iso) + jam * 3_600_000).toISOString();
}

const ms = (iso: string): number => Date.parse(iso);

// Rumus sementara; rumus final ada di migration L7. Satu tempat supaya mudah diganti.
const hitungSkor = (n: number): number => Math.min(100, n * 10);

// ponytail: haversine lokal untuk validasi seed; ganti ke Lokasi.hitungJarak() setelah fungsi itu ada.
function jarakMeter(a: Koordinat, b: Koordinat): number {
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLng = (b.longitude - a.longitude) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.sqrt(h));
}

// ── DATA LAPORAN ─────────────────────────────────────────────────────────

// Alur status sampai kondisi akhir. Laporan di-insert langsung di status akhir.
type Alur =
  | { jenis: "diterima" }
  | { jenis: "ditolak"; alasan: string }
  | { jenis: "menunggu_eksekusi" }
  | { jenis: "menunggu_evaluasi"; hasil: string }
  | { jenis: "dikembalikan"; hasil: string; keputusan: Exclude<Keputusan, "selesai">; catatan: string }
  | { jenis: "berhasil"; hasil: string; catatan: string | null };

type SpecLaporan = {
  n: number;
  kategori: Kategori;
  latitude: number;
  longitude: number;
  deskripsi: string;
  hari: number; // waktu_masuk = hariLalu(hari, jam); langkah berikutnya tiap hari setelahnya
  jam: number;
  upvote: number;
  alur: Alur;
};

const SPEC_LAPORAN: readonly SpecLaporan[] = [
  // ── diterima ──
  // L01 · Jl. Buah Batu dekat Jl. Talaga Bodas
  { n: 1, kategori: "jalan_berlubang", latitude: -6.945, longitude: 107.629, hari: 5, jam: 8, upvote: 0,
    deskripsi: "Lubang besar sekitar 1 meter di lajur kiri Jl. Buah Batu dekat persimpangan Jl. Talaga Bodas. Pengendara motor sering oleng, apalagi saat hujan karena lubang tergenang air.",
    alur: { jenis: "diterima" } },
  // L02 · Jl. Cisangkuy depan Taman Lansia
  { n: 2, kategori: "lampu_jalan_mati", latitude: -6.9015, longitude: 107.623, hari: 4, jam: 19, upvote: 1,
    deskripsi: "Tiga lampu jalan di Jl. Cisangkuy depan Taman Lansia mati sejak minggu lalu. Area jadi gelap total setelah magrib dan rawan bagi pejalan kaki.",
    alur: { jenis: "diterima" } },
  // L03 · Pasar Kosambi, Jl. Ahmad Yani
  { n: 3, kategori: "saluran_air_tersumbat", latitude: -6.9195, longitude: 107.6195, hari: 3, jam: 7, upvote: 2,
    deskripsi: "Saluran air di depan Pasar Kosambi tersumbat sampah plastik dan sisa sayuran. Air meluap ke jalan setiap hujan deras dan menimbulkan bau.",
    alur: { jenis: "diterima" } },
  // L04 · Jl. Braga dekat Braga Citywalk
  { n: 4, kategori: "trotoar_rusak", latitude: -6.9175, longitude: 107.6093, hari: 3, jam: 16, upvote: 0,
    deskripsi: "Paving block trotoar Jl. Braga dekat Braga Citywalk banyak yang lepas dan amblas. Beberapa wisatawan hampir tersandung.",
    alur: { jenis: "diterima" } },
  // L05 · Simpang Dago (Jl. Ir. H. Juanda)
  { n: 5, kategori: "rambu_marka_rusak", latitude: -6.8848, longitude: 107.6136, hari: 2, jam: 10, upvote: 4,
    deskripsi: "Marka zebra cross di Simpang Dago sudah pudar dan hampir tidak terlihat. Kendaraan jarang berhenti untuk pejalan kaki yang menyeberang.",
    alur: { jenis: "diterima" } },
  // L06 · Jl. Terusan Jakarta, Antapani
  { n: 6, kategori: "jalan_berlubang", latitude: -6.913, longitude: 107.662, hari: 1, jam: 7, upvote: 1,
    deskripsi: "Aspal Jl. Terusan Jakarta depan pertokoan Antapani mengelupas dan berlubang di beberapa titik dengan kedalaman sekitar 10 cm.",
    alur: { jenis: "diterima" } },

  // ── ditolak ──
  // L07 · Halaman Gedung Sate
  { n: 7, kategori: "lampu_jalan_mati", latitude: -6.9025, longitude: 107.6188, hari: 7, jam: 12, upvote: 0,
    deskripsi: "Lampu taman di halaman depan Gedung Sate tidak menyala sejak beberapa hari terakhir.",
    alur: { jenis: "ditolak", alasan: "Lokasi berada di dalam area Gedung Sate yang dikelola Pemerintah Provinsi Jawa Barat, di luar kewenangan penanganan kota." } },
  // L08 · Area dalam Cihampelas Walk
  { n: 8, kategori: "trotoar_rusak", latitude: -6.8935, longitude: 107.6045, hari: 6, jam: 15, upvote: 0,
    deskripsi: "Lantai jalur pejalan kaki di dalam area Cihampelas Walk retak dan sedikit amblas.",
    alur: { jenis: "ditolak", alasan: "Jalur yang dilaporkan berada di lahan milik pengelola pusat perbelanjaan, bukan fasilitas publik kota." } },

  // ── dikerjakan / menunggu_eksekusi ──
  // L09 · Jl. Otto Iskandardinata depan Pasar Baru
  { n: 9, kategori: "saluran_air_tersumbat", latitude: -6.9178, longitude: 107.6027, hari: 10, jam: 7, upvote: 7,
    deskripsi: "Got di sepanjang Jl. Otto Iskandardinata depan Pasar Baru tersumbat lumpur dan sampah. Saat hujan, air setinggi mata kaki menggenangi trotoar dan jalan.",
    alur: { jenis: "menunggu_eksekusi" } },
  // L10 · Jalan masuk Terminal Leuwipanjang
  { n: 10, kategori: "jalan_berlubang", latitude: -6.9465, longitude: 107.5944, hari: 9, jam: 17, upvote: 5,
    deskripsi: "Jalan masuk Terminal Leuwipanjang dari arah Jl. Soekarno-Hatta berlubang dalam dan makin lebar karena sering dilewati bus.",
    alur: { jenis: "menunggu_eksekusi" } },
  // L11 · Sekitar Alun-alun Ujungberung
  { n: 11, kategori: "lampu_jalan_mati", latitude: -6.9136, longitude: 107.7015, hari: 8, jam: 20, upvote: 3,
    deskripsi: "Sekitar lima tiang lampu penerangan jalan di sekitar Alun-alun Ujungberung tidak menyala sejak tiga hari lalu.",
    alur: { jenis: "menunggu_eksekusi" } },
  // L12 · Jl. Asia Afrika depan Gedung Merdeka (pernah dikembalikan: minta ulang bukti)
  { n: 12, kategori: "trotoar_rusak", latitude: -6.9211, longitude: 107.6098, hari: 18, jam: 9, upvote: 3,
    deskripsi: "Ubin trotoar di Jl. Asia Afrika depan Gedung Merdeka pecah dan berlubang, membahayakan pejalan kaki dan pengguna kursi roda.",
    alur: { jenis: "dikembalikan", hasil: "Ubin trotoar yang pecah sudah diganti dan lubang sudah ditutup.", keputusan: "minta_ulang_bukti",
      catatan: "Foto bukti buram dan tidak memperlihatkan seluruh area trotoar yang dilaporkan. Mohon unggah ulang foto yang jelas dari beberapa sudut." } },
  // L13 · Jl. Soekarno-Hatta dekat Metro Indah Mall (pernah dikembalikan: belum selesai)
  { n: 13, kategori: "rambu_marka_rusak", latitude: -6.9418, longitude: 107.6593, hari: 21, jam: 13, upvote: 0,
    deskripsi: "Rambu larangan putar balik di Jl. Soekarno-Hatta dekat Metro Indah Mall roboh tertabrak kendaraan dan tergeletak di bahu jalan.",
    alur: { jenis: "dikembalikan", hasil: "Rambu sudah didirikan kembali dan tiangnya diperkuat.", keputusan: "belum_selesai",
      catatan: "Tiang rambu masih miring dan papan rambu penyok sehingga sulit terbaca. Mohon ganti papan rambu dan pasang tiang tegak lurus." } },

  // ── dikerjakan / menunggu_evaluasi ──
  // L14 · Jl. Gatot Subroto depan Trans Studio Mall
  { n: 14, kategori: "jalan_berlubang", latitude: -6.9256, longitude: 107.6366, hari: 15, jam: 8, upvote: 1,
    deskripsi: "Lubang cukup dalam di Jl. Gatot Subroto depan Trans Studio Mall, sering menimbulkan kemacetan karena kendaraan menghindar.",
    alur: { jenis: "menunggu_evaluasi", hasil: "Lubang sudah ditambal dengan aspal hotmix dan dipadatkan." } },
  // L15 · Sisi Taman Tegallega
  { n: 15, kategori: "saluran_air_tersumbat", latitude: -6.9365, longitude: 107.604, hari: 13, jam: 11, upvote: 3,
    deskripsi: "Saluran drainase di sisi Taman Tegallega tertutup sedimen dan sampah daun sehingga jalan tergenang setelah hujan.",
    alur: { jenis: "menunggu_evaluasi", hasil: "Sedimen dan sampah sudah dikeruk sepanjang kurang lebih 30 meter, aliran air kembali lancar." } },
  // L16 · Persimpangan Jl. Merdeka dekat Bandung Indah Plaza
  { n: 16, kategori: "rambu_marka_rusak", latitude: -6.9089, longitude: 107.6107, hari: 11, jam: 18, upvote: 0,
    deskripsi: "Marka garis henti dan panah belok di persimpangan Jl. Merdeka dekat Bandung Indah Plaza sudah pudar.",
    alur: { jenis: "menunggu_evaluasi", hasil: "Marka garis henti dan panah belok sudah dicat ulang dengan cat thermoplastic." } },

  // ── berhasil ──
  // L17 · Jl. Dipatiukur depan kampus Unpad
  { n: 17, kategori: "lampu_jalan_mati", latitude: -6.8903, longitude: 107.617, hari: 30, jam: 9, upvote: 2,
    deskripsi: "Lampu jalan di Jl. Dipatiukur depan kampus Unpad mati, mahasiswa yang pulang malam merasa tidak aman.",
    alur: { jenis: "berhasil", hasil: "Lampu dan fitting yang rusak sudah diganti, seluruh lampu menyala kembali.", catatan: "Lampu sudah menyala saat dicek malam hari." } },
  // L18 · Jl. Tamansari depan Kebun Binatang Bandung
  { n: 18, kategori: "trotoar_rusak", latitude: -6.8895, longitude: 107.6074, hari: 27, jam: 14, upvote: 0,
    deskripsi: "Trotoar di Jl. Tamansari depan Kebun Binatang Bandung amblas sepanjang sekitar 3 meter.",
    alur: { jenis: "berhasil", hasil: "Trotoar yang amblas sudah dibongkar, dipadatkan, dan dipasang paving baru.", catatan: null } },
  // L19 · Depan Terminal Cicaheum
  { n: 19, kategori: "saluran_air_tersumbat", latitude: -6.9017, longitude: 107.6556, hari: 24, jam: 10, upvote: 1,
    deskripsi: "Gorong-gorong di depan Terminal Cicaheum tersumbat sehingga air menggenang di jalur keluar bus.",
    alur: { jenis: "berhasil", hasil: "Gorong-gorong sudah dibersihkan dan tutupnya diganti.", catatan: "Genangan tidak muncul lagi setelah hujan." } },
];

const ID_LAPORAN_SEED: readonly string[] = SPEC_LAPORAN.map((s) => uuidSeed(1, s.n));

// Satu perubahan status/tahap: jadi satu baris riwayat_status + satu notifikasi ke pelapor.
type Kejadian = {
  status: Status;
  tahap: Tahap | null;
  catatan: string | null;
  waktu: string;
  pesan: (tiket: string) => string;
};

type DataLaporan = {
  n: number;
  kode: string;
  laporan: Lengkap<"laporan", "id_tiket">; // id_tiket dari default sequence
  hasil: Lengkap<"hasil_perbaikan"> | null;
  evaluasi: Lengkap<"evaluasi"> | null;
  upvote: Lengkap<"upvote">[];
  kejadian: Kejadian[];
};

// Bentuk semua baris satu laporan dari spesifikasinya. Timeline: waktu_masuk (hari ke-0),
// disetujui/ditolak (+1 hari), hasil diunggah (+2), evaluasi (+3).
function bangunLaporan(s: SpecLaporan): DataLaporan {
  const id = uuidSeed(1, s.n);
  const pelapor = s.n % 2 === 1 ? ID_WARGA1 : ID_WARGA2;
  const masuk = hariLalu(s.hari, s.jam);
  const t1 = hariLalu(s.hari - 1, 9);
  const t2 = hariLalu(s.hari - 2, 14);
  const t3 = hariLalu(s.hari - 3, 10);
  const a = s.alur;

  const kejadian: Kejadian[] = [
    { status: "diterima", tahap: null, catatan: null, waktu: masuk,
      pesan: (t) => `Laporan ${t} diterima dan menunggu validasi petugas.` },
  ];
  let hasil: DataLaporan["hasil"] = null;
  let evaluasi: DataLaporan["evaluasi"] = null;

  if (a.jenis === "ditolak") {
    kejadian.push({ status: "ditolak", tahap: null, catatan: a.alasan, waktu: t1,
      pesan: (t) => `Laporan ${t} ditolak. Alasan: ${a.alasan}` });
  }
  if (a.jenis !== "diterima" && a.jenis !== "ditolak") {
    kejadian.push({ status: "dikerjakan", tahap: "menunggu_eksekusi", catatan: null, waktu: t1,
      pesan: (t) => `Laporan ${t} disetujui dan menunggu pengerjaan oleh petugas lapangan.` });
  }
  if (a.jenis === "menunggu_evaluasi" || a.jenis === "dikembalikan" || a.jenis === "berhasil") {
    hasil = { id_hasil: uuidSeed(2, s.n), id_laporan: id, id_eksekutor: ID_EKSEKUTOR, catatan: a.hasil, waktu_unggah: t2 };
    kejadian.push({ status: "dikerjakan", tahap: "menunggu_evaluasi", catatan: null, waktu: t2,
      pesan: (t) => `Perbaikan laporan ${t} sudah dikerjakan dan sedang dievaluasi.` });
  }
  if (hasil && (a.jenis === "dikembalikan" || a.jenis === "berhasil")) {
    const keputusan: Keputusan = a.jenis === "berhasil" ? "selesai" : a.keputusan;
    evaluasi = { id_evaluasi: uuidSeed(3, s.n), id_laporan: id, id_hasil: hasil.id_hasil, id_admin: ID_ADMIN,
      keputusan, catatan: a.catatan, waktu_evaluasi: t3 };
    kejadian.push(
      a.jenis === "berhasil"
        ? { status: "berhasil", tahap: null, catatan: a.catatan, waktu: t3,
            pesan: (t) => `Laporan ${t} selesai diperbaiki. Terima kasih atas laporan Anda.` }
        : { status: "dikerjakan", tahap: "menunggu_eksekusi", catatan: a.catatan, waktu: t3,
            pesan: (t) => `Hasil perbaikan laporan ${t} belum diterima, laporan dikerjakan ulang.` },
    );
  }

  const akhir = kejadian[kejadian.length - 1];
  const waktuSelesai = akhir.status === "berhasil" ? akhir.waktu : null;

  // Pendukung: warga selain pelapor, digilir per laporan supaya tersebar.
  // Trigger L7 belum ada; setelah L7, cek ulang agar tidak terhitung dua kali.
  const pendukung = ID_WARGA.filter((u) => u !== pelapor);
  const upvote = Array.from({ length: s.upvote }, (_, i) => ({
    id_upvote: uuidSeed(4, s.n * 10 + i),
    id_laporan: id,
    id_user: pendukung[(s.n + i) % pendukung.length],
    waktu_upvote: tambahJam(masuk, 2 * (i + 1)),
  }));

  return {
    n: s.n,
    kode: `L${String(s.n).padStart(2, "0")}`,
    laporan: {
      id,
      id_pelapor: pelapor,
      kategori: s.kategori,
      deskripsi: s.deskripsi,
      latitude: s.latitude,
      longitude: s.longitude,
      status: akhir.status,
      tahap: akhir.tahap,
      // Trigger L7 belum ada; setelah L7, cek ulang agar tidak terhitung dua kali.
      jumlah_upvote: upvote.length,
      skor_prioritas: hitungSkor(upvote.length),
      alasan_penolakan: a.jenis === "ditolak" ? a.alasan : null,
      waktu_masuk: masuk,
      waktu_selesai: waktuSelesai,
    },
    hasil,
    evaluasi,
    upvote,
    kejadian,
  };
}

// ── VALIDASI (sebelum menulis) ───────────────────────────────────────────

const kosong = (s: string | null): boolean => (s ?? "").trim().length === 0;

// Status laporan pada waktu tertentu menurut timeline kejadian.
function statusPada(kejadian: Kejadian[], waktu: string): Status | null {
  let status: Status | null = null;
  for (const k of kejadian) if (ms(k.waktu) <= ms(waktu)) status = k.status;
  return status;
}

function validasi(data: DataLaporan[]): string[] {
  const salah: string[] = [];
  const sekarang = Date.now();
  const peranById = new Map<string, Peran>(AKUN_SEED.map((a) => [a.id, a.role]));

  for (const d of data) {
    const { kode, laporan: l, hasil: h, evaluasi: e } = d;
    const tambah = (pesan: string) => salah.push(`${kode}: ${pesan}`);

    // Lokasi
    if (!dalamWilayah(l)) tambah(`koordinat (${l.latitude}, ${l.longitude}) di luar batas Kota Bandung`);

    // CHECK constraint laporan
    if (kosong(l.deskripsi)) tambah("deskripsi kosong");
    if ((l.status === "dikerjakan") !== (l.tahap !== null)) tambah(`tahap ${l.tahap} tidak cocok dengan status ${l.status}`);
    if (l.skor_prioritas < 0 || l.skor_prioritas >= 1000) tambah(`skor_prioritas ${l.skor_prioritas} di luar numeric(5,2)`);
    if (l.status === "ditolak" ? kosong(l.alasan_penolakan) : l.alasan_penolakan !== null) {
      tambah("alasan_penolakan wajib terisi hanya untuk laporan ditolak");
    }
    if ((l.status === "berhasil") !== (l.waktu_selesai !== null)) tambah("waktu_selesai wajib terisi hanya untuk laporan berhasil");

    // CHECK constraint hasil_perbaikan & evaluasi
    if (h && (kosong(h.catatan) || h.id_laporan !== l.id)) tambah("hasil_perbaikan tidak valid (catatan kosong / laporan beda)");
    if (e) {
      if (e.keputusan !== "selesai" && kosong(e.catatan)) tambah(`evaluasi ${e.keputusan} wajib punya catatan`);
      if (!h || e.id_hasil !== h.id_hasil || e.id_laporan !== l.id) tambah("evaluasi harus merujuk hasil milik laporan yang sama");
    }

    // Timeline
    const [awal] = d.kejadian;
    if (awal.status !== "diterima" || awal.waktu !== l.waktu_masuk) tambah("riwayat pertama harus 'diterima' di waktu_masuk");
    d.kejadian.forEach((k, i) => {
      if (ms(k.waktu) >= sekarang) tambah(`kejadian ${k.status} di masa depan`);
      if (i > 0 && ms(k.waktu) <= ms(d.kejadian[i - 1].waktu)) tambah("urutan waktu riwayat tidak menaik");
    });
    const akhir = d.kejadian[d.kejadian.length - 1];
    if (akhir.status !== l.status || akhir.tahap !== l.tahap) tambah("riwayat terakhir tidak sama dengan status akhir");
    if (h && ms(h.waktu_unggah) <= ms(l.waktu_masuk)) tambah("waktu_unggah hasil harus setelah waktu_masuk");
    if (e && h && ms(e.waktu_evaluasi) <= ms(h.waktu_unggah)) tambah("waktu_evaluasi harus setelah waktu_unggah");
    if (l.waktu_selesai && (!e || ms(l.waktu_selesai) < ms(e.waktu_evaluasi))) tambah("waktu_selesai harus >= waktu_evaluasi");

    // Upvote (sesuai boleh_dukung pada saat upvote diberikan)
    const pemberi = new Set<string>();
    for (const u of d.upvote) {
      if (peranById.get(u.id_user) !== "warga") tambah(`upvote oleh ${u.id_user} yang bukan warga`);
      if (u.id_user === l.id_pelapor) tambah("pelapor mendukung laporannya sendiri");
      if (pemberi.has(u.id_user)) tambah(`upvote dobel oleh ${u.id_user}`);
      pemberi.add(u.id_user);
      const st = statusPada(d.kejadian, u.waktu_upvote);
      if (st !== "diterima" && st !== "dikerjakan") tambah(`upvote saat status ${st} (harus diterima/dikerjakan)`);
      if (ms(u.waktu_upvote) <= ms(l.waktu_masuk) || ms(u.waktu_upvote) >= sekarang) tambah("waktu_upvote di luar rentang");
      if (l.waktu_selesai && ms(u.waktu_upvote) >= ms(l.waktu_selesai)) tambah("waktu_upvote setelah waktu_selesai");
    }
  }

  // Antar-laporan: waktu_masuk unik (urutan LK deterministik) dan laporan aktif sekategori berjarak > 200 m.
  const aktif = data.filter((d) => d.laporan.status === "diterima" || d.laporan.status === "dikerjakan");
  data.forEach((a, i) =>
    data.slice(i + 1).forEach((b) => {
      if (a.laporan.waktu_masuk === b.laporan.waktu_masuk) salah.push(`${a.kode}/${b.kode}: waktu_masuk sama`);
    }),
  );
  aktif.forEach((a, i) =>
    aktif.slice(i + 1).forEach((b) => {
      if (a.laporan.kategori !== b.laporan.kategori) return;
      const jarak = jarakMeter(a.laporan, b.laporan);
      if (jarak <= 200) salah.push(`${a.kode}/${b.kode}: laporan aktif ${a.laporan.kategori} hanya berjarak ${Math.round(jarak)} m`);
    }),
  );

  return salah;
}

// ── TULIS & VERIFIKASI ───────────────────────────────────────────────────

function cek(label: string, error: { message: string } | null): void {
  if (error) throw new Error(`Gagal menulis ${label}: ${error.message}`);
}

const nomorTiket = (tiket: string): number => Number(tiket.replace(/^LK-/, ""));

// Hapus HANYA laporan seed; hasil, evaluasi, upvote, riwayat, notifikasi, foto, video ikut terhapus
// (on delete cascade). Sequence id_tiket tidak di-reset, jadi laporan baru mendapat nomor LK lanjutan.
async function hapusLaporanSeed(): Promise<void> {
  console.log("\n[reset]");
  const { data, error } = await supabase.from("laporan").delete().in("id", ID_LAPORAN_SEED).select("id");
  if (error) throw new Error(`Gagal menghapus laporan seed: ${error.message}`);
  console.log(`  ✓ ${data.length} laporan seed dihapus (beserta data turunannya)`);
}

async function siapkanLaporan(data: DataLaporan[]): Promise<void> {
  console.log("\n[laporan]");
  const opsi = { ignoreDuplicates: true };

  // Urut waktu_masuk menaik supaya nomor LK terkecil = laporan tertua.
  const urut = [...data].sort((a, b) => ms(a.laporan.waktu_masuk) - ms(b.laporan.waktu_masuk));
  cek("laporan", (await supabase.from("laporan").upsert(urut.map((d) => d.laporan), opsi)).error);

  const hasil = data.flatMap((d) => (d.hasil ? [d.hasil] : []));
  cek("hasil_perbaikan", (await supabase.from("hasil_perbaikan").upsert(hasil, opsi)).error);

  const evaluasi = data.flatMap((d) => (d.evaluasi ? [d.evaluasi] : []));
  cek("evaluasi", (await supabase.from("evaluasi").upsert(evaluasi, opsi)).error);

  // Trigger L7 belum ada; setelah L7, cek ulang agar tidak terhitung dua kali.
  cek("upvote", (await supabase.from("upvote").upsert(data.flatMap((d) => d.upvote), opsi)).error);

  // Trigger L7 belum ada; setelah L7, cek ulang agar tidak terhitung dua kali.
  const riwayat: Lengkap<"riwayat_status">[] = data.flatMap((d) =>
    d.kejadian.map((k, i) => ({
      id: uuidSeed(5, d.n * 10 + i),
      id_laporan: d.laporan.id,
      status: k.status,
      tahap: k.tahap,
      catatan: k.catatan,
      waktu: k.waktu,
    })),
  );
  cek("riwayat_status", (await supabase.from("riwayat_status").upsert(riwayat, opsi)).error);

  // id_tiket asli (dari sequence) untuk isi notifikasi.
  const { data: tiket, error } = await supabase.from("laporan").select("id, id_tiket").in("id", ID_LAPORAN_SEED);
  if (error) throw new Error(`Gagal membaca id_tiket: ${error.message}`);
  const tiketById = new Map(tiket.map((t) => [t.id, t.id_tiket]));

  const batasBaca = Date.now() - 2 * 86_400_000;
  const notifikasi: Lengkap<"notifikasi">[] = data.flatMap((d) => {
    const t = tiketById.get(d.laporan.id);
    if (!t) throw new Error(`${d.kode}: id_tiket tidak ditemukan setelah insert`);
    const keNotif = (n: number, idUser: string, isi: string, waktu: string): Lengkap<"notifikasi"> => ({
      id_notifikasi: uuidSeed(6, d.n * 10 + n),
      id_user: idUser,
      id_laporan: d.laporan.id,
      isi_pesan: isi,
      waktu_kirim: waktu,
      status_baca: ms(waktu) < batasBaca,
    });
    const kePelapor = d.kejadian.map((k, i) => keNotif(i, d.laporan.id_pelapor, k.pesan(t), k.waktu));
    const e = d.evaluasi;
    // Notifikasi ke eksekutor untuk evaluasi yang mengembalikan hasil perbaikan (n = 9).
    const keEksekutor =
      e && e.keputusan !== "selesai"
        ? [keNotif(9, ID_EKSEKUTOR,
            `Hasil perbaikan laporan ${t} dikembalikan (${e.keputusan.replaceAll("_", " ")}). Catatan: ${e.catatan ?? "-"}`,
            e.waktu_evaluasi)]
        : [];
    return [...kePelapor, ...keEksekutor];
  });
  cek("notifikasi", (await supabase.from("notifikasi").upsert(notifikasi, opsi)).error);

  await verifikasiLaporan(data.length);
}

async function verifikasiLaporan(jumlahSeed: number): Promise<void> {
  const { data: lap, error } = await supabase
    .from("laporan")
    .select("id, id_tiket, status, tahap, jumlah_upvote, waktu_masuk")
    .in("id", ID_LAPORAN_SEED);
  if (error) throw new Error(`Gagal memverifikasi laporan: ${error.message}`);
  const { data: up, error: errorUp } = await supabase.from("upvote").select("id_laporan").in("id_laporan", ID_LAPORAN_SEED);
  if (errorUp) throw new Error(`Gagal memverifikasi upvote: ${errorUp.message}`);

  const salah: string[] = [];
  if (lap.length !== jumlahSeed) salah.push(`${lap.length}/${jumlahSeed} laporan seed ditemukan`);
  for (const l of lap) {
    const n = up.filter((u) => u.id_laporan === l.id).length;
    if (l.jumlah_upvote !== n) salah.push(`${l.id_tiket}: jumlah_upvote ${l.jumlah_upvote}, baris upvote ${n}`);
  }
  const urut = [...lap].sort((a, b) => ms(a.waktu_masuk) - ms(b.waktu_masuk));
  if (urut.some((l, i) => i > 0 && nomorTiket(l.id_tiket) <= nomorTiket(urut[i - 1].id_tiket))) {
    salah.push("urutan id_tiket tidak mengikuti waktu_masuk (jalankan ulang dengan --reset)");
  }
  if (salah.length > 0) throw new Error(`Verifikasi laporan gagal:\n  - ${salah.join("\n  - ")}`);

  const perStatus = new Map<string, number>();
  for (const l of lap) {
    const kunci = l.tahap ? `${l.status}/${l.tahap}` : l.status;
    perStatus.set(kunci, (perStatus.get(kunci) ?? 0) + 1);
  }
  console.log(`  ✓ ${lap.length} laporan terverifikasi (jumlah_upvote = baris upvote)`);
  for (const [kunci, n] of perStatus) console.log(`    ${kunci.padEnd(30)} ${n}`);

  console.log("  Baris per tabel (milik laporan seed):");
  console.log(`    ${"laporan".padEnd(30)} ${lap.length}`);
  for (const tabel of ["hasil_perbaikan", "evaluasi", "upvote", "riwayat_status", "notifikasi"] as const) {
    const { count, error: errorHitung } = await supabase
      .from(tabel)
      .select("*", { count: "exact", head: true })
      .in("id_laporan", ID_LAPORAN_SEED);
    if (errorHitung) throw new Error(`Gagal menghitung ${tabel}: ${errorHitung.message}`);
    console.log(`    ${tabel.padEnd(30)} ${count ?? 0}`);
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("=== Seed LaporKota ===");
  console.log(`Target: ${url}`);
  if (RESET) console.log("Mode: --reset (laporan seed dihapus lalu dibuat ulang; akun tidak dihapus)");

  try {
    // Validasi data dulu supaya gagal sebelum ada yang ditulis/dihapus.
    const data = SPEC_LAPORAN.map(bangunLaporan);
    const salah = validasi(data);
    if (salah.length > 0) throw new Error(`Validasi data seed gagal:\n  - ${salah.join("\n  - ")}`);
    console.log(`✓ ${data.length} laporan seed lolos validasi`);

    await siapkanAkun();
    if (RESET) await hapusLaporanSeed();
    await siapkanLaporan(data);
    console.log("\n✓ seed selesai");
  } catch (err: unknown) {
    console.error(`\n✗ seed gagal: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

void main();
