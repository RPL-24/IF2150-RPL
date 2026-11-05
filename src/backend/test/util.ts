import type app from "../src/index";
import { envUji } from "./harness";

type App = typeof app;

export interface OpsiMinta {
  method?: string;
  path: string;
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/** Calls the Hono app in-process with a fake D1 binding. */
export async function minta(
  app: App,
  D1: D1Database,
  opsi: OpsiMinta,
): Promise<Response> {
  const headers: Record<string, string> = { ...(opsi.headers ?? {}) };
  if (opsi.token) headers.Authorization = `Bearer ${opsi.token}`;
  if (opsi.body !== undefined) headers["Content-Type"] = "application/json";

  return app.fetch(
    new Request(`http://sehati.test${opsi.path}`, {
      method: opsi.method ?? "GET",
      headers,
      body: opsi.body === undefined ? undefined : JSON.stringify(opsi.body),
    }),
    envUji(D1),
    {} as ExecutionContext,
  );
}

/** Shortcut: parse JSON body of a Response. */
export async function json<T = any>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

/** Builds an unsigned JWT-shaped string with the given payload (for id_token). */
export function jwtPalsu(payload: Record<string, unknown>): string {
  const enc = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${enc({ alg: "RS256", typ: "JWT" })}.${enc(payload)}.tanda-tangan`;
}
