import { Bookmark } from "lucide-react";
import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata: Metadata = {
  title: "Saved",
  description: "Your private shortlist of colleges.",
};

export default function SavedPage() {
  return (
    <PhasePlaceholder
      eyebrow="Shortlist"
      title="Saved colleges"
      lede="A private shortlist tied to your account, ready to compare whenever you are."
      icon={Bookmark}
      emptyTitle="Your shortlist is empty"
      emptyDescription="Saving requires an account. Authentication and saved items are built in a later phase."
    />
  );
}
