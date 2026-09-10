import { Bookmark } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { GlassBezel, GlassSurface } from "@/components/ui/glass-surface";
import { Wordmark } from "@/components/visual/brand-mark";
import { cn } from "@/lib/utils";
import { LabGroup, LabSection, SpecimenCaption } from "./lab-section";
import { TokenValue } from "./token-value";

/**
 * A deliberately loud backdrop — saturated shapes, stripes and large type — so the
 * blur, saturation and edge light of each glass level are easy to judge.
 * Real pages sit on the much quieter ambient scene.
 */
function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-panel bg-canvas-deep p-5 sm:p-8 lg:p-12", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute -left-12 top-8 size-56 rounded-full bg-ice" />
        <span className="absolute right-[10%] top-[16%] size-72 rounded-full bg-indigo-mist" />
        <span className="absolute -bottom-20 left-[34%] size-64 rounded-full bg-azure/70" />
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[clamp(4.5rem,15vw,13rem)] leading-none whitespace-nowrap text-ink/80 italic">
          See clearly
        </span>
        <span className="absolute inset-0 bg-[repeating-linear-gradient(135deg,var(--line-strong)_0_1px,transparent_1px_18px)]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function GlassCopy({ name, usage, tokens, inverse = false }: { name: string; usage: string; tokens: `--${string}`[]; inverse?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-2">
      <span className={cn("text-lg font-medium tracking-heading", inverse ? "text-white" : "text-ink")}>{name}</span>
      <span className={cn("text-label", inverse ? "text-white/75" : "text-ink-secondary")}>{usage}</span>
      <span className="mt-auto flex flex-col gap-0.5 pt-4">
        {tokens.map((token) => (
          <TokenValue key={token} token={token} className={inverse ? "text-white/70" : "text-ink-secondary"} />
        ))}
      </span>
    </div>
  );
}

export function GlassLab() {
  return (
    <LabSection
      id="glass"
      index="02"
      title="Glass lab"
      description="Glass creates hierarchy, not decoration. Three levels, a double bezel, a dark variant and the floating island — each with the same top-left light."
    >
      <LabGroup title="Levels and constructions" note="Move the pointer over Glass 3">
        <Stage>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <GlassSurface level="quiet" className="min-h-48 rounded-card p-6">
              <GlassCopy
                name="Glass 1 · Quiet"
                usage="Filters, chips, small cards"
                tokens={["--glass-quiet", "--glass-blur-quiet"]}
              />
            </GlassSurface>

            <GlassSurface level="elevated" className="min-h-48 rounded-card p-6">
              <GlassCopy
                name="Glass 2 · Elevated"
                usage="Navigation, college cards, panels"
                tokens={["--glass-elevated", "--glass-blur-elevated"]}
              />
            </GlassSurface>

            <GlassSurface level="hero" interactive className="glass-responsive min-h-48 rounded-island p-6">
              <GlassCopy
                name="Glass 3 · Liquid"
                usage="Hero search island, reveal moments"
                tokens={["--glass-hero", "--glass-blur-hero"]}
              />
            </GlassSurface>

            <GlassBezel level="elevated" radius="card" coreClassName="min-h-48 p-5">
              <GlassCopy
                name="Double bezel"
                usage="Shell · 4px optical gap · core. Concentric radii."
                tokens={["--radius-card", "--bezel-gap-card"]}
              />
            </GlassBezel>

            <GlassSurface level="ink" className="min-h-48 rounded-card p-6">
              <GlassCopy
                name="Ink glass"
                usage="Dark content over bright scenes"
                tokens={["--glass-ink"]}
                inverse
              />
            </GlassSurface>

            <div className="flex flex-col justify-center gap-4">
              <GlassSurface level="elevated" className="flex h-14 items-center justify-between gap-3 rounded-full pl-4 pr-2">
                <Wordmark />
                <Button size="sm" variant="primary">
                  <Bookmark aria-hidden className="size-3.5" strokeWidth={2} />
                  Saved
                </Button>
              </GlassSurface>
              <SpecimenCaption name="Elevated island" detail="The navigation's compact state" />
            </div>
          </div>
        </Stage>
      </LabGroup>

      <LabGroup title="Anatomy" note="Layer order, back to front">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Environment", "Ambient blooms, grid and canvas behind the surface."],
            ["Fill + backdrop blur", "Translucent fill, blur and saturation per level."],
            ["Sheen · ::after", "Broad top-down reflection."],
            ["Specular edge · ::before", "Masked 1px gradient ring, brightest top-left."],
            ["Glare", "Radial highlight moved only with transform."],
            ["Inner highlight", "Inset top shadow on the core."],
            ["Shadow", "Soft ambient + contact + environmental bounce."],
            ["Content", "Always on top, always full contrast."],
          ].map(([name, detail], index) => (
            <li key={name} className="surface-solid flex gap-3 rounded-control p-4">
              <span className="font-mono text-micro text-ink-tertiary tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <SpecimenCaption name={name} detail={detail} />
            </li>
          ))}
        </ol>
      </LabGroup>
    </LabSection>
  );
}
