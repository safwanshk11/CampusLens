import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/account/auth-form";
import { currentUser } from "@/server/auth/session";
import { safeReturnTo } from "@/lib/auth-validation";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to save and compare colleges.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const next = safeReturnTo((await searchParams).next);
  if (await currentUser()) redirect(next);
  return <Container size="narrow" className="pt-36 pb-24"><div className="mx-auto max-w-lg"><p className="eyebrow mb-4 text-azure-ink">Your CampusLens</p><h1 className="text-display-page">Pick up where<br />you left off.</h1><p className="mt-5 mb-8 text-body text-ink-secondary">Sign in to keep your colleges and comparisons together.</p><Card surface="quiet" padding="lg"><AuthForm mode="login" next={next} /></Card></div></Container>;
}
