import { EASE, type EaseName } from "@/config/design";

/** Media queries shared by CSS-in-JS checks, `gsap.matchMedia()` and React hooks. */
export const MEDIA = {
  motionOK: "(prefers-reduced-motion: no-preference)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  /** A real mouse or trackpad. Pointer effects are disabled for touch. */
  finePointer: "(hover: hover) and (pointer: fine)",
  desktop: "(min-width: 1024px)",
} as const;

export function cssEase(name: EaseName): string {
  return `cubic-bezier(${EASE[name].join(", ")})`;
}

/**
 * GSAP ease name for a PRISM curve. Hyphenated on purpose: GSAP parses dots as
 * `family.type` (e.g. `power2.out`), so `prism.entrance` would not resolve.
 */
export function gsapEase(name: EaseName): string {
  return `prism-${name}`;
}
