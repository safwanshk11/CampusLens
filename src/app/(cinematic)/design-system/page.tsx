import { CollegeCard } from "@/components/discover/college-card";
import type { Metadata } from "next";
import { CardsLab } from "@/components/design-lab/cards-lab";
import { ControlsLab } from "@/components/design-lab/controls-lab";
import { Foundations } from "@/components/design-lab/foundations";
import { GlassLab } from "@/components/design-lab/glass-lab";
import { MotionLab } from "@/components/design-lab/motion-lab";
import { StatesLab } from "@/components/design-lab/states-lab";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "PRISM design system",
  description:
    "The visual contract for CampusLens: tokens, liquid glass, controls, cards, motion and states.",
  robots: { index: false },
};

const SECTIONS = [
  { id: "foundations", label: "Foundations" },
  { id: "glass", label: "Glass lab" },
  { id: "controls", label: "Controls" },
  { id: "cards", label: "Cards" },
  { id: "discovery-card", label: "Discovery card" },
  { id: "motion", label: "Motion" },
  { id: "states", label: "States" },
] as const;

export default function DesignSystemPage() {
  return (
    <Container size="wide" className="pb-16 pt-32 lg:pt-40">
      <header className="flex flex-col gap-6 border-b border-line pb-12">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="ink" dot>
            PRISM v0.1
          </Badge>
          <Badge tone="glass">Phase 0</Badge>
          <Badge tone="glass">Visual contract</Badge>
        </div>
        <h1 className="text-display-hero font-medium text-ink">
          PRISM<span className="type-serif-accent">.</span>
        </h1>
        <p className="max-w-2xl text-body-lg text-pretty text-ink-secondary">
          <span className="font-medium text-ink">
            Premium Responsive Interface System for Modern discovery.
          </span>{" "}
          The internal studio where CampusLens&apos; tokens, glass, controls and
          motion are defined. Later phases build only from what is on this page.
        </p>

        <nav
          aria-label="Design system sections"
          className="-mx-5 overflow-x-auto px-5 lg:hidden"
        >
          <ul className="flex gap-2">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="glass glass-quiet inline-flex h-10 items-center whitespace-nowrap rounded-full px-4 text-label font-medium text-ink-secondary pointer-coarse:h-11"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <nav aria-label="Design system sections" className="sticky top-28">
            <ol className="flex flex-col gap-1 border-l border-line">
              {SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px flex h-10 items-center gap-3 border-l border-transparent pl-4 text-label text-ink-secondary transition-colors duration-(--duration-fast) ease-standard hover:border-ink hover:text-ink"
                  >
                    <span className="font-mono text-micro text-ink-tertiary tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0">
          <Foundations />
          <GlassLab />
          <ControlsLab />
          <CardsLab />
          <section id="discovery-card" className="scroll-mt-32 py-12">
            <h2 className="mb-3 text-2xl font-medium">Discovery card</h2>
            <p className="mb-6 text-body text-ink-secondary">
              Solid intelligence surface. Illustrative fixture; missing data
              remains explicit.
            </p>
            <div className="max-w-lg">
              <CollegeCard
                college={{
                  id: "lab-discovery",
                  slug: "specimen",
                  name: "Aurora Institute of Technology",
                  city: "Bengaluru",
                  state: "Karnataka",
                  ownership: "PUBLIC",
                  isDemo: true,
                  imageUrl: null,
                  minAnnualFeeInr: 40000,
                  maxAnnualFeeInr: 64000,
                  matchingCourseCount: 3,
                  averageRating: null,
                  reviewCount: 0,
                  placementYear: null,
                  medianSalaryInr: null,
                }}
              />
            </div>
          </section>
          <MotionLab />
          <StatesLab />
        </div>
      </div>
    </Container>
  );
}
