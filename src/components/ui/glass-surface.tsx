import type { ComponentPropsWithoutRef } from "react";
import type { GlassLevel } from "@/config/design";
import { cn } from "@/lib/utils";
import { InteractiveGlass } from "./interactive-glass";

export type GlassTone = GlassLevel | "ink";

const LEVEL: Record<GlassTone, string> = {
  quiet: "glass-quiet",
  elevated: "glass-elevated",
  hero: "glass-hero",
  ink: "glass-ink",
};

export function glassClassName(level: GlassTone): string {
  return cn("glass", LEVEL[level]);
}

/** Static specular highlight, parked at the top-left where the light source is. */
export function GlareLayer() {
  return (
    <span aria-hidden className="glass-glare-layer">
      <span className="glass-glare" />
    </span>
  );
}

type Interactivity = boolean | { tilt: boolean };

export type GlassSurfaceProps = ComponentPropsWithoutRef<"div"> & {
  /** Glass 1 (quiet) · Glass 2 (elevated) · Glass 3 (hero) · dark ink glass. */
  level?: GlassTone;
  /** Adds the specular glare. On by default for hero glass. */
  glare?: boolean;
  /** Pointer-reactive glare, optionally with a ≤1.5° tilt. Renders a client island. */
  interactive?: Interactivity;
};

/**
 * The PRISM glass material. A Server Component by default; only surfaces that react
 * to the pointer opt into the small `InteractiveGlass` client component.
 */
export function GlassSurface({
  level = "elevated",
  glare = level === "hero",
  interactive = false,
  className,
  children,
  ...props
}: GlassSurfaceProps) {
  const classes = cn(glassClassName(level), className);

  if (interactive) {
    const tilt = typeof interactive === "object" && interactive.tilt;
    return (
      <InteractiveGlass className={classes} tilt={tilt} {...props}>
        {children}
      </InteractiveGlass>
    );
  }

  return (
    <div className={classes} {...props}>
      {glare ? <GlareLayer /> : null}
      {children}
    </div>
  );
}

const BEZEL_RADIUS = {
  card: "bezel bezel-card",
  island: "bezel",
  panel: "bezel bezel-panel",
} as const;

type GlassBezelProps = GlassSurfaceProps & {
  radius?: keyof typeof BEZEL_RADIUS;
  coreClassName?: string;
};

/**
 * Double-bezel container: an outer glass shell, an optical gap, and an inner core.
 * Radii stay concentric (core radius = shell radius − gap), computed in CSS.
 *
 * Only the shell uses backdrop-filter. Nesting a second backdrop-filter inside it
 * would sample the shell rather than the page, so the core is a translucent fill.
 */
export function GlassBezel({ radius = "island", coreClassName, className, children, ...props }: GlassBezelProps) {
  return (
    <GlassSurface className={cn(BEZEL_RADIUS[radius], className)} {...props}>
      <div className={cn("bezel-core", coreClassName)}>{children}</div>
    </GlassSurface>
  );
}
