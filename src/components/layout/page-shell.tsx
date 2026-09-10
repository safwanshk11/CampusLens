import type { ReactNode } from "react";
import { AmbientScene, type AmbientVariant } from "@/components/visual/ambient-scene";
import { Footer } from "./footer";
import { Navigation } from "./navigation";

/**
 * Every page renders inside one of PRISM's two visual regimes:
 * - cinematic: homepage, marketing moments, the design lab
 * - intelligence: search, detail, compare, auth — calmer atmosphere, denser UI
 */
export function PageShell({ mode, children }: { mode: AmbientVariant; children: ReactNode }) {
  return (
    <>
      <AmbientScene variant={mode} />
      <Navigation />
      <main id="main" tabIndex={-1} data-mode={mode} className="relative z-content flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
