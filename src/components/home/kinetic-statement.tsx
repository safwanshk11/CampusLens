import { Fragment } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ScrollWords } from "@/components/motion/scroll-words";
import { cn } from "@/lib/utils";

const STATEMENT = [
  { text: "Choosing a college shouldn’t mean" },
  { text: "opening fifteen tabs", accent: true },
  { text: "and trusting" },
  { text: "five conflicting numbers.", accent: true },
] as const;

/** The homepage's single kinetic-typography moment: words gain contrast as you read. */
export function KineticStatement() {
  return (
    <Section spacing="cinematic" aria-labelledby="statement-title">
      <Container>
        <div className="mx-auto max-w-5xl">
          <ScrollWords>
            <h2 id="statement-title" className="text-display-section font-medium text-balance text-ink">
              {STATEMENT.map((segment) =>
                segment.text.split(" ").map((word, index) => (
                  <Fragment key={`${segment.text}-${index}`}>
                    <span data-word className={cn("accent" in segment && segment.accent && "type-serif-accent")}>
                      {word}
                    </span>{" "}
                  </Fragment>
                )),
              )}
            </h2>
          </ScrollWords>

          <Reveal className="mt-14 grid gap-8 sm:grid-cols-2 lg:mt-20">
            <p className="max-w-measure text-body-lg text-pretty text-ink-secondary">
              CampusLens puts the numbers that matter into one structured shape, so two colleges can finally be read the
              same way.
            </p>
            <p className="max-w-measure text-body-lg text-pretty text-ink-secondary">
              Fewer tabs. Clear comparisons. A shortlist you understand the reasons for.
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
