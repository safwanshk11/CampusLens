import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { GlassBezel } from "@/components/ui/glass-surface";
import { Magnetic } from "@/components/visual/magnetic";

export function FinalCta() {
  return (
    <Section spacing="cinematic" aria-labelledby="cta-title">
      <Container>
        <Reveal stagger>
          <GlassBezel level="elevated" radius="panel" coreClassName="px-6 py-14 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <h2 id="cta-title" className="text-display-section font-medium text-balance text-ink lg:col-span-8">
                Your shortlist starts with <span className="type-serif-accent">one search.</span>
              </h2>

              <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:flex-col lg:items-end">
                <Magnetic>
                  <ButtonLink href="/discover" size="lg" icon={ArrowUpRight}>
                    Explore colleges
                  </ButtonLink>
                </Magnetic>
                <ButtonLink href="/compare" variant="secondary" size="lg">
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
