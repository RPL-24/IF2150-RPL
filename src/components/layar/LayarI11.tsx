import Link from "next/link";
import PageTitle from "@/components/shell/PageTitle";
import { Alert, Badge, Card } from "@/components/ui";
import { buatLaporanController } from "@/modules/laporan";
import { waktuWib } from "@/modules/laporan/ui/format";
import LangkahStatus from "@/modules/laporan/ui/LangkahStatus";
import RiwayatStatus from "@/modules/laporan/ui/RiwayatStatus";
import { sesiLayar } from "@/modules/laporan/ui/sesi";
import StatusBadge from "@/modules/laporan/ui/StatusBadge";
import UbahStatus from "@/modules/laporan/ui/UbahStatus";

const KE_DAFTAR = (
  <Link className="btn" href="/dashboard/teknisi/tugas">
    Tugas saya
  </Link>
);

export default async function LayarI11({ id }: { id: string }) {
  const sesi = await sesiLayar("TEKNISI");
  const controller = buatLaporanController(sesi);
  const [detail, riwayat] = await Promise.all([controller.detailTugas(id), controller.riwayatTugas(id)]);

  if (!detail.ok && detail.kode === "TIDAK_DITEMUKAN") {
    return (
      <>
        <PageTitle judul="Detail tugas" deskripsi="Tinjau laporan dan lakukan langkah berikutnya." aksi={KE_DAFTAR} />
        <Card>
          <p style={{ margin: "0 0 12px" }}>
            <Badge nada="bahaya">Akses dibatasi</Badge>
          </p>
          <h2 style={{ fontSize: 26 }}>Teknisi tidak berwenang atas laporan ini</h2>
          <p style={{ margin: "10px 0 20px", color: "var(--muted)" }}>
            Data dan aksi tidak ditampilkan. Kembali ke daftar tugas Anda.
          </p>
          <Link className="btn primary" href="/dashboard/teknisi/tugas">
            Kembali ke tugas
          </Link>
        </Card>
      </>
    );
  }
  if (!detail.ok || !riwayat.ok) return <Alert nada="bahaya">Detail tugas gagal dimuat. Muat ulang halaman ini.</Alert>;

  const t = detail.data;
  return (
    <>
      <PageTitle judul="Detail tugas" deskripsi="Tinjau laporan dan lakukan langkah berikutnya." aksi={KE_DAFTAR} />
      <div className="dua-kolom">
        <Card>
          <h2 style={{ fontSize: 26 }}>{t.jenisGangguan}</h2>
          <p style={{ margin: "14px 0 20px" }}>
            <StatusBadge status={t.status} />
          </p>
          <dl className="facts">
            <div>
              <dt>Nomor laporan</dt>
              <dd>{t.idLaporan}</dd>
            </div>
            <div>
              <dt>Teknisi penugasan</dt>
              <dd>{sesi.nama} · Anda</dd>
            </div>
            <div>
              <dt>Diajukan</dt>
              <dd>{waktuWib(t.waktuDibuat)}</dd>
            </div>
            <div>
              <dt>Jenis</dt>
              <dd>{t.jenisGangguan}</dd>
            </div>
          </dl>
          <hr className="garis" />
          <p>{t.deskripsi}</p>
        </Card>
        <Card className="panel-lembut">
          <h2 style={{ marginBottom: 16 }}>Langkah berikutnya</h2>
          <LangkahStatus status={t.status} />
          <UbahStatus idLaporan={t.idLaporan} status={t.status} />
          <p style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--control)", fontSize: 13, color: "var(--muted)" }}>
            Perubahan hanya untuk teknisi penugasan.
          </p>
        </Card>
      </div>
      <section aria-labelledby="judul-riwayat">
        <h2 id="judul-riwayat" style={{ marginBottom: 16 }}>
          Riwayat tugas · urutan waktu menaik
        </h2>
        <RiwayatStatus waktuDibuat={t.waktuDibuat} riwayat={riwayat.data} />
      </section>
    </>
  );
}
