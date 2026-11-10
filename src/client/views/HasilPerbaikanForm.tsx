"use client";

// C14 · HasilPerbaikanForm (kelas boundary DPPL). Pemilik: Peran C (lihat AGENTS.md bagian 4).
import Link from "next/link";
import { useState } from "react";
import { MediaUploader } from "../components/shared/MediaUploader";
import { StatusBadge } from "../components/shared/StatusBadge";
import type { ActionResult } from "@/lib/action-result";
import { KATEGORI } from "@/lib/constants";
import { cekKelengkapan, PESAN_TAK_LENGKAP, validasiForm } from "@/lib/validasi-perbaikan";
import type { RincianTugas } from "@/server/entities/ListTugas";




function renderGagal(pesan: string) {
  return (
    <main className="mx-auto w-full max-w-md space-y-4 p-4">
      <h1 className="text-xl font-semibold">
        Laporkan Hasil Perbaikan
      </h1>
      <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
        {pesan}
      </p>
      <Link href="/tugas" className="block rounded-md border border-gray-300 py-2 text-center font-medium">
        Kembali ke Daftar Tugas
      </Link>
    </main>
  )
}