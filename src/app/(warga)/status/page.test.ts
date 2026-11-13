import type { ComponentProps, ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import { gagal, ok } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/auth";
import type { StatusLaporanPage } from "@/client/views/StatusLaporanPage";
import { ambilDetailStatus, ambilLaporanPublik, ambilRiwayatWarga, type DetailStatus } from "@/server/controllers/StatusController";
import Page from "./page";

vi.mock("next/navigation", () => ({ redirect: vi.fn(() => { throw new Error("NEXT_REDIRECT"); }) }));
vi.mock("@/lib/auth", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/server/controllers/StatusController", () => ({
  ambilDetailStatus: vi.fn(), ambilLaporanPublik: vi.fn(), ambilRiwayatWarga: vi.fn(), prosesUpvote: vi.fn(),
}));
vi.mock("@/client/components/shared/MapView", () => ({ MapView: () => null }));

const detail: DetailStatus = {
  id_tiket: "LK-0001", kategori: "jalan_berlubang", deskripsi: "Lubang di dekat halte.",
  waktu_masuk: "2026-11-08T01:00:00Z", status: "diterima", tahap: null, alasan_penolakan: null,
  foto: [], video: [], riwayat: [],
};

async function buka(query: Record<string, string | string[] | undefined> = {}) {
  const halaman: ReactElement<ComponentProps<typeof StatusLaporanPage>> = await Page({
    params: Promise.resolve({}), searchParams: Promise.resolve(query),
  });
  return halaman;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCurrentUser).mockResolvedValue({ id: "warga-uji", nama: "Warga Uji", role: "warga" });
  vi.mocked(ambilRiwayatWarga).mockResolvedValue(ok([]));
  vi.mocked(ambilLaporanPublik).mockResolvedValue(ok([]));
  vi.mocked(ambilDetailStatus).mockResolvedValue(ok(detail));
});

describe("Status page: deep link notifikasi", () => {
  it("membaca tiket dari URL dan menyediakan detail awal tanpa menulis notifikasi", async () => {
    const halaman = await buka({ tiket: "LK-0001" });

    expect(ambilDetailStatus).toHaveBeenCalledExactlyOnceWith("LK-0001");
    expect(halaman.props.tiketAwal).toBe("LK-0001");
    expect(halaman.props.detailAwal).toEqual(ok(detail));
    expect(halaman.props.peran).toBe("warga");
  });

  it("membedakan identitas view untuk dua notifikasi pada halaman Status yang sama", async () => {
    vi.mocked(ambilDetailStatus).mockImplementation(async (idTiket) => ok({ ...detail, id_tiket: idTiket }));
    const pertama = await buka({ tiket: "LK-0001" });
    const kedua = await buka({ tiket: "LK-0002" });

    expect(pertama.key).not.toBe(kedua.key);
    expect(kedua.props.tiketAwal).toBe("LK-0002");
    expect(kedua.props.detailAwal).toEqual(ok({ ...detail, id_tiket: "LK-0002" }));
    expect(ambilDetailStatus).toHaveBeenLastCalledWith("LK-0002");
  });

  it("memuat ulang detail ketika URL tiket di-refresh", async () => {
    await buka({ tiket: "LK-0001" });
    const halaman = await buka({ tiket: "LK-0001" });

    expect(ambilDetailStatus).toHaveBeenCalledTimes(2);
    expect(halaman.props.detailAwal).toEqual(ok(detail));
  });

  it("memberi view baru saat notifikasi yang sama dibuka lagi setelah detail ditutup atau tab diganti", async () => {
    const sebelumDitutup = await buka({ tiket: "LK-0001" });
    const dibukaLagi = await buka({ tiket: "LK-0001" });

    // React harus membuang state lama; initializer saja tidak dijalankan ulang jika key sama.
    expect(dibukaLagi.key).not.toBe(sebelumDitutup.key);
    expect(dibukaLagi.props.tiketAwal).toBe("LK-0001");
    expect(dibukaLagi.props.detailAwal).toEqual(ok(detail));
  });

  it("tidak mengambil detail ketika membuka Status tanpa parameter tiket", async () => {
    const halaman = await buka();

    expect(ambilDetailStatus).not.toHaveBeenCalled();
    expect(halaman.props.tiketAwal).toBeNull();
    expect(halaman.props.detailAwal).toBeNull();
  });

  it.each(["Tiket tidak ditemukan atau tidak dapat diakses.", "Format ID tiket tidak valid."])(
    "meneruskan hasil validasi dan akses controller ke panel: %s", async (pesan) => {
      vi.mocked(ambilDetailStatus).mockResolvedValue(gagal(pesan));

      const halaman = await buka({ tiket: "LK-0001" });

      expect(halaman.props.detailAwal).toEqual(gagal(pesan));
    },
  );

  it("menolak parameter tiket berulang tanpa memilih tiket secara ambigu", async () => {
    const halaman = await buka({ tiket: ["LK-0001", "LK-0002"] });

    expect(ambilDetailStatus).not.toHaveBeenCalled();
    expect(halaman.props.detailAwal).toEqual(gagal("Format ID tiket tidak valid."));
  });

  it("mengarahkan tamu ke login dengan tujuan tiket tetap tersimpan", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    await expect(buka({ tiket: "LK-0001" })).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/login?next=%2Fstatus%3Ftiket%3DLK-0001");
    expect(ambilDetailStatus).not.toHaveBeenCalled();
    expect(ambilRiwayatWarga).not.toHaveBeenCalled();
  });

  it("tetap menyediakan Peta untuk tamu yang membuka Status tanpa deep link", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const halaman = await buka();

    expect(redirect).not.toHaveBeenCalled();
    expect(halaman.props.petaAwal).toEqual(ok([]));
    expect(ambilDetailStatus).not.toHaveBeenCalled();
  });

  it.each(["admin", "eksekutor"] as const)("tidak mengambil detail pribadi untuk peran %s", async (role) => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "akun-lain", nama: "Akun Lain", role });

    await buka({ tiket: "LK-0001" });

    expect(ambilDetailStatus).not.toHaveBeenCalled();
    expect(ambilRiwayatWarga).not.toHaveBeenCalled();
  });
});
