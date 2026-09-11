import { ArrowDown, ArrowUpRight, MapPin, Star, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { SearchIsland } from "@/components/ui/search-island";
import { Magnetic } from "@/components/visual/magnetic";
import { cn } from "@/lib/utils";
import { HeroMotion } from "./hero-motion";

type FloatingChip = {
  id: string;
  icon: LucideIcon;
  value: string;
  unit?: string;
  /** Desktop placement around the search island, clear of the headline and copy. */
  position: string;
  floatDelay: string;
  /** A small, deliberate touch of colour — one semantic accent per meaning, not decoration. */
  tone: "azure-ink" | "warning-ink" | "positive-ink" | "ink";
};

/** Illustrative values only — labelled as such beneath the island. */
const CHIPS: readonly FloatingChip[] = [
  { id: "fees", icon: Wallet, value: "₹2.4L", unit: "/ year", position: "lg:-top-16 lg:right-8", floatDelay: "1.8s", tone: "azure-ink" },
  { id: "rating", icon: Star, value: "4.6", unit: "rating", position: "lg:-bottom-16 lg:left-10", floatDelay: "2.6s", tone: "warning-ink" },
  { id: "placed", icon: TrendingUp, value: "93%", unit: "placed", position: "lg:-bottom-9 lg:right-16", floatDelay: "3s", tone: "positive-ink" },
  { id: "city", icon: MapPin, value: "Bengaluru", position: "lg:hidden", floatDelay: "2.2s", tone: "ink" },
];

const CHIP_TONE: Record<FloatingChip["tone"], string> = {
  "azure-ink": "bg-azure-ink",
  "warning-ink": "bg-warning-ink",
  "positive-ink": "bg-positive-ink",
  ink: "bg-ink",
};

const PROMISES = [
  { index: "01", title: "Structured profiles", detail: "Fees, courses, placements and ratings in one consistent format." },
  { index: "02", title: "Honest comparisons", detail: "Colleges aligned field by field, with differences made obvious." },
  { index: "03", title: "A private shortlist", detail: "Save what fits and come back to it when you are ready." },
] as const;

/** Oversized lens rings behind the composition — the brand mark's geometry at room scale. */
function HeroLens() {
  return (
    <div
      aria-hidden
      data-depth="ambient"
      className="pointer-events-none absolute -right-[16vw] top-[4vh] w-[64vw] max-w-[1040px] max-lg:hidden"
    >
      <svg viewBox="0 0 100 100" className="w-full overflow-visible">
        <defs>
          <linearGradient id="hero-lens-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--surface)" }} />
            <stop offset="45%" style={{ stopColor: "var(--ink)", stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: "var(--ink)", stopOpacity: 0.02 }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#hero-lens-edge)" strokeWidth="0.25" />
        <circle cx="50" cy="50" r="33" fill="none" stroke="url(#hero-lens-edge)" strokeWidth="0.15" />
      </svg>
    </div>
  );
}

function DataChip({ chip }: { chip: FloatingChip }) {
  const Icon = chip.icon;
  return (
    // Three wrappers, three owners, no transform conflicts:
    // depth plane (GSAP parallax) → float (CSS loop) → glass chip (GSAP entrance).
    <div data-depth="chips" className={cn("lg:absolute", chip.position)}>
      <div className="float-slow" style={{ "--float-delay": chip.floatDelay } as CSSProperties}>
        <div
          data-hero="chip"
          className="glass glass-elevated flex h-11 items-center gap-2.5 rounded-full pl-1.5 pr-4 text-label"
        >
          <span className={cn("grid size-8 place-items-center rounded-full text-white", CHIP_TONE[chip.tone])}>
            <Icon aria-hidden className="size-3.5" strokeWidth={2} />
          </span>
          <span className="font-semibold text-ink tabular-nums">{chip.value}</span>
          {chip.unit ? <span className="text-ink-tertiary">{chip.unit}</span> : null}
        </div>
      </div>
    </div>
  );
}

export function Hero({ signedIn = false }: { signedIn?: boolean }) {
  const exploreHref = signedIn ? "/discover" : "/sign-in?next=%2Fdiscover";
  return (
    <HeroMotion aria-labelledby="hero-title" className="relative isolate overflow-x-clip">
      <HeroLens />

      <Container size="wide" className="relative pb-(--space-section-standard) pt-28 sm:pt-32 lg:pt-36">
        <p
          data-hero="badge"
          className="glass glass-quiet inline-flex h-10 items-center gap-3 rounded-full pl-2 pr-5 text-label text-ink-secondary"
        >
          <span aria-hidden className="grid size-6 place-items-center rounded-full bg-ink">
            <span className="size-1.5 rounded-full bg-ice" />
          </span>
          Don’t just pick a college.
        </p>

        {/*
          Positioned + z-10 so the headline paints above the search island where the
          "clearly." tail overlaps it. `pointer-events-none` keeps the (mostly empty)
          text block from intercepting clicks meant for the search input/button beneath.
        */}
        <h1 id="hero-title" className="relative z-10 mt-8 text-display-hero font-medium text-ink pointer-events-none">
          <span data-hero-line className="mask-line">
            <span>See your</span>
          </span>
          <span data-hero-line className="mask-line lg:pl-[0.9em]">
            <span>options</span>
          </span>
          <span data-hero-line className="mask-line lg:pl-[2.6em]">
            <span className="type-serif-accent">clearly.</span>
          </span>
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-y-12 lg:mt-6 lg:grid-cols-12 lg:gap-x-10">
          <div className="flex flex-col gap-8 lg:col-span-4 lg:row-start-1 lg:pt-8">
            <p data-hero="copy" className="max-w-measure text-body-lg text-pretty text-ink-secondary">
              Discover colleges through structured data, meaningful comparisons and a shortlist you can trust.
            </p>
            <div data-hero="copy" className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <ButtonLink href={exploreHref} size="lg" icon={ArrowUpRight}>
                  Explore colleges
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="#how-it-works" variant="ghost" size="lg">
                How it works
                <ArrowDown aria-hidden className="size-4" strokeWidth={1.75} />
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:-mt-8">
            {/* The island overlaps only the descender of the headline's last line. */}
            <div className="relative">
              <SearchIsland id="hero-search" action={exploreHref} shellProps={{ "data-hero": "island" }} />
              <div className="mt-5 flex flex-wrap gap-2 lg:contents">
                {CHIPS.map((chip) => (
                  <DataChip key={chip.id} chip={chip} />
                ))}
              </div>
            </div>

            <p data-hero="copy" className="mt-5 text-label text-ink-tertiary lg:mt-24 lg:text-right">
              Illustrative values
            </p>
          </div>
        </div>

        <ul data-hero="rail" className="mt-20 grid gap-8 border-t border-line pt-8 sm:grid-cols-3 lg:mt-28">
          {PROMISES.map((item) => (
            <li key={item.index} className="flex gap-4">
              <span className="pt-0.5 font-mono text-label text-ink-tertiary">{item.index}</span>
              <span className="flex flex-col gap-1.5">
                <span className="text-body font-medium text-ink">{item.title}</span>
                <span className="text-label text-ink-tertiary">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </HeroMotion>
  );
}
