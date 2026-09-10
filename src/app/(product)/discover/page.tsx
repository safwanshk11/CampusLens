import { ScanSearch } from "lucide-react";
import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata: Metadata = {
  title: "Discover",
  description: "Search and filter colleges by course, city, fees and more.",
};

export default async function DiscoverPage({ searchParams }: PageProps<"/discover">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return (
    <PhasePlaceholder
      eyebrow="Discover"
      title="College search"
      lede="Search by name, course or city, then narrow results with filters for fees, ratings and placements."
      icon={ScanSearch}
      emptyTitle="Search arrives in Phase 1"
      emptyDescription={
        query ? (
          <>
            Your search for <span className="font-medium text-ink">“{query}”</span> reached this page correctly. Results
            will appear here once the college data and search API are built.
          </>
        ) : (
          "The search interface, filters and result cards are designed in PRISM and will be connected to real data next."
        )
      }
    />
  );
}
