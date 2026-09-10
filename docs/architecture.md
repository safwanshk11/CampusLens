# Architecture

CampusLens is a **modular monolith**: a single Next.js application that owns the UI, the HTTP API
and data access. It deploys as one Vercel project backed by one PostgreSQL database.

```text
Browser
   ↓
Next.js (App Router)
   ├── Server Components          ← default for every page and most components
   ├── Client Interaction Islands ← only where state, browser APIs or animation lifecycles are needed
   └── Route Handlers             ← /api/*
              ↓
             Zod                  ← validates env now; request/response contracts later
              ↓
         data / domain            ← feature services (from Phase 1)
              ↓
            Prisma                ← Prisma 7 client + @prisma/adapter-pg
              ↓
         PostgreSQL (Neon)
```

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.3 (App Router, Turbopack), React 19.2, TypeScript (strict) |
| Styling | Tailwind CSS 4 with PRISM tokens in `src/app/globals.css` |
| Motion | GSAP 3 + ScrollTrigger + CustomEase, Lenis, Framer Motion (LazyMotion) |
| Accessible primitives | Radix UI Dialog (mobile menu) |
| Validation | Zod 4 |
| Data | Prisma 7 (`prisma-client` generator, pg driver adapter) → PostgreSQL on Neon |
| Hosting | Vercel |

## Directory map

```text
src/
├── app/
│   ├── (cinematic)/          # Route group → cinematic visual regime
│   │   ├── layout.tsx        # PageShell mode="cinematic"
│   │   ├── page.tsx          # Homepage visual prototype
│   │   └── design-system/    # PRISM lab
│   ├── (product)/            # Route group → intelligence visual regime
│   │   ├── layout.tsx        # PageShell mode="intelligence"
│   │   └── discover | compare | saved | sign-in   # honest placeholders
│   ├── api/health/route.ts   # Route Handler
│   ├── globals.css           # PRISM tokens + component classes
│   ├── icon.svg              # Brand mark favicon
│   ├── layout.tsx            # Fonts, metadata, motion bootstrap, MotionProvider
│   └── not-found.tsx
├── components/
│   ├── ui/           # PRISM primitives (button, glass-surface, input, card, …)
│   ├── visual/       # Ambient scene, light orbs, grain, brand mark, magnetic
│   ├── layout/       # Page shell, navigation, mobile menu, container, section, footer
│   ├── motion/       # Motion provider, Lenis, reveal, scroll words, reduced-motion hooks
│   ├── home/         # Homepage sections and their choreography islands
│   └── design-lab/   # /design-system sections and demos
├── config/
│   ├── site.ts       # Name, tagline, navigation
│   └── design.ts     # JS-side design constants (eases, durations, limits)
├── lib/
│   ├── db.ts         # Lazy Prisma singleton (server-only)
│   ├── env.ts        # Zod environment validation (server-only)
│   ├── gsap.ts       # One place that registers GSAP plugins and PRISM eases
│   ├── motion.ts     # Media queries and ease-name helpers
│   └── utils.ts      # cn() with PRISM-aware tailwind-merge
├── types/
└── generated/prisma/ # Prisma client output (git-ignored, built by postinstall)
prisma/schema.prisma  # College, courses, placements, reviews and saved-item models
prisma.config.ts      # Prisma CLI config
```

## Rendering boundaries

**Rule:** everything is a Server Component unless it needs state, browser APIs, event handlers or an
animation lifecycle. A client component never wraps a whole page. Server-rendered content is passed
into client wrappers as `children`, so it stays server-rendered HTML.

### Client islands and why each exists

| Component | Why it is a client component |
|-----------|------------------------------|
| `motion/motion-provider.tsx` | Framer `MotionConfig` + `LazyMotion` context; mounts Lenis |
| `motion/smooth-scroll.tsx` | Lenis lifecycle, GSAP ticker, anchor click handling |
| `motion/reveal.tsx` | GSAP ScrollTrigger lifecycle |
| `motion/scroll-words.tsx` | GSAP scrubbed word contrast |
| `layout/nav-frame.tsx` | Scroll position (`useSyncExternalStore`), active route (`usePathname`) |
| `layout/mobile-menu.tsx` | Dialog open state, presence animation, Lenis pause |
| `ui/interactive-glass.tsx` | Pointer events → glare and tilt |
| `ui/save-button.tsx`, `ui/compare-check.tsx` | Toggle state |
| `visual/magnetic.tsx` | Pointer events → spring motion values |
| `home/hero-motion.tsx`, `home/stack-motion.tsx`, `home/flow-motion.tsx` | GSAP choreography for server-rendered sections |
| `design-lab/token-value.tsx`, `reveal-replay.tsx`, `compare-tray-demo.tsx` | Lab-only demos |

Hooks-only modules such as `motion/reduced-motion.ts` have no directive. They are only imported by
client components.

Everything else is server-rendered, including `GlassSurface`, `GlassBezel`, `Button`, `Input`,
`Card`, `SearchIsland`, `AmbientScene`, every homepage section's markup and every design-lab section.
`GlassSurface` renders the `InteractiveGlass` island only when `interactive` is set.

### Route groups = visual regimes

`(cinematic)` and `(product)` are URL-invisible route groups. Each has its own layout rendering
`PageShell` with a different `AmbientScene` variant. The two-regime design rule
(see [design-system.md](./design-system.md)) is enforced by the file system, not by memory.

## Server foundation

### Environment — `src/lib/env.ts`

- `import "server-only"`: importing it from client code fails the build.
- A Zod schema validates `NODE_ENV` and `DATABASE_URL`, which must be a `postgres://` or
  `postgresql://` URL.
- **Validated lazily** on first call to `getServerEnv()`. Phase 0 never touches the database, so the
  app builds and deploys without `DATABASE_URL`. The first data-access call fails fast with a
  readable Zod error report.
- `isDatabaseConfigured()` reports presence without exposing the value.
- `getSiteUrl()` resolves `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → `http://localhost:3000` for
  `metadataBase`.

### Database — `src/lib/db.ts`

- Prisma 7 generates a TypeScript client into `src/generated/prisma`.
- Prisma 7 connects through a **driver adapter**. We use `@prisma/adapter-pg` over standard
  TCP. Neon's pooled connection string works directly, and there is no WebSocket polyfill to manage
  on Node 20.
- `getDb()` creates the client on first use and caches it on `globalThis`, so dev hot reloads don't
  open a new pool each time.
- Phase 1 domain models, migration and seed are documented in [database.md](./database.md).

### Route Handlers

`GET /api/health` returns service status and whether a database URL is configured. It never
connects to the database and never reveals the URL. It is `force-dynamic` with `Cache-Control:
no-store`.

The college search handler follows this pattern (see [search-api.md](./search-api.md)):

```text
Route Handler
  → parse params / body with a Zod schema (400 on failure)
  → call a domain service in src/server/<feature>
  → service queries Prisma via getDb()
  → return a typed JSON contract
```

## Build and deployment

- `postinstall: prisma generate`: Vercel installs dependencies, which generates the client before
  `next build` type-checks `db.ts`.
- `prisma.config.ts` loads `.env.local` / `.env` with Node's built-in `process.loadEnvFile`
  (Node ≥ 20.12), so there is no `dotenv` dependency.
- Security headers are set in `next.config.ts`: `nosniff`, `Referrer-Policy`, `X-Frame-Options:
  DENY`, `Permissions-Policy`. `poweredByHeader` is disabled.
- Environment variables are documented in `.env.example`. On Vercel, set `DATABASE_URL` to the
  **pooled** Neon string when the data phase begins.

## Quality gates

```bash
npm run lint       # ESLint 9 flat config: next/core-web-vitals + TypeScript + React Compiler hook rules
npm run typecheck  # tsc --noEmit (run `npx next typegen` first on a fresh clone)
npm run build      # production build
```
