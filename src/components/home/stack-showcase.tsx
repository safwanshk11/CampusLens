import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GlassSurface } from "@/components/ui/glass-surface";
import { SectionHeading } from "@/components/ui/section-heading";
import { ComparePreview, SearchPreview, ShortlistPreview } from "./previews";
import { StackMotion } from "./stack-motion";

type Step = {
  index: string;
  verb: string;
  title: string;
  body: string;
  preview: ReactNode;
};

const STEPS: readonly Step[] = [
  {
    index: "01",
    verb: "Discover",
    title: "Search the whole field",
    body: "Filter by course, city, fees and ratings. Every result carries the same structured fields, so nothing hides in a brochure.",
    preview: <SearchPreview />,
  },
  {
    index: "02",
    verb: "Compare",
    title: "Put them side by side",
    body: "Pick a few colleges and read them row by row. Differences in fees, placements and ratings become obvious.",
    preview: <ComparePreview />,
  },
  {
    index: "03",
    verb: "Shortlist",
    title: "Keep the ones that fit",
    body: "Save colleges to a private shortlist tied to your account and come back to it whenever you are ready.",
    preview: <ShortlistPreview />,
  },
];

/** Sticky offset per sheet, so each covered sheet leaves a visible edge above the next. */
const STICKY_BASE_REM = 7;
const STICKY_STEP_REM = 1.75;

export function StackShowcase() {
  return (
    <Section id="how-it-works" spacing="cinematic" aria-labelledby="how-title">
      <Container>
        <StackMotion className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                id="how-title"
                title={
                  <>
                    From a long list to a <span className="type-serif-accent">short</span> one.
                  </>
                }
                description="Three steps, one continuous flow. Each step narrows the field."
              />
              <div aria-hidden className="mt-10 hidden h-40 w-px overflow-hidden bg-line lg:block">
                <div data-stack-progress className="h-full w-full bg-ink" />
              </div>
            </div>
          </div>

          {/* Bottom padding keeps the final sheet pinned in its settled position before the section scrolls away. */}
          <ol data-stack-list className="flex flex-col gap-5 lg:col-span-8 lg:gap-0 lg:pb-[18vh]">
            {STEPS.map((step, index) => (
              <li
                key={step.index}
                data-stack-card
                className="lg:sticky lg:[&:not(:last-child)]:mb-[40vh]"
                style={{ top: `${STICKY_BASE_REM + index * STICKY_STEP_REM}rem` }}
              >
                {/* Equal fixed height on desktop so every sheet fully covers the one beneath it.
                    A stronger fill than standard Glass 2: these sheets sit on top of content. */}
                <GlassSurface
                  level="elevated"
                  data-stack-sheet
                  className="rounded-panel p-6 [--glass-fill:var(--glass-white-strong)] sm:p-10 lg:h-[32rem]"
                >
                  <div data-stack-content className="grid h-full gap-10 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col">
                      <p className="flex items-baseline gap-3">
                        <span className="font-display text-4xl leading-none text-ink italic">{step.index}</span>
                        <span className="text-label font-medium text-ink-secondary">{step.verb}</span>
                      </p>
                      <h3 className="mt-10 text-4xl font-medium tracking-heading text-balance text-ink lg:mt-auto">
                        {step.title}
                      </h3>
                      <p className="mt-4 max-w-measure text-body text-pretty text-ink-secondary">{step.body}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full">{step.preview}</div>
                    </div>
                  </div>
                </GlassSurface>
              </li>
            ))}
          </ol>
        </StackMotion>
      </Container>
    </Section>
  );
}
