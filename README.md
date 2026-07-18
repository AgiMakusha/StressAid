# StressAid

Privacy-first school environment feedback tool — MVP foundation built for
**Social Hackathon Umbria 2026 (#SHU2026)**.

StressAid evaluates the **collective class environment**, never individual
students. Students answer a short, anonymous questionnaire; teachers see only
aggregated, threshold-protected class-level signals.

> One student's answer remains private. Together, the answers become a
> collective signal that helps the teacher improve the classroom environment.

## Status

This repository currently contains only the **application foundation**:

- shared root layout and responsive page shell;
- landing page;
- placeholder routes (`/student/demo`, `/student/demo/complete`,
  `/teacher/demo`, `/privacy`);
- reusable brand header;
- central design tokens and global styles.

Not implemented yet: questionnaire, scoring, Class Environment Wheel, response
storage, Supabase, teacher access, polling, interventions, analytics.

## Requirements

- Node.js `>=20.9.0` (see `.nvmrc`)

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

## Attribution

Created during Social Hackathon Umbria 2026, organised by the European Grants
International Academy (EGInA), 16–19 July 2026, Cascia, Italy.

The StressAid logo and the official SHU2026 logo are separate identities and
are used without modification.
