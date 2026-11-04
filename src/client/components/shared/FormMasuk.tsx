"use client";

import Link from "next/link";
import { useActionState } from "react";
import { masuk } from "@/server/controllers/AuthController";

const KELAS_INPUT = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-base";

export function FormMasuk({ next }: { next: string | null }) {
  const [state, action, pending] = useActionState(masuk, null);
  const query = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="block text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state?.nilai.email}
          className={KELAS_INPUT}
        />
      </label>
      <label className="block text-sm font-medium">
        Kata sandi
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={KELAS_INPUT}
        />
      </label>
      {state && !state.ok && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Memproses…" : "Masuk"}
      </button>
      <p className="text-center text-sm">
        Belum punya akun?{" "}
        <Link href={`/daftar${query}`} className="text-blue-600 underline">
          Daftar
        </Link>
      </p>
    </form>
  );
}
