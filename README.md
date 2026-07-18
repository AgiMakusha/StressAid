# StressAid

Privacy-first school environment feedback tool built for
**Social Hackathon Umbria 2026 (#SHU2026)**.

StressAid evaluates the **collective class environment**, never individual
students. Students answer a short anonymous questionnaire; teachers see only
aggregated, threshold-protected class-level signals.

## Public beta

This repository is a public hackathon beta for demonstration and voluntary
testing. A full security and GDPR review is still required before any
real-school use.

**Production:** [https://stress-aid.vercel.app](https://stress-aid.vercel.app)

## How it works

- **Teachers** sign up, create a campaign, and share a public round link. They
  can start new rounds over time; each round keeps its own aggregates.
- **Students** open the link, choose English or Italian, and answer six
  questions. No name, email, or student ID is requested.
- **Results** are aggregate-only. Individual answers are never stored or shown.
  Class-level distributions stay hidden until a minimum anonymity threshold is
  reached.

Demo routes `/student/demo` and `/teacher/demo` use synthetic data only.

## Local setup

Requires Node.js `>=20.9.0`.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set these environment variables in `.env.local` (names only — use your own
values):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Attribution

Created during Social Hackathon Umbria 2026, organised by the European Grants
International Academy (EGInA), 16–19 July 2026, Cascia, Italy.

The StressAid logo and the official SHU2026 logo are separate identities and
are used without modification.
