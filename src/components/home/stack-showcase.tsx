import { Fragment, type CSSProperties, type ReactNode } from "react";
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
  /** Environmental light pooled in the sheet's top-left corner. */
  light: string;
  /** Same accent, solid — for the small eyebrow dot, where a translucent wash would wash out. */
  dot: string;
  preview: ReactNode;
};

const STEPS: readonly Step[] = [
  {
    index: "01",
    verb: "Discover",
    title: "Search the whole field",
    body: "Filter by course, city, fees and ratings. Every result carries the same structured fields, so nothing hides in a brochure.",
    light: "var(--ambient-cyan)",
    dot: "var(--ice)",
    preview: <SearchPreview />,
  },
  {
    index: "02",
    verb: "Compare",
    title: "Put them side by side",
    body: "Pick a few colleges and read them row by row. Differences in fees, placements and ratings become obvious.",
    light: "var(--ambient-azure)",
    dot: "var(--azure)",
    preview: <ComparePreview />,
  },
  {
    index: "03",
    verb: "Shortlist",
    title: "Keep the ones that fit",
    body: "Save colleges to a private shortlist tied to your account and come back to it whenever you are ready.",
    light: "var(--ambient-indigo)",
    dot: "var(--indigo-mist)",
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

          {/*
            Spacing between sheets comes from spacer elements, never margins or padding.
            A sticky element's margin box must stay inside its container, so margins would
            make earlier sheets release before later sheets arrive; padding is ignored by
            sticky entirely. With spacers, every sheet stays pinned until the stack ends,
            and the final spacer holds the settled stack before it leaves as one piece.
          */}
          <div role="list" data-stack-list className="flex flex-col gap-5 lg:col-span-8 lg:gap-0">
            {STEPS.map((step, index) => (
              <Fragment key={step.index}>
                {index > 0 ? <div aria-hidden className="hidden h-[40vh] lg:block" /> : null}
                <div
                  role="listitem"
                  data-stack-card
                  className="lg:sticky"
                  style={{ top: `${STICKY_BASE_REM + index * STICKY_STEP_REM}rem` }}
                >
                  {/* Equal fixed height on desktop so every sheet fully covers the one beneath it.
                      A stronger fill than standard Glass 2: these sheets sit on top of content. */}
                  <GlassSurface
                    level="elevated"
                    data-stack-sheet
                    className="overflow-hidden rounded-panel p-6 [--glass-fill:var(--glass-white-strong)] sm:p-10 lg:h-[32rem]"
                  >
                    {/* Environmental light pool, tinted per step, pooled top-left with the rest of PRISM's lighting. */}
                    <span
                      aria-hidden
                      className="glass-glare-layer"
                      style={
                        {
                          background: `radial-gradient(70% 90% at 0% 0%, ${step.light}, transparent 70%)`,
                        } as CSSProperties
                      }
                    />

                    <div data-stack-content className="grid h-full gap-10 lg:grid-cols-2 lg:gap-12">
                      <div className="flex flex-col">
                        <p className="eyebrow flex items-center gap-2">
                          <span aria-hidden className="size-1.5 rounded-full" style={{ background: step.dot }} />
                          Step {step.index} · {step.verb}
                        </p>
                        {/* Giant ghost numeral: the liquid-type flourish behind each card's title. */}
                        <p aria-hidden className="mt-6 font-display text-display-section text-ink/15 italic">
                          {step.index}
                        </p>
                        <h3 className="mt-auto pt-6 text-display-page font-medium text-balance text-ink">
                          {step.title}
                        </h3>
                        <p className="mt-4 max-w-measure text-body text-pretty text-ink-secondary">{step.body}</p>
                      </div>
                      <div className="flex items-end">
                        <div className="w-full">{step.preview}</div>
                      </div>
                    </div>
                  </GlassSurface>
                </div>
              </Fragment>
            ))}
            {/* Hold: the fully stacked sheets stay pinned for this distance, then exit together. */}
            <div aria-hidden className="hidden h-[45vh] lg:block" />
          </div>
        </StackMotion>
      </Container>
    </Section>
  );
}
