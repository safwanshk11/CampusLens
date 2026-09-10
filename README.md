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

## Status: Phase 0 — foundation

Phase 0 delivers the architecture, the **PRISM** design system, liquid-glass primitives, the motion
architecture, a homepage visual prototype, the `/design-system` lab, and the Prisma and environment
foundation.

College data, search, detail, compare, authentication and saving come in later phases. The pages
`/discover`, `/compare`, `/saved` and `/sign-in` are honest placeholders.

## Quick start

Requires Node.js ≥ 20.12.

```bash
npm install          # also runs `prisma generate`
cp .env.example .env.local
npm run dev
```

- Homepage: <http://localhost:3000>
- Design lab: <http://localhost:3000/design-system>
- Health check: <http://localhost:3000/api/health>

`DATABASE_URL` is not required in Phase 0.

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
