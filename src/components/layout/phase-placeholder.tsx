import { ArrowLeft, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "./container";
import { Section } from "./section";

type PhasePlaceholderProps = {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: ReactNode;
};

/**
 * Honest stand-in for a feature that has not been built yet. Navigation links land
 * somewhere real without faking data or behaviour.
 */
export function PhasePlaceholder({ eyebrow, title, lede, icon, emptyTitle, emptyDescription }: PhasePlaceholderProps) {
  return (
    <Section spacing="cinematic">
      <Container size="narrow" className="pt-10">
        <SectionHeading as="h1" size="page" eyebrow={eyebrow} title={title} description={lede} />
        <Card surface="solid" padding="none" className="mt-10">
          <EmptyState
            icon={icon}
            title={emptyTitle}
            description={emptyDescription}
            action={
              <ButtonLink href="/" variant="secondary" size="md">
                <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
                Back to home
              </ButtonLink>
            }
          />
        </Card>
      </Container>
    </Section>
  );
}
