"use client";

import { useState } from "react";
import type { Enums } from "@/types/database";

type Keputusan = Enums<"keputusan_evaluasi">;

type Props = {
  idTiket: string;
  keputusan: Keputusan;
  catatanAwal: string;
  sedangMemproses: boolean;
  onBatal: () => void;
  onKirim: (catatan: string) => void;
};

const KONFIGURASI: Record<
  Keputusan,
  {
    judul: string;
    deskripsi: string;
    labelCatatan: string;
    placeholder: string;
    wajibCatatan: boolean;
    labelTombol: string;
    kelasTombol: string;
  }
> = {
  selesai: {
    judul: "Konfirmasi Pekerjaan Selesai",
    deskripsi:
      "Status tiket akan diubah menjadi Berhasil dan notifikasi penyelesaian akan dikirim ke warga pelapor.",
    labelCatatan: "Catatan Evaluasi (Opsional)",
    placeholder: "Tambahkan catatan untuk eksekutor atau arsip tiket",
    wajibCatatan: false,
    labelTombol: "Konfirmasi Selesai",
    kelasTombol: "bg-green-600 text-white hover:bg-green-700",
  },
  belum_selesai: {
    judul: "Kembalikan Pekerjaan (Belum Selesai)",
    deskripsi:
      "Pekerjaan akan dikembalikan ke Daftar Tugas eksekutor lapangan beserta arahan perbaikan lanjutan.",
    labelCatatan: "Catatan Evaluasi / Arahan Perbaikan Lanjutan",
    placeholder: "Tuliskan alasan pekerjaan belum tuntas dan arahan perbaikan lanjutan untuk eksekutor",
    wajibCatatan: true,
    labelTombol: "Belum Selesai",
    kelasTombol: "bg-red-600 text-white hover:bg-red-700",
  },
  minta_ulang_bukti: {
    judul: "Minta Unggah Ulang Bukti Kerja",
    deskripsi:
      "Tugas akan dikembalikan ke eksekutor lapangan untuk mengambil dan mengunggah ulang bukti hasil perbaikan.",
    labelCatatan: "Catatan Kekurangan Bukti Pekerjaan",
    placeholder: "Jelaskan kekurangan foto/video bukti perbaikan yang harus diunggah ulang",
    wajibCatatan: true,
    labelTombol: "Minta Ulang Bukti",
    kelasTombol: "bg-amber-600 text-white hover:bg-amber-700",
  },
};

export function DialogKeputusanEvaluasi({
  idTiket,
  keputusan,
  catatanAwal,
  sedangMemproses,
  onBatal,
  onKirim,
}: Props) {
  const [catatan, setCatatan] = useState(catatanAwal);
  const [galat, setGalat] = useState<string | null>(null);
  const info = KONFIGURASI[keputusan];

  function kirim() {
    if (info.wajibCatatan && catatan.trim() === "") {
      setGalat("Catatan evaluasi wajib diisi untuk keputusan ini.");
      return;
    }
    setGalat(null);
    onKirim(catatan);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onKeyDown={(e) => e.key === "Escape" && !sedangMemproses && onBatal()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-dialog-evaluasi"
        className="w-full max-w-md space-y-3 rounded-lg bg-white p-5 shadow-lg"
      >
        <div>
          <h2 id="judul-dialog-evaluasi" className="font-semibold text-gray-900">
            {info.judul} ({idTiket})
          </h2>
          <p className="mt-1 text-xs text-gray-600">{info.deskripsi}</p>
        </div>

        <div className="space-y-1">
          <label htmlFor="catatan-keputusan-evaluasi" className="text-sm font-medium text-gray-800">
            {info.labelCatatan}
          </label>
          <textarea
            id="catatan-keputusan-evaluasi"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            disabled={sedangMemproses}
            rows={4}
            autoFocus
            placeholder={info.placeholder}
            aria-invalid={galat ? true : undefined}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {galat && (
            <p role="alert" className="text-sm text-red-600">
              {galat}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onBatal}
            disabled={sedangMemproses}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={kirim}
            disabled={sedangMemproses}
            className={`rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 ${info.kelasTombol}`}
          >
            {sedangMemproses ? "Menyimpan..." : info.labelTombol}
          </button>
        </div>
      </div>
    </div>
  );
}
