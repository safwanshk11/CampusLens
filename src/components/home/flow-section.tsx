import { Bookmark, GitCompareArrows, Layers, Search, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FlowMotion } from "./flow-motion";

type FlowNode = { icon: LucideIcon; label: string; detail: string };

const NODES: readonly FlowNode[] = [
  { icon: Search, label: "Search", detail: "Find colleges by name, course or city." },
  { icon: Layers, label: "Inspect", detail: "Read fees, courses and placements in one structure." },
  { icon: GitCompareArrows, label: "Compare", detail: "Line up the finalists field by field." },
  { icon: Bookmark, label: "Save", detail: "Keep your shortlist and return to it later." },
];

/** A gentle wave through the four node centres (x = 125, 375, 625, 875). */
const CONNECTOR_PATH = "M125 60 C 208 12 292 108 375 60 S 542 12 625 60 S 792 108 875 60";

/** A calm explanatory beat after the stack. Motion here is quiet on purpose. */
export function FlowSection() {
  return (
    <Section spacing="cinematic" aria-labelledby="flow-title">
      <Container>
        <SectionHeading
          id="flow-title"
          align="center"
          className="mx-auto"
          title={
            <>
              Search, inspect, compare, <span className="type-serif-accent">save.</span>
            </>
          }
          description="Every screen hands off to the next, so you never lose context — or a college you liked."
        />

        <FlowMotion className="relative mt-16 lg:mt-24">
          {/* Desktop connector */}
          <svg
            aria-hidden
            viewBox="0 0 1000 120"
            className="pointer-events-none absolute inset-x-0 top-8 hidden w-full -translate-y-1/2 overflow-visible lg:block"
          >
            <path d={CONNECTOR_PATH} fill="none" className="stroke-line-strong" strokeWidth="1.5" strokeDasharray="2 6" />
            <path
              data-flow-path
              d={CONNECTOR_PATH}
              fill="none"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="0"
              className="stroke-ink"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Mobile rule */}
          <span aria-hidden className="absolute bottom-8 left-8 top-8 w-px bg-line lg:hidden">
            <span data-flow-rule className="block h-full w-full bg-ink" />
          </span>

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
            {NODES.map((node) => {
              const Icon = node.icon;
              return (
                <li key={node.label} className="flex gap-5 lg:flex-col lg:items-center lg:gap-6 lg:text-center">
                  <span
                    data-flow-reveal
                    className="glass glass-elevated grid size-16 shrink-0 place-items-center rounded-full text-ink"
                  >
                    <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <span data-flow-reveal className="flex flex-col gap-2 pt-3 lg:pt-0">
                    <span className="text-xl font-medium tracking-heading text-ink">{node.label}</span>
                    <span className="max-w-[26ch] text-body text-ink-secondary">{node.detail}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </FlowMotion>
      </Container>
    </Section>
  );
}
