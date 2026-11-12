"use client";
// C11 · LaporPage (kelas boundary DPPL). Pemilik: Peran A (lihat AGENTS.md bagian 4).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KATEGORI } from "@/lib/constants";
import { PESAN_UMUM } from "@/lib/error-db";
import { unggahMedia } from "@/lib/media";
import type { Enums } from "@/types/database";
import { dalamWilayah, type Koordinat } from "@/server/entities/Lokasi";
import { HeaderLapor } from "@/client/components/lapor/HeaderLapor";
import { AreaBerkas } from "@/client/components/lapor/AreaBerkas";
import { AreaLokasi } from "@/client/components/lapor/AreaLokasi";
import { DialogTerkirim } from "@/client/components/lapor/DialogTerkirim";
import { DialogDuplikat } from "@/client/components/lapor/DialogDuplikat";
import { dukungLaporanDuplikat, kirimLaporan } from "@/server/controllers/LaporanController";
import { PESAN_FORM_TIDAK_LENGKAP } from "@/server/controllers/laporan-validasi";

const KELAS_LABEL = "block text-sm font-semibold";
const KELAS_INPUT =
  "mt-1.5 w-full rounded-lg border border-gray-300 bg-background px-3 py-2.5 text-base dark:border-gray-700";

const PESAN_GPS_GAGAL = "Lokasi tidak terdeteksi, tandai lokasi secara manual pada peta";

// Membungkus Geolocation API (berbasis callback) menjadi Promise. Batas 3 detik sesuai Algo-020.
function ambilPosisiGps(): Promise<Koordinat> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation tidak didukung browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (posisi) => resolve({ latitude: posisi.coords.latitude, longitude: posisi.coords.longitude }),
      reject,
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 },
    );
  });
}

type Props = { idUser: string };

export function LaporPage({ idUser }: Props) {
  const router = useRouter();
  // Atribut DPPL C11.
  const [inputKategori, setInputKategori] = useState<Enums<"kategori_kerusakan"> | "">("");
  const [inputDeskripsi, setInputDeskripsi] = useState("");
  const [berkasFoto, setBerkasFoto] = useState<File[]>([]);
  const [berkasVideo, setBerkasVideo] = useState<File[]>([]);
  const [lokasi, setLokasi] = useState<Koordinat | null>(null);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [idTiketTerkirim, setIdTiketTerkirim] = useState<string | null>(null);
  const [mendeteksiLokasi, setMendeteksiLokasi] = useState(true);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const [mengirim, setMengirim] = useState(false);
  const [idTiketDuplikat, setIdTiketDuplikat] = useState<string | null>(null);

  // I01-13: dihitung dari lokasi, bukan disimpan terpisah, supaya selalu sinkron dengan titik di peta.
  const diLuarWilayah = lokasi !== null && !dalamWilayah(lokasi);
  const berkasKosong = berkasFoto.length === 0 && berkasVideo.length === 0;

  // DPPL batalkanLaporan(): dipakai I01-01 dan I01-14.
  function batalkanLaporan() {
    router.back();
  }

  // DPPL bukaForm(): kunci lokasi otomatis saat formulir dibuka (Algo-020).
  useEffect(() => {
    let aktif = true;
    ambilPosisiGps()
      .then((posisi) => {
        // Jangan menimpa titik yang sudah dipilih manual selama GPS masih mencari.
        if (aktif) setLokasi((lama) => lama ?? posisi);
      })
      .catch(() => {
        if (aktif) setPesanLokasi(PESAN_GPS_GAGAL);
      })
      .finally(() => {
        if (aktif) setMendeteksiLokasi(false);
      });
    return () => {
      aktif = false;
    };
  }, []);

  // DPPL kunciLokasi() (I01-11): dipanggil tombol "Gunakan Lokasi Saat Ini".
  async function kunciLokasi() {
    setMendeteksiLokasi(true);
    setPesanLokasi(null);
    try {
      setLokasi(await ambilPosisiGps());
    } catch {
      setPesanLokasi(PESAN_GPS_GAGAL);
    } finally {
      setMendeteksiLokasi(false);
    }
  }

  // DPPL tandaiLokasiManual(latitude, longitude) (I01-12). Cek wilayah lewat diLuarWilayah di atas.
  function tandaiLokasiManual(latitude: number, longitude: number) {
    setLokasi({ latitude, longitude });
    setPesanLokasi(null);
  }

  // DPPL submitForm() (Algo-021): upload berkas → kirimLaporan → dialog sukses / konfirmasi duplikat.
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inputKategori === "" || lokasi === null || berkasKosong) {
      setPesanError(PESAN_FORM_TIDAK_LENGKAP);
      return;
    }
    setPesanError(null);
    setMengirim(true);
    try {
      // 1. Upload langsung dari browser ke bucket media (AGENTS.md bagian 7).
      const unggah = await unggahMedia([...berkasFoto, ...berkasVideo], "laporan", idUser);
      if (!unggah.ok) {
        setPesanError(unggah.error);
        return;
      }
      // 2. Server memvalidasi ulang, mengecek duplikat, lalu menyimpan.
      const hasil = await kirimLaporan({
        kategori: inputKategori,
        deskripsi: inputDeskripsi,
        latitude: lokasi.latitude,
        longitude: lokasi.longitude,
        media: unggah.data,
      });
      if (!hasil.ok) {
        setPesanError(hasil.error);
        return;
      }
      if (hasil.data.jenis === "duplikat") setIdTiketDuplikat(hasil.data.idTiket);
      else setIdTiketTerkirim(hasil.data.idTiket);
    } catch {
      // Mis. koneksi putus saat memanggil Server Action.
      setPesanError(PESAN_UMUM);
    } finally {
      setMengirim(false);
    }
  }

  // DPPL dukungLaporanDuplikat: dukung laporan serupa, lalu buka detailnya di halaman status.
  async function dukungDuplikat() {
    if (idTiketDuplikat === null) return;
    setMengirim(true);
    try {
      const hasil = await dukungLaporanDuplikat(idTiketDuplikat);
      if (!hasil.ok) {
        setIdTiketDuplikat(null);
        setPesanError(hasil.error);
        return;
      }
      router.push(`/status?tiket=${encodeURIComponent(hasil.data.idTiket)}`);
    } catch {
      setIdTiketDuplikat(null);
      setPesanError(PESAN_UMUM);
    } finally {
      setMengirim(false);
    }
  }

  // I01-18: setelah terkirim, kosongkan formulir supaya laporan yang sama tidak terkirim dua kali.
  function tutupDialogTerkirim() {
    setIdTiketTerkirim(null);
    setInputKategori("");
    setInputDeskripsi("");
    setBerkasFoto([]);
    setBerkasVideo([]);
  }

  return (
    <main className="flex flex-1 flex-col">
      <form onSubmit={submitForm} className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <HeaderLapor onKembali={batalkanLaporan} />

        <div className="flex-1 space-y-5 px-4 py-4">
          <label className={KELAS_LABEL}>
            Kategori kerusakan
            <select
              required
              value={inputKategori}
              onChange={(e) => setInputKategori(e.target.value as Enums<"kategori_kerusakan">)}
              className={`${KELAS_INPUT} font-normal`}
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {Object.entries(KATEGORI).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className={KELAS_LABEL}>
            Deskripsi
            <textarea
              required
              rows={3}
              value={inputDeskripsi}
              onChange={(e) => setInputDeskripsi(e.target.value)}
              placeholder="Jelaskan kondisi kerusakan"
              className={`${KELAS_INPUT} font-normal`}
            />
          </label>

          <AreaBerkas
            foto={berkasFoto}
            video={berkasVideo}
            onUbahFoto={setBerkasFoto}
            onUbahVideo={setBerkasVideo}
            kosong={pesanError !== null && berkasKosong}
          />
          <AreaLokasi
            lokasi={lokasi}
            diLuarWilayah={diLuarWilayah}
            mendeteksi={mendeteksiLokasi}
            pesanGps={pesanLokasi}
            onGunakanLokasi={kunciLokasi}
            onPilihTitik={(k) => tandaiLokasiManual(k.latitude, k.longitude)}
          />

          {pesanError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {pesanError}
            </p>
          )}
        </div>

        <div className="sticky bottom-0 z-[1001] flex gap-3 border-t border-gray-200 bg-background px-4 py-3 dark:border-gray-800">
          <button
            type="button"
            onClick={batalkanLaporan}
            className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium dark:border-gray-700"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={diLuarWilayah || mengirim}
            className="flex-[2] rounded-lg bg-blue-600 py-2.5 font-medium text-white disabled:opacity-60"
          >
            {mengirim ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </div>
      </form>

      {idTiketTerkirim && (
        <DialogTerkirim idTiket={idTiketTerkirim} onTutup={tutupDialogTerkirim} />
      )}
      {idTiketDuplikat && (
        <DialogDuplikat
          idTiket={idTiketDuplikat}
          memproses={mengirim}
          onDukung={dukungDuplikat}
          onBatal={() => setIdTiketDuplikat(null)}
        />
      )}
    </main>
  );
}