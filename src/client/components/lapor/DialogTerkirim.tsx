import Link from "next/link";

// I01-16 (dialog), I01-17 (Lihat Status), I01-18 (Tutup). 
// pop-up “Laporan terkirim” + “ID tiket: …”, dengan tombol Tutup dan Lihat Status tapi datanya masih dummy
type Props = {
  idTiket: string;
  onTutup: () => void;
};

export function DialogTerkirim({ idTiket, onTutup }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-dialog-terkirim"
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 px-6"
    >
      <div className="w-full max-w-xs space-y-4 rounded-2xl bg-background p-6 text-center shadow-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          <IkonCentang />
        </div>
        <div>
          <h2 id="judul-dialog-terkirim" className="text-lg font-semibold">
            Laporan terkirim
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            ID tiket: <span className="font-semibold">{idTiket}</span>
          </p>
        </div>
        <div className="space-y-2">
          <Link href={`/status?tiket=${encodeURIComponent(idTiket)}`} className="block w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white">
            Lihat Status
          </Link>
          <button
            type="button"
            onClick={onTutup}
            className="w-full rounded-lg border border-gray-300 py-2.5 dark:border-gray-700 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function IkonCentang() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}