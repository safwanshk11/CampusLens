"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE } from "@/config/design";
import { SmoothScroll } from "./smooth-scroll";

/**
 * Root motion boundary, mounted once in the root layout.
 *
 * - `MotionConfig reducedMotion="user"`: Framer Motion skips transform and layout
 *   animation for users who prefer reduced motion; opacity and colour still animate.
 * - `LazyMotion` with `domAnimation` + `strict`: ships only the animation features we
 *   use and makes the full `motion.*` components throw, so every component uses the
 *   lighter `m.*` API.
 *
 * Children stay Server Components — a Client Component can render server-rendered
 * children passed as props without turning them into client code.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DURATION.base, ease: EASE.standard }}>
      <LazyMotion features={domAnimation} strict>
        <SmoothScroll />
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
