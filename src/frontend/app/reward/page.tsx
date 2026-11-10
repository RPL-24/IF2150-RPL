"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import TombolKeluar from "@/components/akun/TombolKeluar";
import { ambilProgresReward, klaimReward, ApiError, type ProgresReward } from "@/lib/api";

const rupiah = (n: number) => `Rp. ${n.toLocaleString("id-ID")}`;
const hariIni = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local time

export default function RewardPage() {
  const [data, setData] = useState<ProgresReward | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perluLogin, setPerluLogin] = useState(false);
  const [mengklaim, setMengklaim] = useState(false);
  const [pesan, setPesan] = useState<{ jenis: "ok" | "gagal"; teks: string } | null>(null);
  // new Date() tidak stabil saat prerender, jadi dihitung di client saja (useEffect).
  const [tanggalHariIni, setTanggalHariIni] = useState<string | null>(null);

  useEffect(() => {
    setTanggalHariIni(hariIni());
  }, []);

  const muat = useCallback(async () => {
    try {
      setError(null);
      setData(await ambilProgresReward());
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) setPerluLogin(true);
      setError(e instanceof ApiError ? e.message : "Gagal memuat reward");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  async function onKlaim() {
    setMengklaim(true);
    setPesan(null);
    try {
      const kupon = await klaimReward();
      setPesan({ jenis: "ok", teks: `Kupon ${kupon.kode_kupon} berhasil diklaim!` });
      await muat();
    } catch (e) {
      if (e instanceof ApiError && e.status === 400) {
        setPesan({ jenis: "gagal", teks: "Poin tidak mencukupi untuk klaim kupon." });
      } else if (e instanceof ApiError && e.status >= 500) {
        setPesan({ jenis: "gagal", teks: "Sistem gagal memproses klaim. Silakan coba lagi nanti." });
      } else {
        setPesan({ jenis: "gagal", teks: e instanceof ApiError ? e.message : "Terjadi kesalahan" });
      }
    } finally {
      setMengklaim(false);
    }
  }

  const persen = data ? Math.min(100, (data.poin_terkumpul / data.poin_per_klaim) * 100) : 0;
  const sudahLoginHariIni = tanggalHariIni !== null && data?.tanggal_login_terakhir === tanggalHariIni;

  return (
    <AppLayout
      role="buyer"
      isAuthenticated
      title="My Reward"
      showHeader
      theme="pink"
      headerClassName="px-5 pb-5 pt-8"
      bodyClassName="bg-[#e6e0c8] px-4 py-5"
    >
      <div className="space-y-5">
        {loading && <p className="text-center text-[#7a705c]">Memuat reward...</p>}

        {!loading && error && (
          <div className="rounded-[18px] bg-[#f4efe3] p-4 text-center shadow-sm">
            <p className="font-medium text-red-600">{error}</p>
            {perluLogin ? (
              <Link href="/login" className="mt-2 inline-block underline">
                Masuk dulu
              </Link>
            ) : (
              <button onClick={muat} className="mt-3 rounded-full bg-[#f56369] px-5 py-2 font-bold text-white">
                Coba lagi
              </button>
            )}
          </div>
        )}

        {data && (
          <>
            {/* Progress */}
            <div className="rounded-[20px] bg-[#f6f0de] p-4 text-center shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="flex h-32 w-44 items-center justify-center rounded-full bg-[#f1d69a] text-5xl shadow-inner">
                  🥚
                </div>
              </div>

              <h3 className="text-[1.6rem] font-black tracking-[-0.03em] text-[#f15a62]">
                {sudahLoginHariIni ? "Sudah login hari ini ✓" : "Login setiap hari untuk poin"}
              </h3>
              <p className="mt-1 text-sm text-[#7a705c]">
                +{data.poin_per_login} poin untuk login pertama setiap hari
                {data.tanggal_login_terakhir && ` · Login terakhir: ${data.tanggal_login_terakhir}`}
              </p>
            </div>

            {/* Points + claim */}
            <div className="space-y-4 rounded-[18px] bg-[#f4efe3] p-4 shadow-sm">
              <div className="flex items-center justify-between text-[1.7rem] font-black text-[#1d9eb8]">
                <span>Total Point</span>
                <span>{data.poin_terkumpul}</span>
              </div>

              <div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#ddd3bb]">
                  <div className="h-full rounded-full bg-[#1d9eb8] transition-all" style={{ width: `${persen}%` }} />
                </div>
                <p className="mt-1 text-right text-sm text-[#7a705c]">
                  {data.poin_terkumpul} / {data.poin_per_klaim} poin
                </p>
              </div>

              <button
                onClick={onKlaim}
                disabled={mengklaim}
                className="w-full rounded-full bg-[#f56369] py-3 text-lg font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mengklaim
                  ? "Memproses..."
                  : `Klaim Kupon ${rupiah(data.nilai_potongan)} (${data.poin_per_klaim} poin)`}
              </button>

              {pesan && (
                <p className={`text-sm font-medium ${pesan.jenis === "ok" ? "text-green-700" : "text-red-600"}`}>
                  {pesan.teks}
                </p>
              )}
            </div>

            {/* Coupons */}
            <div className="space-y-3">
              <h4 className="text-xl font-black text-[#1d1d1d]">Kupon Saya</h4>

              {data.kupon.length === 0 && (
                <p className="text-sm text-[#7a705c]">
                  Belum ada kupon. Kumpulkan {data.poin_per_klaim} poin untuk klaim.
                </p>
              )}

              {data.kupon.map((k) => (
                <div
                  key={k.kode_kupon}
                  className={`rounded-[18px] px-5 py-4 text-white shadow-sm ${k.berlaku ? "bg-[#f8b638]" : "bg-[#c7bba0]"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[1.8rem] font-black">{rupiah(k.nilai_potongan)}</span>
                    <div className="text-right">
                      <div className="font-mono text-base font-bold">{k.kode_kupon}</div>
                      <div className="text-sm opacity-90">Berlaku sampai: {k.berlaku_sampai}</div>
                      {!k.berlaku && (
                        <span className="mt-1 inline-block rounded-full bg-white/30 px-2 text-xs font-bold">
                          {k.terpakai ? "Terpakai" : "Kedaluwarsa"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <TombolKeluar />
      </div>
    </AppLayout>
  );
}
