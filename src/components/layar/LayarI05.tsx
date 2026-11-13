import PageTitle from "@/components/shell/PageTitle";
import FormLaporan from "@/modules/laporan/ui/FormLaporan";
import { sesiLayar } from "@/modules/laporan/ui/sesi";

const LANGKAH = [
  ["Ceritakan kondisinya", "Lokasi, kondisi yang terlihat, dan sejak kapan terjadi."],
  ["Kirim laporan", "Konfirmasi tersimpan memberi ID dan status MENUNGGU."],
  ["Ikuti perkembangannya", "Laporan saya menampilkan status dan riwayat waktu."],
];

export default async function LayarI05() {
  await sesiLayar("WARGA");
  return (
    <>
      <PageTitle judul="Laporan gangguan baru" deskripsi="Sampaikan gangguan air atau energi di komunitas Anda." />
      <div className="dua-kolom">
        <FormLaporan />
        <aside>
          <h2 style={{ fontSize: 32, marginBottom: 20 }}>Dari temuan ke penanganan.</h2>
          <ol className="langkah">
            {LANGKAH.map(([judul, isi], i) => (
              <li key={judul} className={i === 0 ? "sekarang" : undefined}>
                <strong>{judul}</strong>
                <p>{isi}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  );
}
