import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/account/auth-form";
import { currentUser } from "@/server/auth/session";
import { safeReturnTo } from "@/lib/auth-validation";
export const metadata: Metadata = { title: "Create account", robots: { index: false } };
export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const next = safeReturnTo((await searchParams).next);
  if (await currentUser()) redirect(next);
  return <Container size="narrow" className="pt-36 pb-24"><div className="mx-auto max-w-lg"><p className="eyebrow mb-4 text-azure-ink">Your next chapter</p><h1 className="text-display-page">A shortlist<br />of your own.</h1><p className="mt-5 mb-8 text-body text-ink-secondary">Create an account to save colleges and return to the comparisons that matter to you.</p><Card surface="quiet" padding="lg"><AuthForm mode="register" next={next} /></Card></div></Container>;
}
