// Uji integrasi Peran C (UC03, UC04) terhadap Supabase PRODUCTION, mengikuti aturan 4.3 Dipta:
// akun khusus tes, data berpenanda [TEST-INT], assertion tidak bergantung jumlah total data,
// hanya memakai laporan tes milik sendiri, dan menghapus HANYA ID yang dibuat di afterAll.
// Komponen nyata: controller -> entity -> PostgreSQL (RLS, RPC, trigger) + Storage. Tidak ada entity/DB yang dimock.
// Satu-satunya pengganti: createClient() dari lib/supabase/server (butuh cookies() Next.js), diganti client
// supabase-js asli yang sudah login sebagai akun tes.
// >>> SESUAIKAN: nama variabel env, pola nama file, dan helper bersih-bersih dengan contoh tes integrasi Dipta. <<<
import { createClient as buatClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PESAN_BERKAS_TIDAK_VALID } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { bukaLaporan, doFilter, doSorting } from "@/server/controllers/PenugasanController";
import { unggahHasil } from "@/server/controllers/PerbaikanController";
import { simpanEvaluasi } from "@/server/entities/Evaluasi";
import { catatUpvote } from "@/server/entities/Upvote";
import type { Database, Enums } from "@/types/database";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

type Client = SupabaseClient<Database>;
type Akun = { client: Client; id: string };
type Tugas = { id_tiket: string; skor_prioritas: number; waktu_masuk: string; kategori: string };

const env = (nama: string) => process.env[nama] ?? "";
const URL_SB = env("NEXT_PUBLIC_SUPABASE_URL");
const KEY = env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const SECRET = env("SUPABASE_SECRET_KEY"); // hanya di .env.local, untuk bersih-bersih
const PENANDA = "[TEST-INT]";
const KATEGORI: Enums<"kategori_kerusakan"> = "rambu_marka_rusak";
const JPG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0xff, 0xd9]);

async function login(email: string): Promise<Akun> {
  const client = buatClient<Database>(URL_SB, KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.signInWithPassword({ email, password: env("TEST_PASSWORD") });
  if (error) throw error;
  return { client, id: data.user.id };
}

/** Semua createClient() di controller (termasuk requireRole) memakai sesi akun ini. */
const sebagai = (akun: Akun) => vi.mocked(createClient).mockResolvedValue(akun.client);

/** Invarian urutan prioritas: skor menurun; skor sama -> waktu masuk paling awal dulu. */
function terurut(daftar: Tugas[]) {
  return daftar.every((t, i) => {
    if (i === 0) return true;
    const s = daftar[i - 1];
    return Number(s.skor_prioritas) > Number(t.skor_prioritas) ||
      (Number(s.skor_prioritas) === Number(t.skor_prioritas) && Date.parse(s.waktu_masuk) <= Date.parse(t.waktu_masuk));
  });
}

describe.skipIf(!URL_SB || !KEY || !SECRET)("Integrasi Peran C (UC03, UC04) di production", () => {
  let warga: Akun, warga2: Akun, admin: Akun, eksekutor: Akun;
  const dibuat = { laporan: [] as string[], storage: [] as string[] }; // ID yang wajib dihapus
  let lap: { id: string; id_tiket: string };
  let pathHasil = "";
  const catatanHasil = `${PENANDA} hasil perbaikan Peran C ${Date.now()}`;

  beforeAll(async () => {
    [warga, warga2, admin, eksekutor] = await Promise.all([
      login(env("TEST_WARGA_EMAIL")), login(env("TEST_WARGA2_EMAIL")),
      login(env("TEST_ADMIN_EMAIL")), login(env("TEST_EKSEKUTOR_EMAIL")),
    ]);

    // 1. Warga tes membuat laporan tes sendiri (foto + RPC kirim_laporan).
    const pathFoto = `laporan/${warga.id}/test-int-${Date.now()}.jpg`;
    const unggah = await warga.client.storage.from("media").upload(pathFoto, JPG, { contentType: "image/jpeg" });
    if (unggah.error) throw unggah.error;
    dibuat.storage.push(pathFoto);
    const { data, error } = await warga.client.rpc("kirim_laporan", {
      p_deskripsi: `${PENANDA} laporan uji Peran C`,
      p_kategori: KATEGORI,
      p_latitude: -6.9175 + Math.random() * 0.001,
      p_longitude: 107.6191 + Math.random() * 0.001,
      p_media: [{ path: pathFoto, format: "jpg", ukuran: JPG.byteLength, tipe: "foto" }],
    });
    if (error) throw error;
    lap = data[0];
    dibuat.laporan.push(lap.id);

    // 2. Admin tes menyetujui laporan tes itu -> dikerjakan / menunggu_eksekusi.
    const setuju = await admin.client.from("laporan")
      .update({ status: "dikerjakan", tahap: "menunggu_eksekusi" }).eq("id", lap.id);
    if (setuju.error) throw setuju.error;
  });

  afterAll(async () => {
    // Hapus HANYA ID yang dibuat tes ini. Ganti dengan helper Dipta bila sudah ada.
    const svc = buatClient<Database>(URL_SB, SECRET, { auth: { persistSession: false } });
    for (const id of dibuat.laporan) {
      const { data: hasil } = await svc.from("hasil_perbaikan").select("id_hasil").eq("id_laporan", id);
      const idHasil = (hasil ?? []).map((h) => h.id_hasil);
      await svc.from("evaluasi").delete().eq("id_laporan", id);
      if (idHasil.length) {
        await svc.from("foto").delete().in("id_hasil", idHasil);
        await svc.from("video").delete().in("id_hasil", idHasil);
      }
      await svc.from("hasil_perbaikan").delete().eq("id_laporan", id);
      await svc.from("foto").delete().eq("id_laporan", id);
      await svc.from("video").delete().eq("id_laporan", id);
      await svc.from("upvote").delete().eq("id_laporan", id);
      await svc.from("notifikasi").delete().eq("id_laporan", id);
      await svc.from("riwayat_status").delete().eq("id_laporan", id);
      const { error } = await svc.from("laporan").delete().eq("id", id);
      if (error) console.error("Gagal menghapus laporan tes", id, error.message);
    }
    if (dibuat.storage.length) await svc.storage.from("media").remove(dibuat.storage);
  });

  it("INT-TC40 doSorting: laporan tes ada di daftar tugas dan daftar terurut prioritas", async () => {
    sebagai(eksekutor);
    const hasil = await doSorting();
    if (!hasil.ok) throw new Error(hasil.error);
    expect(hasil.data.some((t) => t.id_tiket === lap.id_tiket)).toBe(true);
    expect(terurut(hasil.data)).toBe(true);
  });

  it("INT-TC41 doFilter: kategori laporan tes saja, tetap terurut", async () => {
    sebagai(eksekutor);
    const hasil = await doFilter(KATEGORI);
    if (!hasil.ok) throw new Error(hasil.error);
    expect(hasil.data.some((t) => t.id_tiket === lap.id_tiket)).toBe(true);
    expect(hasil.data.every((t) => t.kategori === KATEGORI)).toBe(true);
    expect(terurut(hasil.data)).toBe(true);
  });

  it("INT-TC42 doSorting: akun warga ditolak (requireRole + profil nyata)", async () => {
    sebagai(warga);
    expect((await doSorting()).ok).toBe(false);
  });

  it("INT-TC43 bukaLaporan: rincian + foto laporan tes; tiket fiktif ditolak", async () => {
    sebagai(eksekutor);
    const hasil = await bukaLaporan(lap.id_tiket);
    if (!hasil.ok) throw new Error(hasil.error);
    expect(hasil.data.id).toBe(lap.id);
    expect(hasil.data.foto.map((f) => f.path)).toEqual(dibuat.storage.slice(0, 1));
    expect(hasil.data.evaluasiTerakhir).toBeNull();
    expect((await bukaLaporan("LK-TIDAK-ADA")).ok).toBe(false);
  });

  it("C02-UT43 hitungPrioritas (batas): laporan tes baru berskor 0 dengan 0 dukungan", async () => {
    const { data } = await admin.client.from("laporan").select("jumlah_upvote, skor_prioritas").eq("id", lap.id).single();
    expect(data).toEqual({ jumlah_upvote: 0, skor_prioritas: 0 });
  });

  it("C02-UT44 hitungPrioritas (normal): satu dukungan dari warga lain menaikkan skor", async () => {
    const upvote = await catatUpvote(warga2.client, lap.id, warga2.id);
    expect(upvote.error).toBeNull();
    const { data } = await admin.client.from("laporan").select("jumlah_upvote, skor_prioritas").eq("id", lap.id).single();
    expect(data?.jumlah_upvote).toBe(1);
    expect(Number(data?.skor_prioritas)).toBeGreaterThan(0);
  });

  it("C02-UT45 hitungPrioritas (negatif): dukungan ganda ditolak, skor tidak berubah", async () => {
    const sebelum = await admin.client.from("laporan").select("jumlah_upvote, skor_prioritas").eq("id", lap.id).single();
    const ulang = await catatUpvote(warga2.client, lap.id, warga2.id);
    expect(ulang.error).not.toBeNull();
    const sesudah = await admin.client.from("laporan").select("jumlah_upvote, skor_prioritas").eq("id", lap.id).single();
    expect(sesudah.data).toEqual(sebelum.data);
  });

  it("INT-TC44 unggahHasil: Storage -> RPC -> hasil_perbaikan + foto, tahap menunggu_evaluasi", async () => {
    sebagai(eksekutor);
    pathHasil = `hasil/${eksekutor.id}/test-int-${Date.now()}.jpg`;
    const unggah = await eksekutor.client.storage.from("media").upload(pathHasil, JPG, { contentType: "image/jpeg" });
    expect(unggah.error).toBeNull();
    dibuat.storage.push(pathHasil);

    const hasil = await unggahHasil(lap.id_tiket, catatanHasil,
      [{ path: pathHasil, format: "jpg", ukuran: JPG.byteLength, tipe: "foto" }], []);
    expect(hasil).toEqual({ ok: true, data: { idTiket: lap.id_tiket } });

    const { data: baris } = await admin.client.from("hasil_perbaikan")
      .select("id_hasil, catatan, foto!foto_id_hasil_fkey(path)").eq("id_laporan", lap.id);
    expect(baris).toHaveLength(1);
    expect(baris?.[0].catatan).toBe(catatanHasil);
    expect(baris?.[0].foto).toEqual([{ path: pathHasil }]);
    const { data: laporan } = await admin.client.from("laporan").select("status, tahap").eq("id", lap.id).single();
    expect(laporan).toEqual({ status: "dikerjakan", tahap: "menunggu_evaluasi" });
  });

  it("INT-TC45 unggahHasil: kirim ulang tiket yang sama ditolak, tidak ada baris ganda", async () => {
    sebagai(eksekutor);
    const hasil = await unggahHasil(lap.id_tiket, catatanHasil,
      [{ path: pathHasil, format: "jpg", ukuran: JPG.byteLength, tipe: "foto" }], []);
    expect(hasil.ok).toBe(false);
    const { count } = await admin.client.from("hasil_perbaikan")
      .select("id_hasil", { count: "exact", head: true }).eq("id_laporan", lap.id);
    expect(count).toBe(1);
  });

  it("INT-TC46 unggahHasil: path berkas milik pengguna lain ditolak", async () => {
    sebagai(eksekutor);
    const hasil = await unggahHasil(lap.id_tiket, `${PENANDA} x`,
      [{ path: `hasil/${warga.id}/palsu.jpg`, format: "jpg", ukuran: 13, tipe: "foto" }], []);
    expect(hasil).toEqual({ ok: false, error: PESAN_BERKAS_TIDAK_VALID });
  });

  it("INT-TC47 minta ulang bukti: tugas kembali ke daftar dengan catatan evaluasi terakhir", async () => {
    const { data: terkirim, error } = await admin.client.from("hasil_perbaikan")
      .select("id_hasil").eq("id_laporan", lap.id).single();
    if (error) throw error;
    const catatanAdmin = `${PENANDA} mohon foto ulang`;
    const simpan = await simpanEvaluasi(admin.client, {
      id_laporan: lap.id, id_hasil: terkirim.id_hasil, id_admin: admin.id,
      keputusan: "minta_ulang_bukti", catatan: catatanAdmin,
    });
    expect(simpan.error).toBeNull();

    sebagai(eksekutor);
    const rincian = await bukaLaporan(lap.id_tiket);
    if (!rincian.ok) throw new Error(rincian.error);
    expect(rincian.data.tahap).toBe("menunggu_eksekusi");
    expect(rincian.data.evaluasiTerakhir).toMatchObject({ keputusan: "minta_ulang_bukti", catatan: catatanAdmin });
  });
});
