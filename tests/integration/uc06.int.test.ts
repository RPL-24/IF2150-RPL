import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/types/database";
import {
  getDaftarPublik,
  getRincianPublik,
} from "@/server/entities/Laporan";
import {
  catatUpvote,
  getJumlahUpvote,
} from "@/server/entities/Upvote";
import { buatPelacak } from "./helpers/pelacak";
import {
  buatClientAdmin,
  KOORDINAT_TES,
  loginSebagai,
  PENANDA,
} from "./helpers/supabase";

describe("Integrasi UC06 - Peta Publik dan Upvote", () => {
  const service = buatClientAdmin();
  const pelacak = buatPelacak();
  const idLaporanTes: string[] = [];

  let warga: SupabaseClient<Database>;
  let anonim: SupabaseClient<Database>;
  let idWarga: string;
  let idPemilikLain: string;

  beforeAll(async () => {
    const akunWarga = await loginSebagai("warga");
    const akunAdmin = await loginSebagai("admin");

    warga = akunWarga.client;
    idWarga = akunWarga.idUser;
    idPemilikLain = akunAdmin.idUser;

    expect(idWarga).not.toBe(idPemilikLain);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      throw new Error("Konfigurasi client anonim belum lengkap.");
    }

    anonim = createClient<Database>(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  });

  // Setup fixture saja, bukan pengujian proses mengirim laporan.
  // Pemilik fixture boleh berbeda dari akun warga yang memberi upvote.
  async function buatLaporanTes(idPelapor: string, idTes: string) {
    const id = crypto.randomUUID();

    // Catat sebelum request agar tetap bisa dibersihkan
    // jika respons request gagal diterima.
    pelacak.catat("laporan", id);
    idLaporanTes.push(id);

    const { data, error } = await service
      .from("laporan")
      .insert({
        id,
        id_pelapor: idPelapor,
        kategori: "jalan_berlubang",
        deskripsi: `${PENANDA} UC06 ${idTes} ${id}`,
        ...KOORDINAT_TES,
      })
      .select("id, id_tiket, jumlah_upvote")
      .single();

    if (error || !data) {
      throw new Error(
        `Gagal membuat fixture: ${error?.message ?? "data kosong"}`,
      );
    }

    return data;
  }

  async function bacaLaporan(id: string) {
    const { data, error } = await service
      .from("laporan")
      .select("jumlah_upvote, skor_prioritas")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw new Error(
        `Gagal membaca fixture: ${error?.message ?? "data kosong"}`,
      );
    }

    return data;
  }

  async function periksaJumlahBarisUpvote(
    idLaporan: string,
    jumlah: number,
  ) {
    const { count, error } = await service
      .from("upvote")
      .select("id_upvote", { count: "exact", head: true })
      .eq("id_laporan", idLaporan);

    expect(error).toBeNull();
    expect(count).toBe(jumlah);
  }

  afterAll(async () => {
    try {
      // Catat juga ID baris upvote milik fixture kita.
      if (idLaporanTes.length > 0) {
        const { data, error } = await service
          .from("upvote")
          .select("id_upvote")
          .in("id_laporan", idLaporanTes);

        if (error) throw new Error(error.message);

        for (const baris of data ?? []) {
          pelacak.catat("upvote", baris.id_upvote);
        }
      }
    } finally {
      // Tetap bersihkan jika pembacaan ID upvote gagal.
      // Penghapusan laporan juga meng-cascade upvote terkait.
      await pelacak.bersihkan();
    }

    if (idLaporanTes.length > 0) {
      const { count, error } = await service
        .from("laporan")
        .select("id", { count: "exact", head: true })
        .in("id", idLaporanTes);

      expect(error).toBeNull();
      expect(count).toBe(0);
    }

    console.log("UC06: seluruh laporan fixture sudah dibersihkan.");
  });

  it("INT-TC60 upvote tersimpan dan trigger menambah jumlah serta skor", async () => {
    const laporan = await buatLaporanTes(idPemilikLain, "INT-TC60");
    expect(laporan.jumlah_upvote).toBe(0);

    const hasil = await catatUpvote(warga, laporan.id, idWarga);

    expect(hasil.error).toBeNull();
    await periksaJumlahBarisUpvote(laporan.id, 1);

    const aktual = await bacaLaporan(laporan.id);
    expect(aktual.jumlah_upvote).toBe(1);
    expect(aktual.skor_prioritas).toBe(10);

    const jumlah = await getJumlahUpvote(warga, laporan.id);
    expect(jumlah).toEqual({ data: 1, error: null });
  });

  it("INT-TC61 upvote kedua oleh pengguna sama ditolak tanpa menambah jumlah", async () => {
    const laporan = await buatLaporanTes(idPemilikLain, "INT-TC61");

    const pertama = await catatUpvote(warga, laporan.id, idWarga);
    expect(pertama.error).toBeNull();

    const kedua = await catatUpvote(warga, laporan.id, idWarga);
    expect(kedua.error?.code).toBe("23505");

    await periksaJumlahBarisUpvote(laporan.id, 1);

    const aktual = await bacaLaporan(laporan.id);
    expect(aktual.jumlah_upvote).toBe(1);
    expect(aktual.skor_prioritas).toBe(10);
  });

  it("INT-TC62 tamu tidak dapat memberikan upvote", async () => {
    const laporan = await buatLaporanTes(idPemilikLain, "INT-TC62");

    const hasil = await catatUpvote(anonim, laporan.id, idWarga);

    expect(hasil.error).not.toBeNull();
    await periksaJumlahBarisUpvote(laporan.id, 0);

    const aktual = await bacaLaporan(laporan.id);
    expect(aktual.jumlah_upvote).toBe(0);
  });

  it("INT-TC63 pelapor tidak dapat mendukung laporannya sendiri", async () => {
    const laporan = await buatLaporanTes(idWarga, "INT-TC63");

    const hasil = await catatUpvote(warga, laporan.id, idWarga);

    expect(hasil.error?.code).toBe("42501");
    await periksaJumlahBarisUpvote(laporan.id, 0);

    const aktual = await bacaLaporan(laporan.id);
    expect(aktual.jumlah_upvote).toBe(0);
  });

  it("INT-TC64 peta dan rincian publik tidak mengirim identitas pelapor", async () => {
    const laporan = await buatLaporanTes(idPemilikLain, "INT-TC64");

    const daftar = await getDaftarPublik(anonim);
    expect(daftar.error).toBeNull();

    const marker = daftar.data?.find((item) => item.id === laporan.id);
    expect(marker?.id_tiket).toBe(laporan.id_tiket);

    const rincian = await getRincianPublik(anonim, laporan.id_tiket);
    expect(rincian.error).toBeNull();
    expect(rincian.data?.id).toBe(laporan.id);

    // Periksa juga seluruh kolom view asli, bukan hanya pilihan entity.
    const langsung = await anonim
      .from("laporan_publik")
      .select("*")
      .eq("id", laporan.id)
      .single();

    expect(langsung.error).toBeNull();
    expect(langsung.data?.id).toBe(laporan.id);

    for (const publik of [marker, rincian.data, langsung.data]) {
      expect(publik).toBeDefined();
      expect(publik).not.toBeNull();
      expect(publik).not.toHaveProperty("id_pelapor");
      expect(publik).not.toHaveProperty("pelapor");
      expect(publik).not.toHaveProperty("nama");
      expect(publik).not.toHaveProperty("kontak");
      expect(publik).not.toHaveProperty("email");
      expect(JSON.stringify(publik)).not.toContain(idPemilikLain);
    }
  });
});