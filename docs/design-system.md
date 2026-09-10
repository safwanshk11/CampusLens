# PRISM Design System

**P**remium **R**esponsive **I**nterface **S**ystem for **M**odern discovery.

PRISM is CampusLens' visual contract. Its tokens live in `src/app/globals.css`, its JS-side
constants in `src/config/design.ts`, and its living specimen is **`/design-system`**. Later phases
build from these primitives; they do not invent new visual values.

## Design read

> A high-trust college intelligence platform for ambitious students, with a cinematic editorial
> interface, liquid-glass depth, spatial motion, and information-dense product surfaces.

```text
DESIGN_VARIANCE     = 8/10
MOTION_INTENSITY    = 8/10
VISUAL_DENSITY      = 6/10
GLASS_INTENSITY     = 9/10
EDITORIAL_CHARACTER = 8/10
```

It should feel intelligent, precise, dimensional and calm beneath the spectacle. It should not feel
like cyberpunk, crypto, generic SaaS, a purple AI startup, or "glass everywhere".

---

## 1. Two visual regimes

| | **Cinematic mode** | **Intelligence mode** |
|---|---|---|
| Used for | Homepage, hero, navigation, section transitions, empty states, marketing and reveal moments | Search results, filters, detail data, fees, placements, compare tables, auth forms |
| Atmosphere | Full ambient scene: four blooms, refraction band, grid | Quiet wash: two faint blooms, faint grid, no refraction |
| Surfaces | Glass 2 and 3, double bezels | Solid (`surface-solid`), Glass 1 for utility chrome |
| Type | Oversized display, serif accents, editorial asymmetry | Geist throughout, tabular numerals, compact rhythm |
| Motion | Staged entrances, parallax, scroll choreography | State transitions only |

**Implementation:** route groups. `(cinematic)/layout.tsx` and `(product)/layout.tsx` render
`PageShell` with `mode="cinematic"` or `mode="intelligence"`.

**Rule:** glass creates hierarchy. If a number has to be read quickly, it sits on a solid surface or
on glass with full-contrast text and no decorative effects behind it.

---

## 2. Lighting model

One virtual light source sits **top-left, in front of the screen**. Consequences:

- Specular edges are brightest at the top-left and fade toward the bottom-right.
- Glare highlights rest at the top-left of a surface.
- The sheen falls from the top edge.
- Shadows fall down and slightly right, with a positive x offset in elevated shadows.
- The brand mark's glint sits at the top-left of the lens.

Light that stays consistent is what makes the glass read as a physical material.

---

## 3. Colour

Semantic tokens only. Raw colour values appear in `globals.css` and nowhere else. Tailwind's default
palettes are removed (`--color-*: initial`), so `bg-blue-500` generates nothing.

### Palette

| Token | Value | Role | Contrast on canvas |
|---|---|---|---|
| `--canvas` | `#F4F7FB` | Page foundation | — |
| `--canvas-deep` | `#EAF0F7` | Recessed areas, table heads | — |
| `--ink` | `#09111F` | Primary text, primary actions | 17.6:1 |
| `--ink-secondary` | `#455468` | Body copy | 7.2:1 |
| `--ink-tertiary` | `#5B6A80` | Captions, eyebrows | 5.1:1 |
| `--ice` | `#86DDF1` | Glints, cyan bloom | fill only |
| `--azure` | `#4D8DFF` | Accents, connectors, marks | fill only |
| `--indigo-mist` | `#A6A3E8` | Soft bloom, edge tint | fill only |
| `--positive` / `--warning` / `--danger` | `#16A36A` / `#D88A24` / `#DF5B5B` | Status fills, meters, rings | fill only |
| `--azure-ink` | `#2459C9` | Links, **focus ring** | 5.8:1 |
| `--positive-ink` / `--warning-ink` / `--danger-ink` | `#0E7A4E` / `#9A5B0E` / `#B83B3B` | Status **text** | ≥ 5.0:1 |

**Refinement:** the brief's starting `--ink-tertiary: #718096` measures 3.7:1 on canvas, which fails
WCAG AA. It was darkened to `#5B6A80`. Base accents fail as small text, so every accent has an
`-ink` twin, and badges and messages always use the `-ink` variant for text.

### Surface and line

`--surface` (white), `--surface-solid` (92% white), `--line` (ink 8%), `--line-strong` (ink 16%),
`--focus` (= `--azure-ink`).

### Ambient light

`--ambient-cyan`, `--ambient-indigo`, `--ambient-white`, `--ambient-aqua`, `--ambient-azure`.
These are translucent tints used only by light blooms and in-sheet light pools.

---

## 4. Liquid glass

### Anatomy (back to front)

```text
ambient environment            AmbientScene behind the page
        ↓
outer optical shell            .glass (position, isolation)
        ↓
translucent fill               background-color: var(--glass-fill)
        ↓
backdrop blur + saturation     backdrop-filter: blur() saturate()
        ↓
sheen                          ::after — broad top-down reflection
        ↓
specular edge                  ::before — masked 1px gradient ring
        ↓
glare                          .glass-glare — radial highlight, moved by transform
        ↓
inner highlight + shadow       inset top highlight, multi-layer shadow
        ↓
content                        always on top, full contrast
```

`.glass` sets `isolation: isolate`. Both pseudo-elements use `z-index: -1`, so they paint **above the
surface's own background but below its content**. Text is never washed out by reflections.

### Levels

| Level | Class | Fill | Blur | Saturate | Shadow | Use for |
|---|---|---|---|---|---|---|
| **Glass 1 · Quiet** | `glass glass-quiet` | white 46% | 14px | 115% | `glass-1` | Filters, chips, small cards, utility surfaces |
| **Glass 2 · Elevated** | `glass glass-elevated` | white 56% | 24px | 140% | `glass-2` | Navigation, college cards, search panel, compare controls |
| **Glass 3 · Liquid** | `glass glass-hero` | white 40% + ambient reflection gradients | 36px | 175% | `floating` | Hero search island, mobile menu sheet. **Sparingly.** |
| Ink glass | `glass glass-ink` | ink 80% | 24px | 175% | `floating` | Dark content over bright scenes |

Glass 3 appears exactly twice in the product: the hero search island and the mobile menu sheet. The
closing CTA deliberately uses Glass 2 in a double bezel instead.

**React API:** `<GlassSurface level="quiet | elevated | hero | ink" glare interactive>`. It is a
Server Component. `interactive` (or `interactive={{ tilt: true }}`) swaps in the `InteractiveGlass`
client island.

### Optical edge

The familiar trick below needs an **opaque** padding-box, which glass doesn't have:

```css
background: linear-gradient(...) padding-box, linear-gradient(...) border-box;
```

PRISM instead draws a 1px gradient ring on `::before` and cuts out the middle with a mask:

```css
padding: 1px;
background: var(--edge);                       /* e.g. --specular */
mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
```

`--specular` runs white (top-left) → ice cyan → near-transparent → pale indigo → soft white. It
suggests reflected environment light, not neon. The same `.edge-light` mechanism gives the primary
button and search action their specular rim (`--specular-button`).

### Glass rules

1. **No nested backdrop-filters.** A backdrop-filter inside another samples the parent surface, not
   the page. Double bezels blur the shell only; the core is a translucent fill.
2. **Never fade an ancestor of glass.** An ancestor with `opacity < 1`, `filter`, `mask`,
   `clip-path` or `mix-blend-mode` becomes a *Backdrop Root*, and the glass inside samples nothing
   for the length of the fade. Entrance animations target the glass element itself (see `Reveal
   stagger`).
3. **Never leave glass semi-transparent over content.** Opacity on a backdrop-filter element
   composites the *unblurred* backdrop back in at (1 − opacity). Covered stack sheets therefore
   fade their content, never the glass surface.
4. **No cards inside cards.** Previews and data inside a card use hairlines and type, not a second
   surface with its own background and shadow.
3. **Fallbacks:** without `backdrop-filter` support, or with
   `prefers-reduced-transparency: reduce`, glass becomes a solid 92% white surface.

---

## 5. Double bezel

```text
╭─ shell ─────────────────────────╮  radius R, glass, backdrop blur
│ ╭─ core ──────────────────────╮ │  gap G (4 / 5 / 6px)
│ │                             │ │  radius R − G  ← concentric
│ ╰─────────────────────────────╯ │
╰─────────────────────────────────╯
```

| Variant | Shell radius | Gap | Core radius |
|---|---|---|---|
| `card` | 22px | 4px | 18px |
| `island` | 28px | 5px | 23px |
| `panel` | 32px | 6px | 26px |

The core radius is **computed**, not typed: `calc(var(--bezel-radius) - var(--bezel-gap))`. The core
has a 78% white fill and an inset top highlight. On `:focus-within` it clarifies to 90% white, and
when its input is focused it draws the focus ring inside the gap.

**API:** `<GlassBezel level radius="card | island | panel" coreClassName>`.

**Used for:** hero search island, compare bento card, final CTA panel, glass-lab specimen. Not for
small elements.

---

## 6. Shadows

Multi-layer, named, never a universal `0 4px 6px rgba(0,0,0,.4)`.

| Token | Character |
|---|---|
| `shadow-control` | Tight contact shadow + inset highlight for solid controls |
| `shadow-glass-1` | Soft contact + short ambient shadow + inset highlight |
| `shadow-glass-2` | Contact + broad ambient shadow + **azure environmental bounce** + inset highlight |
| `shadow-floating` | Contact + large ambient shadow + **cyan bounce** + strong inset highlight |
| `shadow-modal` | Deep ambient shadow for overlays |

Tailwind's default shadow scale is removed.

---

## 7. Radius

| Token | px | Use |
|---|---|---|
| `rounded-mark` | 6 | Checkbox marks |
| `rounded-control` | 12 | Inputs, table cells, tiles in dense UI |
| `rounded-tile` | 16 | Small glass, swatches, preview frames |
| `rounded-card` | 22 | Cards |
| `rounded-island` | 28 | Glass islands |
| `rounded-panel` | 32 | Hero panels, sheets, stack sheets |
| `rounded-full` | 9999 | Pills, buttons, chips, icon buttons |

Tailwind's default radius scale is removed.

---

## 8. Spacing and layout

- **Base rhythm:** 4px. Preferred steps: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 ·
  128 · 160, which are Tailwind spacing units 1–40.
- **Section spacing tokens:**
  - `--space-section-cinematic`: 96 → 160px
  - `--space-section-standard`: 64 → 96px
  - `--space-section-compact`: 40 → 64px
- **Containers:**
  - `narrow` 56rem (896px)
  - `content` 80rem (1280px, the default)
  - `wide` 90rem (1440px, editorial pages)
  - `measure` 46ch for running text
- **Components:** `Container`, `Section spacing="cinematic | standard | compact"`, `PageShell mode`.
- **Composition:** asymmetric 12-column grids. No row of three identical cards: the bento sizes each
  card by feature importance (7 / 5 / 5 / 7).

---

## 9. Typography

| Family | Loaded via | Used for |
|---|---|---|
| **Geist** | `next/font/google` | Everything functional: navigation, buttons, inputs, body, labels, data, tables |
| **Instrument Serif** (400, normal + italic) | `next/font/google` | Editorial accents only: one word or phrase inside a headline, large decorative numerals |
| **Geist Mono** | `next/font/google` | Eyebrows, indices, token readouts |

### Scale

| Token | Size | Line height | Tracking |
|---|---|---|---|
| `text-display-hero` | `clamp(3.5rem, 8vw, 8.5rem)` | 0.90 | −0.055em |
| `text-display-section` | `clamp(2.6rem, 5vw, 5.5rem)` | 0.98 | −0.045em |
| `text-display-page` | `clamp(2rem, 3.8vw, 4rem)` | 1.02 | −0.035em |
| `text-body-lg` | 18 → 21px | 1.5 | — |
| `text-body` | 15 → 17px | 1.6 | — |
| `text-control` | 15px | 1.2 | — |
| `text-label` | 13px | 1.35 | — |
| `text-micro` / `.eyebrow` | 12px | 1.3 | +0.08em, uppercase mono |

### Rules

- Giant Geist display uses negative tracking; serif accents reset to near-normal tracking.
- `type-serif-accent` scales Instrument Serif to **1.12em**, because its x-height is smaller than
  Geist's.
- Numbers that are compared use `tabular-nums`.
- Headlines use `text-balance`, paragraphs use `text-pretty`.

---

## 10. Depth

| Layer | Token | Value | Contents |
|---|---|---|---|
| Z0 | `z-canvas` | 0 | Canvas gradient |
| Z1 | `z-ambient` | 10 | Light blooms, refraction |
| Z2 | `z-grid` | 20 | Structural grid |
| Z3 | `z-content` | 30 | `<main>`, footer, glass surfaces |
| Z4 | `z-float` | 40 | Floating chips, popovers |
| Z5 | `z-nav` | 50 | Navigation island |
| Z6 | `z-overlay` | 60 | Menus, modals, sheets, skip link |
| Z7 | `z-grain` | 70 | Film grain |

These `@utility` classes are the only z-index values in the codebase. Inside a glass surface, the
decorative layers use `z-index: -1` within the surface's own isolated stacking context.

---

## 11. Ambient scene

`components/visual/ambient-scene.tsx` renders five fixed, `aria-hidden`, `pointer-events: none`
planes:

1. **Canvas:** a radial near-white → canvas → canvas-deep gradient.
2. **Atmospheric light:** 2–4 `LightOrb`s at 42–66vw, blurred 110–180px, placed partly outside the
   viewport, drifting over 64–80s.
3. **Structural grid:** 1px lines every 72px at very low opacity, faded out with a radial mask.
4. **Grain:** a fixed SVG `feTurbulence` tile at 3% opacity.
5. **Refraction:** one broad diagonal band of light (cinematic only).

On mobile the orb blur scales to 55% and the fourth orb is hidden.

---

## 12. Iconography and brand

- **Lucide only.** Stroke width 1.75 by default (2–3 for tiny check marks). Sizes are 14, 16, 18 and
  20px (`size-3.5 · 4 · 4.5 · 5`).
- Icons are decorative (`aria-hidden`) unless they are the only content, in which case the button
  gets an `aria-label`. `IconButton` requires `label`.
- **Brand mark:** an inline SVG. An open lens ring reads as a **C**, three rising columns suggest a
  **campus**, and one ice-cyan glint sits top-left. The wordmark sets "Campus" in Geist and "Lens" in
  Instrument Serif italic.

---

## 13. Components

| Component | Notes |
|---|---|
| `Button`, `ButtonLink` | Variants: primary · glass · secondary · ghost · danger. Sizes: sm · md · lg. Optional `icon` renders a nested capsule that travels 2px and rotates the arrow 45° on hover. Hover lifts ≤ 1px; press scales to 0.98. |
| `IconButton` | glass · ghost · solid; required `label` |
| `GlassSurface`, `GlassBezel` | The glass material and the double-bezel construction |
| `SearchIsland` | Glass 3 bezel + input core + circular action; a native GET form |
| `Input` | Required `id` + `label`; `hint`, `error` (`aria-invalid`, `aria-describedby`), `icon`; solid or glass surface |
| `Chip` | `aria-pressed`; selected = ink fill + inverted text + check mark |
| `Badge` | neutral · accent · positive · warning · danger · glass · ink; optional dot |
| `Card` | quiet · elevated · solid; `interactive` for hover lift + edge light |
| `Skeleton`, `CollegeCardSkeleton` | Frosted placeholders with a slow light sweep |
| `EmptyState` | Spatial glass-tile object, headline, explanation, recovery action |
| `SectionHeading` | Mono index + eyebrow, display title, measured description |
| `SaveButton` | Stable label + `aria-pressed`; outline → compress → filled |
| `CompareCheck` | A real hidden checkbox; empty → soft fill → check reveal |
| `Magnetic` | ≤ 5px spring pull for one or two major CTAs per page |
| `Container`, `Section`, `PageShell` | Layout system |

### College card contract (for Phase 1)

In reading order:

1. Identity: name and save toggle
2. Location
3. Metadata: rating, ownership, established year
4. Course indicator
5. Two headline figures: fees per year, median package
6. Placement meter
7. Actions: compare and view details

Use elevated glass in cinematic contexts and `surface-solid` in result grids. Tilt is capped at 1.5°
and only on the glass variant.

---

## 14. State clarity

| State | Treatment |
|---|---|
| Hover | Colour shift + at most 1–2px lift; glass edge light rises to full |
| Focus | 2px `--focus` (azure-ink) outline, 3px offset. Inputs show a ring on their container. The search island shows a ring inside the bezel gap. |
| Active / press | Scale 0.98 (0.95 for icon buttons) |
| Selected | Solid ink fill, inverted text, check icon. Never a subtle opacity change. |
| Disabled | 45% opacity, `pointer-events: none` |
| Error | 2px danger-ink ring + icon + message wired with `aria-describedby` |
| Success | Positive-ink icon + message + undo |
| Loading | Skeleton with the same footprint as the loaded content |

---

## 15. Accessibility commitments

- Semantic landmarks: skip link → `<main id="main">`; labelled `<nav>` elements.
- Every input has a `<label>`. Icon-only buttons have an accessible name.
- Decorative planes, orbs, grain, lens ring and connectors are `aria-hidden`.
- Functional text meets WCAG AA (≥ 4.5:1). Contrast values are documented above.
- Touch targets are ≥ 44px on coarse pointers (`pointer-coarse:` variants on small controls).
- Animation never carries essential information. Reduced motion is honoured everywhere (see
  `motion-system.md`), and reduced transparency is honoured by glass.

---

## 16. Extending PRISM

1. Need a new colour, radius, shadow or type size? Add a token to `globals.css` and document it here
   and in the lab. Don't use an arbitrary value.
2. Need a new surface? Compose `GlassSurface`, `GlassBezel` or `Card`. Don't hand-roll
   `backdrop-filter`.
3. Need motion? Pick the owner from `motion-system.md` and a curve from the five-ease vocabulary.
4. Add the new piece to `/design-system` before using it in a feature.

## Phase 3 implementation

`CollegeCard` is the solid discovery result component, exhibited under Discovery card
in the lab. It composes existing Card and Badge primitives and uses native details
for fee context. `SearchForm` owns URL navigation; `FilterPanel` owns responsive disclosure.
Detail/save/compare actions are deferred to their functional phases.
