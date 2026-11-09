import { describe, expect, it } from "vitest";
import { ListTugas, type TugasLaporan } from "@/server/entities/ListTugas";

function tugas(idTiket: string, ubah: Partial<TugasLaporan> = {}): TugasLaporan {
  return {
    id: `uuid-${idTiket}`,
    id_tiket: idTiket,
    kategori: "jalan_berlubang",
    deskripsi: `Deskripsi ${idTiket}`,
    latitude: -6.9175,
    longitude: 107.6191,
    jumlah_upvote: 0,
    skor_prioritas: 0,
    waktu_masuk: "2026-11-01T08:00:00+07:00",
    ...ubah,
  };
}

const idTiket = (daftar: TugasLaporan[]) => daftar.map((t) => t.id_tiket);

describe("ListTugas.urutPrioritas", () => {
  it("mengurutkan dari skor prioritas tertinggi", () => {
    const list = new ListTugas([
      tugas("LK-0001", { skor_prioritas: 30 }),
      tugas("LK-0002", { skor_prioritas: 92 }),
      tugas("LK-0003", { skor_prioritas: 50 }),
    ]);
    expect(idTiket(list.urutPrioritas())).toEqual(["LK-0002", "LK-0003", "LK-0001"]);
  });

  it("skor sama: laporan yang masuk lebih awal lebih dulu", () => {
    const list = new ListTugas([
      tugas("LK-0001", { skor_prioritas: 30, waktu_masuk: "2026-11-03T08:00:00+07:00" }),
      tugas("LK-0002", { skor_prioritas: 30, waktu_masuk: "2026-10-20T08:00:00+07:00" }),
    ]);
    expect(idTiket(list.urutPrioritas())).toEqual(["LK-0002", "LK-0001"]);
  });

  it("tidak mengubah urutan data aslinya", () => {
    const asli = [tugas("LK-0001", { skor_prioritas: 10 }), tugas("LK-0002", { skor_prioritas: 90 })];
    new ListTugas(asli).urutPrioritas();
    expect(idTiket(asli)).toEqual(["LK-0001", "LK-0002"]);
  });

  it("daftar kosong menghasilkan daftar kosong (UC03 Alt 2)", () => {
    expect(new ListTugas([]).urutPrioritas()).toEqual([]);
  });
});

describe("ListTugas.jumlahLaporanAktif", () => {
  it("sama dengan banyaknya laporan", () => {
    expect(new ListTugas([tugas("LK-0001"), tugas("LK-0002")]).jumlahLaporanAktif).toBe(2);
    expect(new ListTugas([]).jumlahLaporanAktif).toBe(0);
  });
});

describe("ListTugas.filterKategori", () => {
  const list = new ListTugas([
    tugas("LK-0001", { kategori: "lampu_jalan_mati", skor_prioritas: 20 }),
    tugas("LK-0002", { kategori: "jalan_berlubang", skor_prioritas: 70 }),
    tugas("LK-0003", { kategori: "lampu_jalan_mati", skor_prioritas: 80 }),
  ]);

  it("hanya menyisakan kategori yang dipilih dan tetap terurut prioritas", () => {
    expect(idTiket(list.filterKategori("lampu_jalan_mati"))).toEqual(["LK-0003", "LK-0001"]);
  });

  it("kategori tanpa tugas menghasilkan daftar kosong", () => {
    expect(list.filterKategori("trotoar_rusak")).toEqual([]);
  });
});

describe("ListTugas.getLaporanById", () => {
  const list = new ListTugas([tugas("LK-0001"), tugas("LK-0002")]);

  it("mengembalikan laporan dengan ID tiket tersebut", () => {
    expect(list.getLaporanById("LK-0002")?.id).toBe("uuid-LK-0002");
  });

  it("mengembalikan null jika ID tiket tidak ada", () => {
    expect(list.getLaporanById("LK-9999")).toBeNull();
  });
});