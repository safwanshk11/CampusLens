# CampusLens

> **See your options clearly.**

A college discovery platform built for the AI Software Engineer Internship technical assignment
(**Full Stack Engineer · Track A — College Discovery Platform**).

```text
DISCOVER → UNDERSTAND → COMPARE → SHORTLIST
```

The four features are:

1. College listing and search
2. College detail page
3. Compare colleges
4. Authentication and saved items

## Current status

Phases 0–8 are implemented: PRISM, discovery, details, comparison, authentication,
saved items and optional academic profiles. Phase 8 code preparation is ready;
public deployment is live. Phase 9 documentation is prepared; recording and
final submission are pending.

The catalogue contains 12 fictional demo colleges and 45 IIT/AIIMS profiles with
illustrative courses, fees, establishment years and placement figures. Academic
matching uses invented thresholds, not actual eligibility. Seeded reviews are
examples; Google reviews are not integrated. Gemini explains supplied comparison
data and does not verify it.

## Quick start

Requires Node.js ≥ 20.12.

```bash
npm ci               # also runs `prisma generate`
cp .env.example .env.local
# Set DATABASE_URL in .env.local before the following commands
npm run db:deploy
npm run db:seed
npm run db:seed-national
npm run dev -- --port 3210
```

- Homepage: <http://localhost:3210>
- Design lab: <http://localhost:3210/design-system>
- Health check: <http://localhost:3210/api/health>

PostgreSQL is required for product features. See [database setup](docs/database.md).
For the existing local setup, start Docker Desktop then run
`docker start campuslens-phase1-db`. Seeds overwrite their own sample records;
use a dedicated prototype database. Register at `/sign-up`; no shared demo password
is configured.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next core-web-vitals, TypeScript, React Compiler hook rules) |
| `npm run typecheck` | `tsc --noEmit` (run `npx next typegen` first on a fresh clone) |
| `npm run db:generate` | Regenerate the Prisma client |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · GSAP + ScrollTrigger ·
Lenis · Framer Motion · Radix Dialog · Zod 4 · Prisma 7 (pg adapter) · PostgreSQL on Neon · Vercel

## Documentation

| Doc | Contents |
|---|---|
| [docs/product-scope.md](docs/product-scope.md) | Journey, the four features, exclusions, data-honesty rules |
| [docs/architecture.md](docs/architecture.md) | Modular monolith, server/client boundaries, env and database foundation |
| [docs/design-system.md](docs/design-system.md) | PRISM: regimes, lighting, colour, glass, bezels, type, depth, components |
| [docs/motion-system.md](docs/motion-system.md) | Library ownership, easing vocabulary, animation inventory, reduced motion, performance |
| [docs/decisions.md](docs/decisions.md) | ADR-001 to ADR-007 |
| [docs/visual-reference.md](docs/visual-reference.md) | Inspiration and what is original |

## Deploying to Vercel

The verified public deployment is [campuslens-tan.vercel.app](https://campuslens-tan.vercel.app).
Follow [the deployment runbook](docs/deployment.md).

1. Import the repository. Framework preset: Next.js.
2. Optional: set `NEXT_PUBLIC_SITE_URL` to the production origin.
3. From the data phase onward, set `DATABASE_URL` to Neon's **pooled** connection string.

`postinstall` generates the Prisma client during install, before `next build`.

## Phase 1 — Database

The database schema, migration and repeatable illustrative seed are implemented.
See [the database guide](docs/database.md) for setup, model explanations and verification.
The existing homepage remains unchanged; database-backed discovery UI begins in Phase 3.

## Phase 2 — Search API

`GET /api/colleges` supports validated search, filters, aggregate sorting and pagination.
See [the API guide](docs/search-api.md) for parameters, examples and test commands.

## Phase 3 — Discovery UI

Open `/discover` for working college search, filters and pagination with the PRISM
result cards. See [the discovery guide](docs/discovery-ui.md) for behaviour and phase boundaries.

## Phase 4 — College details

Discovery cards now open `/colleges/<slug>` for overview, courses, fees, placements and
reviews. See [the detail guide](docs/college-detail.md) for data semantics and checks.

## Phases 5–7

Comparison supports two to four colleges and optional Gemini explanations.
Accounts use scrypt passwords, hashed sessions, HttpOnly cookies, origin checks
and database-backed atomic throttling. Saved items are scoped to the signed-in
user. Academic profiles are optional, editable and use explicitly demo criteria.

Run against the local seeded app:

```bash
npm test
npm run test:api
npm run test:detail
npm run test:account
npm run test:throttle
npm run lint
npm run typecheck
npm run build
```

Account tests create and clean up temporary users. See [reliability](docs/reliability.md)
for coverage and limits. The health endpoint now checks database connectivity.

## Phase 9 — Submission preparation

See [the Loom script and checklist](docs/submission.md). Add the verified deployment
and recording links before submission. Earlier phase documents describe their
scope at the time; this status section reflects the current implementation.
