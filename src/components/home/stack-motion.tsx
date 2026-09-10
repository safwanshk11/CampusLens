"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { STACK } from "@/config/design";
import { gsap, useGSAP } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";

/**
 * Sticky glass-sheet stack (desktop + motion only).
 *
 * Pinning is plain CSS `position: sticky`. GSAP only scrubs the *covered* sheet:
 * as sheet N+1 slides up to its sticky offset, sheet N settles back (scale),
 * blurs via `filter`, and its content fades out — receding out of focus like a
 * physical sheet of glass sliding away.
 *
 * The glass surface's own opacity is never touched. A semi-transparent
 * backdrop-filter element lets the *unblurred* backdrop leak through in
 * proportion to its transparency, so fading the sheet's opacity would show the
 * sheet beneath it sharply. `filter: blur()` has no such problem — it blurs the
 * sheet's own already-composited pixels as a post-process — so it's safe to
 * combine with the sheet's `backdrop-filter` glass.
 */
export function StackMotion({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(`${MEDIA.desktop} and ${MEDIA.motionOK}`, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", root);

        cards.forEach((card, index) => {
          const next = cards[index + 1];
          const sheet = card.querySelector<HTMLElement>("[data-stack-sheet]");
          const content = card.querySelector<HTMLElement>("[data-stack-content]");
          if (!next || !sheet || !content) return;

          // The sticky offset is a static value we set ourselves (never changes on
          // resize or refresh), so it's read once, synchronously, as a plain number —
          // not via a lazily-evaluated function, which left `end` unresolved (`start: 0,
          // end: undefined`) for the whole scroll range in testing.
          const stickyTop = parseFloat(getComputedStyle(next).top) || 0;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: next,
                start: "top 85%",
                // Finish exactly when the next sheet reaches its own sticky offset.
                end: `top ${stickyTop}px`,
                scrub: true,
              },
            })
            .to(sheet, { scale: STACK.scaleTo, filter: `blur(${STACK.sheetBlurTo}px)`, transformOrigin: "50% 0%", ease: "none" }, 0)
            .to(content, { opacity: STACK.contentOpacityTo, ease: "none" }, 0);
        });

        const progress = root.querySelector<HTMLElement>("[data-stack-progress]");
        const list = root.querySelector<HTMLElement>("[data-stack-list]");
        if (progress && list) {
          gsap.fromTo(
            progress,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "50% 0%",
              scrollTrigger: { trigger: list, start: "top 60%", end: "bottom bottom", scrub: true },
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
