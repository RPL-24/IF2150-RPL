"use client";
// Widget Cloudflare Turnstile (KNF04) untuk LaporPage. Pemilik: Peran A.
// Memuat script resmi Cloudflare (tanpa package npm) lalu merender widget secara eksplisit.

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type OpsiTurnstile = {
  sitekey: string;
  size?: "normal" | "flexible" | "compact";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

// Objek global yang dipasang script Turnstile.
declare global {
  interface Window {
    turnstile?: {
      render(wadah: HTMLElement, opsi: OpsiTurnstile): string;
      remove(idWidget: string): void;
    };
  }
}

type Props = {
  /** Dipanggil dengan token saat verifikasi lolos, atau null saat token kedaluwarsa/gagal. */
  onToken: (token: string | null) => void;
};

export function WidgetAntiBot({ onToken }: Props) {
  const wadah = useRef<HTMLDivElement>(null);
  const [skripSiap, setSkripSiap] = useState(false);

  useEffect(() => {
    const turnstile = window.turnstile;
    if (!skripSiap || !wadah.current || !turnstile) return;
    const idWidget = turnstile.render(wadah.current, {
      sitekey: SITE_KEY,
      size: "flexible",
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });
    // Saat komponen dilepas (mis. di-reset lewat `key`), hapus widget lama.
    return () => turnstile.remove(idWidget);
  }, [skripSiap, onToken]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setSkripSiap(true)}
      />
      <div ref={wadah} className="min-h-[65px]" />
    </>
  );
}