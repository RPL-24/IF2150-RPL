# Source Code

Sehati — IF2150 Rekayasa Perangkat Lunak, Kelas K01, Kelompok G04.

| Directory | Contents |
| --- | --- |
| `backend/` | Cloudflare Worker (Hono + D1) providing the REST API and scheduled jobs |

---

## Backend

Full documentation: [`backend/README.md`](./backend/README.md).

### What it is

A Cloudflare Worker written in TypeScript that serves the Sehati API under `/api`,
plus a per-minute Cron Trigger for notification dispatch and uptime checks. It is
implemented from the design in [`docs/M8/K01_G04_DPPL2.md`](../docs/M8/K01_G04_DPPL2.md)
(the M8 revision supersedes M7 and carries the algorithm/query catalogue).

Stack: **Hono** (routing) · **Drizzle ORM** (Cloudflare D1 / SQLite) · **Vitest**
(tests) · **Wrangler** (dev/deploy). Runtime config: `wrangler.jsonc`.

> **Use `bun`, not `npm`.** The project is pinned to Bun 1.4.x with `bun.lock`;
> npm ignores that lockfile and may resolve a different dependency tree.

### Quick start

```bash
cd src/backend
bun install
```

Create `src/backend/.dev.vars` (gitignored):

```ini
KUNCI_TOKEN=<openssl rand -base64 32 output>
GOOGLE_CLIENT_ID=<oauth client id>
GOOGLE_CLIENT_SECRET=<oauth client secret>
GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google
API_BASE_URL=http://localhost:8787
```

`KUNCI_TOKEN` encrypts Google tokens at rest (AES-256-GCM) and must decode to exactly
32 bytes. `GOOGLE_CLIENT_SECRET` only ever lives on the server, which is why the OAuth
code exchange happens here rather than in the mobile app. Tests do not need `.dev.vars`.

```bash
bun run db:migrate:local   # apply migrations to local D1
bun run db:seed:local      # fictional dev data + dev tokens
bun run dev                # http://localhost:8787
```

Then:

```bash
curl http://localhost:8787/health
curl http://localhost:8787/api/me -H 'Authorization: Bearer dev-token-mahasiswa'
```

### Dev tokens

The seed ships two ready-made sessions, so you can call authenticated routes without
a Google login:

| Account | Role | Header |
| --- | --- | --- |
| `seed-usr-mhs` (Mahasiswa Uji) | `mahasiswa` | `Bearer dev-token-mahasiswa` |
| `seed-usr-adm` (Administrator Uji) | `administrator` | `Bearer dev-token-administrator` |

They exist only in `seed/seed.sql` and are never valid on a deployed worker. The
seeded accounts carry fake `google_id` values, so a real Google login will create a
separate account. Re-run `bun run db:seed:local` if a session has passed its 30-day
lifetime.

### Commands

```bash
bun run dev              # wrangler dev on :8787
bun run test             # vitest run
bun run test:watch
bun run typecheck        # tsc --noEmit
bun run db:generate      # regenerate migrations from src/db/schema.ts
bun run db:migrate:local # / db:seed:local
bun run db:studio:local  # browse local D1, no auth
bun run db:studio:remote # browse remote D1, needs .env + wrangler login
bun run deploy
```

### Database

Local D1 lives in `.wrangler/state/` and is gitignored:

```bash
bun run db:migrate:local && bun run db:seed:local
bun run db:studio:local        # table UI over the local sqlite file
```

Remote (production D1) needs two separate things:

1. **Wrangler login** — `bunx wrangler login` (one time), for `wrangler d1 …` commands.
2. **API token** — `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, and
   `CLOUDFLARE_D1_TOKEN` in `src/backend/.env` (copy `.env.example`), for anything
   going over HTTP such as Drizzle Studio remote and `db:migrate:remote`.

`CLOUDFLARE_D1_TOKEN` is a Cloudflare API token with **D1 Edit**, not the wrangler
session. Remote Studio writes to production immediately.

### Tests

`bun run test` runs the suite against a real SQLite database: `test/harness.ts`
provides an in-process D1 adapter over `better-sqlite3` and replays the actual
migrations, so CHECK/UNIQUE/FK constraints are genuinely enforced. Google and Expo
HTTP calls are stubbed. No `.dev.vars`, network, or running server required.

### API surface

| Method | Path | Role |
| --- | --- | --- |
| `POST` | `/api/auth/google` | public |
| `POST` | `/api/auth/logout` | any |
| `POST` | `/api/auth/device` | any |
| `GET` | `/api/me` | any |
| `GET` | `/api/affirmation` | mahasiswa |
| `PUT` | `/api/affirmation/time` | mahasiswa |
| `GET` | `/api/reminders` | mahasiswa |
| `PUT` | `/api/reminders/:jenis` | mahasiswa |
| `GET` | `/api/calendar` | mahasiswa |
| `GET` | `/api/consultants` | any |
| `GET` | `/api/consultants/:id/slots` | any |
| `GET` | `/api/sessions/next` | mahasiswa |
| `POST` | `/api/slots/:id/book` | mahasiswa |
| `POST` | `/api/slots` | administrator |
| `PATCH` | `/api/slots/:id` | administrator |
| `GET` | `/api/faq?q=` | any |
| `POST` | `/api/faq` | administrator |
| `PUT` | `/api/faq/:id` | administrator |
| `DELETE` | `/api/faq/:id` | administrator |
| `POST` | `/api/questions` | mahasiswa |
| `POST` | `/api/feedback` | mahasiswa |
| `GET` | `/api/feedback` | administrator |
| `PUT` | `/api/feedback/:id/response` | administrator |
| `GET` | `/api/status/:jenis` | any |
| `GET` | `/health` | public |

Everything except `/api/auth/google` and `/health` requires
`Authorization: Bearer <token>`. Error responses share one envelope:

```json
{ "error": { "kode": "VALIDASI_GAGAL", "pesan": "...", "detail": null } }
```

Status codes: `400` malformed body · `401` unauthenticated · `403` wrong role ·
`404` not found · `409` conflict (slot taken / calendar clash) · `422` validation ·
`502` upstream Google failure.

### Scheduled jobs

A single `* * * * *` cron trigger runs:

- affirmation and reminder dispatch, recording notifications and sending Expo push
  messages in batches of at most 100, dropping tokens Expo reports as
  `DeviceNotRegistered`
- uptime probes for `website` and `server` (needs `API_BASE_URL`)

These are not HTTP routes — they live in the Worker's `scheduled()` handler.

---

## Adding a new endpoint

1. Add any new SQL to `src/db/queries.ts`, annotated with its `Q-xxx` id from the DPPL.
2. Add the handler under `src/routes/`, guarded with `auth` and `requireRole(...)`.
3. Mount it in `src/index.ts`.
4. Add a suite in `test/` and run `bun run test`.
