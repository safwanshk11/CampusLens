import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LabSectionProps = {
  id: string;
  index: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function LabSection({ id, index, title, description, children }: LabSectionProps) {
  const headingId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-28 border-t border-line py-(--space-section-standard) first:border-t-0 first:pt-0"
    >
      <header className="flex flex-col gap-4">
        <p className="eyebrow">
          <span className="text-ink">{index}</span> / {title}
        </p>
        <h2 id={headingId} className="text-display-page font-medium text-ink">
          {title}
        </h2>
        <p className="max-w-measure text-body-lg text-pretty text-ink-secondary">{description}</p>
      </header>
      <div className="mt-12 flex flex-col gap-16">{children}</div>
    </section>
  );
}

export function LabGroup({
  title,
  note,
  children,
  className,
}: {
  title: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
        <h3 className="text-lg font-medium tracking-heading text-ink">{title}</h3>
        {note ? <p className="text-label text-ink-tertiary">{note}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function SpecimenCaption({ name, detail, className }: { name: string; detail?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-label font-medium text-ink">{name}</span>
      {detail ? <span className="text-micro text-ink-tertiary">{detail}</span> : null}
    </div>
  );
}
