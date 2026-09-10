import { CircleAlert, CircleCheck, SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { CompareCheck } from "@/components/ui/compare-check";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { CollegeCardSkeleton } from "@/components/ui/skeleton";
import { LabGroup, LabSection } from "./lab-section";

function StatusMessage({
  tone,
  title,
  description,
  action,
}: {
  tone: "danger" | "positive";
  title: string;
  description: string;
  action: ReactNode;
}) {
  const Icon = tone === "danger" ? CircleAlert : CircleCheck;
  return (
    <Card surface="solid" padding="md">
      <div className="flex gap-4">
        <span
          className={
            tone === "danger"
              ? "grid size-10 shrink-0 place-items-center rounded-full bg-danger/12 text-danger-ink"
              : "grid size-10 shrink-0 place-items-center rounded-full bg-positive/12 text-positive-ink"
          }
        >
          <Icon aria-hidden className="size-5" strokeWidth={1.75} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-body font-medium text-ink">{title}</p>
          <p className="text-body text-pretty text-ink-secondary">{description}</p>
          <div className="mt-3 flex flex-wrap gap-2">{action}</div>
        </div>
      </div>
    </Card>
  );
}

export function StatesLab() {
  return (
    <LabSection
      id="states"
      index="06"
      title="States"
      description="Glass never hides state. Loading, empty, error, success, disabled and focus each read clearly at a glance."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <LabGroup title="Loading" note="Low-key light sweep">
          <CollegeCardSkeleton />
        </LabGroup>

        <LabGroup title="Empty" note="Object · headline · explanation · recovery">
          <Card surface="solid" padding="none">
            <EmptyState
              icon={SearchX}
              title="No colleges match these filters"
              description="Try widening the fee range or removing a city. Your search text is kept."
              action={<Button variant="secondary">Clear filters</Button>}
            />
          </Card>
        </LabGroup>

        <LabGroup title="Error">
          <StatusMessage
            tone="danger"
            title="We couldn’t load colleges"
            description="The connection dropped before results arrived. Nothing you entered was lost."
            action={
              <Button variant="secondary" size="sm">
                Try again
              </Button>
            }
          />
        </LabGroup>

        <LabGroup title="Success">
          <StatusMessage
            tone="positive"
            title="Added to your shortlist"
            description="Northfield Institute of Technology is now saved."
            action={
              <Button variant="ghost" size="sm">
                Undo
              </Button>
            }
          />
        </LabGroup>

        <LabGroup title="Disabled" note="45% opacity, no hover response">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled>Primary</Button>
              <Button variant="secondary" disabled>
                Secondary
              </Button>
              <Chip disabled>Chip</Chip>
              <CompareCheck itemName="Lakeview University" disabled />
            </div>
            <Input id="lab-state-disabled" label="Entrance exam" placeholder="Not available for this course" disabled />
          </div>
        </LabGroup>

        <LabGroup title="Focus" note="Press Tab anywhere on this page to see live focus rings">
          <div className="flex flex-wrap items-center gap-4">
            <span className="rounded-full outline-2 outline-offset-3 outline-focus">
              <Button tabIndex={-1}>Focused button</Button>
            </span>
            <span className="rounded-full outline-2 outline-offset-3 outline-focus">
              <Chip tabIndex={-1}>Focused chip</Chip>
            </span>
            <span className="flex h-12 items-center rounded-control bg-surface px-3.5 text-control text-ink-tertiary ring-2 ring-focus">
              Focused input
            </span>
          </div>
        </LabGroup>
      </div>
    </LabSection>
  );
}
