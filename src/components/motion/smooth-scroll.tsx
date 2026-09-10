"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { SCROLL } from "@/config/design";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "./reduced-motion";

/**
 * There is exactly one smooth-scroll engine per document, so a module-level handle
 * is the simplest way for overlays (the mobile menu) to pause it. Every method is a
 * no-op when smooth scrolling is disabled.
 */
let activeLenis: Lenis | null = null;

export const smoothScrollControls = {
  stop() {
    activeLenis?.stop();
  },
  start() {
    activeLenis?.start();
  },
};

function isPlainPrimaryClick(event: MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function LenisEngine() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: SCROLL.lerp,
      anchors: false,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    activeLenis = lenis;

    // 1. Lenis scrolls the real window, so ScrollTrigger needs no scroller proxy —
    //    only a nudge whenever Lenis moves.
    const syncScrollTrigger = () => ScrollTrigger.update();
    lenis.on("scroll", syncScrollTrigger);

    // 2. One clock. GSAP's ticker advances Lenis, so smooth scroll and scrubbed
    //    tweens are computed in the same frame and never drift apart.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // 3. Same-page anchors: smooth scroll, then move focus to the target so keyboard
    //    and screen-reader users land where sighted users do. (Lenis' built-in
    //    anchor handling scrolls but leaves focus behind.)
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !isPlainPrimaryClick(event)) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link ? decodeURIComponent(link.hash.slice(1)) : "";
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      event.preventDefault();
      history.pushState(null, "", `#${id}`);
      lenis.scrollTo(target, {
        offset: -SCROLL.anchorOffset,
        onComplete: () => {
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        },
      });
    };
    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("click", onDocumentClick);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = null;
    };
  }, []);

  return null;
}

/**
 * Inertial smooth scrolling for pointer users. Not mounted at all when the user
 * prefers reduced motion — the browser's native scrolling takes over.
 * Touch scrolling stays native in every case (`syncTouch` is off by default).
 */
export function SmoothScroll() {
  const reducedMotion = usePrefersReducedMotion();
  return reducedMotion ? null : <LenisEngine />;
}
