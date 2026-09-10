import { GitCompareArrows } from "lucide-react";
import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare colleges side by side on fees, placements and ratings.",
};

export default function ComparePage() {
  return (
    <PhasePlaceholder
      eyebrow="Compare"
      title="Side-by-side comparison"
      lede="Line up colleges on the numbers that matter and see exactly where they differ."
      icon={GitCompareArrows}
      emptyTitle="Nothing to compare yet"
      emptyDescription="Comparison is built in a later phase. You will add colleges from search results or detail pages."
    />
  );
}
