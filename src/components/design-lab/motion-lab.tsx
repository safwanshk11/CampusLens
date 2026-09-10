import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GlassSurface } from "@/components/ui/glass-surface";
import { Magnetic } from "@/components/visual/magnetic";
import { CompareTrayDemo } from "./compare-tray-demo";
import { LabGroup, LabSection, SpecimenCaption } from "./lab-section";
import { RevealReplay } from "./reveal-replay";

const OWNERSHIP = [
  { owner: "GSAP + ScrollTrigger", scope: "Timelines, hero staging, parallax, scroll scrubbing, sticky stack" },
  { owner: "Lenis", scope: "Inertial wheel scrolling, synced to GSAP's ticker" },
  { owner: "Framer Motion", scope: "React presence and layout: mobile menu, compare tray, toggles" },
  { owner: "CSS", scope: "Hover, focus, press, colour and the slow ambient loops" },
] as const;

export function MotionLab() {
  return (
    <LabSection
      id="motion"
      index="05"
      title="Motion"
      description="Every movement describes hierarchy or state. One library per class of animation, one vocabulary of five curves, and a reduced-motion path for all of it."
    >
      <LabGroup title="Ownership" note="No two libraries animate the same thing">
        <ul className="grid gap-3 sm:grid-cols-2">
          {OWNERSHIP.map((item) => (
            <li key={item.owner} className="surface-solid rounded-control p-4">
              <SpecimenCaption name={item.owner} detail={item.scope} />
            </li>
          ))}
        </ul>
      </LabGroup>

      <LabGroup title="Reveal" note="Masked lines rise; nothing fades from nowhere">
        <RevealReplay />
      </LabGroup>

      <LabGroup title="Scroll reveal" note="Staggered on the glass surfaces themselves">
        <Reveal stagger className="grid gap-4 sm:grid-cols-3">
          {["Discover", "Compare", "Shortlist"].map((label, index) => (
            <Card key={label} surface="quiet" padding="md">
              <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-3 text-xl font-medium tracking-heading text-ink">{label}</p>
            </Card>
          ))}
        </Reveal>
      </LabGroup>

      <LabGroup title="Hover and pointer" note="Pointer effects are disabled on touch and with reduced motion">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Card surface="elevated" padding="lg" interactive className="min-h-40">
              <p className="text-lg font-medium tracking-heading text-ink">Hover lift</p>
              <p className="mt-2 text-body text-ink-secondary">Rises 2px; the specular edge brightens.</p>
            </Card>
            <SpecimenCaption name="CSS transition" detail="transform + edge opacity" />
          </div>

          <div className="flex flex-col gap-4">
            <GlassSurface level="hero" interactive={{ tilt: true }} className="glass-responsive min-h-40 rounded-island p-6">
              <p className="text-lg font-medium tracking-heading text-ink">Glass interaction</p>
              <p className="mt-2 text-body text-ink-secondary">Glare follows the pointer; tilt stays under 1.5°.</p>
            </GlassSurface>
            <SpecimenCaption name="InteractiveGlass" detail="rAF-coalesced transforms via refs" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="surface-solid grid min-h-40 place-items-center rounded-card p-6">
              <Magnetic>
                <ButtonLink href="#motion" size="lg" icon={ArrowUpRight}>
                  Magnetic CTA
                </ButtonLink>
              </Magnetic>
            </div>
            <SpecimenCaption name="Magnetic" detail="≤ 5px pull, spring return · major CTAs only" />
          </div>
        </div>
      </LabGroup>

      <LabGroup title="Compare tray" note="Framer Motion presence + layout">
        <CompareTrayDemo />
      </LabGroup>
    </LabSection>
  );
}
