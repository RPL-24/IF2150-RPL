import { describe, expect, it } from "vitest";
import { isKategori, isTugasAktif, ListTugas, type Kategori, type TugasLaporan } from "@/server/entities/ListTugas";

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
  it("C07-UT01 urutPrioritas (normal): skor tertinggi lebih dulu", () => {
    const list = new ListTugas([
      tugas("LK-0001", { skor_prioritas: 30 }),
      tugas("LK-0002", { skor_prioritas: 92 }),
      tugas("LK-0003", { skor_prioritas: 50 }),
    ]);
    expect(idTiket(list.urutPrioritas())).toEqual(["LK-0002", "LK-0003", "LK-0001"]);
  });

  it("C07-UT02 urutPrioritas (batas): skor sama, yang masuk lebih awal lebih dulu", () => {
    const list = new ListTugas([
      tugas("LK-0001", { skor_prioritas: 30, waktu_masuk: "2026-11-03T08:00:00+07:00" }),
      tugas("LK-0002", { skor_prioritas: 30, waktu_masuk: "2026-10-20T08:00:00+07:00" }),
    ]);
    expect(idTiket(list.urutPrioritas())).toEqual(["LK-0002", "LK-0001"]);
  });

  it("C07-UT03 urutPrioritas (normal): tidak mengubah data asli", () => {
    const asli = [tugas("LK-0001", { skor_prioritas: 10 }), tugas("LK-0002", { skor_prioritas: 90 })];
    new ListTugas(asli).urutPrioritas();
    expect(idTiket(asli)).toEqual(["LK-0001", "LK-0002"]);
  });

  it("C07-UT04 urutPrioritas (batas): daftar kosong -> [] (UC03 Alt 2)", () => {
    expect(new ListTugas([]).urutPrioritas()).toEqual([]);
  });
});

describe("ListTugas.jumlahLaporanAktif", () => {
  it("C07-UT05 jumlahLaporanAktif (normal): sama dengan banyak laporan", () => {
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

  it("C07-UT06 filterKategori (normal): hanya kategori terpilih, tetap terurut", () => {
    expect(idTiket(list.filterKategori("lampu_jalan_mati"))).toEqual(["LK-0003", "LK-0001"]);
  });

  it("C07-UT07 filterKategori (batas): kategori tanpa tugas -> []", () => {
    expect(list.filterKategori("trotoar_rusak")).toEqual([]);
  });
});

describe("ListTugas.getLaporanById", () => {
  const list = new ListTugas([tugas("LK-0001"), tugas("LK-0002")]);

  it("C07-UT08 getLaporanById (normal): tiket ada", () => {
    expect(list.getLaporanById("LK-0002")?.id).toBe("uuid-LK-0002");
  });

  it("C07-UT09 getLaporanById (negatif): tiket tidak ada -> null", () => {
    expect(list.getLaporanById("LK-9999")).toBeNull();
  });
});

describe("isKategori", () => {
  it.each(["jalan_berlubang", "lampu_jalan_mati", "saluran_air_tersumbat", "trotoar_rusak", "rambu_marka_rusak"])(
    "C07-UT10 isKategori (normal): menerima %s",
    (nilai) => {
      expect(isKategori(nilai)).toBe(true);
    },
  );

  it.each(["", "semua", "Jalan berlubang", "jalan_berlubang ", "drop table laporan"])("C07-UT11 isKategori (negatif): menolak %j", (nilai) => {
    expect(isKategori(nilai)).toBe(false);
  });
});


describe("isTugasAktif", () => {
  it("C07-UT12 isTugasAktif (normal): dikerjakan + menunggu_eksekusi", () => {
    expect(isTugasAktif({ status: "dikerjakan", tahap: "menunggu_eksekusi" })).toBe(true);
  });

  it.each([
    { status: "dikerjakan", tahap: "menunggu_evaluasi" },
    { status: "diterima", tahap: null },
    { status: "berhasil", tahap: null },
    { status: "ditolak", tahap: null },
  ] as const)("C07-UT13 isTugasAktif (negatif): tidak aktif untuk $status / $tahap", (laporan) => {
    expect(isTugasAktif(laporan)).toBe(false);
  });
});

describe("Tambahan HIUPL: kasus batas/negatif per operasi DPPL", () => {
  it("C07-UT14 urutPrioritas (negatif): skor berupa string numerik tetap terurut sebagai angka", () => {
    const daftar = [
      tugas("LK-0001", { skor_prioritas: "2.5" as unknown as number }),
      tugas("LK-0002", { skor_prioritas: "10" as unknown as number }),
    ];
    expect(idTiket(new ListTugas(daftar).urutPrioritas())).toEqual(["LK-0002", "LK-0001"]);
  });

  it("C07-UT15 filterKategori (negatif): kategori di luar enum -> []", () => {
    const list = new ListTugas([tugas("LK-0001"), tugas("LK-0002", { kategori: "trotoar_rusak" })]);
    expect(list.filterKategori("bukan_kategori" as Kategori)).toEqual([]);
  });

  it("C07-UT16 getLaporanById (batas): daftar kosong -> null", () => {
    expect(new ListTugas([]).getLaporanById("LK-0001")).toBeNull();
  });
});
