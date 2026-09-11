"use client";
import { Bookmark } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safeReturnTo } from "@/lib/auth-validation";

function loginUrl() { return `/sign-in?next=${encodeURIComponent(safeReturnTo(window.location.pathname + window.location.search))}`; }

export function BookmarkToggle({ collegeId, name, initialSaved = false }: { collegeId: string; name: string; initialSaved?: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function toggle() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/saved/colleges", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ collegeId, saved: !saved }) });
      if (response.status === 401) { router.push(loginUrl()); return; }
      const body = await response.json();
      if (!response.ok) { setError(body.error || "Could not update shortlist."); return; }
      setSaved(body.saved); router.refresh();
    } catch { setError("Couldn’t save. Please try again."); }
    finally { setPending(false); }
  }
  return <span className="relative z-float inline-flex flex-col items-end">
    <button type="button" onClick={toggle} disabled={pending} aria-pressed={saved} aria-label={`Save ${name}`} title={saved ? "Remove from shortlist" : "Save to shortlist"} className={`grid size-11 place-items-center rounded-full ring-1 ring-line transition-colors disabled:opacity-45 ${saved ? "bg-ink text-white" : "bg-surface text-ink-secondary hover:bg-azure/10 hover:text-azure-ink"}`}><Bookmark aria-hidden className={`size-4 ${saved ? "fill-current" : ""}`} /></button>
    {error && <span role="alert" className="mt-2 max-w-40 text-label text-danger-ink">{error}</span>}
  </span>;
}

export function SaveComparison({ slugs }: { slugs: string[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setMessage(""); setSuccess(false);
    const name = new FormData(event.currentTarget).get("name");
    try {
      const response = await fetch("/api/saved/comparisons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, colleges: slugs.join(",") }) });
      if (response.status === 401) { router.push(loginUrl()); return; }
      const body = await response.json();
      setSuccess(response.ok); setMessage(response.ok ? "Comparison saved to your shortlist." : body.error || "Could not save comparison.");
    } catch { setMessage("Couldn’t connect. Please try again."); }
    finally { setPending(false); }
  }
  return <form onSubmit={save} className="mb-8 rounded-card glass glass-quiet p-5" aria-busy={pending}><div className="flex flex-wrap items-end gap-3"><Input id="comparison-name" name="name" label="Keep this comparison" placeholder="e.g. My engineering shortlist" required maxLength={80} className="min-w-0 flex-1" /><Button type="submit" disabled={pending || success}>{pending ? "Saving…" : success ? "Saved" : "Save comparison"}</Button></div>{message && <p role="status" className={`mt-3 text-label ${success ? "text-positive-ink" : "text-danger-ink"}`}>{message}</p>}</form>;
}

export function DeleteComparison({ id }: { id: string }) {
  const router = useRouter(); const [pending, setPending] = useState(false); const [error, setError] = useState("");
  async function remove() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/saved/comparisons", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (response.status === 401) { router.push(loginUrl()); return; }
      if (!response.ok) { setError("Could not remove comparison. Try again."); return; }
      router.refresh();
    } catch { setError("Couldn’t connect. Try again."); } finally { setPending(false); }
  }
  return <div><Button variant="ghost" onClick={remove} disabled={pending}>{pending ? "Removing…" : "Remove"}</Button>{error && <p role="alert" className="text-label text-danger-ink">{error}</p>}</div>;
}

export function SignOut() {
  const router = useRouter(); const [pending, setPending] = useState(false); const [error, setError] = useState("");
  async function logout() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) { setError("Could not sign out. Try again."); return; }
      router.replace("/sign-in"); router.refresh();
    } catch { setError("Couldn’t connect. Try again."); } finally { setPending(false); }
  }
  return <div><Button onClick={logout} variant="secondary" disabled={pending}>{pending ? "Signing out…" : "Sign out"}</Button>{error && <p role="alert" className="text-label text-danger-ink">{error}</p>}</div>;
}
