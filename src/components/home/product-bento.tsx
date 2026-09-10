import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card, type CardSurface } from "@/components/ui/card";
import { GlassBezel } from "@/components/ui/glass-surface";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { ComparePreview, IntelligencePreview, SearchPreview, ShortlistPreview } from "./previews";

function BentoCopy({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-medium tracking-heading text-balance text-ink">{title}</h3>
        <Badge tone="neutral" className="mt-1">
          Illustrative
        </Badge>
      </div>
      <p className="max-w-measure text-body text-pretty text-ink-secondary">{description}</p>
    </div>
  );
}

function BentoCard({ surface, className, children }: { surface: CardSurface; className?: string; children: ReactNode }) {
  return (
    <Card surface={surface} padding="lg" interactive className={cn("flex flex-col gap-10", className)}>
      {children}
    </Card>
  );
}

/**
 * Asymmetric feature composition. Card size tracks feature importance: Compare is
 * the product's decisive moment and gets the largest, double-bezel surface.
 */
export function ProductBento() {
  return (
    <Section spacing="cinematic" aria-labelledby="product-title">
      <Container>
        <SectionHeading
          id="product-title"
          title={
            <>
              Four surfaces. <span className="type-serif-accent">One</span> clear decision.
            </>
          }
          description="Every part of CampusLens is designed around the decision you actually have to make — not around a directory of listings."
        />

        <Reveal stagger className="mt-14 grid gap-4 *:min-w-0 lg:mt-20 lg:grid-cols-12 lg:gap-5">
          <GlassBezel
            level="elevated"
            radius="card"
            className="card-interactive lg:col-span-7"
            coreClassName="flex h-full flex-col gap-10 p-6 sm:p-8"
          >
            <BentoCopy
              title="See exactly where colleges differ"
              description="Fees, packages, ratings and placement rates aligned row by row, with the stronger value marked."
            />
            <ComparePreview className="mt-auto" />
          </GlassBezel>

          <BentoCard surface="quiet" className="lg:col-span-5">
            <BentoCopy
              title="Keep the ones that fit"
              description="Save colleges to a private shortlist and return to it whenever you are ready."
            />
            <ShortlistPreview className="mt-auto" />
          </BentoCard>

          <BentoCard surface="quiet" className="lg:col-span-5">
            <BentoCopy
              title="Search the whole field"
              description="Search by name, course or city, then narrow with filters that change results instantly."
            />
            <SearchPreview className="mt-auto" />
          </BentoCard>

          <BentoCard surface="elevated" className="lg:col-span-7">
            <BentoCopy
              title="College intelligence, not brochures"
              description="Each college page presents courses, fees and placements in the same scannable structure."
            />
            <IntelligencePreview className="mt-auto" />
          </BentoCard>
        </Reveal>
      </Container>
    </Section>
  );
}
