import { cn } from "@/lib/utils";
import { Grain } from "./grain";
import { LightOrb, type LightOrbProps } from "./light-orb";

export type AmbientVariant = "cinematic" | "intelligence";

/**
 * Bloom composition per visual regime. Orbs sit partly outside the viewport so
 * they read as light entering the frame, not as circles placed on it.
 * Cinematic pages get the full atmosphere; data pages get a quiet wash.
 */
const BLOOMS: Record<AmbientVariant, readonly LightOrbProps[]> = {
  cinematic: [
    { tone: "cyan", size: 60, x: 2, y: -6, blur: 170, opacity: 0.55, drift: 64 },
    { tone: "indigo", size: 50, x: 104, y: 40, blur: 180, opacity: 0.4, drift: 72, phase: 24 },
    { tone: "white", size: 44, x: 54, y: 18, blur: 140, opacity: 0.8 },
  ],
  intelligence: [
    { tone: "cyan", size: 46, x: 2, y: -6, blur: 150, opacity: 0.5 },
    { tone: "indigo", size: 40, x: 102, y: 72, blur: 160, opacity: 0.38 },
  ],
};

/**
 * The fixed environment every page sits in. Five decorative planes, all
 * `aria-hidden`, all `pointer-events: none`, all fixed so none of them repaint
 * while the page scrolls:
 *
 *   Z0 canvas → Z1 light blooms + refraction → Z2 grid … content … Z7 grain
 */
export function AmbientScene({ variant = "cinematic" }: { variant?: AmbientVariant }) {
  return (
    <>
      <div aria-hidden className="ambient-canvas pointer-events-none fixed inset-0 z-canvas" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-ambient overflow-hidden">
        {BLOOMS[variant].map((bloom) => (
          <LightOrb key={`${bloom.tone}-${bloom.x}-${bloom.y}`} {...bloom} />
        ))}
        {variant === "cinematic" ? <div className="ambient-refraction absolute inset-0" /> : null}
      </div>
      <div
        aria-hidden
        className={cn("ambient-grid pointer-events-none fixed inset-0 z-grid", variant === "intelligence" && "opacity-35")}
      />
      <Grain />
    </>
  );
}
