// I01-01 (panah kembali buat ke home) + I01-02 (judul). Bagian dari C11 LaporPage.
// menampilkan tombol panah ← dan judul “Laporkan Kerusakan”
type Props = { onKembali: () => void };

export function HeaderLapor({ onKembali }: Props) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 bg-background dark:border-gray-800 px-4 py-3">
      <button
        type="button"
        onClick={onKembali}
        aria-label="Kembali"
        className="rounded-md px-1 text-xl leading-none hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        ←
      </button>
      <h1 className="text-lg font-semibold">Laporkan Kerusakan</h1>
    </div>
  );
}