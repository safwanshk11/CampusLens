"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const body = await response.json();
      if (!response.ok) { setError(body.error || "Could not sign in."); return; }
      router.replace(mode === "register" ? "/account?onboarding=1" : next); router.refresh();
    } catch { setError("Couldn’t connect. Please try again."); }
    finally { setPending(false); }
  }
  return <form onSubmit={submit} className="space-y-5" aria-busy={pending}>
    {mode === "register" && <Input id="account-name" name="name" label="Your name" required maxLength={80} autoComplete="name" />}
    <Input id="account-email" name="email" label="Email address" type="email" required maxLength={254} autoComplete="email" />
    <Input id="account-password" name="password" label="Password" type="password" required minLength={12} maxLength={128} autoComplete={mode === "register" ? "new-password" : "current-password"} hint={mode === "register" ? "Use at least 12 characters. A memorable passphrase works well." : undefined} />
    {error && <p role="alert" className="text-label text-danger-ink">{error}</p>}
    <Button className="w-full" type="submit" disabled={pending}>{pending ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</Button>
    <p className="text-center text-label text-ink-secondary">{mode === "register" ? "Already have an account? " : "New to CampusLens? "}<Link className="font-medium text-azure-ink underline" href={`${mode === "register" ? "/sign-in" : "/sign-up"}?next=${encodeURIComponent(next)}`}>{mode === "register" ? "Sign in" : "Create an account"}</Link></p>
  </form>;
}
