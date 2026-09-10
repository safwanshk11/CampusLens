import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";

/** Cinematic regime: full ambient atmosphere, editorial composition, staged motion. */
export default function CinematicLayout({ children }: { children: ReactNode }) {
  return <PageShell mode="cinematic">{children}</PageShell>;
}
