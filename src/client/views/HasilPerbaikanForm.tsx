"use client";

// C14 · HasilPerbaikanForm (kelas boundary DPPL). Pemilik: Peran C (lihat AGENTS.md bagian 4).
import Link from "next/link";
import { useState } from "react";
import { MediaUploader } from "../components/shared/MediaUploader";
import { StatusBadge } from "../components/shared/StatusBadge";
import type { ActionResult } from "@/lib/action-result";
import { KATEGORI } from "@/lib/constants";
import { cekKelengkapan, PESAN_TAK_LENGKAP, validasiForm } from "@/lib/validasi-perbaikan";
import type { RincianTugas } from "@/server/entities/ListTugas";

// Atribut statusTampilan
type StatusTampilan = "mengisi" | "tak_lengkap" | "siap_kirim"

type Props = { hasilTiket: ActionResult<RincianTugas> };

// Operasi tampilkanForm
export function HasilPerbaikanForm({ hasilTiket }: Props) {
  const [statusTampilan, setStatusTampilan] = useState<StatusTampilan>("mengisi");
  const [inputDeskripsi, setInputDeskripsi] = useState("");
  const [berkasFoto, setBerkasFoto] = useState<File[]>([]);
  const [berkasVideo, setBerkasVideo] = useState<File[]>([]);

  if (!hasilTiket.ok) return renderGagal(hasilTiket.error);
  const tiket = hasilTiket.data;

  const tandaiKosong = statusTampilan === "tak_lengkap";
  const { catatanKosong, fotoKosong } = cekKelengkapan(inputDeskripsi, berkasFoto);
  const lengkap = validasiForm(inputDeskripsi, berkasFoto, berkasVideo);

  // Operasi userInput
  function userInput(deskripsi: string, foto: File[], video: File[]) {
    setInputDeskripsi(deskripsi);
    setBerkasFoto(foto);
    setBerkasVideo(video);
    if (statusTampilan === "siap_kirim") setStatusTampilan("mengisi");
  }

  // Operasi submitForm
  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validasiForm(inputDeskripsi, berkasFoto, berkasVideo)) {
      setStatusTampilan("tak_lengkap");
      return;
    }
    // unggahMedia() masih DITAHAN
  }

  return (
    <main className="mx-auto w-full max-w-md p-4">
      <form onSubmit={submitForm} className="space-y-5">
        <header className="flex items-center gap-2">
          <Link 
              href="/tugas"
              aria-label="Kembali ke Daftar Tugas"
              className="flex h-10 w-f10 shrink-0 items-center justify-center rounded-full text-xl hover:bg-gray-100"
          >
            ←
          </Link>
          <h1 className="text-xl font-semibold">
            Laporkan Hasil Perbaikan
          </h1>
        </header>

        {/* I06-03 */}
        <section aria-label="Tiket" className="flex items-start justify-between gap-2 rounded-lg border border-gray-200 p-3">
          <div>
            <p className="font-semibold">
              Tiket {tiket.id_tiket}
            </p>
            <p className="text-sm text-gray-500">
              {KATEGORI[tiket.kategori]} · {tiket.latitude.toFixed(5)}, {tiket.longitude.toFixed(5)}
            </p>
          </div>
          <StatusBadge status={tiket.status} />
        </section>

        {/* I06-04 */}
        <label className="block text-sm font-medium">
          Catatan perbaikan *
          <textarea
            rows={4}
            value={inputDeskripsi}
            onChange={(e) => userInput(e.target.value, berkasFoto, berkasVideo)}
            placeholder="Contoh: Lubang ditambal aspal hotmix, area sudah dibersihkan."
            aria-invalid={tandaiKosong && catatanKosong}
            className={`mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-base font-normal ${
              tandaiKosong && catatanKosong ? "border-red-500" : "border-gray-300"
            }`}
          />
        </label>

        {/* I06-05: berkas foto */}
        <MediaUploader
          tipe="foto"
          label="foto bukti *"
          value={berkasFoto}
          onChange={(foto) => userInput(inputDeskripsi, foto, berkasVideo)}
          invalid={tandaiKosong && fotoKosong}
        />

        {/* I06-06 & I06-07: berkas video */}
        <MediaUploader
          tipe="video"
          label="Video bukti [opsional]"
          maks={1}
          value={berkasVideo}
          onChange={(video) => userInput(inputDeskripsi, berkasFoto, video)}
        />

        {/* I06-08: form tak lengkap */}
        {tandaiKosong && !lengkap && (
          <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {PESAN_TAK_LENGKAP}
          </p>
        )}

        {statusTampilan === "siap_kirim" && (
          <p role="status" className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
            Formulir lengkap. Dilanjut di Langkah 6.
          </p>
        )}

        {/* I06-09 */}
        <button type="submit" className="w-full cursor-pointer rounded-md bg-blue-600 py-2.5 font-medium text-white">
          Kirim Hasil
        </button>

      </form>
    </main>
  );
}


function renderGagal(pesan: string) {
  return (
    <main className="mx-auto w-full max-w-md space-y-4 p-4">
      <h1 className="text-xl font-semibold">
        Laporkan Hasil Perbaikan
      </h1>
      <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
        {pesan}
      </p>
      <Link href="/tugas" className="block rounded-md border border-gray-300 py-2 text-center font-medium">
        Kembali ke Daftar Tugas
      </Link>
    </main>
  )
}