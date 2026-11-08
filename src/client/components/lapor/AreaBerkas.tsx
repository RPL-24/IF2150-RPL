import { MediaUploader } from "@/client/components/shared/MediaUploader";
// I01-05 sampe I01-10. MediaUploader (shared) menangani pilih berkas, validasi format/ukuran
// pratinjau, dan tombol hapus. Daftar berkas disimpan di LaporPage (atribut berkasFoto/berkasVideo).

type Props = {
  foto: File[];
  video: File[];
  onUbahFoto: (files: File[]) => void;
  onUbahVideo: (files: File[]) => void;
  /** Garis merah saat submit tanpa berkas sama sekali. */
  kosong: boolean;
};

export function AreaBerkas({ foto, video, onUbahFoto, onUbahVideo, kosong }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">Unggah minimal satu foto atau video.</p>
      <MediaUploader tipe="foto" label="Foto" value={foto} onChange={onUbahFoto} invalid={kosong} />
      <MediaUploader tipe="video" label="Video (opsional)" value={video} onChange={onUbahVideo} invalid={kosong} />
    </div>
  );
}