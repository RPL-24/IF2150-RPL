// C07 · ListTugas (kelas entity DPPL). Pemilik: Peran C.
// Nama fungsi mengikuti nama operasi di DPPL.

import { Constants, type Enums, type Tables } from "@/types/database";

export type Kategori = Enums<"kategori_kerusakan">;

const DAFTAR_KATEGORI: readonly string[] = Constants.public.Enums.kategori_kerusakan;

//Periksa apakah input kategori terdapat di database
export function isKategori(nilai: string): nilai is Kategori {
    return DAFTAR_KATEGORI.includes(nilai);
}

export type TugasLaporan = Pick<
    Tables<"laporan">,
    |   "id"
    |   "id_tiket"
    |   "kategori"
    |   "deskripsi"
    |   "latitude"
    |   "longitude"
    |   "jumlah_upvote"
    |   "skor_prioritas"
    |   "waktu_masuk"
>;

export class ListTugas {
    private readonly daftarLaporan: readonly TugasLaporan[];

    constructor(daftarLaporan: readonly TugasLaporan[]) {
        this.daftarLaporan = [...daftarLaporan];
    }

    // Atribut jumlahLaporanAktif
    get jumlahLaporanAktif(): number {
        return this.daftarLaporan.length;
    }

    // Algo-012
    urutPrioritas(): TugasLaporan[] {
        // BELUM DIURUTIN GA ADA bandingkanPrioritas
        return [...this.daftarLaporan].sort(bandingkanPrioritas);
    }

    // Algo-013
    filterKategori(kategori: Kategori): TugasLaporan[] {
        return this.urutPrioritas().filter((laporan) => laporan.kategori === kategori);
    }

    getLaporanById(idTiket: string): TugasLaporan | null {
        return this.daftarLaporan.find((laporan) => laporan.id_tiket === idTiket) ?? null;
    }
}

function bandingkanPrioritas(a: TugasLaporan, b: TugasLaporan): number {
    const selisihSkor = Number(b.skor_prioritas) - Number(a.skor_prioritas);
    if (selisihSkor !== 0) return selisihSkor;
    return Date.parse(a.waktu_masuk) - Date.parse(b.waktu_masuk);
}