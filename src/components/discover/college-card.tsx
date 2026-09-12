import Link from "next/link";
import { GraduationCap, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CollegeSearchItem } from "@/server/colleges/search";
import { CompareToggle } from "./compare-toggle";
import { BookmarkToggle } from "@/components/account/saved-controls";
import { catalogueFacts, annualFeeLabel } from "@/lib/catalogue-facts";

const ownership = {
  PUBLIC: "Public",
  PRIVATE: "Private",
  DEEMED: "Deemed university",
};
const money = (value: number | null) =>
  value === null
    ? "Unavailable"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value);

export function CollegeCard({
  college,
  returnTo,
  saved = false,
}: {
  college: CollegeSearchItem;
  returnTo?: string;
  saved?: boolean;
}) {
  const facts = catalogueFacts(college.catalogueFacts);
  const annualFee = college.minAnnualFeeInr;
  const feeLabel = annualFee !== null ? (facts ? annualFeeLabel(facts.annualFeeBasis) : "Annual tuition from") : facts?.feeInr ? "Listed total course fee" : "Annual tuition from";
  const salary = college.medianSalaryInr ?? facts?.averageSalaryInr ?? null;
  return (
    <article aria-labelledby={`college-${college.id}`}>
      <Card
        surface="solid"
        interactive={college.slug !== "specimen"}
        className="group/card relative flex h-full cursor-pointer flex-col overflow-hidden bg-gradient-to-br from-white via-white/95 to-azure/5 transition-shadow duration-(--duration-base) hover:shadow-glass-2"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <span
            aria-hidden
            className="grid size-12 place-items-center rounded-tile bg-azure/10 text-azure-ink ring-1 ring-inset ring-azure/10 transition-colors group-hover/card:bg-azure/15"
          >
            <GraduationCap className="size-5" strokeWidth={1.75} />
          </span>
          <div className="flex items-center gap-2">
            <Badge tone="neutral">{ownership[college.ownership]}</Badge>
            {college.slug !== "specimen" && (
              <CompareToggle slug={college.slug} name={college.name} />
            )}
            {college.slug !== "specimen" && <BookmarkToggle key={`${college.id}-${saved}`} collegeId={college.id} name={college.name} initialSaved={saved} />}
          </div>
        </div>
        <h3
          id={`college-${college.id}`}
          className="text-xl font-medium leading-snug tracking-heading text-ink transition-colors group-hover/card:text-azure-ink"
        >
          {college.name}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-label text-ink-secondary">
          <MapPin aria-hidden className="size-3.5 shrink-0" />
          {college.city}, {college.state}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-label">
          <span className="flex items-center gap-1.5 text-ink">
            <Star aria-hidden className="size-3.5 text-warning-ink" />
            {college.averageRating === null
              ? "Not yet rated"
              : `${college.averageRating.toFixed(1)} / 5`}
            <span className="text-ink-tertiary">
              ({college.reviewCount}{" "}
              {college.reviewCount === 1 ? "review" : "reviews"})
            </span>
          </span>
          {college.isDemo && <Badge tone="accent">Illustrative</Badge>}
          {facts && <span className="text-xs text-ink-tertiary">{college.ratingProvider || facts.ratingProvider} rating</span>}
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-tile border border-line bg-azure/[0.025] p-4">
          <div>
            <dt className="text-label text-ink-secondary">
              {feeLabel}
            </dt>
            <dd className="mt-2 text-xl font-medium tabular-nums tracking-heading">
              {money(annualFee ?? facts?.feeInr ?? null)}
            </dd>
          </div>
          <div>
            <dt className="text-label text-ink-secondary">
              {college.medianSalaryInr !== null || facts?.averageSalaryInr == null ? "Median annual salary" : "Reported average salary"}
            </dt>
            <dd className="mt-2 text-xl font-medium tabular-nums tracking-heading">
              {money(salary)}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-label text-ink-tertiary">
          <span>{college.matchingCourseCount} {facts && college.matchingCourseCount === 1 ? "programme fee reference" : "matching programmes"}</span>
          <span>
            {college.placementYear
              ? `${college.placementYear} placements`
              : facts?.averageSalaryInr ? "Year not specified by source" : "No placement report"}
          </span>
        </div>
        {college.slug !== "specimen" && (
          <Link
            className="absolute inset-0 rounded-card focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-focus"
            href={`/colleges/${college.slug}${returnTo ? `?from=${encodeURIComponent(returnTo)}` : ""}`}
            aria-labelledby={`college-${college.id}`}
          />
        )}
      </Card>
    </article>
  );
}
