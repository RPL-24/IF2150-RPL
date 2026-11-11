// Repositori dan sesi palsu dalam memori untuk tes modul laporan. Perilakunya meniru query DPPL 5.48.
import { jest } from "@jest/globals";
import type { KonteksSesi } from "@/lib/auth/konteks";
import type { DataLaporan, DataLaporanPemilik } from "@/modules/laporan/internal/LaporanGangguan";
import type { RepositoriLaporan } from "@/modules/laporan/internal/ModulLaporan";
import type { DataRiwayat } from "@/modules/laporan/internal/RiwayatStatusLaporan";

export const WARGA: KonteksSesi = {
  email: "warga@fajar.test",
  nama: "Sari Lestari",
  statusAkun: "DISETUJUI",
  peran: "WARGA",
  idWarga: 7,
  idKomunitas: "KOM-1",
};
export const WARGA_LAIN: KonteksSesi = { ...WARGA, email: "warga2@fajar.test", nama: "Budi", idWarga: 8 };
export const TEKNISI_LAIN: KonteksSesi = { email: "teknisi2@fajar.test", nama: "Dedi", statusAkun: "DISETUJUI", peran: "TEKNISI", idTeknisi: "TEK-02" };
export const TEKNISI: KonteksSesi = {
  email: "teknisi@fajar.test",
  nama: "Arif Pratama",
  statusAkun: "DISETUJUI",
  peran: "TEKNISI",
  idTeknisi: "TEK-01",
};

export function laporan(idLaporan: string, idWarga: number, status: DataLaporan["status"] = "MENUNGGU", jam = 8): DataLaporan {
  return {
    idLaporan,
    idWarga,
    jenisGangguan: "Kebocoran pipa",
    deskripsi: `Deskripsi ${idLaporan}`,
    fotoPendukung: [],
    waktuDibuat: new Date(Date.UTC(2026, 9, 28, jam)),
    status,
  };
}

export function riwayat(idRiwayat: string, idLaporan: string, status: DataRiwayat["status"], jam: number): DataRiwayat {
  return { idRiwayat, idLaporan, status, timestamp: new Date(Date.UTC(2026, 9, 28, jam)) };
}

export interface IsiPalsu {
  laporan?: DataLaporan[];
  riwayat?: DataRiwayat[];
  penugasan?: { idTeknisi: string; idLaporan: string }[];
  nama?: Record<number, string>;
}

export function buatRepoPalsu(isi: IsiPalsu = {}) {
  const dataLaporan = isi.laporan ?? [];
  const dataRiwayat = isi.riwayat ?? [];
  const penugasan = isi.penugasan ?? [];
  const nama = isi.nama ?? { 7: "Sari Lestari", 8: "Budi" };
  const ditugaskan = (idTeknisi: string, idLaporan: string) =>
    penugasan.some((p) => p.idTeknisi === idTeknisi && p.idLaporan === idLaporan);
  const denganPemilik = (l: DataLaporan): DataLaporanPemilik => ({ ...l, namaPemilik: nama[l.idWarga] ?? "Warga" });

  const repo = {
    simpanLaporan: jest.fn<RepositoriLaporan["simpanLaporan"]>(async (l) => {
      dataLaporan.push(l);
      return true;
    }),
    cariMilikWarga: jest.fn<RepositoriLaporan["cariMilikWarga"]>(async (idWarga) =>
      dataLaporan.filter((l) => l.idWarga === idWarga).sort((a, b) => b.waktuDibuat.getTime() - a.waktuDibuat.getTime()),
    ),
    cariDetailMilik: jest.fn<RepositoriLaporan["cariDetailMilik"]>(async (idWarga, idLaporan) => {
      const l = dataLaporan.find((x) => x.idLaporan === idLaporan && x.idWarga === idWarga);
      return l ? denganPemilik(l) : null;
    }),
    cariRiwayatMilik: jest.fn<RepositoriLaporan["cariRiwayatMilik"]>(async (idWarga, idLaporan) => {
      const milik = dataLaporan.some((x) => x.idLaporan === idLaporan && x.idWarga === idWarga);
      return milik
        ? dataRiwayat.filter((r) => r.idLaporan === idLaporan).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        : [];
    }),
  };
  const milikTeknisi = (idTeknisi: string, idLaporan: string) =>
    ditugaskan(idTeknisi, idLaporan) ? dataLaporan.find((x) => x.idLaporan === idLaporan) : undefined;

  const tugas = {
    cariPenugasan: jest.fn<RepositoriLaporan["cariPenugasan"]>(async (idTeknisi, idLaporan) =>
      ditugaskan(idTeknisi, idLaporan) ? { idPenugasan: "P", idTeknisi, idLaporan, waktuPenugasan: new Date(0) } : null,
    ),
    cariDaftarTugas: jest.fn<RepositoriLaporan["cariDaftarTugas"]>(async (idTeknisi) =>
      dataLaporan
        .filter((l) => ditugaskan(idTeknisi, l.idLaporan))
        .sort((a, b) => a.waktuDibuat.getTime() - b.waktuDibuat.getTime()),
    ),
    cariDetailTugas: jest.fn<RepositoriLaporan["cariDetailTugas"]>(async (idTeknisi, idLaporan) => {
      const l = milikTeknisi(idTeknisi, idLaporan);
      return l ? denganPemilik(l) : null;
    }),
    cariRiwayatTugas: jest.fn<RepositoriLaporan["cariRiwayatTugas"]>(async (idTeknisi, idLaporan) =>
      milikTeknisi(idTeknisi, idLaporan)
        ? dataRiwayat.filter((r) => r.idLaporan === idLaporan).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        : [],
    ),
    // Meniru transaksi: syarat dicek ulang, lalu status dan riwayat berubah bersama atau tidak sama sekali.
    simpanStatusDanRiwayat: jest.fn<RepositoriLaporan["simpanStatusDanRiwayat"]>(async (l, r, idTeknisi, statusLama) => {
      const asli = dataLaporan.find((x) => x.idLaporan === l.idLaporan);
      if (!asli || !ditugaskan(idTeknisi, l.idLaporan) || asli.status !== statusLama) return false;
      if (kendali.gagalRiwayat) return false;
      asli.status = l.status;
      dataRiwayat.push(r);
      return true;
    }),
  };
  const kendali = { gagalRiwayat: false };
  Object.assign(repo, tugas);
  return { repo: repo as typeof repo & typeof tugas, dataLaporan, dataRiwayat, penugasan, ditugaskan, kendali };
}
