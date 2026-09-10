import { Container } from "@/components/layout/container";
import { CollegeCardSkeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <Container className="pt-40 pb-20">
      <p role="status" className="mb-8 text-body text-ink-secondary">
        Finding your possibilities…
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <CollegeCardSkeleton key={index} />
        ))}
      </div>
    </Container>
  );
}
