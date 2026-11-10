"use client";

import { useRef, useState } from "react";
import { AntreanLaporan } from "@/client/components/validasi/AntreanLaporan";
import { DialogTolak } from "@/client/components/validasi/DialogTolak";
import { RincianLaporan } from "@/client/components/validasi/RincianLaporan";
import type { ActionResult } from "@/lib/action-result";
import {
  ambilRincianLaporan,
  saringAntrean,
  setujuiLaporan,
  tolakLaporan,
  type LaporanAntrean,
  type LaporanRincian,
} from "@/server/controllers/ValidasiController";

type Props = { hasilAwal: ActionResult<LaporanAntrean[]> };
type Pesan = { jenis: "sukses" | "galat"; teks: string };

export function ValidasiPage({ hasilAwal }: Props) {
  const [daftarAntrean, setDaftarAntrean] = useState<LaporanAntrean[]>(hasilAwal.ok ? hasilAwal.data : []);
  const [pilihanFilter, setPilihanFilter] = useState("semua");
  const [ascending, setAscending] = useState(false);
  const [idTiketTerpilih, setIdTiketTerpilih] = useState<string | null>(null);
  const [rincian, setRincian] = useState<LaporanRincian | null>(null);
  const [memuatAntrean, setMemuatAntrean] = useState(false);
  const [memuatRincian, setMemuatRincian] = useState(false);
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [dialogTolakTerbuka, setDialogTolakTerbuka] = useState(false);
  const [pesan, setPesan] = useState<Pesan | null>(hasilAwal.ok ? null : { jenis: "galat", teks: hasilAwal.error });
  const permintaanTerakhir = useRef(0);
  const idTiketTerakhir = useRef<string | null>(null);

  async function tampilkanAntrean(kategori: string, urutan: boolean) {
    const nomor = ++permintaanTerakhir.current;
    setMemuatAntrean(true);
    const hasil = await saringAntrean(kategori, urutan);
    if (nomor !== permintaanTerakhir.current) return;
    setMemuatAntrean(false);
    if (hasil.ok) setDaftarAntrean(hasil.data);
    else setPesan({ jenis: "galat", teks: hasil.error });
  }

  function pilihFilterKategori(kategori: string) {
    setPilihanFilter(kategori);
    void tampilkanAntrean(kategori, ascending);
  }

  function balikUrutan() {
    setAscending(!ascending);
    void tampilkanAntrean(pilihanFilter, !ascending);
  }

  async function pilihLaporan(idTiket: string) {
    idTiketTerakhir.current = idTiket;
    setIdTiketTerpilih(idTiket);
    setRincian(null);
    setMemuatRincian(true);
    const hasil = await ambilRincianLaporan(idTiket);
    if (idTiket !== idTiketTerakhir.current) return;
    setMemuatRincian(false);
    if (hasil.ok) setRincian(hasil.data);
    else setPesan({ jenis: "galat", teks: hasil.error });
  }

  async function selesaikanAksi(hasil: ActionResult<undefined>, pesanSukses: string) {
    setSedangMemproses(false);
    if (!hasil.ok) {
      setPesan({ jenis: "galat", teks: hasil.error });
      return;
    }
    setPesan({ jenis: "sukses", teks: pesanSukses });
    setDialogTolakTerbuka(false);
    idTiketTerakhir.current = null;
    setIdTiketTerpilih(null);
    setRincian(null);
    await tampilkanAntrean(pilihanFilter, ascending);
  }

  async function onValidClicked() {
    if (!idTiketTerpilih || sedangMemproses) return;
    if (!window.confirm(`Validasi laporan ${idTiketTerpilih} dan teruskan ke tim lapangan?`)) return;
    setSedangMemproses(true);
    const hasil = await setujuiLaporan(idTiketTerpilih);
    await selesaikanAksi(hasil, "Laporan berhasil divalidasi dan diteruskan ke daftar tugas penugasan.");
  }

  function onTolakClicked() {
    setDialogTolakTerbuka(true);
  }

  async function submitAlasanPenolakan(alasan: string) {
    if (!idTiketTerpilih || sedangMemproses) return;
    setSedangMemproses(true);
    const hasil = await tolakLaporan(idTiketTerpilih, alasan);
    await selesaikanAksi(hasil, "Laporan berhasil ditolak dan status diperbarui.");
  }

  return (
    <main className="flex h-full flex-col gap-4 p-6">
      <header>
        <h1 className="text-xl font-semibold">Validasi Laporan</h1>
      </header>

      {pesan && (
        <div
          role={pesan.jenis === "galat" ? "alert" : "status"}
          className={`flex items-start justify-between gap-3 rounded-md border p-3 text-sm ${
            pesan.jenis === "galat"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          <span>{pesan.teks}</span>
          <button type="button" onClick={() => setPesan(null)} aria-label="Tutup pesan" className="font-medium">
            ×
          </button>
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-[22rem_1fr] gap-6">
        <AntreanLaporan
          daftar={daftarAntrean}
          pilihanFilter={pilihanFilter}
          ascending={ascending}
          idTiketTerpilih={idTiketTerpilih}
          memuat={memuatAntrean}
          onPilihFilterKategori={pilihFilterKategori}
          onBalikUrutan={balikUrutan}
          onPilihLaporan={(idTiket) => void pilihLaporan(idTiket)}
        />

        <section aria-label="Rincian laporan" className="min-w-0">
          {rincian ? (
            <RincianLaporan
              rincian={rincian}
              sedangMemproses={sedangMemproses}
              onValidClicked={() => void onValidClicked()}
              onTolakClicked={onTolakClicked}
            />
          ) : (
            <p className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
              {memuatRincian ? "Memuat rincian..." : "Pilih laporan dari antrean untuk divalidasi"}
            </p>
          )}
        </section>
      </div>

      {dialogTolakTerbuka && idTiketTerpilih && (
        <DialogTolak
          idTiket={idTiketTerpilih}
          sedangMemproses={sedangMemproses}
          onBatal={() => setDialogTolakTerbuka(false)}
          onKirim={(alasan) => void submitAlasanPenolakan(alasan)}
        />
      )}
    </main>
  );
}
