import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowRight, ScanSearch, CircleAlert } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import { Button, ButtonLink, buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterPanel } from "@/components/discover/filter-panel";
import { SearchForm } from "@/components/discover/search-form";
import { CollegeCard } from "@/components/discover/college-card";
import { CompareTray } from "@/components/discover/compare-toggle";
import { parseCollegeQuery } from "@/server/colleges/query";
import {
  searchColleges,
  type CollegeSearchResponse,
} from "@/server/colleges/search";

export const metadata: Metadata = {
  title: "Discover",
  description: "Find colleges by course, city, annual fees and ratings.",
};
export const dynamic = "force-dynamic";

export default async function DiscoverPage({
  searchParams,
}: PageProps<"/discover">) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    for (const item of Array.isArray(value)
      ? value
      : value === undefined
        ? []
        : [value]) {
      // Native GET forms send blank controls. Omit those on the UI route only.
      if (item.trim()) params.append(key, item);
    }
  }
  if (!params.has("pageSize")) params.set("pageSize", "6");
  const searchParamsOnly = new URLSearchParams(params);
  searchParamsOnly.delete("compare");
  const parsed = parseCollegeQuery(searchParamsOnly);
  let results: CollegeSearchResponse | undefined;
  let unavailable = false;
  if (parsed.success) {
    try {
      results = await searchColleges(parsed.data);
    } catch {
      unavailable = true;
      console.error("Discovery data unavailable.");
    }
  }
  const value = (key: string) => params.get(key) || "";
  const href = (key: string, next?: string) => {
    const copy = new URLSearchParams(params);
    copy.delete("page");
    if (next === undefined) copy.delete(key);
    else copy.set(key, next);
    return `/discover?${copy.toString()}`;
  };
  const filterLabels: Record<string, string> = {
    q: "Search",
    city: "City",
    state: "State",
    ownership: "Institution",
    discipline: "Discipline",
    degreeLevel: "Degree",
    minFee: "Min fee ₹",
    maxFee: "Max fee ₹",
    minRating: "Min rating",
  };
  const active = [...params].filter(
    ([key]) => !["page", "pageSize", "sort", "compare"].includes(key),
  );
  const select = (
    name: string,
    label: string,
    options: [string, string][],
    placeholder = "Any",
  ) => (
    <label
      className="flex flex-col gap-2 text-label font-medium text-ink"
      htmlFor={`filter-${name}`}
      key={name}
    >
      {label}
      <select
        id={`filter-${name}`}
        name={name}
        defaultValue={value(name) || (name === "sort" ? "name_asc" : "")}
        className="h-12 w-full min-w-0 rounded-control bg-surface px-3 text-control shadow-control ring-1 ring-line"
      >
        {name !== "sort" && <option value="">{placeholder}</option>}
        {options.map(([id, text]) => (
          <option key={id} value={id}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <Container className="pb-20 pt-36 sm:pt-40">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-4 text-azure-ink">CampusLens / Discover</p>
          <h1 className="text-display-page text-ink">
            A clearer view of
            <br />
            your next chapter.
          </h1>
        </div>
        <p className="max-w-sm text-body text-ink-secondary">
          Find the courses, cities and fees that fit. Start broad, then make the
          choice yours.
        </p>
      </header>
      <SearchForm key={params.toString()}>
        {value("compare") && (
          <input type="hidden" name="compare" value={value("compare")} />
        )}
        <div className="mb-8 flex flex-col gap-3 rounded-card glass glass-quiet p-4 sm:flex-row sm:items-end sm:p-5">
          <Input
            id="college-search"
            label="Search colleges"
            name="q"
            type="search"
            maxLength={100}
            placeholder="College name, course or city"
            defaultValue={value("q")}
            icon={Search}
            className="flex-1"
          />
          <Button
            type="submit"
            icon={ArrowRight}
            className="h-12 group-aria-busy/search:opacity-50"
          >
            Search colleges
          </Button>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <Card surface="quiet" padding="sm">
              <FilterPanel>
                <div className="mt-5 grid gap-5">
                  <Input
                    id="filter-city"
                    label="City"
                    name="city"
                    defaultValue={value("city")}
                    placeholder="e.g. Bengaluru"
                    maxLength={100}
                  />
                  <Input
                    id="filter-state"
                    label="State / territory"
                    name="state"
                    defaultValue={value("state")}
                    placeholder="e.g. Karnataka"
                    maxLength={100}
                  />
                  {select("ownership", "Institution type", [
                    ["PUBLIC", "Public"],
                    ["PRIVATE", "Private"],
                    ["DEEMED", "Deemed university"],
                  ])}
                  <Input
                    id="filter-discipline"
                    label="Discipline"
                    name="discipline"
                    defaultValue={value("discipline")}
                    placeholder="e.g. Engineering"
                    maxLength={100}
                  />
                  {select("degreeLevel", "Degree level", [
                    ["UNDERGRADUATE", "Undergraduate"],
                    ["POSTGRADUATE", "Postgraduate"],
                    ["DIPLOMA", "Diploma"],
                  ])}
                  <fieldset>
                    <legend className="mb-3 text-label font-medium">
                      Annual tuition · INR
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        id="filter-min"
                        label="Minimum"
                        name="minFee"
                        type="number"
                        min={0}
                        max={2147483647}
                        defaultValue={value("minFee")}
                        placeholder="0"
                      />
                      <Input
                        id="filter-max"
                        label="Maximum"
                        name="maxFee"
                        type="number"
                        min={0}
                        max={2147483647}
                        defaultValue={value("maxFee")}
                        placeholder="Any"
                      />
                    </div>
                  </fieldset>
                  <Input
                    id="filter-rating"
                    label="Minimum rating"
                    name="minRating"
                    type="number"
                    min={0}
                    max={5}
                    step="0.01"
                    defaultValue={value("minRating")}
                    placeholder="Any · out of 5"
                  />
                  <Button type="submit">Apply filters</Button>
                  <ButtonLink href="/discover" variant="ghost">
                    Reset all
                  </ButtonLink>
                </div>
              </FilterPanel>
            </Card>
          </aside>
          <section
            aria-labelledby="results-heading"
            className="min-w-0 lg:col-span-9"
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-2 text-ink-tertiary">
                  Your possibilities
                </p>
                <h2
                  id="results-heading"
                  className="text-xl font-medium"
                  aria-live="polite"
                >
                  {results
                    ? `${results.pagination.total} ${results.pagination.total === 1 ? "college" : "colleges"} found`
                    : "College results"}
                </h2>
              </div>
              <div className="flex items-end gap-2">
                {select(
                  "sort",
                  "Sort results",
                  [
                    ["name_asc", "Name · A–Z"],
                    ["fee_asc", "Lowest starting fee"],
                    ["fee_desc", "Highest starting fee"],
                    ["rating_desc", "Highest rating"],
                  ],
                  "Name · A–Z",
                )}
                <Button type="submit" variant="secondary">
                  Sort
                </Button>
              </div>
            </div>
            {value("pageSize") && (
              <input type="hidden" name="pageSize" value={value("pageSize")} />
            )}
            {active.length > 0 && (
              <div
                className="mb-5 flex flex-wrap gap-2"
                aria-label="Applied filters"
              >
                {active.map(([key, item]) => (
                  <Link
                    key={key}
                    href={href(key)}
                    className="inline-flex min-h-11 items-center gap-3 rounded-full bg-ink px-4 text-label text-white"
                    aria-label={`Remove ${key}: ${item}`}
                  >
                    <span className="max-w-48 truncate">
                      {filterLabels[key] || key}:{" "}
                      {item.replaceAll("_", " ").toLowerCase()}
                    </span>
                    <span aria-hidden>×</span>
                  </Link>
                ))}
              </div>
            )}
            {results?.meta.demoDataNotice && (
              <p className="mb-6 border-l-2 border-azure pl-3 text-label text-ink-secondary">
                Illustrative catalogue · These colleges and figures are
                fictional. Use them to explore the experience.
              </p>
            )}
            {!parsed.success ? (
              <EmptyState
                icon={CircleAlert}
                title="Check your search filters"
                description={parsed.issues
                  .map((issue) => `${issue.field}: ${issue.message}`)
                  .join(". ")}
                action={<ButtonLink href="/discover">Reset search</ButtonLink>}
              />
            ) : unavailable ? (
              <EmptyState
                icon={CircleAlert}
                title="College search is unavailable"
                description="We couldn’t load the catalogue. Try again in a moment."
                action={
                  <a
                    href={`/discover?${params.toString()}`}
                    className={buttonClassName({})}
                  >
                    Try again
                  </a>
                }
              />
            ) : results && results.data.length === 0 ? (
              <EmptyState
                icon={ScanSearch}
                title={
                  results.pagination.total
                    ? "You’ve reached the end"
                    : "Give your search a little more room"
                }
                description={
                  results.pagination.total
                    ? "There are no results on this page. Return to the first page to see your matches."
                    : "Try a different city, widen your fee range, or remove a filter."
                }
                action={
                  <ButtonLink
                    href={
                      results.pagination.total ? href("page", "1") : "/discover"
                    }
                  >
                    {results.pagination.total ? "First page" : "Clear filters"}
                  </ButtonLink>
                }
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {results?.data.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    returnTo={`/discover?${params.toString()}`}
                  />
                ))}
              </div>
            )}
            {results && results.pagination.totalPages > 0 && (
              <nav
                aria-label="Results pages"
                className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6"
              >
                <span className="text-label text-ink-secondary">
                  Page {results.pagination.page} of{" "}
                  {results.pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  {results.pagination.hasPreviousPage && (
                    <ButtonLink
                      href={href(
                        "page",
                        String(
                          Math.min(
                            results.pagination.page - 1,
                            results.pagination.totalPages,
                          ),
                        ),
                      )}
                      variant="secondary"
                    >
                      Previous
                    </ButtonLink>
                  )}
                  {results.pagination.hasNextPage && (
                    <ButtonLink
                      href={href("page", String(results.pagination.page + 1))}
                      variant="secondary"
                    >
                      Next
                      <ArrowRight aria-hidden className="size-4" />
                    </ButtonLink>
                  )}
                </div>
              </nav>
            )}
          </section>
        </div>
      </SearchForm>
      <CompareTray />
    </Container>
  );
}
