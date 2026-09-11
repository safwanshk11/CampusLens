import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { GlassBezel } from "@/components/ui/glass-surface";
import { Magnetic } from "@/components/visual/magnetic";
import { BrandMark } from "@/components/visual/brand-mark";

export function FinalCta({ signedIn = false }: { signedIn?: boolean }) {
  const exploreHref = signedIn ? "/discover" : "/sign-in?next=%2Fdiscover";
  const compareHref = signedIn ? "/compare" : "/sign-in?next=%2Fcompare";
  return (
    <Section spacing="cinematic" aria-labelledby="cta-title">
      <Container>
        <Reveal stagger>
          <GlassBezel
            level="elevated"
            radius="panel"
            coreClassName="relative overflow-hidden px-6 py-14 sm:px-12 sm:py-20 lg:px-20 lg:py-24"
          >
            <BrandMark className="pointer-events-none absolute -bottom-24 -right-16 size-80 text-ink/5 sm:size-[26rem]" />

            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="eyebrow flex items-center gap-3">
                  <span className="text-ink">05</span>
                  <span aria-hidden className="h-px w-8 bg-line-strong" />
                  <span>Start here</span>
                </p>
                <h2 id="cta-title" className="mt-6 text-display-section font-medium text-balance text-ink">
                  Your shortlist starts with <span className="type-serif-accent">one search.</span>
                </h2>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:col-span-4 lg:flex-col lg:items-end">
                <Magnetic>
                  <ButtonLink href={exploreHref} size="lg" icon={ArrowUpRight}>
                    Explore colleges
                  </ButtonLink>
                </Magnetic>
                <ButtonLink href={compareHref} variant="ghost" size="lg">
                  Compare colleges
                </ButtonLink>
              </div>
            </div>
          </GlassBezel>
        </Reveal>
      </Container>
    </Section>
  );
}
