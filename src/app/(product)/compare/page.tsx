import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GitCompareArrows, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getDb } from "@/lib/db";
import { formatInr, ownershipLabel } from "@/lib/college-display";
import { CompareInsights } from "@/components/discover/compare-insights";
import { SaveComparison } from "@/components/account/saved-controls";

export const metadata: Metadata = {
  title: "Compare colleges",
  description:
    "Compare college fees, courses, ratings and placements side by side.",
};
export const dynamic = "force-dynamic";
type Props = { searchParams: Promise<{ colleges?: string | string[] }> };

export default async function ComparePage({ searchParams }: Props) {
  const param = (await searchParams).colleges;
  const raw = typeof param === "string" ? param : "";
  const slugs = [
    ...new Set(
      raw.split(",").filter((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)),
    ),
  ].slice(0, 4);
  if (slugs.length < 2)
    return (
      <Container className="pt-40 pb-20">
        <EmptyState
          icon={GitCompareArrows}
          title="Choose two colleges to compare"
          description="Return to Discover and select at least two colleges. You can compare up to four at a time."
          action={<ButtonLink href="/discover">Explore colleges</ButtonLink>}
        />
      </Container>
    );
  const colleges = await getDb().college.findMany({
    where: { slug: { in: slugs } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      city: true,
      state: true,
      ownership: true,
      isDemo: true,
      courses: {
        orderBy: { annualFeeInr: "asc" },
        select: { name: true, annualFeeInr: true },
      },
      placements: {
        orderBy: { year: "desc" },
        take: 1,
        select: { year: true, medianSalaryInr: true },
      },
      reviews: { select: { rating: true } },
    },
  });
  if (colleges.length < 2)
    return (
      <Container className="pt-40 pb-20">
        <EmptyState
          icon={GitCompareArrows}
          title="Some colleges could not be found"
          description="The comparison link is out of date. Return to Discover and choose from the current catalogue."
          action={<ButtonLink href="/discover">Explore colleges</ButtonLink>}
        />
      </Container>
    );
  const values = colleges.map((college) => ({
    ...college,
    minFee: college.courses[0]?.annualFeeInr ?? null,
    rating: college.reviews.length
      ? college.reviews.reduce((sum, review) => sum + review.rating, 0) /
        college.reviews.length
      : null,
    placement: college.placements[0]?.medianSalaryInr ?? null,
  }));
  values.sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug));
  const row = (
    label: string,
    get: (college: (typeof values)[number]) => React.ReactNode,
  ) => (
    <div className="grid min-w-[44rem] grid-cols-[12rem_repeat(var(--compare-columns),minmax(11rem,1fr))] border-b border-line last:border-b-0">
      <div className="sticky left-0 bg-white/95 px-4 py-5 text-label font-medium text-ink-secondary backdrop-blur-sm sm:px-5">
        {label}
      </div>
      {values.map((college) => (
        <div
          key={college.slug}
          className="px-4 py-5 text-body font-medium tabular-nums text-ink sm:px-5"
        >
          {get(college)}
        </div>
      ))}
    </div>
  );
  return (
    <Container className="pt-32 pb-24 sm:pt-40">
      <ButtonLink href="/discover" variant="ghost" className="mb-8">
        <ArrowLeft aria-hidden className="size-4" />
        Back to discover
      </ButtonLink>
      <header className="mb-10">
        <p className="eyebrow mb-4 text-azure-ink">CampusLens / Compare</p>
        <h1 className="text-display-page">See the differences clearly.</h1>
        <p className="mt-4 max-w-2xl text-body text-ink-secondary">
          Aligned facts for the colleges you selected. Fees are annual tuition
          in INR; missing figures stay unavailable.
        </p>
      </header>
      <SaveComparison key={slugs.join(",")} slugs={values.map(college => college.slug)} />
      <CompareInsights
        key={values.map((college) => college.slug).join(",")}
        slugs={values.map((college) => college.slug)}
      />
      <div
        className="overflow-x-auto rounded-panel border border-line bg-white/55 shadow-glass-1"
        style={{ "--compare-columns": values.length } as React.CSSProperties}
      >
        <div className="grid min-w-[44rem] grid-cols-[12rem_repeat(var(--compare-columns),minmax(11rem,1fr))] border-b border-line bg-white/65">
          <div className="px-4 py-5 text-label text-ink-tertiary">
            Comparison
          </div>
          {values.map((college) => (
            <div key={college.slug} className="px-4 py-5">
              <div className="flex flex-wrap gap-2">
                {college.isDemo && <Badge tone="accent">Illustrative</Badge>}
                <Badge tone="neutral">
                  {ownershipLabel[college.ownership]}
                </Badge>
              </div>
              <Link
                href={`/colleges/${college.slug}`}
                className="mt-3 block text-lg font-medium tracking-heading text-ink hover:text-azure-ink"
              >
                {college.name}
              </Link>
              <p className="mt-2 flex items-center gap-1 text-label text-ink-secondary">
                <MapPin aria-hidden className="size-3.5" />
                {college.city}, {college.state}
              </p>
            </div>
          ))}
        </div>
        {row("Starting annual tuition", (college) => formatInr(college.minFee))}
        {row("College rating", (college) =>
          college.rating === null
            ? "Not yet rated"
            : `${college.rating.toFixed(1)} / 5`,
        )}
        {row("Latest median salary", (college) => formatInr(college.placement))}
        {row(
          "Latest placement report",
          (college) => college.placements[0]?.year ?? "Unavailable",
        )}
        {row("Programmes", (college) => `${college.courses.length} offered`)}
        <div className="min-w-[44rem] border-t border-line bg-azure/5 px-4 py-4 text-label text-ink-secondary">
          Comparison uses each college’s lowest offered annual tuition and
          latest available placement report. Verify current details with the
          institution.
        </div>
      </div>
    </Container>
  );
}
