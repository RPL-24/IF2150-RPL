// I01-05 sampe I01-10. MASIH PLACEHOLDER. nanti diganti <MediaUploader> dari components/shared setelah tersedia
// sekarang: hanya menggambar dua kotak bergaris putus-putus untuk foto dan video
// <MediaUploader> dari shared, dan dilarang membuat uploader sendiri. Komponen itu tunggu dibikin dipta
export function AreaBerkas() {
  return (
    <div className="space-y-5">
      <SlotBerkas
        label="Foto"
        format="JPG/PNG, maks. 10 MB"
        petunjuk="Unggah minimal satu foto atau video."
      />
      <SlotBerkas label="Video (opsional)" format="MP4/MOV/MKV, maks. 10 MB" />
    </div>
  );
}

type PropsSlot = { label: string; format: string; petunjuk?: string };

function SlotBerkas({ label, format, petunjuk }: PropsSlot) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{format}</span>
      </div>
      {petunjuk && <p className="text-xs text-gray-500 dark:text-gray-400">{petunjuk}</p>}
      <div className="mt-1.5 flex h-16 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
        Menunggu MediaUploader
      </div>
    </div>
  );
}