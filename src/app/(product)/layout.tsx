import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";

/** Intelligence regime: quiet atmosphere, solid surfaces, dense and scannable. */
export default function ProductLayout({ children }: { children: ReactNode }) {
  return <PageShell mode="intelligence">{children}</PageShell>;
}
