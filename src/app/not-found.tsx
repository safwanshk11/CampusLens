import { Compass } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <PageShell mode="intelligence">
      <Container size="narrow" className="pb-24 pt-40">
        <EmptyState
          icon={Compass}
          titleAs="h1"
          title="This page is out of view"
          description="The address may be mistyped, or the page may not exist yet. Start again from the homepage."
          action={
            <ButtonLink href="/" size="md">
              Go to homepage
            </ButtonLink>
          }
        />
      </Container>
    </PageShell>
  );
}
