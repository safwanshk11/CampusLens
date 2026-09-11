import { Bookmark, GitCompareArrows } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BookmarkToggle, DeleteComparison, SignOut } from "@/components/account/saved-controls";
import { currentUser } from "@/server/auth/session";
import { listSaved } from "@/server/saved/items";

export const metadata: Metadata = {
  title: "Saved",
  description: "Your private shortlist of colleges.",
  robots: { index: false },
};

export default async function SavedPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in?next=%2Fsaved");
  const items = await listSaved(user.id);
  return <Container className="pt-36 pb-24"><header className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow mb-4 text-azure-ink">Your CampusLens</p><h1 className="text-display-page">Room for your favourites.</h1><p className="mt-5 text-body text-ink-secondary">{user.name || "Your account"} · Your colleges and comparisons, saved for later.</p></div><SignOut /></header>
    <section aria-labelledby="saved-colleges"><h2 id="saved-colleges" className="mb-6 text-2xl font-medium">Saved colleges <span className="text-ink-tertiary">({items.colleges.length})</span></h2>
      {items.colleges.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.colleges.map(college => <Card key={college.id} surface="solid" interactive className="relative"><div className="flex items-center justify-between gap-2">{college.isDemo ? <Badge tone="accent">Illustrative</Badge> : <span />}<BookmarkToggle collegeId={college.id} name={college.name} initialSaved /></div><h3 id={`saved-${college.id}`} className="mt-4 text-xl font-medium">{college.name}</h3><p className="mt-2 text-label text-ink-secondary">{college.city}, {college.state}</p><Link className="absolute inset-0 rounded-card focus-visible:outline-2 focus-visible:outline-focus" aria-labelledby={`saved-${college.id}`} href={`/colleges/${college.slug}`} /></Card>)}</div> : <EmptyState icon={Bookmark} title="Your shortlist starts here" description="Use the bookmark on a college to keep it here." action={<ButtonLink href="/discover">Explore colleges</ButtonLink>} />}
    </section>
    <section aria-labelledby="saved-comparisons" className="mt-16"><h2 id="saved-comparisons" className="mb-6 text-2xl font-medium">Saved comparisons <span className="text-ink-tertiary">({items.comparisons.length})</span></h2>
      {items.comparisons.length ? <div className="grid gap-5 md:grid-cols-2">{items.comparisons.map(comparison => <Card surface="solid" key={comparison.id}><h3 className="text-xl font-medium">{comparison.name}</h3><p className="mt-3 text-label leading-relaxed text-ink-secondary">{comparison.colleges.map(item => item.college.name).join(" · ")}</p><div className="mt-5 flex flex-wrap items-center gap-3"><ButtonLink variant="secondary" href={`/compare?colleges=${encodeURIComponent(comparison.colleges.map(item => item.college.slug).join(","))}`}>Open comparison</ButtonLink><DeleteComparison id={comparison.id} /></div></Card>)}</div> : <EmptyState icon={GitCompareArrows} title="Keep your decisions in view" description="Compare two to four colleges, give the comparison a name, and save it here." action={<ButtonLink href="/discover">Choose colleges</ButtonLink>} />}
    </section>
  </Container>;
}
