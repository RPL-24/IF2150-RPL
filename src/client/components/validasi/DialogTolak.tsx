"use client";

import { useState } from "react";

type Props = {
  idTiket: string;
  sedangMemproses: boolean;
  onBatal: () => void;
  onKirim: (alasan: string) => void;
};

export function DialogTolak({ idTiket, sedangMemproses, onBatal, onKirim }: Props) {
  const [alasan, setAlasan] = useState("");
  const [galat, setGalat] = useState<string | null>(null);

  function kirim() {
    if (alasan.trim() === "") {
      setGalat("Gagal terkirim: Alasan penolakan wajib diisi.");
      return;
    }
    setGalat(null);
    onKirim(alasan);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onKeyDown={(e) => e.key === "Escape" && !sedangMemproses && onBatal()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-dialog-tolak"
        className="w-full max-w-md space-y-3 rounded-lg bg-white p-5 shadow-lg"
      >
        <h2 id="judul-dialog-tolak" className="font-semibold">
          Tolak laporan {idTiket}
        </h2>
        <div className="space-y-1">
          <label htmlFor="alasan-penolakan" className="text-sm font-medium">
            Alasan penolakan
          </label>
          <textarea
            id="alasan-penolakan"
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            disabled={sedangMemproses}
            rows={4}
            autoFocus
            placeholder="Tuliskan alasan yang akan dikirim ke pelapor"
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
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sedangMemproses ? "Mengirim..." : "Kirim Penolakan"}
          </button>
        </div>
      </div>
    </div>
  );
}
