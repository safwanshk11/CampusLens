import { KeyRound } from "lucide-react";
import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to save and compare colleges.",
};

export default function SignInPage() {
  return (
    <PhasePlaceholder
      eyebrow="Account"
      title="Sign in"
      lede="Accounts let you keep a shortlist and return to your comparisons."
      icon={KeyRound}
      emptyTitle="Authentication is not built yet"
      emptyDescription="Sign-in arrives with the saved-items feature. No credentials are collected in this prototype."
    />
  );
}
