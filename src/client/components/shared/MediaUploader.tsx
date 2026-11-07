"use client";

import { useCallback, useState } from "react";
import { PESAN_BERKAS_TIDAK_VALID } from "@/lib/media";
import { isFotoValid } from "@/server/entities/Foto";
import { isVideoValid } from "@/server/entities/Video";

// Field upload foto ATAU video (DPPL I01-05..10, I06-05..07). Controlled, TIDAK meng-upload:
// View memanggil unggahMedia() dari lib/media.ts saat submit.

const TEKS = {
  foto: { hint: "JPG/PNG, maks. 10 MB", accept: ".jpg,.jpeg,.png,image/jpeg,image/png", hapus: "Hapus foto", valid: isFotoValid },
  video: { hint: "MP4/MOV/MKV, maks. 10 MB", accept: ".mp4,.mov,.mkv,video/mp4,video/quicktime,video/x-matroska", hapus: "Hapus video", valid: isVideoValid },
} as const;

type Props = {
  tipe: "foto" | "video";
  label: string;
  value: File[];
  onChange: (files: File[]) => void;
  /** USULAN: DPPL tidak menyebut batas jumlah berkas. */
  maks?: number;
  /** Garis tepi merah, mis. field wajib kosong saat submit (I06-05). */
  invalid?: boolean;
  disabled?: boolean;
};

export function MediaUploader({ tipe, label, value, onChange, maks = 3, invalid, disabled }: Props) {
  const [error, setError] = useState<string | null>(null);
  const teks = TEKS[tipe];
  const penuh = value.length >= maks;

  function pilih(e: React.ChangeEvent<HTMLInputElement>) {
    const dipilih = Array.from(e.target.files ?? []);
    e.target.value = ""; // supaya berkas yang sama bisa dipilih lagi
    const valid = dipilih.filter(teks.valid);
    const sisa = maks - value.length;
    if (valid.length < dipilih.length) setError(PESAN_BERKAS_TIDAK_VALID);
    else if (valid.length > sisa) setError(`Maksimal ${maks} ${tipe}.`);
    else setError(null);
    if (valid.length && sisa > 0) onChange([...value, ...valid.slice(0, sisa)]);
  }

  return (
    <div>
      <label
        className={`block rounded-md border-2 border-dashed p-4 text-center ${
          invalid ? "border-red-500" : "border-gray-300"
        } ${penuh || disabled ? "opacity-60" : "cursor-pointer"}`}
      >
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-gray-500">{teks.hint}</span>
        <input
          type="file"
          accept={teks.accept}
          multiple={maks > 1}
          disabled={penuh || disabled}
          onChange={pilih}
          className="sr-only"
        />
      </label>
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {value.length > 0 && (
        <ul className="mt-2 space-y-2">
          {value.map((file, i) => (
            <Pratinjau
              key={`${file.name}-${file.size}-${file.lastModified}-${i}`}
              file={file}
              tipe={tipe}
              labelHapus={teks.hapus}
              onHapus={disabled ? undefined : () => onChange(value.filter((_, j) => j !== i))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Pratinjau({
  file,
  tipe,
  labelHapus,
  onHapus,
}: {
  file: File;
  tipe: "foto" | "video";
  labelHapus: string;
  onHapus?: () => void;
}) {
  const [durasi, setDurasi] = useState<number | null>(null);
  // Object URL dibuat & di-revoke lewat ref callback (React 19 cleanup): aman di StrictMode dan
  // otomatis di-revoke saat berkas dihapus atau komponen unmount.
  const pasangSrc = useCallback(
    (el: HTMLImageElement | HTMLVideoElement | null) => {
      if (!el) return;
      const url = URL.createObjectURL(file);
      el.src = url;
      return () => URL.revokeObjectURL(url);
    },
    [file],
  );

  const mb = (file.size / (1024 * 1024)).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const info = durasi === null ? `${mb} MB` : `${mb} MB · ${formatDurasi(durasi)}`;

  return (
    <li className="flex items-center gap-3 rounded-md border border-gray-200 p-2">
      {tipe === "foto" ? (
        // eslint-disable-next-line @next/next/no-img-element -- object URL lokal, next/image tidak berguna di sini
        <img ref={pasangSrc} alt="" className="h-14 w-14 shrink-0 rounded object-cover" />
      ) : (
        <video
          ref={pasangSrc}
          preload="metadata"
          muted
          playsInline
          onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDurasi(e.currentTarget.duration)}
          className="h-14 w-14 shrink-0 rounded bg-black object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{file.name}</p>
        <p className="text-xs text-gray-500">{info}</p>
      </div>
      {onHapus && (
        <button
          type="button"
          onClick={onHapus}
          aria-label={labelHapus}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100"
        >
          ×
        </button>
      )}
    </li>
  );
}

function formatDurasi(detik: number): string {
  const s = Math.round(detik);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
