# StressAid

Privacy-first school environment feedback tool — MVP foundation built for
**Social Hackathon Umbria 2026 (#SHU2026)**.

StressAid evaluates the **collective class environment**, never individual
students. Students answer a short, anonymous questionnaire; teachers see only
aggregated, threshold-protected class-level signals.

> One student's answer remains private. Together, the answers become a
> collective signal that helps the teacher improve the classroom environment.

## Hackathon beta

> **Hackathon beta · ready to use.**
>
> This is a public hackathon beta ready for demonstration and voluntary testing.
> A full security and GDPR review is still required before any real-school use.

This build adds a public, Supabase-backed workflow:

- **Teacher auth** (email/password) via Supabase Auth + `@supabase/ssr` cookies:
  `/teacher/login`, `/teacher/signup`, `/teacher/dashboard`.
- **Campaigns and repeatable rounds**: teachers create a campaign (first round is
  created automatically) and can `Start new round` any time; previous rounds are
  preserved with their own aggregate data and public link.
- **Public student links**: `/student/<public-round-code>` shows the questionnaire
  for a valid, live round only.
- **Aggregate-only submission**: all six answers are submitted atomically to one
  PostgreSQL function. No individual response is ever stored.
- **Threshold-gated results**: the database withholds section distributions until
  the anonymity threshold is reached.

`/student/demo` and `/teacher/demo` remain as synthetic-only demo fallbacks.

### Privacy invariants (unchanged)

- No individual responses, answer rows, names, emails, IDs, device identifiers,
  open text, or individual scores are stored — only per-section counters.
- Anonymity thresholds are enforced **inside PostgreSQL**; below-threshold reads
  never return section distributions.
- Anonymous users have **no direct table access**; students write only through
  the hardened submission function.
- No service-role client/key in the application. No answers or payloads logged.

## Requirements

- Node.js `>=20.9.0` (see `.nvmrc`)
- A Supabase project (public URL + anon key) for the auth/data features.

## Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `NEXT_PUBLIC_SITE_URL` | Public base URL used to build student links |

There is **no service-role key**. All authorization is enforced by Postgres RLS
and `SECURITY DEFINER` RPCs. The frontend build succeeds without these variables
(they are read lazily, only when a Supabase operation runs).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with autofix |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run test` | Run the Vitest suite (watch) |
| `npm run test:run` | Run the Vitest suite once |
| `npm run db:start` | Start the local Supabase stack (requires Docker) |
| `npm run db:stop` | Stop the local Supabase stack |
| `npm run db:reset` | Recreate the local database and apply all migrations |
| `npm run db:test` | Run the pgTAP database tests locally |

## Local database (Supabase) — development only

The data foundation is **aggregate-only** and is not yet wired to any UI. The
frontend build runs without any Supabase configuration.

Prerequisites:

- Docker Desktop must be **installed and running** before any `db:*` command.
  The Supabase CLI is pinned as a dev dependency (`supabase`), so no global
  install is required.

Typical local workflow:

```bash
npm run db:start   # boots the local stack (Docker)
npm run db:reset   # applies supabase/migrations in order
npm run db:test    # runs supabase/tests/*.sql (pgTAP)
```

Layout:

- `supabase/migrations/` — ordered, forward-only migrations:
  - `0001_hardening.sql` — schema privilege hardening
  - `0002_tables.sql` — `campaigns`, `assessment_rounds`, `round_section_aggregates`
  - `0003_triggers.sql` — six aggregate rows seeded per round
  - `0004_rls.sql` — RLS + owner-scoped teacher policies; aggregates locked down
  - `0005_functions.sql` — hardened RPCs (public + teacher)
- `supabase/tests/` — pgTAP tests. `00-setup.sql` installs pgTAP and the pinned
  `basejump-supabase_test_helpers` (v0.0.6) into the **local test database
  only**; it is not an application migration. The helpers create
  transaction-scoped auth users so the owner foreign key is satisfied without
  any handcrafted `auth.users` insert.

Notes:

- No individual responses table exists; only per-section aggregate counters are
  stored. No student information and no precise per-submission timestamps.

## Supabase project configuration (deployed beta)

In the Supabase dashboard for your project:

1. **Auth → Providers → Email**: enable email/password. For frictionless public
   testing you may **disable "Confirm email"** (the code supports both modes).
2. **Auth → URL configuration**: set the Site URL to your deployed domain and add
   it (and `http://localhost:3000`) to the redirect allow-list.
3. **Database → migrations**: apply `supabase/migrations` (via `supabase db push`
   when linked, or the SQL editor in order 0001→0005).
4. Copy the project **URL** and **anon key** from Project Settings → API. Do
   **not** use or expose the service-role key anywhere in the app.

## Deploying to Vercel

Set these Environment Variables in the Vercel project (all environments):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your deployed domain, e.g. `https://stressaid.example`)

Public deployment checklist:

- [ ] Migrations `0001`–`0005` applied to the Supabase project.
- [ ] Email auth enabled; Site URL + redirect URLs configured.
- [ ] Vercel env vars set; **no service-role key present anywhere**.
- [ ] Create a teacher test account, create a campaign, share a Round 1 link.
- [ ] Submit answers via the public link; confirm the response count rises.
- [ ] Confirm results stay hidden below the threshold and appear at/above it.

## Open-beta limitations

- This is a **hackathon beta** for synthetic and voluntary test data only.
- Anonymous duplicate submissions **cannot be fully prevented** in this phase.
- Public student links may be shared freely.
- There is **no organization verification** and no school-admin roles.
- Email verification may be **disabled** for easier testing.
- Production anti-abuse controls (rate limiting, bot mitigation) are **not
  complete**.
- A full **security and GDPR review is required before real school use.**

## Attribution

Created during Social Hackathon Umbria 2026, organised by the European Grants
International Academy (EGInA), 16–19 July 2026, Cascia, Italy.

The StressAid logo and the official SHU2026 logo are separate identities and
are used without modification.
