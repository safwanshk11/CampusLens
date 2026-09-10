import { Check, Heart, MapPin, Search } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Presentational previews of product surfaces that do not exist yet.
 *
 * They are illustrations, not data: every value is fictional, each preview is a
 * single `role="img"` with a text alternative (so screen readers do not read
 * invented numbers as facts), and the surrounding card labels them as
 * illustrative.
 *
 * They sit inside cards, so they never draw a surface of their own: structure
 * comes from hairlines and type, not from nested boxes.
 */
function Illustration({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} className={className}>
      {children}
    </div>
  );
}

const COMPARE_GRID = "grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 sm:gap-3";

const COMPARE_ROWS = [
  { field: "Annual fees", a: "₹2.1L", b: "₹3.4L", better: "a" },
  { field: "Median package", a: "₹8.2L", b: "₹11.5L", better: "b" },
  { field: "Rating", a: "4.2", b: "4.5", better: "b" },
  { field: "Placement rate", a: "86%", b: "91%", better: "b" },
] as const;

export function ComparePreview({ className }: { className?: string }) {
  return (
    <Illustration
      label="Illustration of two colleges compared row by row on fees, median package, rating and placement rate, with the better value highlighted"
      className={className}
    >
      <div className={cn(COMPARE_GRID, "border-b border-line-strong pb-3")}>
        <span className="text-label text-ink-tertiary">Field</span>
        <span className="text-label font-medium text-ink">College A</span>
        <span className="text-label font-medium text-ink">College B</span>
      </div>
      {COMPARE_ROWS.map((row) => (
        <div key={row.field} className={cn(COMPARE_GRID, "items-center border-b border-line py-3 last:border-b-0")}>
          <span className="text-label text-ink-secondary">{row.field}</span>
          {(["a", "b"] as const).map((side) => {
            const better = row.better === side;
            return (
              <span
                key={side}
                className={cn(
                  "flex min-w-0 items-center gap-1 text-label tabular-nums sm:gap-1.5 sm:text-control",
                  better ? "font-semibold text-ink" : "text-ink-secondary",
                )}
              >
                {row[side]}
                {better ? <Check className="size-3.5 shrink-0 text-positive-ink" strokeWidth={2.5} /> : null}
              </span>
            );
          })}
        </div>
      ))}
    </Illustration>
  );
}

const SAVED = [
  { name: "Northfield Institute of Technology", city: "Pune", initials: "NI" },
  { name: "Riverside College of Engineering", city: "Chennai", initials: "RC" },
  { name: "Lakeview University", city: "Bengaluru", initials: "LU" },
] as const;

export function ShortlistPreview({ className }: { className?: string }) {
  return (
    <Illustration
      label="Illustration of a shortlist with three saved fictional colleges"
      className={cn("divide-y divide-line", className)}
    >
      {SAVED.map((college) => (
        <div key={college.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/5 text-label font-semibold text-ink">
            {college.initials}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-label font-medium text-ink">{college.name}</span>
            <span className="flex items-center gap-1 text-micro text-ink-tertiary">
              <MapPin className="size-3" strokeWidth={1.75} />
              {college.city}
            </span>
          </span>
          <Heart className="size-4 shrink-0 fill-current text-danger-ink" strokeWidth={1.75} />
        </div>
      ))}
    </Illustration>
  );
}

const FILTERS = [
  { label: "Engineering", selected: true },
  { label: "Under ₹3L", selected: true },
  { label: "Rating 4+", selected: false },
  { label: "Hostel", selected: false },
] as const;

export function SearchPreview({ className }: { className?: string }) {
  return (
    <Illustration
      label="Illustration of a college search for B.Tech in Pune with filter chips for engineering and fees under three lakh selected"
      className={cn("flex flex-col gap-4", className)}
    >
      <div className="flex h-11 items-center gap-2.5 border-b border-line-strong">
        <Search className="size-4 text-ink-tertiary" strokeWidth={1.75} />
        <span className="text-control text-ink">B.Tech in Pune</span>
        <span className="h-4 w-px bg-ink" />
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <span
            key={filter.label}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-micro font-medium",
              filter.selected ? "bg-ink text-white" : "text-ink-secondary ring-1 ring-line-strong",
            )}
          >
            {filter.selected ? <Check className="size-3" strokeWidth={2.5} /> : null}
            {filter.label}
          </span>
        ))}
      </div>
    </Illustration>
  );
}

const DETAIL_TABS = ["Overview", "Courses", "Fees", "Placements"] as const;
const DETAIL_METRICS = [
  { label: "Median package", value: "₹9.6L" },
  { label: "Highest package", value: "₹42L" },
  { label: "Students placed", value: "88%" },
] as const;

export function IntelligencePreview({ className }: { className?: string }) {
  return (
    <Illustration
      label="Illustration of a college detail page showing the placements tab with median package, highest package and share of students placed"
      className={className}
    >
      <div className="flex gap-6 overflow-hidden border-b border-line">
        {DETAIL_TABS.map((tab) => (
          <span
            key={tab}
            className={cn(
              "relative whitespace-nowrap pb-3 text-label",
              tab === "Placements" ? "font-medium text-ink" : "text-ink-tertiary",
            )}
          >
            {tab}
            {tab === "Placements" ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-ink" /> : null}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 divide-x divide-line py-5">
        {DETAIL_METRICS.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-1 px-4 first:pl-0">
            <span className="text-micro text-ink-tertiary">{metric.label}</span>
            <span className="text-xl font-semibold tracking-heading text-ink tabular-nums">{metric.value}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-line pt-4">
        <div className="flex items-center justify-between text-micro">
          <span className="text-ink-tertiary">Placement rate</span>
          <span className="font-medium text-ink tabular-nums">88%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/5">
          <div className="h-full w-[88%] rounded-full bg-positive" />
        </div>
      </div>
    </Illustration>
  );
}
