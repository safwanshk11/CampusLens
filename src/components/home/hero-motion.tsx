"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { DURATION, HERO } from "@/config/design";
import { gsap, useGSAP } from "@/lib/gsap";
import { gsapEase, MEDIA } from "@/lib/motion";

/**
 * Hero choreography. The hero's markup is server-rendered; this wrapper only
 * finds the `data-hero*` hooks inside it and stages them.
 *
 *   0.10s  badge lifts in
 *   0.25s  headline lines rise through their masks
 *   0.50s  supporting copy and CTAs
 *   0.70s  glass search island rises and settles
 *   0.95s  floating data chips arrive, staggered
 *
 * Desktop adds three parallax depth planes. Reduced motion skips all of it and
 * the hero renders in its final state.
 */
export function HeroMotion({ className, children, ...props }: ComponentPropsWithoutRef<"section">) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add({ motion: MEDIA.motionOK, desktop: MEDIA.desktop }, (context) => {
        const { motion = false, desktop = false } = context.conditions ?? {};
        if (!motion) return;

        const t = HERO.timeline;
        const tl = gsap.timeline({ defaults: { ease: gsapEase("entrance") } });

        tl.fromTo("[data-hero='badge']", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DURATION.slow }, t.badge)
          .fromTo(
            "[data-hero-line] > span",
            { yPercent: 110 },
            { yPercent: 0, duration: DURATION.cinematic, ease: gsapEase("cinematic"), stagger: 0.11 },
            t.headline,
          )
          .fromTo(
            "[data-hero='copy']",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: DURATION.cinematic, stagger: 0.08 },
            t.copy,
          )
          .fromTo(
            "[data-hero='island']",
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: DURATION.cinematic },
            t.island,
          )
          .fromTo(
            "[data-hero='chip']",
            { opacity: 0, y: 18, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: DURATION.slow, stagger: 0.09 },
            t.chips,
          )
          .fromTo("[data-hero='rail']", { opacity: 0 }, { opacity: 1, duration: DURATION.slow }, t.chips + 0.2);

        if (desktop) {
          const { ambient, chips, strength } = HERO.parallax;
          const scrollTrigger = {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          };
          // Slower plane drifts down relative to the page; faster plane drifts up.
          gsap.to("[data-depth='ambient']", {
            y: () => root.offsetHeight * (1 - ambient) * strength,
            ease: "none",
            scrollTrigger,
          });
          gsap.to("[data-depth='chips']", {
            y: () => -root.offsetHeight * (chips - 1) * strength,
            ease: "none",
            scrollTrigger,
          });
        }
      });

      // Initial states are now inline, so the CSS pre-paint guard can be released.
      document.documentElement.setAttribute("data-hero-ready", "");

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={className} {...props}>
      {children}
    </section>
  );
}
