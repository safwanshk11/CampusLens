import { ButtonLink } from "@/components/ui/button";
import { GraduationCap, MapPin, Star, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CollegeSearchItem } from "@/server/colleges/search";

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
}: {
  college: CollegeSearchItem;
  returnTo?: string;
}) {
  return (
    <article aria-labelledby={`college-${college.id}`}>
      <Card surface="solid" className="flex h-full flex-col overflow-hidden">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span
            aria-hidden
            className="grid size-12 place-items-center rounded-tile bg-azure/10 text-azure-ink"
          >
            <GraduationCap className="size-5" strokeWidth={1.75} />
          </span>
          <Badge tone="neutral">{ownership[college.ownership]}</Badge>
        </div>
        <h3
          id={`college-${college.id}`}
          className="text-xl font-medium tracking-heading text-ink"
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
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5">
          <div>
            <dt className="text-label text-ink-secondary">
              Annual tuition from
            </dt>
            <dd className="mt-2 text-xl font-medium tabular-nums tracking-heading">
              {money(college.minAnnualFeeInr)}
            </dd>
          </div>
          <div>
            <dt className="text-label text-ink-secondary">
              Median annual salary
            </dt>
            <dd className="mt-2 text-xl font-medium tabular-nums tracking-heading">
              {money(college.medianSalaryInr)}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-label text-ink-tertiary">
          <span>{college.matchingCourseCount} matching programmes</span>
          <span>
            {college.placementYear
              ? `${college.placementYear} placements`
              : "No placement report"}
          </span>
        </div>
        <details className="mt-5 border-t border-line pt-4 text-label text-ink-secondary">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 font-medium text-ink">
            About these figures
            <ArrowUpRight aria-hidden className="size-4" />
          </summary>
          <p className="mt-2 leading-relaxed">
            Tuition spans {money(college.minAnnualFeeInr)} to{" "}
            {money(college.maxAnnualFeeInr)} per year across programmes matching
            your course filters. Living expenses are excluded.{" "}
            {college.isDemo
              ? "This college and its figures are fictional demonstration data."
              : "Confirm fees and admission requirements with the institution."}
          </p>
        </details>
        {college.slug !== "specimen" && (
          <ButtonLink
            className="mt-5"
            variant="secondary"
            href={`/colleges/${college.slug}${returnTo ? `?from=${encodeURIComponent(returnTo)}` : ""}`}
            aria-label={`View ${college.name}`}
          >
            View college
            <ArrowUpRight aria-hidden className="size-4" />
          </ButtonLink>
        )}
      </Card>
    </article>
  );
}
