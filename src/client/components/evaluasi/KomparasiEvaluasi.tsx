import { StatusBadge } from "@/client/components/shared/StatusBadge";
import { KATEGORI } from "@/lib/constants";
import { formatTanggal, formatWaktu } from "@/lib/format";
import type { HasilPerbaikanEvaluasi, LaporanEvaluasi } from "@/server/entities/Evaluasi";
import { urlMedia } from "@/server/entities/Foto";

type Props = {
  laporan: LaporanEvaluasi;
  hasil: HasilPerbaikanEvaluasi;
  inputCatatan: string;
  sedangMemproses: boolean;
  onUbahCatatan: (catatan: string) => void;
  onBukaKeputusan: (keputusan: "selesai" | "belum_selesai" | "minta_ulang_bukti") => void;
};

function GaleriBukti({
  foto,
  video,
  labelAlt,
}: {
  foto: { path: string }[];
  video: { path: string }[];
  labelAlt: string;
}) {
  if (foto.length === 0 && video.length === 0) {
    return <p className="text-xs text-gray-500">Tidak ada berkas media.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {foto.map((f) => (
        <a
          key={f.path}
          href={urlMedia(f.path)}
          target="_blank"
          rel="noopener noreferrer"
          title="Perbesar foto"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- URL publik Supabase Storage */}
          <img
            src={urlMedia(f.path)}
            alt={labelAlt}
            loading="lazy"
            className="aspect-square w-full rounded object-cover"
          />
        </a>
      ))}
      {video.map((v) => (
        <video
          key={v.path}
          src={urlMedia(v.path)}
          controls
          preload="metadata"
          playsInline
          className="aspect-square w-full rounded bg-black"
        />
      ))}
    </div>
  );
}

export function KomparasiEvaluasi({
  laporan,
  hasil,
  inputCatatan,
  sedangMemproses,
  onUbahCatatan,
  onBukaKeputusan,
}: Props) {
  return (
    <div className="space-y-4">
      <section className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
        <header className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-semibold text-gray-900">
              {laporan.id_tiket} · {KATEGORI[laporan.kategori]}
            </h2>
            <p className="text-xs text-gray-500">
              Koordinat ({laporan.latitude.toFixed(5)}, {laporan.longitude.toFixed(5)}) · dikerjakan oleh{" "}
              <span className="font-medium text-gray-700">
                {hasil.nama_eksekutor ?? "Eksekutor Lapangan"}
              </span>
            </p>
          </div>
          <StatusBadge status={laporan.status} tahap={laporan.tahap} />
        </header>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Sebelum · laporan warga, {formatTanggal(laporan.waktu_masuk)}
              </h3>
              {laporan.nama_pelapor && (
                <p className="text-xs text-gray-500">Pelapor: {laporan.nama_pelapor}</p>
              )}
            </div>
            <GaleriBukti foto={laporan.foto} video={laporan.video} labelAlt="Foto kondisi awal" />
            <div>
              <h4 className="text-xs font-medium text-gray-700">Deskripsi laporan</h4>
              <p className="mt-0.5 text-sm whitespace-pre-line text-gray-800">{laporan.deskripsi}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Sesudah · bukti eksekutor, {formatWaktu(hasil.waktu_unggah)}
              </h3>
              <p className="text-xs text-gray-500">
                Tanggal selesai pengerjaan: {formatWaktu(hasil.waktu_unggah)}
              </p>
            </div>
            <GaleriBukti foto={hasil.foto} video={hasil.video} labelAlt="Foto bukti hasil perbaikan" />
            <div>
              <h4 className="text-xs font-medium text-gray-700">Catatan eksekutor</h4>
              <p className="mt-0.5 text-sm whitespace-pre-line text-gray-800">{hasil.catatan}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 border-t border-gray-200 pt-3">
          <label htmlFor="catatan-evaluasi-inline" className="text-sm font-medium text-gray-800">
            Catatan evaluasi
          </label>
          <textarea
            id="catatan-evaluasi-inline"
            value={inputCatatan}
            onChange={(e) => onUbahCatatan(e.target.value)}
            disabled={sedangMemproses}
            rows={2}
            placeholder="Tambahkan catatan untuk eksekutor atau arsip tiket"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => onBukaKeputusan("minta_ulang_bukti")}
            disabled={sedangMemproses}
            className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Minta Ulang Bukti
          </button>
          <button
            type="button"
            onClick={() => onBukaKeputusan("belum_selesai")}
            disabled={sedangMemproses}
            className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Belum Selesai
          </button>
          <button
            type="button"
            onClick={() => onBukaKeputusan("selesai")}
            disabled={sedangMemproses}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sedangMemproses ? "Memproses..." : "Konfirmasi Selesai"}
          </button>
        </div>
      </section>
    </div>
  );
}
