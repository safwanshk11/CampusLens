# Architecture Decision Records

Each record: context → decision → consequences.

---

## ADR-001 — Next.js Route Handlers rather than NestJS

**Status:** Accepted

**Context.** The assignment needs four features: search, detail, compare, and auth plus saved items.
A separate NestJS service would add a second deployable, a second runtime config, CORS, duplicated
types across the boundary, and a second hosting target, all for an API used by one frontend.

**Decision.** Build the API with Next.js Route Handlers (`src/app/api/**/route.ts`) inside the same
application: a modular monolith. Business logic lives in plain TypeScript modules (feature services)
that Route Handlers and Server Components both call.

**Consequences.**

- One repository, one deploy, one set of types from database to UI.
- Server Components can call services directly, with no HTTP hop for server-rendered pages.
- Feature modules keep boundaries clean, so services could move behind a separate API later.
- No NestJS-style dependency injection or decorators. Structure comes from folder conventions and
  explicit imports.

---

## ADR-002 — Prisma + PostgreSQL (Neon)

**Status:** Accepted

**Context.** College data is relational: colleges → courses → fees and placements; users → saved
colleges. Compare needs consistent, typed fields. Hosting must suit serverless.

**Decision.**

- PostgreSQL hosted on Neon. Prisma 7 as ORM using the new `prisma-client` generator (TypeScript
  output in `src/generated/prisma`).
- The `@prisma/adapter-pg` driver adapter, so Neon's pooled URL works over standard TCP.
- `prisma.config.ts` for CLI configuration, loading env with Node's built-in `process.loadEnvFile`.
- A lazy, `globalThis`-cached, `server-only` client (`getDb()`).
- Zod-validated `DATABASE_URL`, validated lazily.

**Consequences.**

- End-to-end types from schema to component props. Migrations are versioned in
  `prisma/migrations`.
- The pg adapter works on Node 20 without a WebSocket polyfill. Neon's own adapter would need
  `ws` on Node < 22.
- `postinstall: prisma generate` is required so fresh installs (Vercel) have a client before
  `next build`.
- Phase 0 ships no models. The client architecture is proven and nothing queries the database yet.

---

## ADR-003 — PRISM, an in-house design system

**Status:** Accepted

**Context.** The brief demands a distinctive, studio-grade visual identity (liquid glass, editorial
type, spatial depth). Material UI, Ant Design, Chakra and Bootstrap impose their own visual language
and weight, and fighting them costs more than building the primitives.

**Decision.**

- Build PRISM on Tailwind CSS 4.
- Semantic tokens live in `globals.css`, and Tailwind's default colour, radius, shadow, easing and
  font scales are reset, so only PRISM tokens generate utilities.
- Primitives are hand-built React components, mostly Server Components.
- Radix is used only where accessibility behaviour is hard to get right (Dialog).
- `/design-system` is the living contract.

**Consequences.**

- Full control over glass, light and motion, and a small dependency surface.
- Stray values are hard to introduce: `bg-blue-500` or `rounded-md` simply produce no CSS.
- We own accessibility for every primitive: labels, `aria-pressed`, focus, contrast.
- `tailwind-merge` must be extended with PRISM theme keys (`src/lib/utils.ts`). Otherwise it
  mis-merges `text-display-hero` against `text-ink`.

---

## ADR-004 — Two visual regimes: Cinematic and Intelligence

**Status:** Accepted

**Context.** Maximum glass and motion make marketing moments memorable but hurt data work: reading
fees, scanning placements, filling forms. One uniform style would either be dull on the homepage or
tiring on the results page.

**Decision.** Define two regimes and enforce them structurally.

- **Cinematic:** full ambient atmosphere, Glass 2 and 3, editorial type, staged motion.
- **Intelligence:** quiet atmosphere, solid surfaces, Geist-only dense type, state transitions only.

`(cinematic)` and `(product)` route groups each render `PageShell` with the matching `AmbientScene`
variant.

**Consequences.**

- Glass signals hierarchy instead of wallpapering everything.
- The regime is chosen by where a route lives, which is reviewable in the file tree.
- Components serve both regimes through variants: `Card surface="solid | quiet | elevated"` and
  `Input surface="solid | glass"`.

---

## ADR-005 — GSAP + Lenis, with explicit CSS and Framer Motion boundaries

**Status:** Accepted

**Context.** Scroll choreography, React presence animations and hover states have different needs.
Using several libraries for the same job causes conflicting transforms, duplicated easing
vocabularies and bundle bloat.

**Decision.**

- **GSAP (+ ScrollTrigger, CustomEase):** timelines and scroll-linked motion.
- **Lenis:** smooth wheel scrolling, driven by GSAP's ticker so both share one clock.
- **Framer Motion:** via `LazyMotion` + `m` in strict mode, only for React-state presence and layout
  (and spring motion values for the magnetic CTA).
- **CSS:** hover, focus, press, colour and ambient loops.
- One five-curve easing vocabulary shared by all three through `config/design.ts`, CSS variables and
  CustomEase.

**Consequences.**

- Each animated property has exactly one owner. Where two owners meet, separate wrapper elements
  keep them apart (hero chips: GSAP depth plane → CSS float → GSAP entrance).
- Framer ships only `domAnimation` globally, with `domMax` loaded locally for layout animation.
- Anime.js was not added: there is no SVG morphing need GSAP can't meet.

---

## ADR-006 — Progressive reduction of effects on mobile and for reduced motion

**Status:** Accepted

**Context.** Parallax, sticky stacks, large blurs and pointer effects cost GPU and battery. They can
cause motion sickness and don't translate to touch.

**Decision.** Effects degrade in defined steps.

- **Mobile:**
  - no parallax
  - sticky stack becomes a list
  - curved connector becomes a vertical rule
  - orb blur × 0.55 and one orb hidden
- **Touch at any width:** no glare, tilt or magnetic pull.
- **Reduced motion, at three layers:**
  - CSS media query
  - `gsap.matchMedia()`
  - `useSyncExternalStore` hooks plus `MotionConfig reducedMotion="user"`

  These remove Lenis, parallax, loops, reveals and pointer effects, while keeping state transitions.
- **Reduced transparency / no `backdrop-filter`:** glass becomes solid.

**Consequences.**

- Mobile stays premium through typography, spacing and surface quality.
- The reduced-motion experience is complete, not broken: content is visible and legible immediately.
- Hydration assumes reduced motion until the client confirms otherwise. The trade-off is that
  pointer effects and Lenis start a frame after hydration.

---

## ADR-007 — Lazy environment validation

**Status:** Accepted

**Context.** Eager validation at import time would fail `next build` and Vercel deploys in Phase 0,
where no database exists or is needed.

**Decision.** `getServerEnv()` parses with Zod on first use and caches the result.
`isDatabaseConfigured()` checks presence without throwing.

**Consequences.**

- Builds work without secrets.
- The first data-access call fails fast with a readable report.
- Once the data layer is live, add a startup check (e.g. in `instrumentation.ts`) so a
  misconfigured deploy fails at boot rather than on the first request.
