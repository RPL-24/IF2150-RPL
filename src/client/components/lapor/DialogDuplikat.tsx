// komponen tampilan saja, tanpa logika. Isinya judul “Laporan serupa sudah ada”, 
// ID tiket, pertanyaan “Dukung laporan ini?”, serta tombol Dukung dan Batal
// KF05: konfirmasi saat ditemukan laporan serupa(sekategori, ≤ 20 m, masih aktif).
// Jikalaw "Dukung" → LaporanController.dukungLaporanDuplikat, "Batal" → kembali ke formulir.
type Props = {
  idTiket: string;
  memproses: boolean;
  onDukung: () => void;
  onBatal: () => void;
};

export function DialogDuplikat({ idTiket, memproses, onDukung, onBatal }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-dialog-duplikat"
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 px-6"
    >
      <div className="w-full max-w-xs space-y-4 rounded-2xl bg-background p-6 text-center shadow-xl">
        <div>
          <h2 id="judul-dialog-duplikat" className="text-lg font-semibold">
            Laporan serupa sudah ada
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Laporan <span className="font-semibold">{idTiket}</span> berada di dekat lokasi ini dengan kategori
            yang sama. Dukung laporan ini?
          </p>
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={onDukung}
            disabled={memproses}
            className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white disabled:opacity-60"
          >
            {memproses ? "Memproses..." : "Dukung"}
          </button>
          <button
            type="button"
            onClick={onBatal}
            disabled={memproses}
            className="w-full rounded-lg border border-gray-300 py-2.5 font-medium disabled:opacity-60 dark:border-gray-700"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}