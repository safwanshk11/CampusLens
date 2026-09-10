import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type OrbTone = "cyan" | "indigo" | "white" | "aqua" | "azure";

const TONE: Record<OrbTone, string> = {
  cyan: "var(--ambient-cyan)",
  indigo: "var(--ambient-indigo)",
  white: "var(--ambient-white)",
  aqua: "var(--ambient-aqua)",
  azure: "var(--ambient-azure)",
};

type CSSVariables = CSSProperties & Record<`--${string}`, string>;

export type LightOrbProps = {
  tone: OrbTone;
  /** Diameter in vw. */
  size: number;
  /** Centre as a percentage of the parent. Values outside 0–100 push the orb off-canvas. */
  x: number;
  y: number;
  /** Blur radius in px on desktop (scaled down on small screens). */
  blur: number;
  opacity?: number;
  /** Seconds per drift cycle. Omit for a static orb. */
  drift?: number;
  /** Seconds into the drift cycle to start, so orbs never move in unison. */
  phase?: number;
  className?: string;
};

/**
 * A single atmospheric light bloom. The blurred layer is rasterised once;
 * drift animates only the wrapper's transform on the compositor, so the
 * expensive blur is never recalculated per frame.
 */
export function LightOrb({ tone, size, x, y, blur, opacity = 1, drift, phase = 0, className }: LightOrbProps) {
  const style: CSSVariables = {
    left: `${x}%`,
    top: `${y}%`,
    width: `max(${size}vw, ${Math.round(size * 7)}px)`,
    opacity,
    "--orb-color": TONE[tone],
    "--orb-blur": `${blur}px`,
  };

  if (drift) {
    style.animationDuration = `${drift}s`;
    style.animationDelay = `${-phase}s`;
  }

  return (
    <div className={cn("light-orb-anchor", drift && "light-orb-drift", className)} style={style}>
      <div className="light-orb" />
    </div>
  );
}
