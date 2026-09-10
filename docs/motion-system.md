# Motion System

Motion in CampusLens communicates **hierarchy** (what matters, what is in front) and **state** (what
changed). Anything that does neither is removed.

## 1. Ownership: one library per class of animation

| Owner | Responsible for | Never used for |
|---|---|---|
| **GSAP + ScrollTrigger + CustomEase** | Timelines, hero staging, masked text reveals, parallax, scroll-scrubbed transforms, sticky-stack choreography, SVG path drawing | Hover states, React presence |
| **Lenis** | Inertial wheel scrolling, driven by GSAP's ticker | Touch scrolling (stays native), anything with reduced motion |
| **Framer Motion** (`LazyMotion` + `m`) | React-state animation: mobile-menu presence, menu-glyph morph, compare-tray presence and layout, magnetic spring | Scroll choreography |
| **CSS** | Hover, focus, press, colour, nav morph, button capsule, save compression, skeleton sweep, ambient drift and chip float loops | Sequenced timelines |

Anime.js is intentionally not installed. Nothing in Phase 0 needs SVG morphing beyond what GSAP
covers.

## 2. Easing vocabulary

Five curves. They are defined once in `src/config/design.ts` (`EASE`), mirrored in CSS as
`--ease-*`, and registered in GSAP through CustomEase as `prism-*` in `src/lib/gsap.ts`.

| Name | cubic-bezier | Character | Used for |
|---|---|---|---|
| `standard` | 0.2, 0, 0, 1 | Quick, settled | Hover, colour, toggles, menu overlay |
| `entrance` | 0.16, 1, 0.3, 1 | Fast start, long settle | Elements arriving: reveals, island rise, chips, sheet open |
| `exit` | 0.7, 0, 0.84, 0 | Accelerates away | Sheet close |
| `spring` | 0.3, 1.15, 0.5, 1 | Tiny overshoot, **no bounce** | Button capsule, save-heart press, check reveal |
| `cinematic` | 0.65, 0.05, 0.1, 1 | Slow build, long glide | Headline masks, nav morph, menu-glyph morph |

Durations (seconds in JS, ms in CSS): `instant` 0.12 · `fast` 0.2 · `base` 0.36 · `slow` 0.64 ·
`cinematic` 1.1.

GSAP ease names are hyphenated (`prism-entrance`) because GSAP parses `a.b` as family and type (like
`power2.out`).

## 3. Animation inventory

For each animation: **what** moves, **why**, **who** controls it, what happens on **mobile**, and
what happens with **reduced motion**.

| Animation | What moves | Why | Owner | Mobile | Reduced motion |
|---|---|---|---|---|---|
| Hero entrance | Badge → headline lines → copy/CTAs → search island → data chips → promise rail, staged 0.1s–1.5s | Establishes reading order and depth on arrival | GSAP timeline (`HeroMotion`) | Same sequence, no parallax | Skipped; hero renders in its final state |
| Headline mask reveal | Each line rises from `yPercent 110` inside an `overflow: clip` wrapper | Kinetic type without a generic fade | GSAP (`cinematic` ease) | Same | Static |
| Hero parallax | Lens ring plane (0.25×) drifts down; chip plane (1.2×) drifts up; type is the 1.0 reference | Three depth planes make the glass feel spatial | GSAP ScrollTrigger scrub | **Disabled** (desktop ≥ 1024px only) | Disabled |
| Floating chips | Chips bob 10px over 9s | Suggests they hover in front of the island | CSS keyframes (`float-slow`) | Same (cheap, compositor-only) | Stopped |
| Ambient drift | Light-orb wrappers translate and scale over 64–80s | The environment feels alive without drawing attention | CSS keyframes | Blur scaled to 55%, one orb hidden | Stopped |
| Nav morph | Glass plate fades in; brand and actions slide inward by `--nav-shift`; bar moves up 8px | Signals the move from open page to scrolled product | CSS transitions keyed off `data-scrolled` (set via `useSyncExternalStore`) | Plate fades in only; no inward slide | Transitions stay (they express state) |
| Mobile menu | Overlay fades; glass sheet scales from 0.98 and drops in; links stagger up | Sheet emerges from the nav it replaces | Framer Motion `AnimatePresence` + Radix Dialog | — (mobile only) | `MotionConfig reducedMotion="user"` drops transforms; opacity remains |
| Menu glyph | Two bars rotate ±45° into an X | Morph instead of an icon swap | Framer Motion variants | — | Transform skipped; the X is shown |
| Search island | Edge brightens, core clarifies, glare follows pointer (±12%), action nudges forward 2px | The surface responds physically to attention | CSS + `InteractiveGlass` (rAF, transform only) | Hover/pointer effects off; focus states remain | Pointer glare off; focus and edge changes remain |
| Magnetic CTA | Button translates ≤ 5px toward the pointer, springs back | Adds weight to the primary action | Framer Motion `useSpring` motion values | Off (touch) | Off |
| Card tilt (lab) | Card rotates ≤ 1.5° on each axis | Demonstrates restrained 3D | `InteractiveGlass` | Off | Off |
| Button feedback | Lift 1px; capsule shifts 2px and arrow rotates 45°; press scales 0.98 | Tactile affordance | CSS | Hover not applicable; press remains | Transforms off (`motion-safe:`); colour remains |
| Kinetic statement | Words go from 16% to full opacity in reading order, scrubbed | The single scroll-reading moment | GSAP ScrollTrigger scrub | Same | Full contrast from the start |
| Scroll reveal | Glass cards rise 24px and fade in, staggered, once | Paces content as it enters | GSAP (`Reveal`) | Same | Visible immediately |
| Sticky stack | Equal-height sheets pin (CSS sticky); the covered sheet scales to 0.95 and its *content* fades out (the glass never fades, so nothing shows through); progress rule fills | Layered glass sheets: the strongest scroll moment | CSS sticky + GSAP scrub | **Plain stacked list** (no sticky, no scrub) | Plain stacked list |
| Flow connector | SVG path draws via `stroke-dashoffset`; nodes rise | Visualises Search → Inspect → Compare → Save | GSAP ScrollTrigger | Vertical rule scales via `scaleY` (transform) | Path fully drawn, nodes visible |
| Save toggle | Heart compresses to 0.78, then fills | State change felt, not just seen | CSS keyframe on state change | Same | Fill changes, no compression |
| Compare check | Mark fills; check scales from 0.5 | Reveal matches the meaning | CSS transitions (`spring`) | Same | Instant state |
| Compare tray (lab) | Chips enter and leave; neighbours reflow | Layout continuity | Framer Motion `layout` + presence (`domMax` loaded only here) | Same | Layout transforms skipped |
| Skeleton | A soft light band sweeps across | Low-key loading signal | CSS keyframe | Same | Stopped |

## 4. Smooth scroll and ScrollTrigger

`src/components/motion/smooth-scroll.tsx`:

```ts
const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: false, allowNestedScroll: true });
lenis.on("scroll", () => ScrollTrigger.update());      // ① keep triggers in sync
gsap.ticker.add((time) => lenis.raf(time * 1000));     // ② one clock for both
gsap.ticker.lagSmoothing(0);                           // ③ no catch-up jumps while scrolling
```

- **Why no `scrollerProxy`:** Lenis scrolls the real window, so ScrollTrigger reads the true
  `scrollY`.
- **Why the GSAP ticker drives Lenis:** smooth scroll and scrubbed tweens are computed in the same
  frame and can never drift a frame apart.
- **Scrubs use `scrub: true`, not a number.** Lenis already smooths input; a numeric scrub would
  stack a second lag on top.
- **Anchors:** a document-level click handler smooth-scrolls same-page `#links` with a 96px offset,
  updates the URL, then **moves focus to the target**. Lenis' built-in anchor handling scrolls but
  leaves keyboard focus behind.
- **Keyboard, touch and forms:** Lenis doesn't intercept keys (PageDown and Space scroll natively)
  and leaves touch native (`syncTouch` off). Scrollable overlays carry `data-lenis-prevent`.
- **Overlays:** Radix locks native scroll, but Lenis scrolls programmatically and would ignore that
  lock. The mobile menu calls `smoothScrollControls.stop()` while open and `start()` on close.
- **Cleanup:** the ticker callback is removed, lag smoothing restored and Lenis destroyed on unmount.

## 5. Reduced motion: one decision, three layers

| Layer | Mechanism | Covers |
|---|---|---|
| CSS | `@media (prefers-reduced-motion: reduce)` stops keyframe loops (ambient drift, chip float, shimmer). Hover transforms use `motion-safe:` variants. | Everything CSS-driven |
| GSAP | Every choreography registers inside `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`. If the preference flips at runtime, GSAP reverts the tweens. | Hero, parallax, reveals, statement, stack, flow |
| React | `usePrefersReducedMotion()` / `usePointerEffects()` (`useSyncExternalStore` over `matchMedia`) gate Lenis, magnetic, glare and tilt. `MotionConfig reducedMotion="user"` makes Framer drop transform and layout animation. | Lenis, pointer effects, Framer |

The server snapshot for reduced motion is `true`. Hydration assumes **no motion** until the client
confirms motion is welcome, so a reduced-motion user never sees Lenis or pointer effects boot.

**What is preserved:** colour, fill, opacity and focus transitions. They carry state, so they stay.

## 6. First paint: no flash, no trap

Problem: server HTML paints before JavaScript loads. Without a guard, the hero appears fully formed,
then disappears, then animates in.

1. An inline script in `<head>` sets `html[data-js]` before first paint.
2. CSS (motion-OK only) hides `[data-hero]` elements and pushes `[data-hero-line] > span` below their
   masks while `html[data-js]:not([data-hero-ready])`.
3. `HeroMotion` sets GSAP start states inline (in a layout effect, before paint), then adds
   `data-hero-ready`, which releases the CSS guard.
4. **Failsafe:** the same inline script sets `data-hero-ready` after 4 seconds regardless. A script
   error or very slow network can never leave the hero invisible.

`<html suppressHydrationWarning>` is required because the script modifies attributes React
hydrates.

## 7. Performance constraints

- **Animate `transform` and `opacity`.** Do not scroll-animate width, height, top, left, blur or
  box-shadow.
  - Exception 1: the flow connector's `stroke-dashoffset`, a tiny SVG path repaint.
  - Exception 2: word opacity on inline text in the kinetic statement.
- **Nav morph without layout.** Width is never animated. Brand and actions translate by
  `--nav-shift`, computed in CSS with container-query units:
  `max(0px, (min(100cqw, 1280px) − 760px) / 2)`.
- **Blur is rasterised once.** Light orbs apply `filter: blur()` to a child and drift the parent
  with `transform` (`will-change: transform` on the parent only), so the blurred texture is cached
  and moved on the compositor.
- **Fixed decorative planes** (canvas, orbs, grid, grain) never repaint on scroll.
  `pointer-events: none` on all of them.
- **Pointer effects don't re-render React.** `InteractiveGlass` coalesces pointer moves into one rAF,
  does one layout read then transform writes through refs. `Magnetic` writes to motion values.
- **Nav scroll state** uses `useSyncExternalStore`, which re-renders only when the boolean crosses
  the threshold, not on every scroll event.
- **No persistent JS loops of our own.** Infinite loops are CSS keyframes on the compositor. The one
  steady tick is GSAP's ticker driving Lenis (idle-cheap), and it isn't mounted with reduced motion.
- **Sticky, not pinned.** The stack uses CSS `position: sticky` instead of ScrollTrigger pinning. No
  pin-spacer reflow, and the browser handles it.
- **Cleanup.** Every GSAP island uses `useGSAP` (a scoped `gsap.context`) and `gsap.matchMedia()`.
  Unmounting reverts every tween and kills every ScrollTrigger it created.
- **Bundle discipline.** Framer Motion loads `domAnimation` globally (`strict` forbids the heavier
  `motion.*`). `domMax` (layout animations) is loaded only by the lab's compare tray.

## 8. Mobile degradation

| Desktop | Mobile (< 1024px unless noted) |
|---|---|
| Hero parallax, three planes | None |
| Chips absolutely placed around the island | Chips wrap in a row beneath it |
| Sticky glass stack with scale/dim scrub | Simple list of sheets |
| Curved SVG connector | Vertical rule scaling with scroll |
| Nav: inward slide + plate | Plate only; full-screen glass sheet menu (< 768px) |
| Pointer glare, tilt, magnetic | Off on touch devices at any width |
| Orb blur 110–180px, four orbs | Blur × 0.55, three orbs |

The premium feel on mobile comes from type, spacing and surface quality, not expensive effects.
