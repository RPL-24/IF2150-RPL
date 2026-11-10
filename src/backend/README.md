# Sehati Backend

Cloudflare Worker (Hono + Cloudflare D1) implementing the API and scheduled jobs
described in the DPPL (`docs/M8/K01_G04_DPPL2.md`).

> **Use `bun`, not `npm`.** This project is pinned to Bun (`bun.lock`, `bun --version`
> 1.4.4). npm will ignore the lockfile and can produce a different dependency tree.

---

## Requirements

| Tool | Version |
| --- | --- |
| [Bun](https://bun.com) | 1.4.x |
| Node.js | 20+ (only for `better-sqlite3`, used by the test harness) |

No global `wrangler` is needed — it comes from `node_modules` via `bun run`.

---

## 1. Install

```bash
cd src/backend
bun install
```

---

## 2. Local secrets (`.dev.vars`)

`wrangler dev` reads `.dev.vars` from this directory. It is **gitignored** — never
commit it.

Create `src/backend/.dev.vars`:

```ini
KUNCI_TOKEN=<32-byte base64 key>
GOOGLE_CLIENT_ID=<oauth client id>
GOOGLE_CLIENT_SECRET=<oauth client secret>
GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback
API_BASE_URL=http://localhost:8787
MODE_DEMO=1
```

Generate `KUNCI_TOKEN` with:

```bash
openssl rand -base64 32
```

| Variable | Purpose |
| --- | --- |
| `KUNCI_TOKEN` | AES-256-GCM key that encrypts Google access/refresh tokens at rest (Algo-001, Algo-009). Must decode to **exactly 32 bytes**. Losing it makes stored Google tokens unreadable, so users must log in again. |
| `GOOGLE_CLIENT_ID` | OAuth client id, sent in the code exchange and refresh grant (Algo-027). Not secret. |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret, required by Google at both grants. This is why the exchange happens server-side — it must never reach the mobile app. |
| `GOOGLE_REDIRECT_URI` | This backend's `/api/auth/google/callback` URL. Must **exactly** match the redirect URI registered in Google Cloud Console. A mismatch yields `redirect_uri_mismatch`. |
| `API_BASE_URL` | Base URL the uptime cron probes (Algo-021). Optional; without it probes record `down`. |
| `MODE_DEMO` | Set to `1` to enable `POST /api/auth/demo`, which signs in as the seeded Mahasiswa or Administrator account without Google (for assistants testing the APK). Optional; any other value or unset keeps the route disabled (404). Requires the seed to have been run on that database. |

Only `KUNCI_TOKEN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and
`GOOGLE_REDIRECT_URI` are mandatory — the worker throws on first use if one is missing.

For tests you do **not** need `.dev.vars`: `test/harness.ts` supplies its own env.

### Deploying

Production secrets go through Wrangler, not `.dev.vars`:

```bash
bunx wrangler secret put KUNCI_TOKEN
bunx wrangler secret put GOOGLE_CLIENT_ID
bunx wrangler secret put GOOGLE_CLIENT_SECRET
bunx wrangler secret put GOOGLE_REDIRECT_URI
```

---

## 3. Database: migrate and seed

Local D1 lives in `.wrangler/state/` and is gitignored.

```bash
bun run db:migrate:local   # apply migrations to local D1
bun run db:seed:local      # insert fictional dev data
```

The seed is idempotent — it deletes its own rows by fixed id before inserting, so you
can re-run it any time.

Remote (only when you mean it):

```bash
bun run db:migrate:remote
```

### Generated schema

```bash
bun run db:generate        # drizzle-kit: schema.ts -> migrations/*.sql
```

---

## 3b. Drizzle Studio

Browse and edit rows in a table UI.

**Local** reads `.wrangler/state` directly — no login, no credentials:

```bash
bun run db:studio:local
```

**Remote** talks to Cloudflare D1 over HTTP, so it needs three values in
`src/backend/.env` (copy `.env.example`):

```ini
CLOUDFLARE_ACCOUNT_ID=<from `bunx wrangler whoami`>
CLOUDFLARE_DATABASE_ID=2061ca01-6f0f-4e31-a2e7-5da3889d89ec
CLOUDFLARE_D1_TOKEN=<API token with D1 Edit permission>
```

```bash
bunx wrangler login          # first time only
bunx wrangler whoami         # prints your account id
bun run db:studio:remote
```

`CLOUDFLARE_D1_TOKEN` is a **Cloudflare API token**, not your wrangler login
session. Create it at *My Profile → API Tokens → Create Token* with **D1 Edit**.
`drizzle.config.ts` reads it from `.env` (gitignored), independently of the
wrangler CLI login used by `wrangler d1 ...`.

> Remote Studio writes to production D1 immediately — there is no review step.

---

## 4. Run the dev server

```bash
bun run dev                # wrangler dev on http://localhost:8787
```

Quick check:

```bash
curl http://localhost:8787/health
# {"ok":true,"latest":null}
```

---

## Dev tokens

The seed creates two accounts with **pre-made session tokens**, so you can call
authenticated routes without doing a Google login:

| Account | Role | `Authorization` header |
| --- | --- | --- |
| `seed-usr-mhs` — Mahasiswa Uji | `mahasiswa` | `Bearer dev-token-mahasiswa` |
| `seed-usr-adm` — Administrator Uji | `administrator` | `Bearer dev-token-administrator` |

```bash
# identity of the seeded student
curl http://localhost:8787/api/me \
  -H 'Authorization: Bearer dev-token-mahasiswa'

# list FAQ as the seeded admin
curl http://localhost:8787/api/faq \
  -H 'Authorization: Bearer dev-token-administrator'
```

Notes:

- These tokens are **dev-only** and are never valid on a deployed worker — they exist
  only inside `seed/seed.sql`.
- The seeded accounts have fake `google_id` values, so the real Google login flow
  will create *separate* accounts. Use the tokens above if you just want to exercise
  the API.
- Sessions expire after `BATAS_SESI` (30 days); re-run `bun run db:seed:local` to reset them.

### Demo login

With `MODE_DEMO=1`, `POST /api/auth/demo` signs in as one of the seeded accounts and
returns a fresh session, in the same shape as `POST /api/auth/google`. The mobile app
uses it for its "Mode demo" buttons. Without the flag the route answers 404.

```bash
curl -X POST http://localhost:8787/api/auth/demo \
  -H 'Content-Type: application/json' -d '{"peran":"administrator"}'
# {"token":"…","waktuLogin":"…","pengguna":{"idPengguna":"seed-usr-adm",…,"peran":"administrator"}}
```

## Google login flow

Google only redirects to `http(s)` URIs, so the authorization code cannot come
straight back to the app. The backend relays it in three steps:

```
1. app      -> GET /api/auth/google/mulai?kembali=<app deep link>
                 302 to accounts.google.com, with `state=<app deep link>`
2. Google   -> GET /api/auth/google/callback?code=…&state=…
                 302 to <app deep link>?code=…
3. app      -> POST /api/auth/google { kodeOtorisasi }
                 200 { token, waktuLogin, pengguna }
```

The exchange in step 3 happens on the server because it needs the client secret;
the code is never exchanged on the device.

### `kembali` / `state` must have a host

Both routes validate the deep link and answer **400** if it has no host:

```bash
curl -s -o /dev/null -w '%{http_code}\n' \
  'http://localhost:8787/api/auth/google/mulai?kembali=sehati%3A%2F%2F'
# 400
```

| Value | Result |
| --- | --- |
| `sehati://masuk` | accepted — production binary |
| `exp://10.0.2.2:8081/--/` | accepted — Expo Go under Metro |
| `sehati://` | **400** — empty host |
| `sehati:///` | **400** — empty host |
| `https://evil.example/` | **400** — scheme not in the allowlist |

Only the schemes in `SKEMA_KEMBALI` (`sehati:`, `exp:`, `exps:`) are accepted, so
the callback cannot be used as an open redirect that leaks the code.

The host requirement is not cosmetic. Android routes an intent by
`scheme://host`, so a hostless link opens nothing at all — the browser sits there
and the login appears to hang with no error anywhere.

> Adding a new deep-link scheme? Register it in `SKEMA_KEMBALI` in
> `src/routes/auth.ts` **and** keep a host.

### Seed contents

| Table | What you get |
| --- | --- |
| `pengguna` / `mahasiswa` | 1 student (`nim` 13599001), 1 administrator |
| `sesi_autentikasi` | the two dev tokens above |
| `konsultan` | 3 consultants |
| `jadwal_konsultasi` | grid of future slots (`seed-jdw-*`), a few already booked |
| `faq` | 3 FAQ entries |

---

## 5. Tests

```bash
bun run test           # vitest run (single pass, CI mode)
bun run test:watch     # watch mode
```

The suite runs against a **real SQLite database**: `test/harness.ts` builds an
in-process D1 adapter over `better-sqlite3` and replays the actual migrations, so
schema constraints (CHECK/UNIQUE/FK) are exercised for real. Google and Expo calls
are stubbed with `vi.fn`.

No `.dev.vars`, network, or running server is required.

```
test/
  harness.ts            D1 adapter + fixtures
  util.ts               request/JSON helpers
  validasi.test.ts      validation predicates, nim derivation, WIB clock
  crypto.test.ts        AES-256-GCM roundtrip and tampering
  auth.test.ts          Algo-002 auth, roles, logout, device, Algo-001 login
  faq.test.ts           FAQ CRUD/search, question submission
  affirmation.test.ts   affirmation + reminder upserts
  consultation.test.ts  booking, 409 races, calendar merge
  feedback-status.test.ts
  scheduler.test.ts     cron jobs, push batching
```

---

## 6. Typecheck and format

```bash
bun run typecheck      # tsc --noEmit (includes test/)
```

There is no formatter wired up in this package; match the surrounding style.

---

## All scripts

| Command | Description |
| --- | --- |
| `bun run dev` | `wrangler dev` on :8787 |
| `bun run deploy` | `wrangler deploy` |
| `bun run test` | run the test suite once |
| `bun run test:watch` | watch mode |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run db:generate` | regenerate migrations from `src/db/schema.ts` |
| `bun run db:migrate:local` | apply migrations to local D1 |
| `bun run db:migrate:remote` | apply migrations to remote D1 |
| `bun run db:seed:local` | seed local D1 |
| `bun run db:studio:local` | Drizzle Studio against local D1, no auth |
| `bun run db:studio:remote` | Drizzle Studio against remote D1; needs `CLOUDFLARE_*` in `.env` |
| `bun run cf-typegen` | regenerate `worker-configuration.d.ts` |

---

## Layout

```
src/
  index.ts              app wiring, error envelope, /health, scheduled export
  config.ts             env parsing, constants, nim derivation
  db/
    schema.ts           Drizzle schema (DPPL 5.37)
    queries.ts          Q-001..Q-042
  lib/
    crypto.ts           AES-256-GCM helpers
    errors.ts           AppError -> JSON envelope
    google.ts           OAuth exchange, calendar read, free/busy
    http.ts             body/pagination helpers
    validasi.ts         Validasi predicates (Algo-023/025/026)
  middleware/auth.ts    Algo-002 + requireRole
  routes/               one file per resource
  jobs/scheduler.ts     Algo-005/007/008/021 cron work
migrations/             drizzle SQL
seed/seed.sql           dev fixtures
test/                   vitest suites + D1 harness
```

---

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| `Missing required binding/env: KUNCI_TOKEN` | `.dev.vars` absent or not picked up — restart `bun run dev`. |
| `KUNCI_TOKEN must decode to exactly 32 bytes` | Regenerate with `openssl rand -base64 32`. |
| `redirect_uri_mismatch` from Google | `GOOGLE_REDIRECT_URI` differs from the console registration. It is sent verbatim at both grants, so it must include the scheme. |
| `400 Parameter kembali harus deep link aplikasi yang memiliki host` | The app sent `sehati://` or `sehati:///`. A deep link needs a host; see [Google login flow](#kembali--state-must-have-a-host). |
| Login hangs, browser never returns | Deep link has no host, or its scheme is not claimed by the running app (Expo Go only claims `exp:`/`exps:`). |
| `401` on every call | Token is not a seeded dev token, or the session passed `BATAS_SESI` — re-run `bun run db:seed:local`. |
| `no such table` | Migrations not applied: `bun run db:migrate:local`. |
| Studio remote: `needs CLOUDFLARE_ACCOUNT_ID` | `.env` missing or not loaded — copy `.env.example` and fill it. |
| Studio remote: auth/permission error | Run `bunx wrangler login`, and check the API token has **D1 Edit**. |
| Calendar returns `peringatan` | Google tokens missing/expired or Google unreachable; the endpoint intentionally degrades to slots only. |
