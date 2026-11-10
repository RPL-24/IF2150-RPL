"use client";

import { useRef, useState } from "react";
import { DaftarSiapEvaluasi } from "@/client/components/evaluasi/DaftarSiapEvaluasi";
import { DialogKeputusanEvaluasi } from "@/client/components/evaluasi/DialogKeputusanEvaluasi";
import { KomparasiEvaluasi } from "@/client/components/evaluasi/KomparasiEvaluasi";
import type { ActionResult } from "@/lib/action-result";
import {
  ambilDaftarUntukEvaluasi,
  ambilDetailEvaluasi,
  simpanKeputusan,
} from "@/server/controllers/EvaluasiController";
import type {
  DetailEvaluasi,
  HasilPerbaikanEvaluasi,
  ItemSiapEvaluasi,
  LaporanEvaluasi,
} from "@/server/entities/Evaluasi";
import type { Enums } from "@/types/database";

type Props = { hasilAwal: ActionResult<ItemSiapEvaluasi[]> };
type Pesan = { jenis: "sukses" | "galat"; teks: string };
type Keputusan = Enums<"keputusan_evaluasi">;

const PESAN_SUKSES: Record<Keputusan, string> = {
  selesai: "Evaluasi selesai: status laporan telah diperbarui menjadi Berhasil.",
  belum_selesai: "Keputusan disimpan: pekerjaan dikembalikan ke eksekutor lapangan.",
  minta_ulang_bukti: "Instruksi unggah ulang bukti telah dikirim ke eksekutor lapangan.",
};

export function EvaluasiPage({ hasilAwal }: Props) {
  const [daftarPekerjaan, setDaftarPekerjaan] = useState<ItemSiapEvaluasi[]>(
    hasilAwal.ok ? hasilAwal.data : [],
  );
  const [idTiketDipilih, setIdTiketDipilih] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailEvaluasi | null>(null);
  const [inputCatatan, setInputCatatan] = useState("");
  const [memuatDaftar, setMemuatDaftar] = useState(false);
  const [memuatDetail, setMemuatDetail] = useState(false);
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [dialogKeputusan, setDialogKeputusan] = useState<Keputusan | null>(null);
  const [pesan, setPesan] = useState<Pesan | null>(
    hasilAwal.ok ? null : { jenis: "galat", teks: hasilAwal.error },
  );
  const idTiketTerakhir = useRef<string | null>(null);

  async function muatUlangDaftar() {
    setMemuatDaftar(true);
    const hasil = await ambilDaftarUntukEvaluasi();
    setMemuatDaftar(false);
    if (hasil.ok) setDaftarPekerjaan(hasil.data);
    else setPesan({ jenis: "galat", teks: hasil.error });
  }

  async function pilihPekerjaan(idTiket: string) {
    idTiketTerakhir.current = idTiket;
    setIdTiketDipilih(idTiket);
    setDetail(null);
    setInputCatatan("");
    setMemuatDetail(true);
    const hasil = await ambilDetailEvaluasi(idTiket);
    if (idTiket !== idTiketTerakhir.current) return;
    setMemuatDetail(false);
    if (hasil.ok) setDetail(hasil.data);
    else setPesan({ jenis: "galat", teks: hasil.error });
  }

  function tampilkanHasilEvaluasi(berhasil: boolean, teks: string) {
    setPesan({ jenis: berhasil ? "sukses" : "galat", teks });
  }

  async function kirimKeputusan(keputusan: Keputusan, catatan: string) {
    if (!idTiketDipilih || !detail?.hasilPerbaikan || sedangMemproses) return;
    setSedangMemproses(true);
    const hasil = await simpanKeputusan(
      idTiketDipilih,
      detail.hasilPerbaikan.id_hasil,
      keputusan,
      catatan,
    );
    setSedangMemproses(false);

    if (!hasil.ok) {
      tampilkanHasilEvaluasi(false, hasil.error);
      return;
    }

    tampilkanHasilEvaluasi(true, PESAN_SUKSES[keputusan]);
    setDialogKeputusan(null);
    idTiketTerakhir.current = null;
    setIdTiketDipilih(null);
    setDetail(null);
    setInputCatatan("");
    await muatUlangDaftar();
  }

  function konfirmasiSelesai(catatan: string = inputCatatan) {
    void kirimKeputusan("selesai", catatan);
  }

  function konfirmasiBelumSelesai(catatan: string) {
    void kirimKeputusan("belum_selesai", catatan);
  }

  function mintaUlangBukti(catatan: string) {
    void kirimKeputusan("minta_ulang_bukti", catatan);
  }

  function renderListPekerjaan(daftar: ItemSiapEvaluasi[]) {
    return (
      <DaftarSiapEvaluasi
        daftar={daftar}
        idTiketDipilih={idTiketDipilih}
        memuat={memuatDaftar}
        onPilihPekerjaan={(idTiket) => void pilihPekerjaan(idTiket)}
      />
    );
  }

  function renderDetailPekerjaan(laporan: LaporanEvaluasi, hasil: HasilPerbaikanEvaluasi) {
    return (
      <KomparasiEvaluasi
        laporan={laporan}
        hasil={hasil}
        inputCatatan={inputCatatan}
        sedangMemproses={sedangMemproses}
        onUbahCatatan={setInputCatatan}
        onBukaKeputusan={setDialogKeputusan}
      />
    );
  }

  return (
    <main className="flex h-full flex-col gap-4 p-6">
      <header>
        <h1 className="text-xl font-semibold">Evaluasi Hasil Kerja</h1>
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
          <button
            type="button"
            onClick={() => setPesan(null)}
            aria-label="Tutup pesan"
            className="font-medium"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-[22rem_1fr] gap-6">
        {renderListPekerjaan(daftarPekerjaan)}

        <section aria-label="Panel evaluasi dan komparasi hasil kerja" className="min-w-0">
          {detail && detail.hasilPerbaikan ? (
            renderDetailPekerjaan(detail.laporan, detail.hasilPerbaikan)
          ) : (
            <p className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
              {memuatDetail
                ? "Memuat rincian hasil kerja..."
                : "Pilih laporan dari antrean untuk mengevaluasi hasil kerja"}
            </p>
          )}
        </section>
      </div>

      {dialogKeputusan && idTiketDipilih && (
        <DialogKeputusanEvaluasi
          idTiket={idTiketDipilih}
          keputusan={dialogKeputusan}
          catatanAwal={inputCatatan}
          sedangMemproses={sedangMemproses}
          onBatal={() => setDialogKeputusan(null)}
          onKirim={(catatan) => {
            if (dialogKeputusan === "selesai") konfirmasiSelesai(catatan);
            else if (dialogKeputusan === "belum_selesai") konfirmasiBelumSelesai(catatan);
            else mintaUlangBukti(catatan);
          }}
        />
      )}
    </main>
  );
}
