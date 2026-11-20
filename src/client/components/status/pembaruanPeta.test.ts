import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ItemPeta } from "@/server/controllers/StatusController";
import { gabungkanPetaTerbaru, mulaiPembaruanPeta } from "./pembaruanPeta";

class DokumenUji extends EventTarget {
  visibilityState: DocumentVisibilityState = "visible";
}

let dokumen: DokumenUji;
let jendela: EventTarget;
let hentikan: () => void;

beforeEach(() => {
  vi.useFakeTimers();
  dokumen = new DokumenUji();
  jendela = new EventTarget();
  vi.stubGlobal("document", dokumen);
  vi.stubGlobal("window", jendela);
  hentikan = () => {};
});

afterEach(() => {
  hentikan();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("pembaruan Peta: timer dan fokus", () => {
  it("mengambil ulang daftar setiap 30 detik tanpa menduplikasi pemuatan awal", async () => {
    let permintaan = 0;
    hentikan = mulaiPembaruanPeta(async () => { permintaan++; });

    await vi.advanceTimersByTimeAsync(29_999);
    expect(permintaan).toBe(0);
    await vi.advanceTimersByTimeAsync(1);
    expect(permintaan).toBe(1);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(permintaan).toBe(2);
  });

  it("melewati polling saat tersembunyi dan langsung memuat saat tab kembali terlihat", async () => {
    let permintaan = 0;
    dokumen.visibilityState = "hidden";
    hentikan = mulaiPembaruanPeta(async () => { permintaan++; });

    await vi.advanceTimersByTimeAsync(60_000);
    expect(permintaan).toBe(0);
    dokumen.visibilityState = "visible";
    dokumen.dispatchEvent(new Event("visibilitychange"));
    expect(permintaan).toBe(1);
  });

  it("memuat ulang saat jendela mendapat fokus tanpa menunggu interval", () => {
    let permintaan = 0;
    hentikan = mulaiPembaruanPeta(async () => { permintaan++; });

    jendela.dispatchEvent(new Event("focus"));

    expect(permintaan).toBe(1);
  });

  it("tidak memuat pada event fokus atau visibility ketika dokumen masih tersembunyi", () => {
    let permintaan = 0;
    dokumen.visibilityState = "hidden";
    hentikan = mulaiPembaruanPeta(async () => { permintaan++; });

    jendela.dispatchEvent(new Event("focus"));
    dokumen.dispatchEvent(new Event("visibilitychange"));

    expect(permintaan).toBe(0);
  });

  it("mencegah permintaan bertumpuk dari timer, fokus, dan visibility", async () => {
    let permintaan = 0;
    let selesaikan!: () => void;
    const tertunda = new Promise<void>((resolve) => { selesaikan = resolve; });
    hentikan = mulaiPembaruanPeta(async () => { permintaan++; await tertunda; });

    jendela.dispatchEvent(new Event("focus"));
    dokumen.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(30_000);
    expect(permintaan).toBe(1);
    selesaikan();
    await vi.advanceTimersByTimeAsync(30_000);
    expect(permintaan).toBe(2);
  });

  it("membersihkan timer/listener dan membatalkan penerapan respons setelah dihentikan", async () => {
    let permintaan = 0;
    let diterapkan = 0;
    let selesaikan!: () => void;
    const tertunda = new Promise<void>((resolve) => { selesaikan = resolve; });
    let sinyal: AbortSignal | undefined;
    hentikan = mulaiPembaruanPeta(async (signal) => {
      permintaan++;
      sinyal = signal;
      await tertunda;
      if (!signal.aborted) diterapkan++;
    });

    jendela.dispatchEvent(new Event("focus"));
    hentikan();
    expect(sinyal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    selesaikan();
    jendela.dispatchEvent(new Event("focus"));
    dokumen.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(60_000);

    expect(permintaan).toBe(1);
    expect(diterapkan).toBe(0);
  });

  it("tetap mencoba pada interval berikutnya setelah koneksi gagal", async () => {
    let permintaan = 0;
    let berhasil = 0;
    hentikan = mulaiPembaruanPeta(async () => {
      permintaan++;
      if (permintaan === 1) throw new Error("Koneksi terputus");
      berhasil++;
    });

    await vi.advanceTimersByTimeAsync(60_000);

    expect(permintaan).toBe(2);
    expect(berhasil).toBe(1);
  });

  it("tidak menggandakan listener ketika effect dibersihkan dan dipasang ulang", () => {
    let permintaan = 0;
    hentikan = mulaiPembaruanPeta(async () => { permintaan++; });
    hentikan();
    hentikan = mulaiPembaruanPeta(async () => { permintaan++; });

    jendela.dispatchEvent(new Event("focus"));

    expect(permintaan).toBe(1);
    expect(vi.getTimerCount()).toBe(1);
  });
});

const laporan: ItemPeta = {
  id: "00000000-0000-0000-0000-000000000097", id_tiket: "LK-0097", kategori: "trotoar_rusak",
  latitude: -6.9175, longitude: 107.6191, status: "diterima", jumlah_upvote: 12, sudahDidukung: false,
};

describe("pembaruan Peta: data terbaru dan dukungan", () => {
  it("memperbarui status, lokasi, dan jumlah dukungan tanpa mengubah data sumber", () => {
    const terbaru: ItemPeta = { ...laporan, status: "dikerjakan", latitude: -6.918, jumlah_upvote: 20 };

    const hasil = gabungkanPetaTerbaru([terbaru], [laporan], {});

    expect(hasil).toEqual([terbaru]);
    expect(laporan.status).toBe("diterima");
    expect(laporan.jumlah_upvote).toBe(12);
  });

  it("tidak menurunkan jumlah dari upvote yang selesai setelah refetch dimulai", () => {
    expect(gabungkanPetaTerbaru([laporan], [laporan], { "LK-0097": 13 })[0].jumlah_upvote).toBe(13);
  });

  it("tidak menurunkan jumlah dukungan yang sudah pernah dibaca dari server", () => {
    const sebelumnya = { ...laporan, jumlah_upvote: 20 };

    expect(gabungkanPetaTerbaru([laporan], [sebelumnya], {})[0].jumlah_upvote).toBe(20);
  });

  it("tidak mengaktifkan kembali tombol yang sudah didukung ketika hasil refetch lebih lama", () => {
    const sebelumnya = { ...laporan, sudahDidukung: true };

    expect(gabungkanPetaTerbaru([laporan], [sebelumnya], {})[0].sudahDidukung).toBe(true);
  });

  it("membuang laporan yang sudah tidak publik dan menerima laporan baru", () => {
    const baru = { ...laporan, id: "laporan-baru", id_tiket: "LK-0100" };

    expect(gabungkanPetaTerbaru([baru], [laporan], {})).toEqual([baru]);
  });

  it("tetap membedakan status dukungan yang belum diketahui dari belum mendukung", () => {
    expect(gabungkanPetaTerbaru([{ ...laporan, sudahDidukung: null }], [laporan], {})[0].sudahDidukung).toBeNull();
  });
});
