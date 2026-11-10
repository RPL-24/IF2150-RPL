"use client";

// C16 · StatusLaporanPage (kelas boundary DPPL). Pemilik: Peran D.
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { DetailLaporan } from "@/client/components/shared/DetailLaporan";
import { BuktiPerbaikan } from "@/client/components/status/BuktiPerbaikan";
import { KartuLaporanPublik } from "@/client/components/status/KartuLaporanPublik";
import { MapView } from "@/client/components/shared/MapView";
import { StatusBadge } from "@/client/components/shared/StatusBadge";
import { gagal, type ActionResult } from "@/lib/action-result";
import { KATEGORI, STATUS_LABEL, STATUS_WARNA_PETA } from "@/lib/constants";
import { formatTanggal } from "@/lib/format";
import {
  ambilDetailStatus, ambilLaporanPublik, ambilRiwayatWarga, prosesUpvote, type DetailStatus, type ItemPeta, type ItemRiwayat,
} from "@/server/controllers/StatusController";
import type { Enums, Tables } from "@/types/database";

type ModeTampilan = "Riwayat" | "Peta";
type KeadaanDukungan = { memuat: boolean; tercatat: boolean; pesan: string; gagal: boolean };
type Props = {
  peran: Enums<"peran_user"> | null;
  riwayatAwal: ActionResult<ItemRiwayat[]> | null;
  petaAwal: ActionResult<ItemPeta[]> | null;
  tiketAwal?: Tables<"laporan">["id_tiket"] | null;
  detailAwal?: ActionResult<DetailStatus> | null;
};

const STATUS_PUBLIK = ["diterima", "dikerjakan", "berhasil"] as const satisfies readonly Enums<"status_laporan">[];

export function StatusLaporanPage({ peran, riwayatAwal, petaAwal, tiketAwal = null, detailAwal = null }: Props) {
  const [modeTampilan, setModeTampilan] = useState<ModeTampilan>(peran === "warga" || detailAwal !== null ? "Riwayat" : "Peta");
  const [riwayat, setRiwayat] = useState(riwayatAwal);
  const [peta, setPeta] = useState(petaAwal);
  const [memuat, setMemuat] = useState(false);
  const [pilihanTiket, setPilihanTiket] = useState<Tables<"laporan">["id_tiket"] | null>(peran === "warga" ? tiketAwal : null);
  const [detail, setDetail] = useState<ActionResult<DetailStatus> | null>(peran === "warga" ? detailAwal : null);
  const [memuatDetail, setMemuatDetail] = useState(false);
  const [dukunganTiket, setDukunganTiket] = useState<Record<string, KeadaanDukungan>>({});
  const dukunganBerjalan = useRef(new Set<string>());
  const jumlahDukunganTerbaru = useRef<Record<string, ItemPeta["jumlah_upvote"]>>({});
  const permintaan = useRef(0);
  const permintaanDetail = useRef(0);
  const tabRiwayat = useRef<HTMLButtonElement>(null);
  const tabPeta = useRef<HTMLButtonElement>(null);
  const id = useId();

  /** C16 pilihMenuRiwayat (Algo-031). */
  async function pilihMenuRiwayat() {
    tutupDetailTiket();
    setModeTampilan("Riwayat");
    const nomor = ++permintaan.current;
    if (peran !== "warga") {
      setMemuat(false);
      return;
    }

    setMemuat(true);
    try {
      const hasil = await ambilRiwayatWarga();
      if (nomor === permintaan.current) setRiwayat(hasil);
    } catch {
      if (nomor === permintaan.current) setRiwayat(gagal("Gagal memuat riwayat. Periksa koneksi lalu coba lagi."));
    } finally {
      if (nomor === permintaan.current) setMemuat(false);
    }
  }

  /** C16 pilihMenuPeta (Algo-032). */
  async function pilihMenuPeta() {
    tutupDetailTiket();
    setModeTampilan("Peta");
    const nomor = ++permintaan.current;
    setMemuat(true);
    try {
      const hasil = await ambilLaporanPublik();
      if (nomor === permintaan.current) {
        // Pembacaan yang dimulai sebelum upvote selesai tidak boleh menurunkan counter.
        setPeta(hasil.ok ? {
          ...hasil,
          data: hasil.data.map((laporan) => ({
            ...laporan,
            jumlah_upvote: Math.max(laporan.jumlah_upvote, jumlahDukunganTerbaru.current[laporan.id_tiket] ?? 0),
          })),
        } : hasil);
      }
    } catch {
      if (nomor === permintaan.current) setPeta(gagal("Gagal memuat peta. Periksa koneksi lalu coba lagi."));
    } finally {
      if (nomor === permintaan.current) setMemuat(false);
    }
  }

  function tutupDetailTiket() {
    ++permintaanDetail.current;
    setPilihanTiket(null);
    setDetail(null);
    setMemuatDetail(false);
  }

  /** C16 pilihTiket: pilih kartu (I02-05), lalu muat panel detail (I02-07). */
  async function pilihTiket(idTiket: string) {
    const nomor = ++permintaanDetail.current;
    setPilihanTiket(idTiket);
    setDetail(null);
    setMemuatDetail(true);
    try {
      const hasil = await ambilDetailStatus(idTiket);
      if (nomor === permintaanDetail.current) setDetail(hasil);
    } catch {
      if (nomor === permintaanDetail.current) {
        setDetail(gagal("Gagal memuat detail tiket. Periksa koneksi lalu coba lagi."));
      }
    } finally {
      if (nomor === permintaanDetail.current) setMemuatDetail(false);
    }
  }

  /** C16 tampilkanDetailTiket: I02-08, I02-09, dan bagian bukti hasil KF19. */
  function tampilkanDetailTiket(detailTiket: DetailStatus) {
    return (
      <>
        {detailTiket.foto.length === 0 && detailTiket.video.length === 0 && (
          <p className="text-sm text-gray-600">Laporan ini belum memiliki foto atau video.</p>
        )}
        <DetailLaporan laporan={detailTiket} riwayat={detailTiket.riwayat} />
        {detailTiket.riwayat.length === 0 && (
          <p className="text-sm text-gray-600">Riwayat penanganan belum tersedia.</p>
        )}
        {detailTiket.status === "ditolak" && !detailTiket.alasan_penolakan && (
          <p className="text-sm text-gray-600">Alasan penolakan belum tersedia.</p>
        )}
        <BuktiPerbaikan status={detailTiket.status} bukti={detailTiket.hasilPerbaikan} />
      </>
    );
  }

  function tampilkanRiwayat(daftarLaporan: ItemRiwayat[]) {
    return (
      <ul className="space-y-3">
        {daftarLaporan.map((laporan) => (
          <li key={laporan.id}>
            <button
              type="button"
              aria-expanded={pilihanTiket === laporan.id_tiket}
              aria-controls={`${id}-detail`}
              onClick={() => void pilihTiket(laporan.id_tiket)}
              className={`block w-full space-y-2 rounded-lg border p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                pilihanTiket === laporan.id_tiket ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <span className="block text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{laporan.id_tiket}</span>
                {" · "}<time dateTime={laporan.waktu_masuk}>{formatTanggal(laporan.waktu_masuk)}</time>
              </span>
              <span className="block font-medium">{KATEGORI[laporan.kategori]}</span>
              <StatusBadge status={laporan.status} tahap={laporan.tahap} />
            </button>
          </li>
        ))}
      </ul>
    );
  }

  function tampilkanPanelDetail() {
    return (
      <section id={`${id}-detail`} aria-labelledby={`${id}-detail-judul`} aria-busy={memuatDetail} className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id={`${id}-detail-judul`} className="text-lg font-semibold">Detail tiket</h2>
          {pilihanTiket && (
            <button type="button" onClick={tutupDetailTiket} className="text-sm text-blue-700 underline">
              Tutup detail
            </button>
          )}
        </div>
        {memuatDetail ? (
          <p role="status" className="text-sm text-gray-600">Memuat detail tiket {pilihanTiket}…</p>
        ) : detail ? (
          detail.ok ? (
            tampilkanDetailTiket(detail.data)
          ) : (
            <div role="alert" className="space-y-2 rounded-md bg-red-50 p-4 text-sm text-red-700">
              <p>{detail.error}</p>
              {pilihanTiket && (
                <button
                  type="button"
                  onClick={() => { if (pilihanTiket) void pilihTiket(pilihanTiket); }}
                  className="font-medium underline"
                >
                  Coba lagi
                </button>
              )}
            </div>
          )
        ) : <p className="text-sm text-gray-600">Pilih tiket untuk melihat detail laporan.</p>}
      </section>
    );
  }

  /** C16 pilihMarker (I02-12): pilih tiket publik yang memang ada pada daftar peta. */
  function pilihMarker(idTiket: string) {
    if (!peta?.ok || !peta.data.some((laporan) => laporan.id_tiket === idTiket)) return;
    setPilihanTiket(idTiket);
  }

  function perbaruiJumlahDukungan(idTiket: string, jumlah: ItemPeta["jumlah_upvote"]) {
    const terbaru = Math.max(jumlah, jumlahDukunganTerbaru.current[idTiket] ?? 0);
    jumlahDukunganTerbaru.current[idTiket] = terbaru;
    setPeta((sebelumnya) => sebelumnya?.ok ? {
      ...sebelumnya,
      data: sebelumnya.data.map((laporan) => laporan.id_tiket === idTiket
        ? { ...laporan, jumlah_upvote: Math.max(laporan.jumlah_upvote, terbaru) }
        : laporan),
    } : sebelumnya);
  }

  /** C16 onUpvoteClicked (I02-14): hasil tetap terikat tiket awal saat marker berganti. */
  async function onUpvoteClicked() {
    const idTiket = pilihanTiket;
    if (peran !== "warga" || !idTiket || !peta?.ok || dukunganBerjalan.current.has(idTiket) || dukunganTiket[idTiket]?.tercatat) return;
    const laporan = peta.data.find((item) => item.id_tiket === idTiket);
    if (!laporan || laporan.sudahDidukung !== false || (laporan.status !== "diterima" && laporan.status !== "dikerjakan")) return;

    dukunganBerjalan.current.add(idTiket);
    setDukunganTiket((sebelumnya) => ({
      ...sebelumnya, [idTiket]: { memuat: true, tercatat: false, pesan: "", gagal: false },
    }));
    try {
      const hasil = await prosesUpvote(idTiket);
      setDukunganTiket((sebelumnya) => ({
        ...sebelumnya,
        [idTiket]: {
          memuat: true, tercatat: hasil.ok || hasil.dukunganTercatat === true,
          pesan: hasil.ok ? "Terima kasih, dukungan Anda sudah tercatat." : hasil.error,
          gagal: !hasil.ok,
        },
      }));
      if (hasil.ok) {
        perbaruiJumlahDukungan(idTiket, hasil.data);
      } else if (hasil.dukunganTercatat) {
        // Dukungan sudah ada; hanya baca ulang counter, jangan mengirim insert ulang.
        try {
          const terbaru = await ambilLaporanPublik();
          const tiket = terbaru.ok ? terbaru.data.find((item) => item.id_tiket === idTiket) : null;
          if (tiket) perbaruiJumlahDukungan(idTiket, tiket.jumlah_upvote);
        } catch {
          // Pesan dan penanda dukungan tersimpan tetap dipertahankan saat koneksi gagal.
        }
      }
    } catch {
      setDukunganTiket((sebelumnya) => ({
        ...sebelumnya,
        [idTiket]: { memuat: true, tercatat: false, pesan: "Gagal mengirim dukungan. Periksa koneksi lalu coba lagi.", gagal: true },
      }));
    } finally {
      dukunganBerjalan.current.delete(idTiket);
      setDukunganTiket((sebelumnya) => ({ ...sebelumnya, [idTiket]: { ...sebelumnya[idTiket], memuat: false } }));
    }
  }

  /** C16 tampilkanPetaSebaran (I02-10..13), memakai MapView shared. */
  function tampilkanPetaSebaran(daftarLaporanPublik: ItemPeta[]) {
    const laporanTerpilih = daftarLaporanPublik.find((laporan) => laporan.id_tiket === pilihanTiket);

    return (
      <div className="relative isolate -mx-4 overflow-hidden bg-gray-100 sm:mx-0 sm:rounded-2xl">
        <MapView
          markers={daftarLaporanPublik.map((laporan) => ({
            id: laporan.id_tiket,
            latitude: laporan.latitude,
            longitude: laporan.longitude,
            status: laporan.status,
            label: laporan.id_tiket,
          }))}
          onPilihMarker={pilihMarker}
          idTerpilih={laporanTerpilih?.id_tiket ?? null}
          tinggi="clamp(28rem, calc(100svh - 12rem), 44rem)"
        />

        {/* Sisakan ruang di kiri untuk kontrol zoom Leaflet dan di bawah untuk atribusi. */}
        <div className="pointer-events-none absolute top-3 right-3 left-14 z-[1000] space-y-2">
          <h2 className="w-fit max-w-full rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm">
            Laporan publik di sekitar Anda
          </h2>
          <ul aria-label="Legenda status laporan" className="flex w-fit max-w-full flex-wrap gap-x-4 gap-y-2 rounded-xl bg-white px-3 py-2 text-xs text-gray-700 shadow-sm sm:text-sm">
            {STATUS_PUBLIK.map((status) => (
              <li key={status} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: STATUS_WARNA_PETA[status] }} />
                {STATUS_LABEL[status]}
              </li>
            ))}
          </ul>
          <label className="pointer-events-auto flex max-w-full items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
            <span className="shrink-0 font-medium">Tiket</span>
            <select
              aria-label="Pilih laporan pada peta"
              value={laporanTerpilih?.id_tiket ?? ""}
              onChange={(event) => pilihMarker(event.target.value)}
              disabled={daftarLaporanPublik.length === 0}
              className="min-w-0 flex-1 rounded bg-white text-gray-900 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-60"
            >
              <option value="" disabled>Pilih tiket laporan</option>
              {daftarLaporanPublik.map((laporan) => (
                <option key={laporan.id} value={laporan.id_tiket}>
                  {laporan.id_tiket} · {KATEGORI[laporan.kategori]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div aria-live="polite" aria-atomic="true" className="absolute right-3 bottom-8 left-3 z-[1000]">
          {laporanTerpilih ? (
            <KartuLaporanPublik
              laporan={laporanTerpilih}
              peran={peran}
              memuatDukungan={dukunganTiket[laporanTerpilih.id_tiket]?.memuat}
              sudahDidukung={dukunganTiket[laporanTerpilih.id_tiket]?.tercatat || laporanTerpilih.sudahDidukung}
              pesanDukungan={dukunganTiket[laporanTerpilih.id_tiket]?.pesan}
              gagalDukungan={dukunganTiket[laporanTerpilih.id_tiket]?.gagal}
              onDukung={() => void onUpvoteClicked()}
            />
          ) : (
            <p className="rounded-xl bg-white px-4 py-3 text-sm text-gray-600 shadow-md">
              {daftarLaporanPublik.length === 0
                ? "Belum ada laporan publik untuk ditampilkan."
                : "Pilih penanda untuk melihat ringkasan laporan."}
            </p>
          )}
        </div>
      </div>
    );
  }

  function pindahTabDenganKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    let tujuan: ModeTampilan;
    if (event.key === "Home") tujuan = "Riwayat";
    else if (event.key === "End") tujuan = "Peta";
    else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      tujuan = modeTampilan === "Riwayat" ? "Peta" : "Riwayat";
    } else return;

    event.preventDefault();
    if (tujuan === "Riwayat") {
      tabRiwayat.current?.focus();
      void pilihMenuRiwayat();
    } else {
      tabPeta.current?.focus();
      void pilihMenuPeta();
    }
  }

  const hasilAktif = modeTampilan === "Riwayat" ? riwayat : peta;

  return (
    <main className="mx-auto w-full max-w-2xl space-y-5 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">Laporan Saya</h1>
      <div role="tablist" aria-label="Tampilan laporan" className="flex border-b border-gray-200">
        {(["Riwayat", "Peta"] as const).map((mode) => (
          <button
            key={mode}
            ref={mode === "Riwayat" ? tabRiwayat : tabPeta}
            type="button"
            role="tab"
            id={`${id}-tab-${mode}`}
            aria-controls={`${id}-panel-${mode}`}
            aria-selected={modeTampilan === mode}
            tabIndex={modeTampilan === mode ? 0 : -1}
            onKeyDown={pindahTabDenganKeyboard}
            onClick={mode === "Riwayat" ? pilihMenuRiwayat : pilihMenuPeta}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              modeTampilan === mode ? "border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {(["Riwayat", "Peta"] as const).map((mode) => (
        <section
          key={mode}
          id={`${id}-panel-${mode}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${mode}`}
          hidden={modeTampilan !== mode}
          aria-busy={modeTampilan === mode && memuat}
          tabIndex={0}
          className="space-y-4"
        >
          {modeTampilan === mode && (
            mode === "Riwayat" && peran !== "warga" ? (
              <p className="text-sm text-gray-600">
                {peran === null ? (
                  <>Silakan <Link href="/login?next=%2Fstatus" className="text-blue-700 underline">masuk</Link> untuk melihat riwayat laporan Anda.</>
                ) : "Riwayat laporan hanya tersedia untuk akun warga."}
              </p>
            ) : memuat ? (
              <p role="status" className="text-sm text-gray-600">Memuat {mode === "Riwayat" ? "riwayat laporan" : "peta laporan publik"}…</p>
            ) : hasilAktif && !hasilAktif.ok ? (
              <>
                <div role="alert" className="space-y-2 rounded-md bg-red-50 p-4 text-sm text-red-700">
                  <p>{hasilAktif.error}</p>
                  <button
                    type="button"
                    onClick={mode === "Riwayat" ? pilihMenuRiwayat : pilihMenuPeta}
                    className="font-medium underline"
                  >
                    Coba lagi
                  </button>
                </div>
                {mode === "Riwayat" && detail !== null && tampilkanPanelDetail()}
              </>
            ) : mode === "Riwayat" ? (
              <>
                {riwayat?.ok && riwayat.data.length > 0 ? (
                  tampilkanRiwayat(riwayat.data)
                ) : <p className="text-sm text-gray-600">Belum ada laporan yang Anda kirim.</p>}
                {(pilihanTiket !== null || detail !== null || (riwayat?.ok && riwayat.data.length > 0)) && tampilkanPanelDetail()}
              </>
            ) : (
              tampilkanPetaSebaran(peta?.ok ? peta.data : [])
            )
          )}
        </section>
      ))}
    </main>
  );
}
