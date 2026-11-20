// Unit test C02 Laporan bagian Peran A: Laporan() + simpanLaporan (Algo-002). ID test case: C02-UT01 s.d. C02-UT05.
// Di implementasi, konstruktor Laporan() diwakili tipe DataLaporanBaru yang dikirim ke RPC kirim_laporan.
// Client Supabase di-mock; penyimpanan sungguhan ke DB diuji di INT-TC01.
import { describe, expect, it, vi } from "vitest";
import type { MediaTerunggah } from "@/server/entities/Foto";
import { simpanLaporan, type DataLaporanBaru } from "@/server/entities/Laporan";

const foto: MediaTerunggah = { path: "laporan/u/a.jpg", format: "jpg", ukuran: 1024, tipe: "foto" };
const DATA: DataLaporanBaru = {
  kategori: "trotoar_rusak",
  deskripsi: "Trotoar amblas",
  latitude: -6.9175,
  longitude: 107.6191,
  media: [foto],
};

/** Client palsu: rpc(nama, argumen).single() → hasil. */
function clientPalsu(hasil: { data: unknown; error: unknown }) {
  const single = vi.fn().mockResolvedValue(hasil);
  const rpc = vi.fn().mockReturnValue({ single });
  return { client: { rpc } as never, rpc, single };
}

describe("C02 Laporan.simpanLaporan (Peran A)", () => {
  it("C02-UT01 Laporan()/simpanLaporan (normal): data dipetakan ke parameter RPC kirim_laporan → {id, id_tiket}", async () => {
    const { client, rpc, single } = clientPalsu({ data: { id: "uuid-1", id_tiket: "LK-0101" }, error: null });
    const hasil = await simpanLaporan(client, DATA);
    expect(rpc).toHaveBeenCalledWith("kirim_laporan", {
      p_kategori: "trotoar_rusak",
      p_deskripsi: "Trotoar amblas",
      p_latitude: -6.9175,
      p_longitude: 107.6191,
      p_media: [foto],
    });
    expect(single).toHaveBeenCalled();
    expect(hasil).toEqual({ data: { id: "uuid-1", id_tiket: "LK-0101" }, error: null });
  });

  it("C02-UT02 simpanLaporan (batas): foto dan video sekaligus diteruskan utuh dalam satu panggilan RPC", async () => {
    const video: MediaTerunggah = { path: "laporan/u/b.mp4", format: "mp4", ukuran: 2048, tipe: "video" };
    const { client, rpc } = clientPalsu({ data: { id: "uuid-2", id_tiket: "LK-0102" }, error: null });
    await simpanLaporan(client, { ...DATA, media: [foto, video] });
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc.mock.calls[0][1]).toMatchObject({ p_media: [foto, video] });
  });

  it("C02-UT03 simpanLaporan (batas): media kosong tetap diteruskan, penolakan diserahkan ke RPC (P0001)", async () => {
    const galat = { code: "P0001", message: "Lampirkan minimal satu foto atau video." };
    const { client } = clientPalsu({ data: null, error: galat });
    expect(await simpanLaporan(client, { ...DATA, media: [] })).toEqual({ data: null, error: galat });
  });

  it("C02-UT04 simpanLaporan (negatif): error RLS dari DB diteruskan apa adanya ke controller", async () => {
    const galat = { code: "42501", message: "permission denied for function kirim_laporan" };
    const { client } = clientPalsu({ data: null, error: galat });
    const hasil = await simpanLaporan(client, DATA);
    expect(hasil.data).toBeNull();
    expect(hasil.error).toEqual(galat);
  });
});
