import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const SPACING = {
  /** Cinematic breathing room between major homepage moments. */
  cinematic: "py-(--space-section-cinematic)",
  standard: "py-(--space-section-standard)",
  /** Denser rhythm for intelligence-mode product pages. */
  compact: "py-(--space-section-compact)",
  none: "",
} as const;

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  spacing?: keyof typeof SPACING;
};

export function Section({ spacing = "standard", className, ...props }: SectionProps) {
  return <section className={cn("relative", SPACING[spacing], className)} {...props} />;
}
