"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";
import {
  ApiError,
  ambilTransaksi,
  bayarTransaksi,
  type TransaksiPembayaran,
} from "@/lib/api";

const PESAN_KEDALUWARSA = "Transaksi dibatalkan karena batas waktu pembayaran telah lewat";
const rupiah = (n: number) => `Rp. ${n.toLocaleString("id-ID")}`;
const pesanDari = (e: unknown) => (e instanceof ApiError ? e.message : "Terjadi kesalahan");

function PembayaranIsi() {
  const { idTransaksi } = useParams<{ idTransaksi: string }>();
  const router = useRouter();
  const [trx, setTrx] = useState<TransaksiPembayaran | null>(null);
  const [pesan, setPesan] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const statusRef = useRef("");

  // Halaman pembayaran hanya sah untuk id transaksi yang valid (dibuat lewat "Buy Now" di keranjang).
  const idValid = Number.isInteger(Number(idTransaksi)) && Number(idTransaksi) >= 1;

  useEffect(() => {
    if (!idValid) return; // id tidak sah → tampilkan pesan tanpa memanggil API
    let dibatalkan = false;
    ambilTransaksi(idTransaksi)
      .then((t) => {
        if (dibatalkan) return;
        setTrx(t);
        statusRef.current = t.status;
      })
      .catch((e) => {
        if (!dibatalkan) setPesan(pesanDari(e));
      });
    return () => {
      dibatalkan = true;
    };
  }, [idTransaksi, idValid]);

  async function kirimBayar() {
    setSibuk(true);
    setPesan("");
    statusRef.current = "MEMPROSES";
    try {
      const hasil = await bayarTransaksi(idTransaksi);
      setTrx(hasil);
      statusRef.current = hasil.status;
      if (hasil.status !== "LUNAS") setPesan(PESAN_KEDALUWARSA);
    } catch (e) {
      statusRef.current = "MENUNGGU_BAYAR";
      setPesan(pesanDari(e));
      setSibuk(false);
    }
  }

  let isi;
  if (!idValid) {
    // Bukan id transaksi (mis. sisa URL lama /pembayaran/checkout) → tidak ada yang bisa dibayar.
    isi = (
      <div className="space-y-4">
        <p className="font-medium text-red-600">Transaksi tidak ditemukan</p>
        <button
          type="button"
          onClick={() => router.push("/katalog")}
          className="w-full rounded-md bg-[#f25f4b] px-4 py-4 text-xl font-black text-white shadow-sm"
        >
          Kembali ke katalog
        </button>
      </div>
    );
  } else if (!trx) {
    isi = <p className="text-[#5d625b]">{pesan || "Memuat..."}</p>;
  } else if (trx.status === "LUNAS") {
    isi = (
      <div className="space-y-4">
        <div className="rounded-[18px] border border-[#d7d0b4] bg-[#f7f0dc] p-5 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#1b8ca3]">Pembayaran berhasil</h2>
          <p className="mt-3 text-sm text-[#5d625b]">Kode pengambilan</p>
          <p className="mt-1 text-3xl font-black tracking-widest">{trx.kode_pengambilan}</p>
        </div>
        <Ringkasan trx={trx} />
        <button
          type="button"
          onClick={() => router.push("/katalog")}
          className="w-full rounded-md bg-[#f25f4b] px-4 py-4 text-xl font-black text-white shadow-sm"
        >
          Kembali ke katalog
        </button>
      </div>
    );
  } else if (trx.status === "BATAL") {
    isi = (
      <div className="space-y-4">
        <p className="font-medium text-red-600">{pesan || "Transaksi ini sudah dibatalkan"}</p>
        <button
          type="button"
          onClick={() => router.push("/katalog")}
          className="w-full rounded-md bg-[#f25f4b] px-4 py-4 text-xl font-black text-white shadow-sm"
        >
          Kembali ke katalog
        </button>
      </div>
    );
  } else {
    isi = (
      <div className="space-y-4">
        <Ringkasan trx={trx} />
        {trx.kode_qris && (
          <div className="rounded-[18px] border border-[#d7d0b4] bg-[#f7f0dc] p-4 text-center shadow-sm">
            <img src={trx.kode_qris} alt="QRIS dummy" className="mx-auto w-56" />
          </div>
        )}
        {pesan && <p className="font-medium text-red-600">{pesan}</p>}
        <button
          type="button"
          disabled={sibuk}
          onClick={kirimBayar}
          className="w-full rounded-md bg-[#f25f4b] px-4 py-4 text-xl font-black text-white shadow-sm disabled:opacity-60"
        >
          {sibuk ? "Memproses..." : "Bayar"}
        </button>
      </div>
    );
  }

  return (
    <AppLayout
      role="buyer"
      isAuthenticated
      title="Pembayaran"
      showHeader
      headerClassName="bg-[#1bb0c7] px-5 pb-5 pt-8"
      bodyClassName="bg-[#e6e0c8] px-4 py-5"
    >
      {isi}
    </AppLayout>
  );
}

export default function PembayaranPage() {
  return (
    <Suspense fallback={null}>
      <PembayaranIsi />
    </Suspense>
  );
}

function Ringkasan({ trx }: { trx: TransaksiPembayaran }) {
  return (
    <div className="rounded-[18px] border border-[#d7d0b4] bg-[#f7f0dc] p-4 shadow-sm">
      {trx.items.map((i) => (
        <div key={i.id_listing} className="flex items-start justify-between gap-3 py-1">
          <div>
            <p className="font-bold text-[#1b8ca3]">{i.nama_makanan}</p>
            <p className="text-sm text-[#5d625b]">
              {i.jumlah} porsi × {rupiah(i.harga_satuan)}
            </p>
          </div>
          <p className="font-bold">{rupiah(i.jumlah * i.harga_satuan)}</p>
        </div>
      ))}
      <div className="mt-3 flex justify-between border-t border-[#d6cebb] pt-3 text-lg font-bold">
        <span>Total</span>
        <span>{rupiah(trx.total_harga)}</span>
      </div>
    </div>
  );
}