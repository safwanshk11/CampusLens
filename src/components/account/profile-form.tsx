"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button, ButtonLink } from "@/components/ui/button";
import type { StudentProfile } from "@/lib/student-profile";

export function ProfileForm({ profile }: { profile?: StudentProfile }) {
  const router = useRouter();
  const [stream, setStream] = useState(profile?.stream || "Engineering");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError("");
    const data = { jeePercentile: null, neetScore: null, ...Object.fromEntries(new FormData(event.currentTarget)) };
    try {
      const response = await fetch("/api/account/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const body = await response.json(); setError(body.error || "Could not save your profile."); return; }
      router.push("/discover?academic=on"); router.refresh();
    } catch { setError("Could not connect. Your entries are still here; try again."); }
    finally { setPending(false); }
  }
  const number = (name: keyof StudentProfile, label: string, max: number, hint?: string) => <Input key={name} id={`profile-${name}`} name={name} label={label} type="number" min={0} max={max} step="any" defaultValue={profile?.[name] ?? ""} hint={hint} />;
  return <form onSubmit={submit} className="mt-10 max-w-3xl space-y-8" aria-busy={pending}>
    <p className="text-body text-ink-secondary">Optional details to help narrow your search. Leave any score blank if you do not have it yet. You can edit everything here later.</p>
    <fieldset disabled={pending} className="space-y-6 rounded-panel border border-line bg-white/60 p-6 sm:p-8">
      <legend className="px-2 text-xl font-medium">Your academic profile</legend>
      <label className="flex flex-col gap-2 text-label font-medium">Area of study<select name="stream" value={stream} onChange={event => setStream(event.target.value as StudentProfile["stream"])} className="h-12 rounded-control bg-surface px-3 ring-1 ring-line"><option>Engineering</option><option>Medical</option><option>Other</option></select></label>
      <div className="grid gap-5 sm:grid-cols-2">
        {number("tenth", "Class 10 percentage", 100)}
        {number("twelfth", "Class 12 percentage", 100)}
        {stream === "Engineering" && number("jeePercentile", "JEE Main percentile", 100, "Enter percentile, not raw marks or rank.")}
        {stream === "Medical" && number("neetScore", "NEET marks (out of 720)", 720)}
        {number("examYear", "Entrance exam year", 2100)}
        <Input id="other-exam" name="otherExam" label="Another entrance exam" maxLength={80} defaultValue={profile?.otherExam || ""} placeholder="e.g. KCET, BITSAT" />
        <Input id="other-score" name="otherScore" label="Result and score type" maxLength={80} defaultValue={profile?.otherScore || ""} placeholder="e.g. rank 4,000; 180 marks" />
      </div>
    </fieldset>
    <fieldset disabled={pending} className="grid gap-5 rounded-panel border border-line bg-white/60 p-6 sm:grid-cols-2 sm:p-8">
      <legend className="px-2 text-xl font-medium">Your preferences</legend>
      <Input id="profile-state" name="state" label="Home state" maxLength={80} defaultValue={profile?.state || ""} />
      {number("budget", "Annual tuition budget (₹)", 10000000)}
      <Input id="profile-interests" name="interests" label="Preferred courses or cities" maxLength={200} defaultValue={profile?.interests || ""} className="sm:col-span-2" />
    </fieldset>
    {error && <p role="alert" className="text-danger-ink">{error}</p>}
    <div className="flex flex-wrap gap-3"><Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save and see matches"}</Button><ButtonLink href="/discover?academic=off" variant="ghost">Skip and explore colleges</ButtonLink></div>
  </form>;
}
