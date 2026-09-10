import { ArrowUpRight, GraduationCap, MapPin, Star } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompareCheck } from "@/components/ui/compare-check";
import { GlassSurface } from "@/components/ui/glass-surface";
import { SaveButton } from "@/components/ui/save-button";
import { CollegeCardSkeleton } from "@/components/ui/skeleton";
import { LabGroup, LabSection, SpecimenCaption } from "./lab-section";

type SpecimenCollege = {
  name: string;
  city: string;
  rating: string;
  ownership: string;
  established: number;
  course: string;
  fees: string;
  medianPackage: string;
  placed: number;
};

/** Fictional institutions. These cards define a layout contract, not data. */
const SPECIMENS: readonly SpecimenCollege[] = [
  {
    name: "Northfield Institute of Technology",
    city: "Pune, Maharashtra",
    rating: "4.4",
    ownership: "Private",
    established: 1998,
    course: "B.Tech Computer Science",
    fees: "₹2.4L",
    medianPackage: "₹9.6L",
    placed: 88,
  },
  {
    name: "Riverside College of Engineering",
    city: "Chennai, Tamil Nadu",
    rating: "4.1",
    ownership: "Autonomous",
    established: 1985,
    course: "B.E. Electronics",
    fees: "₹1.6L",
    medianPackage: "₹6.8L",
    placed: 81,
  },
];

function CollegeCardBody({ college }: { college: SpecimenCollege }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Badge tone="accent" dot>
            Specimen data
          </Badge>
          <h4 className="mt-3 text-xl font-medium tracking-heading text-balance text-ink">{college.name}</h4>
          <p className="mt-1 flex items-center gap-1.5 text-label text-ink-tertiary">
            <MapPin aria-hidden className="size-3.5" strokeWidth={1.75} />
            {college.city}
          </p>
        </div>
        <SaveButton itemName={college.name} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-label">
        <span className="inline-flex items-center gap-1 font-semibold text-ink tabular-nums">
          <Star aria-hidden className="size-3.5 fill-current text-warning" strokeWidth={1.75} />
          {college.rating}
          <span className="sr-only"> out of 5</span>
        </span>
        <span aria-hidden className="size-1 rounded-full bg-line-strong" />
        <span className="text-ink-secondary">{college.ownership}</span>
        <span aria-hidden className="size-1 rounded-full bg-line-strong" />
        <span className="text-ink-secondary">Est. {college.established}</span>
      </div>

      <p className="mt-4 inline-flex h-8 items-center gap-2 rounded-full bg-ink/5 px-3 text-label font-medium text-ink">
        <GraduationCap aria-hidden className="size-3.5" strokeWidth={1.75} />
        {college.course}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
        <div>
          <dt className="text-micro text-ink-tertiary">Fees / year</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-heading text-ink tabular-nums">{college.fees}</dd>
        </div>
        <div>
          <dt className="text-micro text-ink-tertiary">Median package</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-heading text-ink tabular-nums">{college.medianPackage}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <div className="flex items-center justify-between text-micro">
          <span className="text-ink-tertiary">Students placed</span>
          <span className="font-medium text-ink tabular-nums">{college.placed}%</span>
        </div>
        <div aria-hidden className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/5">
          <div className="h-full rounded-full bg-positive" style={{ width: `${college.placed}%` }} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <CompareCheck itemName={college.name} />
        <ButtonLink href="#cards" variant="ghost" className="-mr-2">
          View details
          <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.75} />
        </ButtonLink>
      </div>
    </>
  );
}

function Column({ caption, detail, children }: { caption: string; detail: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      {children}
      <SpecimenCaption name={caption} detail={detail} />
    </div>
  );
}

const TABLE_ROWS = [
  { name: "Northfield Institute of Technology", fees: "₹2.40L", pkg: "₹9.60L", rating: "4.4", placed: "88%" },
  { name: "Riverside College of Engineering", fees: "₹1.60L", pkg: "₹6.80L", rating: "4.1", placed: "81%" },
  { name: "Lakeview University", fees: "₹3.10L", pkg: "₹11.20L", rating: "4.5", placed: "91%" },
  { name: "Eastgate Institute of Science", fees: "₹0.95L", pkg: "₹5.40L", rating: "3.9", placed: "74%" },
] as const;

export function CardsLab() {
  return (
    <LabSection
      id="cards"
      index="04"
      title="Cards"
      description="A college card is an information object. Identity first, then the three numbers students scan for — fees, package, placement — then actions."
    >
      <LabGroup title="College card contract" note="Glass for cinematic contexts · solid for dense results">
        <div className="grid gap-8 lg:grid-cols-3">
          <Column caption="Elevated glass" detail="Pointer tilt ≤ 1.5° · edge catches light">
            <GlassSurface level="elevated" interactive={{ tilt: true }} className="glass-responsive rounded-card p-6">
              <CollegeCardBody college={SPECIMENS[0]!} />
            </GlassSurface>
          </Column>
          <Column caption="Solid · intelligence mode" detail="Opaque surface for result grids">
            <Card surface="solid" padding="lg" interactive>
              <CollegeCardBody college={SPECIMENS[1]!} />
            </Card>
          </Column>
          <Column caption="Loading" detail="Same footprint, frosted sweep">
            <CollegeCardSkeleton />
          </Column>
        </div>
      </LabGroup>

      <LabGroup title="Intelligence table" note="Dense, aligned, tabular numerals">
        <Card surface="solid" padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left">
              <caption className="sr-only">Specimen comparison table with fictional colleges</caption>
              <thead className="bg-canvas">
                <tr className="border-b border-line">
                  {["College", "Fees / year", "Median package", "Rating", "Placed"].map((heading, index) => (
                    <th
                      key={heading}
                      scope="col"
                      className={index === 0 ? "eyebrow px-5 py-3.5 font-normal" : "eyebrow px-5 py-3.5 text-right font-normal"}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.name} className="border-b border-line last:border-b-0 hover:bg-canvas/70">
                    <th scope="row" className="px-5 py-4 text-label font-medium text-ink">
                      {row.name}
                    </th>
                    <td className="px-5 py-4 text-right text-control text-ink tabular-nums">{row.fees}</td>
                    <td className="px-5 py-4 text-right text-control text-ink tabular-nums">{row.pkg}</td>
                    <td className="px-5 py-4 text-right text-control text-ink tabular-nums">{row.rating}</td>
                    <td className="px-5 py-4 text-right text-control text-ink tabular-nums">{row.placed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </LabGroup>
    </LabSection>
  );
}
