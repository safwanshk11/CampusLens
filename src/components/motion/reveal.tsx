"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { DURATION, REVEAL } from "@/config/design";
import { gsap, useGSAP } from "@/lib/gsap";
import { gsapEase, MEDIA } from "@/lib/motion";

type RevealProps = ComponentPropsWithoutRef<"div"> & {
  /** Animate each direct child in sequence rather than the wrapper. */
  stagger?: boolean;
  delay?: number;
};

/**
 * Scroll-triggered entrance: opacity and a short rise, played once.
 *
 * Use `stagger` whenever the children are glass surfaces. Fading an *ancestor* of
 * a glass surface makes that ancestor a Backdrop Root, so the glass would sample
 * nothing and lose its blur for the length of the fade. Fading the surface itself
 * does not have that problem.
 *
 * Opacity is used instead of GSAP's autoAlpha on purpose: `visibility: hidden`
 * would remove not-yet-revealed links from the keyboard tab order.
 */
export function Reveal({ stagger = false, delay = 0, className, children, ...props }: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const targets = stagger ? Array.from(root.children) : [root];
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motionOK, () => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: REVEAL.distance },
          {
            opacity: 1,
            y: 0,
            delay,
            duration: DURATION.cinematic,
            ease: gsapEase("entrance"),
            stagger: stagger ? REVEAL.stagger : 0,
            clearProps: "transform",
            scrollTrigger: { trigger: root, start: REVEAL.start, once: true },
          },
        );
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
