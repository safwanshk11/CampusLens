import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "accent" | "positive" | "warning" | "danger" | "glass" | "ink";

/** Text always uses the `-ink` colour variant so labels keep ≥4.5:1 contrast. */
const TONE: Record<BadgeTone, string> = {
  neutral: "bg-ink/5 text-ink-secondary",
  accent: "bg-azure/12 text-azure-ink",
  positive: "bg-positive/12 text-positive-ink",
  warning: "bg-warning/15 text-warning-ink",
  danger: "bg-danger/12 text-danger-ink",
  glass: "glass glass-quiet text-ink",
  ink: "bg-ink text-white",
};

const DOT: Record<BadgeTone, string> = {
  neutral: "bg-ink-tertiary",
  accent: "bg-azure",
  positive: "bg-positive",
  warning: "bg-warning",
  danger: "bg-danger",
  glass: "bg-azure",
  ink: "bg-ice",
};

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: BadgeTone;
  dot?: boolean;
};

export function Badge({ tone = "neutral", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-micro font-medium",
        TONE[tone],
        className,
      )}
      {...props}
    >
      {dot ? <span aria-hidden className={cn("size-1.5 rounded-full", DOT[tone])} /> : null}
      {children}
    </span>
  );
}
