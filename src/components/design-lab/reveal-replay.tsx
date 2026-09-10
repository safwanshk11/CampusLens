"use client";

import { RotateCcw } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DURATION } from "@/config/design";
import { gsap, useGSAP } from "@/lib/gsap";
import { gsapEase, MEDIA } from "@/lib/motion";

/** Replays the masked line reveal used by the hero headline. */
export function RevealReplay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: rootRef });

  const replay = contextSafe(() => {
    if (window.matchMedia(MEDIA.reducedMotion).matches) return;

    gsap
      .timeline()
      .fromTo(
        "[data-demo-line] > span",
        { yPercent: 110 },
        { yPercent: 0, duration: DURATION.cinematic, ease: gsapEase("cinematic"), stagger: 0.1 },
      )
      .fromTo(
        "[data-demo-meta]",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: DURATION.slow, ease: gsapEase("entrance") },
        "-=0.55",
      );
  });

  return (
    <div ref={rootRef} className="surface-solid flex flex-col gap-8 rounded-card p-6 sm:p-8">
      <p className="text-display-page font-medium text-ink">
        <span data-demo-line className="mask-line">
          <span>Motion describes</span>
        </span>
        <span data-demo-line className="mask-line">
          <span className="type-serif-accent">interaction.</span>
        </span>
      </p>
      <div data-demo-meta className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-label text-ink-tertiary">Masked line reveal · GSAP · prism-cinematic</p>
        <Button variant="secondary" size="sm" onClick={replay}>
          <RotateCcw aria-hidden className="size-3.5" strokeWidth={2} />
          Replay
        </Button>
      </div>
    </div>
  );
}
