import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MapPin, CircleAlert } from "lucide-react";
import { getCollegeDetail } from "@/server/colleges/detail";
import {
  formatInr,
  ownershipLabel,
  placementRate,
  safeWebsite,
  discoveryReturn,
} from "@/lib/college-display";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { currentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const college = await getCollegeDetail((await params).slug);
    return {
      title: college?.name || "College not found",
      description: college
        ? `${college.name}: courses, annual fees, placements and reviews in ${college.city}.`
        : undefined,
      ...(college?.isDemo ? { robots: { index: false } } : {}),
    };
  } catch {
    return { title: "College details" };
  }
}
export default async function CollegePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const incoming = await searchParams;
  if (!(await currentUser().catch(() => null))) {
    redirect(`/sign-in?next=${encodeURIComponent(`/colleges/${slug}${incoming.from ? `?from=${encodeURIComponent(Array.isArray(incoming.from) ? incoming.from[0] : incoming.from)}` : ""}`)}`);
  }
  const back = discoveryReturn(incoming.from);
  let college;
  try {
    college = await getCollegeDetail(slug);
  } catch {
    return (
      <Container className="pt-40 pb-20">
        <EmptyState
          icon={CircleAlert}
          title="College details are unavailable"
          description="We couldn’t load this college. Try again in a moment."
          action={
            <a
              className={buttonClassName({})}
              href={`/colleges/${encodeURIComponent(slug)}`}
            >
              Try again
            </a>
          }
        />
      </Container>
    );
  }
  if (!college) notFound();
  const latest = college.placements[0];
  const website = safeWebsite(college.websiteUrl);
  const campusPhoto = college.isDemo
    ? "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=2000&q=85"
    : safeWebsite(college.imageUrl);
  return (
    <Container className="pt-32 pb-20 sm:pt-40">
      <ButtonLink href={back} variant="ghost" className="mb-8">
        <ArrowLeft aria-hidden className="size-4" />
        Back to results
      </ButtonLink>
      <header className="relative isolate overflow-hidden rounded-panel border border-line bg-surface p-6 shadow-glass-1 sm:p-10 lg:p-12">
        {campusPhoto && <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(campusPhoto)})` }} />}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(248,250,252,0.98)_0%,rgba(248,250,252,0.93)_40%,rgba(248,250,252,0.55)_100%)]" />
        <p className="eyebrow mb-6 text-azure-ink">CampusLens / Campus profile</p>
        <div className="mb-5 flex flex-wrap gap-2">
          <Badge tone="neutral">{ownershipLabel[college.ownership]}</Badge>
          {college.isDemo && <Badge tone="accent">Illustrative data</Badge>}
        </div>
        <h1 className="max-w-3xl text-display-page text-balance tracking-tight leading-[1.08]">{college.name}</h1>
        <p className="mt-5 flex flex-wrap items-center gap-2 text-body text-ink-secondary">
          <MapPin aria-hidden className="size-4" />
          {college.city}, {college.state}
          <span aria-hidden>·</span>Established {college.established}
        </p>
        {college.isDemo && (
          <p className="mt-6 max-w-xl border-l-2 border-azure pl-4 text-label leading-relaxed text-ink-secondary">
            This profile uses illustrative courses, fees, placement figures
            and reviews. These are not verified admissions information.
          </p>
        )}
        {college.isDemo && <a href="https://unsplash.com/photos/Ucr4Yp-t364" target="_blank" rel="noopener noreferrer" className="mt-8 inline-block rounded-full bg-white/80 px-3 py-2 text-xs text-ink-secondary backdrop-blur-sm hover:text-ink">Illustrative campus photo · Unsplash ↗</a>}
      </header>
      <dl className="my-10 grid gap-6 border-y border-line py-8 sm:grid-cols-3">
        {[
          [
            "Annual tuition from",
            formatInr(college.courses[0]?.annualFeeInr ?? null),
          ],
          [
            latest
              ? `${latest.year} median annual salary`
              : "Median annual salary",
            formatInr(latest?.medianSalaryInr ?? null),
          ],
          [
            "College rating",
            college.averageRating === null
              ? "Not yet rated"
              : `${college.averageRating.toFixed(1)} / 5 · ${college.reviewCount} ${college.reviewCount === 1 ? "review" : "reviews"}`,
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-label text-ink-secondary">{label}</dt>
            <dd className="mt-3 text-2xl font-medium tracking-heading tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <nav aria-label="College sections" className="mb-12 flex flex-wrap gap-2">
        {[
          ["overview", "Overview"],
          ["courses", "Courses & fees"],
          ["placements", "Placements"],
          ["reviews", "Reviews"],
        ].map(([id, title]) => (
          <a
            key={id}
            href={`#${id}`}
            className={buttonClassName({ variant: "glass" })}
          >
            {title}
          </a>
        ))}
      </nav>
      <section id="overview" className="mb-16 scroll-mt-32">
        <p className="eyebrow mb-3 text-azure-ink">The institution</p>
        <h2 className="mb-5 text-2xl font-medium">Overview</h2>
        <p className="max-w-3xl text-body leading-relaxed text-ink-secondary">
          {college.overview}
        </p>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClassName({ variant: "secondary" })} mt-5`}
          >
            Institution website
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        )}
      </section>
      <section id="courses" className="mb-16 scroll-mt-32">
        <p className="eyebrow mb-3 text-azure-ink">What you can study</p>
        <h2 className="text-2xl font-medium">Courses & fees</h2>
        <p className="mt-3 mb-6 text-body text-ink-secondary">
          Annual tuition in INR. Hostel, meals and living expenses are excluded.
          All offered programmes are shown here.
        </p>
        {college.courses.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {college.courses.map((course) => (
              <Card key={course.id} surface="solid">
                <p className="mb-3 text-label text-azure-ink">
                  {course.discipline} · {course.degreeLevel.toLowerCase()}
                </p>
                <h3 className="text-xl font-medium">{course.name}</h3>
                <dl className="my-5 flex flex-wrap gap-8 border-y border-line py-4">
                  <div>
                    <dt className="text-label text-ink-secondary">Duration</dt>
                    <dd className="mt-2 font-medium">
                      {course.durationMonths % 12 === 0
                        ? `${course.durationMonths / 12} years`
                        : `${course.durationMonths} months`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-label text-ink-secondary">
                      Annual tuition
                    </dt>
                    <dd className="mt-2 font-medium tabular-nums">
                      {formatInr(course.annualFeeInr)}
                    </dd>
                  </div>
                </dl>
                <p className="text-label leading-relaxed text-ink-secondary">
                  <span className="font-medium text-ink">Eligibility: </span>
                  {course.eligibility}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-body text-ink-secondary">
            Course information is not available for this college.
          </p>
        )}
      </section>
      <section id="placements" className="mb-16 scroll-mt-32">
        <p className="eyebrow mb-3 text-azure-ink">After graduation</p>
        <h2 className="text-2xl font-medium">Placement history</h2>
        <p className="mt-3 mb-6 text-body text-ink-secondary">
          College-wide reports, newest first. Salaries are annual INR;
          unavailable figures stay unreported.
        </p>
        {college.placements.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {college.placements.map((report) => (
              <Card key={report.year} surface="solid">
                <h3 className="mb-5 text-xl font-medium">
                  {report.year} report
                </h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    ["Median salary", formatInr(report.medianSalaryInr)],
                    ["Average salary", formatInr(report.averageSalaryInr)],
                    ["Highest salary", formatInr(report.highestSalaryInr)],
                    [
                      "Placement rate",
                      placementRate(
                        report.placedStudents,
                        report.eligibleStudents,
                      ),
                    ],
                    [
                      "Eligible students",
                      report.eligibleStudents ?? "Unavailable",
                    ],
                    ["Placed students", report.placedStudents ?? "Unavailable"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-label text-ink-secondary">{label}</dt>
                      <dd className="mt-2 font-medium tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
                {safeWebsite(report.sourceUrl) && (
                  <a
                    href={safeWebsite(report.sourceUrl)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center text-label text-azure-ink underline"
                  >
                    Read source report
                  </a>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-body text-ink-secondary">
            No placement reports are available for this college.
          </p>
        )}
      </section>
      <section id="reviews" className="scroll-mt-32">
        <p className="eyebrow mb-3 text-azure-ink">Campus perspectives</p>
        <h2 className="mb-3 text-2xl font-medium">Reviews</h2>
        {college.reviews.length ? (
          <>
            <p className="mb-6 text-label text-ink-secondary">
              Showing {college.reviews.length} of {college.reviewCount} reviews,
              newest first. The rating includes all reviews.
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {college.reviews.map((review) => (
                <Card surface="solid" key={review.id}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{review.rating} / 5</span>
                    {review.isDemo && (
                      <Badge tone="accent">Illustrative review</Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-medium">{review.title}</h3>
                  <p className="mt-3 text-body text-ink-secondary">
                    {review.body}
                  </p>
                  <p className="mt-5 text-label text-ink-tertiary">
                    <time dateTime={review.createdAt.toISOString()}>
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeZone: "UTC",
                      }).format(review.createdAt)}
                    </time>
                  </p>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <p className="text-body text-ink-secondary">
            No reviews yet. This college has not been rated.
          </p>
        )}
      </section>
    </Container>
  );
}
