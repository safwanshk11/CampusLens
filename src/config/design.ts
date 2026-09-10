/**
 * PRISM — TypeScript-side design constants.
 *
 * Visual tokens (colour, glass, shadow, radius, type) live in `src/app/globals.css`,
 * which is the source of truth for anything CSS can express on its own.
 *
 * This file holds the values JavaScript needs at runtime: easing curves, durations,
 * interaction limits and choreography timings. Easing curves and durations are
 * mirrored in CSS as `--ease-*` / `--duration-*` — keep both in sync when editing.
 */

export type CubicBezier = readonly [number, number, number, number];

/**
 * The entire motion vocabulary. Every animation in the product uses one of these
 * five curves — in CSS (`ease-standard`), Framer Motion (`EASE.standard`) and GSAP
 * (`gsapEase("standard")`, registered through CustomEase).
 */
export const EASE = {
  /** UI state changes: hover, selection, colour, small toggles. */
  standard: [0.2, 0, 0, 1],
  /** Elements arriving on screen. Fast start, long settle. */
  entrance: [0.16, 1, 0.3, 1],
  /** Elements leaving. Quick acceleration, no lingering. */
  exit: [0.7, 0, 0.84, 0],
  /** Press and capsule feedback. A restrained overshoot — never a bounce. */
  spring: [0.3, 1.15, 0.5, 1],
  /** Staged moments: headline masks, sheet transitions, the nav morph. */
  cinematic: [0.65, 0.05, 0.1, 1],
} as const satisfies Record<string, CubicBezier>;

export type EaseName = keyof typeof EASE;
export const EASE_NAMES = Object.keys(EASE) as EaseName[];

/** Seconds (GSAP and Framer Motion). CSS mirrors these as `--duration-*` in ms. */
export const DURATION = {
  instant: 0.12,
  fast: 0.2,
  base: 0.36,
  slow: 0.64,
  cinematic: 1.1,
} as const;

export const NAV = {
  /** Scroll distance (px) after which the navigation morphs into the compact island. */
  scrollThreshold: 72,
} as const;

export const SCROLL = {
  /** Lenis interpolation factor. Lower is smoother and heavier. */
  lerp: 0.1,
  /** Space kept above anchor targets so the floating navigation never covers them. */
  anchorOffset: 96,
} as const;

export const MAGNETIC = {
  /** Hard ceiling on how far a magnetic CTA may travel toward the pointer (px). */
  maxOffset: 5,
  /** Fraction of the pointer's distance from centre applied before clamping. */
  pull: 0.2,
  spring: { stiffness: 240, damping: 24, mass: 0.5 },
} as const;

export const TILT = {
  /** Maximum rotation on either axis (deg). */
  maxDeg: 1.5,
  perspective: 1200,
} as const;

export const GLARE = {
  /** How far the specular highlight may travel, as a fraction of the surface size. */
  travel: 0.12,
} as const;

export const HERO = {
  /** If the hero choreography never boots, content is revealed after this long. */
  failsafeMs: 4000,
  /** Timeline positions (seconds) for the entrance sequence. */
  timeline: { badge: 0.1, headline: 0.25, copy: 0.5, island: 0.7, chips: 0.95 },
  /** Depth planes, as multiples of scroll speed. Typography is the 1.0 reference. */
  parallax: { ambient: 0.25, chips: 1.2, strength: 0.4 },
} as const;

export const STACK = {
  /** Where a sheet settles once the next sheet has covered it. */
  scaleTo: 0.95,
  /**
   * The covered sheet's *content* fades out. The glass surface itself stays opaque:
   * fading a backdrop-filter element's opacity leaks the unblurred backdrop through it.
   */
  contentOpacityTo: 0,
  /**
   * The covered sheet itself gains a CSS `filter: blur()`, in px, as it recedes.
   * This is a different operation from the opacity rule above — `filter` blurs the
   * sheet's own already-composited pixels as a post-process, it doesn't touch alpha,
   * so it never leaks the sharp backdrop through. Safe to combine with `backdrop-filter`.
   */
  sheetBlurTo: 8,
} as const;

export const REVEAL = {
  distance: 24,
  stagger: 0.08,
  start: "top 85%",
} as const;

export type GlassLevel = "quiet" | "elevated" | "hero";

type GlassLevelSpec = {
  readonly level: GlassLevel;
  readonly name: string;
  readonly blurToken: string;
  readonly fillToken: string;
  readonly usage: string;
};

export const GLASS_LEVELS: readonly GlassLevelSpec[] = [
  {
    level: "quiet",
    name: "Glass 1 · Quiet",
    blurToken: "--glass-blur-quiet",
    fillToken: "--glass-quiet",
    usage: "Filters, chips, small cards, utility surfaces.",
  },
  {
    level: "elevated",
    name: "Glass 2 · Elevated",
    blurToken: "--glass-blur-elevated",
    fillToken: "--glass-elevated",
    usage: "Navigation, college cards, search panel, comparison controls.",
  },
  {
    level: "hero",
    name: "Glass 3 · Liquid",
    blurToken: "--glass-blur-hero",
    fillToken: "--glass-hero",
    usage: "Hero search island and major reveal moments. Used sparingly.",
  },
];

/** Conceptual depth stack. Implemented as `--z-*` tokens and `z-*` utilities. */
export const DEPTH_LAYERS = [
  { token: "--z-canvas", name: "Z0 · Canvas", role: "Base environment colour" },
  { token: "--z-ambient", name: "Z1 · Ambient light", role: "Light blooms and refraction" },
  { token: "--z-grid", name: "Z2 · Grid", role: "Structural precision grid" },
  { token: "--z-content", name: "Z3 · Content", role: "Page content and glass surfaces" },
  { token: "--z-float", name: "Z4 · Floating", role: "Floating chips, popovers" },
  { token: "--z-nav", name: "Z5 · Navigation", role: "Detached navigation island" },
  { token: "--z-overlay", name: "Z6 · Overlay", role: "Modals, sheets, menus" },
  { token: "--z-grain", name: "Z7 · Grain", role: "Film grain over everything" },
] as const;
