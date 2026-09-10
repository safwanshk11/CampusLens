import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Optional context label. Use sparingly — most headings should stand on their own. */
  eyebrow?: string;
  id?: string;
  as?: "h1" | "h2" | "h3";
  size?: "section" | "page";
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({
  title,
  description,
  eyebrow,
  id,
  as: Heading = "h2",
  size = "section",
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-6", align === "center" && "items-center text-center", className)}>
      {eyebrow ? <p className="text-label font-medium text-ink-secondary">{eyebrow}</p> : null}
      <Heading
        id={id}
        className={cn(
          "font-medium text-balance text-ink",
          size === "section" ? "text-display-section" : "text-display-page",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="max-w-measure text-body-lg text-pretty text-ink-secondary">{description}</p>
      ) : null}
    </div>
  );
}
