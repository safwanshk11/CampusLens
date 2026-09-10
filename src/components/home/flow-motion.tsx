"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { DURATION } from "@/config/design";
import { gsap, useGSAP } from "@/lib/gsap";
import { gsapEase, MEDIA } from "@/lib/motion";

/**
 * Search → Inspect → Compare → Save.
 *
 * Desktop: the SVG connector draws itself with scroll. Mobile: a vertical rule
 * scales down the list (transform only). Nodes rise in once. Reduced motion:
 * the connector is simply drawn and every node is visible.
 */
export function FlowMotion({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add({ motion: MEDIA.motionOK, desktop: MEDIA.desktop }, (context) => {
        const { motion = false, desktop = false } = context.conditions ?? {};
        if (!motion) return;

        gsap.fromTo(
          "[data-flow-reveal]",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.cinematic,
            ease: gsapEase("entrance"),
            stagger: 0.08,
            scrollTrigger: { trigger: root, start: "top 80%", once: true },
          },
        );

        if (desktop) {
          gsap.fromTo(
            "[data-flow-path]",
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 60%", scrub: true },
            },
          );
        } else {
          gsap.fromTo(
            "[data-flow-rule]",
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "50% 0%",
              scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 60%", scrub: true },
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className} {...props}>
      {children}
    </div>
  );
}
