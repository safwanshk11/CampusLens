import { ScanSearch } from "lucide-react";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
export default function NotFound() {
  return (
    <Container className="pt-40 pb-20">
      <EmptyState
        icon={ScanSearch}
        title="College not found"
        description="This college link is unavailable. Browse the catalogue to find another college."
        action={<ButtonLink href="/discover">Explore colleges</ButtonLink>}
      />
    </Container>
  );
}
