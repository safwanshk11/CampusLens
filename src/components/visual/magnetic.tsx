"use client";

import { m, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { usePointerEffects } from "@/components/motion/reduced-motion";
import { MAGNETIC } from "@/config/design";
import { cn } from "@/lib/utils";

function clampOffset(value: number): number {
  return Math.max(-MAGNETIC.maxOffset, Math.min(MAGNETIC.maxOffset, value));
}

/**
 * Pulls a major CTA a few pixels toward the pointer and springs it back on leave.
 *
 * Motion values write `transform` directly — pointer movement never re-renders
 * React. Travel is clamped to MAGNETIC.maxOffset (5px). Inert on touch devices
 * and for reduced-motion users. Reserve for one or two primary CTAs per page.
 */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const enabled = usePointerEffects();
  const x = useSpring(0, MAGNETIC.spring);
  const y = useSpring(0, MAGNETIC.spring);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(clampOffset((event.clientX - (rect.left + rect.width / 2)) * MAGNETIC.pull));
    y.set(clampOffset((event.clientY - (rect.top + rect.height / 2)) * MAGNETIC.pull));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </m.div>
  );
}
