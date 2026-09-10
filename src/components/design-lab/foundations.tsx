import { DEPTH_LAYERS, DURATION, EASE, GLASS_LEVELS, type CubicBezier } from "@/config/design";
import { cn } from "@/lib/utils";
import { LabGroup, LabSection, SpecimenCaption } from "./lab-section";
import { TokenValue } from "./token-value";

type ColorToken = { token: `--${string}`; name: string; role: string };

const COLOR_GROUPS: readonly { title: string; tokens: readonly ColorToken[] }[] = [
  {
    title: "Canvas & ink",
    tokens: [
      { token: "--canvas", name: "Canvas", role: "Page foundation" },
      { token: "--canvas-deep", name: "Canvas deep", role: "Recessed areas, table headers" },
      { token: "--ink", name: "Ink", role: "Primary text and actions · 17.6:1" },
      { token: "--ink-secondary", name: "Ink secondary", role: "Body copy · 7.2:1" },
      { token: "--ink-tertiary", name: "Ink tertiary", role: "Captions · 5.1:1" },
    ],
  },
  {
    title: "Environment light",
    tokens: [
      { token: "--ice", name: "Ice", role: "Glints, cyan bloom" },
      { token: "--azure", name: "Azure", role: "Accents, connectors, marks" },
      { token: "--indigo-mist", name: "Indigo mist", role: "Soft bloom, edge tint" },
    ],
  },
  {
    title: "Status fills",
    tokens: [
      { token: "--positive", name: "Positive", role: "Fills, meters" },
      { token: "--warning", name: "Warning", role: "Fills, rating stars" },
      { token: "--danger", name: "Danger", role: "Fills, error rings" },
    ],
  },
  {
    title: "Text-safe accents",
    tokens: [
      { token: "--azure-ink", name: "Azure ink", role: "Links, focus ring · 5.8:1" },
      { token: "--positive-ink", name: "Positive ink", role: "Success text · 5.0:1" },
      { token: "--warning-ink", name: "Warning ink", role: "Warning text · 5.0:1" },
      { token: "--danger-ink", name: "Danger ink", role: "Error text · 5.2:1" },
    ],
  },
];

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160] as const;

const RADII = [
  { className: "rounded-mark", token: "--radius-mark", usage: "Checkbox marks" },
  { className: "rounded-control", token: "--radius-control", usage: "Inputs, table cells" },
  { className: "rounded-tile", token: "--radius-tile", usage: "Small glass, tiles" },
  { className: "rounded-card", token: "--radius-card", usage: "Cards" },
  { className: "rounded-island", token: "--radius-island", usage: "Glass islands" },
  { className: "rounded-panel", token: "--radius-panel", usage: "Hero panels, sheets" },
  { className: "rounded-full", token: "--radius-pill", usage: "Pills, buttons" },
] as const;

const SHADOWS = [
  { className: "shadow-control", name: "control", usage: "Solid controls" },
  { className: "shadow-glass-1", name: "glass-1", usage: "Quiet glass" },
  { className: "shadow-glass-2", name: "glass-2", usage: "Elevated glass" },
  { className: "shadow-floating", name: "floating", usage: "Hero glass, chips" },
  { className: "shadow-modal", name: "modal", usage: "Overlays" },
] as const;

const TYPE_SCALE = [
  { className: "text-display-hero font-medium", token: "--text-display-hero", name: "Display hero", sample: "See clearly." },
  { className: "text-display-section font-medium", token: "--text-display-section", name: "Display section", sample: "Compare with care" },
  { className: "text-display-page font-medium", token: "--text-display-page", name: "Page heading", sample: "College search" },
  { className: "text-body-lg", token: "--text-body-lg", name: "Body large", sample: "Structured data that reads the same way for every college." },
  { className: "text-body", token: "--text-body", name: "Body", sample: "Fees, courses, placements and ratings in one consistent format." },
  { className: "text-label font-medium", token: "--text-label", name: "Label", sample: "Median package" },
  { className: "eyebrow", token: "--text-micro", name: "Eyebrow · Geist Mono", sample: "Section label" },
] as const;

function EaseCurve({ curve }: { curve: CubicBezier }) {
  const [x1, y1, x2, y2] = curve;
  const path = `M0 100 C ${x1 * 100} ${100 - y1 * 100} ${x2 * 100} ${100 - y2 * 100} 100 0`;
  return (
    <svg viewBox="-8 -24 116 148" aria-hidden className="h-28 w-full overflow-visible">
      <rect x="0" y="0" width="100" height="100" className="fill-none stroke-line" />
      <path d={path} className="fill-none stroke-ink" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Foundations() {
  return (
    <LabSection
      id="foundations"
      index="01"
      title="Foundations"
      description="Tokens are the only source of visual values. Components consume them through utilities; nothing hard-codes a colour, radius or shadow."
    >
      <LabGroup title="Colour" note="Contrast ratios measured against canvas">
        <div className="flex flex-col gap-10">
          {COLOR_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="eyebrow mb-4">{group.title}</p>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
                {group.tokens.map((color) => (
                  <li key={color.token} className="flex flex-col gap-3">
                    <span
                      aria-hidden
                      className="h-20 rounded-tile shadow-control ring-1 ring-line"
                      style={{ background: `var(${color.token})` }}
                    />
                    <SpecimenCaption name={color.name} detail={color.role} />
                    <TokenValue token={color.token} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </LabGroup>

      <LabGroup title="Glass tokens" note="Fill and blur per level">
        <ul className="grid gap-4 md:grid-cols-3">
          {GLASS_LEVELS.map((level) => (
            <li key={level.level} className="surface-solid flex flex-col gap-2 rounded-card p-5">
              <SpecimenCaption name={level.name} detail={level.usage} />
              <TokenValue token={level.fillToken as `--${string}`} />
              <TokenValue token={level.blurToken as `--${string}`} />
            </li>
          ))}
        </ul>
      </LabGroup>

      <LabGroup title="Typography" note="Geist for interface and data · Instrument Serif for editorial accents">
        <ul className="flex flex-col divide-y divide-line">
          {TYPE_SCALE.map((type) => (
            <li key={type.token} className="grid gap-3 py-6 first:pt-0 lg:grid-cols-12 lg:items-baseline lg:gap-8">
              <div className="flex flex-col gap-1 lg:col-span-3">
                <SpecimenCaption name={type.name} />
                <TokenValue token={type.token} />
              </div>
              <p className={cn("min-w-0 text-ink lg:col-span-9", type.className)}>{type.sample}</p>
            </li>
          ))}
          <li className="grid gap-3 py-6 lg:grid-cols-12 lg:items-baseline lg:gap-8">
            <SpecimenCaption name="Editorial accent" detail="type-serif-accent inside Geist" className="lg:col-span-3" />
            <p className="text-display-page font-medium text-ink lg:col-span-9">
              See your options <span className="type-serif-accent">clearly.</span>
            </p>
          </li>
          <li className="grid gap-3 py-6 lg:grid-cols-12 lg:items-baseline lg:gap-8">
            <SpecimenCaption name="Numerals" detail="tabular-nums for aligned data" className="lg:col-span-3" />
            <p className="text-2xl font-semibold tracking-heading text-ink tabular-nums lg:col-span-9">
              ₹2,40,000 · ₹11,50,000 · 88% · 4.6
            </p>
          </li>
        </ul>
      </LabGroup>

      <LabGroup title="Spacing" note="4px base rhythm">
        <ul className="flex flex-col gap-2.5">
          {SPACING.map((space) => (
            <li key={space} className="flex items-center gap-4">
              <span className="w-10 text-right font-mono text-micro text-ink-tertiary tabular-nums">{space}</span>
              <span aria-hidden className="h-2.5 rounded-full bg-ink" style={{ width: space }} />
            </li>
          ))}
        </ul>
      </LabGroup>

      <LabGroup title="Radius" note="Semantic, never arbitrary">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {RADII.map((radius) => (
            <li key={radius.className} className="flex flex-col gap-3">
              <span aria-hidden className={cn("h-20 bg-surface shadow-control ring-1 ring-line", radius.className)} />
              <SpecimenCaption name={radius.className} detail={radius.usage} />
            </li>
          ))}
        </ul>
      </LabGroup>

      <LabGroup title="Shadow" note="Multi-layer: ambient + contact + inset highlight">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {SHADOWS.map((shadow) => (
            <li key={shadow.className} className="flex flex-col gap-4">
              <span aria-hidden className={cn("h-24 rounded-card bg-surface", shadow.className)} />
              <SpecimenCaption name={shadow.name} detail={shadow.usage} />
            </li>
          ))}
        </ul>
      </LabGroup>

      <LabGroup title="Motion vocabulary" note="Five curves shared by CSS, GSAP and Framer Motion">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {(Object.keys(EASE) as (keyof typeof EASE)[]).map((name) => (
            <li key={name} className="surface-solid flex flex-col gap-3 rounded-card p-4">
              <EaseCurve curve={EASE[name]} />
              <SpecimenCaption name={name} detail={`cubic-bezier(${EASE[name].join(", ")})`} />
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-micro text-ink-tertiary">
          Durations ·{" "}
          {Object.entries(DURATION)
            .map(([name, seconds]) => `${name} ${Math.round(seconds * 1000)}ms`)
            .join(" · ")}
        </p>
      </LabGroup>

      <LabGroup title="Depth" note="Named layers replace ad-hoc z-index values">
        <ol className="flex flex-col-reverse gap-2">
          {DEPTH_LAYERS.map((layer, index) => (
            <li
              key={layer.token}
              className="surface-solid flex flex-wrap items-center justify-between gap-2 rounded-control px-4 py-3"
              style={{ marginInlineStart: `${index * 12}px` }}
            >
              <SpecimenCaption name={layer.name} detail={layer.role} />
              <TokenValue token={layer.token} />
            </li>
          ))}
        </ol>
      </LabGroup>
    </LabSection>
  );
}
