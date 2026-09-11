"use client";

import { CircleAlert } from "lucide-react";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function ProductError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <Container className="pt-40 pb-20">
      <EmptyState
        icon={CircleAlert}
        title="We couldn’t load this page"
        description="Please try again in a moment. Your saved items will be here when the connection returns."
        action={<Button onClick={() => retry()}>Try again</Button>}
      />
    </Container>
  );
}
