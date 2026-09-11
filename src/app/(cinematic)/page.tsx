import { FinalCta } from "@/components/home/final-cta";
import { FlowSection } from "@/components/home/flow-section";
import { Hero } from "@/components/home/hero";
import { KineticStatement } from "@/components/home/kinetic-statement";
import { ProductBento } from "@/components/home/product-bento";
import { StackShowcase } from "@/components/home/stack-showcase";
import { currentUser } from "@/server/auth/session";

/**
 * Homepage — a visual prototype of the CampusLens journey.
 *
 * Scroll rhythm: cinematic hero → quiet statement → product bento →
 * strong sticky-stack moment → calm flow explanation → closing CTA.
 */
export default async function HomePage() {
  const signedIn = Boolean(await currentUser().catch(() => null));
  return (
    <>
      <Hero signedIn={signedIn} />
      <KineticStatement />
      <ProductBento />
      <StackShowcase />
      <FlowSection />
      <FinalCta signedIn={signedIn} />
    </>
  );
}
