"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";

const MUTED_OPACITY = 0.16;

/**
 * Scroll-reading text. Words marked `data-word` start muted and gain full contrast
 * in reading order as the passage crosses the viewport.
 *
 * - The text itself is server-rendered; this wrapper only animates it.
 * - `scrub: true` (not a number): Lenis already smooths the scroll, and a numeric
 *   scrub would add a second layer of lag on top.
 * - Screen readers read the full passage regardless of visual opacity.
 * - With reduced motion the passage simply renders at full contrast.
 */
export function ScrollWords({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const words = root.querySelectorAll<HTMLElement>("[data-word]");
      if (words.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add(MEDIA.motionOK, () => {
        gsap.fromTo(
          words,
          { opacity: MUTED_OPACITY },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
