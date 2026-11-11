import PageTitle from "@/components/shell/PageTitle";
import { Alert } from "@/components/ui";
import { buatLaporanController } from "@/modules/laporan";
import DaftarLaporan from "@/modules/laporan/ui/DaftarLaporan";
import { sesiLayar } from "@/modules/laporan/ui/sesi";

export default async function LayarI10() {
  const sesi = await sesiLayar("TEKNISI");
  const hasil = await buatLaporanController(sesi).daftarPenugasan();

  return (
    <>
      <PageTitle judul="Tugas saya" deskripsi="Penanganan gangguan yang ditugaskan kepada Anda." />
      {hasil.ok ? (
        <DaftarLaporan
          judulPanel="Penugasan Anda"
          satuan="tugas"
          labelAksi="Buka tugas"
          kosong="Belum ada tugas untuk Anda. Tugas yang ditugaskan kepada Anda akan muncul di sini."
          baris={hasil.data.map((l) => ({
            id: l.idLaporan,
            judul: l.jenisGangguan,
            keterangan: "Ditugaskan kepada Anda",
            status: l.status,
            waktu: l.waktuDibuat,
            href: `/dashboard/teknisi/tugas/${l.idLaporan}`,
          }))}
        />
      ) : (
        <Alert nada="bahaya">Daftar tugas gagal dimuat. Muat ulang halaman ini.</Alert>
      )}
      <div className="note">
        <strong>Hanya tugas penugasan Anda</strong>
        <br />
        Daftar ini tidak mencakup tugas teknisi lain.
      </div>
    </>
  );
}
