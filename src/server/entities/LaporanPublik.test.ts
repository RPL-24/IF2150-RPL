import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getRincianPublik } from "./Laporan";

// Contoh data laporan yang boleh dilihat publik.
const laporan = {
    id: "laporan-uji",
    id_tiket: "LK-0001",
    kategori: "jalan_berlubang",
    deskripsi: "Jalan berlubang di depan halte.",
    latitude: -6.9175,
    longitude: 107.6191,
    status: "diterima",
    tahap: null,
    jumlah_upvote: 5,
    waktu_masuk: "2026-11-20T08:00:00Z",
    waktu_selesai: null,
    foto: [{ path: "laporan/foto-uji.jpg" }],
    video: [],
};

function buatMockPublik(hasil: unknown) {
    const maybeSingle = vi.fn().mockResolvedValue(hasil);
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    const supabase = { from } as unknown as SupabaseClient<Database>;

    return { supabase, from, select, eq };
}

describe("C02 Laporan - getRincianPublik", () => {
    it("C02-UT60 mengambil rincian melalui view publik tanpa meminta identitas pelapor", async () => {
        const mock = buatMockPublik({
            data: laporan,
            error: null,
        });

        const respons = await getRincianPublik(
            mock.supabase,
            "LK-0001",
        );

        expect(respons).toEqual({ data: laporan, error: null });
        expect(mock.from).toHaveBeenCalledWith("laporan_publik");
        expect(mock.eq).toHaveBeenCalledWith("id_tiket", "LK-0001");

        const kolom = mock.select.mock.calls[0][0] as string;
        expect(kolom).not.toContain("*");
        expect(kolom).not.toMatch(
            /\b(id_pelapor|pelapor|profiles|nama|kontak)\b/,
        );
    });

    it("C02-UT61 tetap mengembalikan laporan dengan nol dukungan", async () => {
        const data = { ...laporan, jumlah_upvote: 0 };
        const mock = buatMockPublik({ data, error: null });

        const respons = await getRincianPublik(
            mock.supabase,
            "LK-0001",
        );

        expect(respons).toEqual({ data, error: null });
    });

    it.each([
        ["C02-UT62", "id"],
        ["C02-UT63", "id_tiket"],
        ["C02-UT64", "kategori"],
        ["C02-UT65", "latitude"],
        ["C02-UT66", "longitude"],
        ["C02-UT67", "status"],
        ["C02-UT68", "waktu_masuk"],
    ] as const)("%s tidak mengembalikan laporan jika %s bernilai null", async (
        _id,
        kolom,
    ) => {
        const data = { ...laporan, [kolom]: null };
        const mock = buatMockPublik({ data, error: null });

        const respons = await getRincianPublik(
            mock.supabase,
            "LK-0001",
        );

        expect(respons).toEqual({ data: null, error: null });
    });

    it("C02-UT69 mengembalikan null jika laporan tidak ditemukan", async () => {
        const mock = buatMockPublik({
            data: null,
            error: null,
        });

        const respons = await getRincianPublik(
            mock.supabase,
            "LK-0001",
        );

        expect(respons).toEqual({ data: null, error: null });
    });

    it("C02-UT70 meneruskan error ketika pembacaan laporan gagal", async () => {
        const error = {
            code: "42501",
            message: "Akses pembacaan ditolak.",
        };
        const mock = buatMockPublik({ data: null, error });

        const respons = await getRincianPublik(
            mock.supabase,
            "LK-0001",
        );

        expect(respons).toEqual({ data: null, error });
    });
});