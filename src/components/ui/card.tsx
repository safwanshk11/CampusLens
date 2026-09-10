import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { GlassSurface } from "./glass-surface";

export type CardSurface = "quiet" | "elevated" | "solid";

const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
} as const;

type CardProps = ComponentPropsWithoutRef<"div"> & {
  /** `quiet` / `elevated` glass for cinematic contexts, `solid` for dense intelligence-mode data. */
  surface?: CardSurface;
  padding?: keyof typeof PADDING;
  /** Hover lift and edge-light response for cards that link somewhere. */
  interactive?: boolean;
};

export function Card({ surface = "elevated", padding = "md", interactive = false, className, ...props }: CardProps) {
  const classes = cn("rounded-card", PADDING[padding], interactive && "card-interactive", className);

  if (surface === "solid") {
    return <div className={cn("surface-solid", classes)} {...props} />;
  }

  return <GlassSurface level={surface} className={classes} {...props} />;
}
