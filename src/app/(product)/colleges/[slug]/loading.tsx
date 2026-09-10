import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <Container className="pt-40 pb-20">
      <p role="status" className="mb-8 text-body">
        Loading college details…
      </p>
      <Skeleton className="h-20 w-full rounded-card" />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Skeleton className="h-64 rounded-card" />
        <Skeleton className="h-64 rounded-card" />
      </div>
    </Container>
  );
}
