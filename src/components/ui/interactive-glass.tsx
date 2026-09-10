"use client";

import { useRef, type ComponentPropsWithoutRef, type PointerEvent } from "react";
import { usePointerEffects } from "@/components/motion/reduced-motion";
import { GLARE, TILT } from "@/config/design";
import { cn } from "@/lib/utils";

type InteractiveGlassProps = ComponentPropsWithoutRef<"div"> & {
  tilt?: boolean;
};

/**
 * Pointer-reactive glass. The glare drifts toward the pointer and, with `tilt`,
 * the surface rotates at most TILT.maxDeg on each axis.
 *
 * Performance contract:
 * - Pointer events are coalesced into one requestAnimationFrame per frame.
 * - Each frame does one layout read (getBoundingClientRect) then transform writes,
 *   so it never forces layout twice.
 * - Styles are written straight to DOM nodes through refs. React never re-renders
 *   while the pointer moves.
 * - Nothing runs on touch devices or with reduced motion.
 */
export function InteractiveGlass({
  tilt = false,
  className,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}: InteractiveGlassProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);
  const enabled = usePointerEffects();

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (!enabled || event.pointerType !== "mouse") return;

    const { clientX, clientY } = event;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const surface = surfaceRef.current;
      const glare = glareRef.current;
      if (!surface || !glare) return;

      const rect = surface.getBoundingClientRect();
      // Normalised pointer position, -1 … 1 from the centre.
      const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;

      glare.style.transform = `translate3d(${nx * rect.width * GLARE.travel}px, ${ny * rect.height * GLARE.travel}px, 0)`;
      if (tilt) {
        surface.style.transform = `perspective(${TILT.perspective}px) rotateX(${(-ny * TILT.maxDeg).toFixed(2)}deg) rotateY(${(nx * TILT.maxDeg).toFixed(2)}deg)`;
      }
    });
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    cancelAnimationFrame(frameRef.current);
    if (glareRef.current) glareRef.current.style.transform = "";
    if (surfaceRef.current) surfaceRef.current.style.transform = "";
  };

  return (
    <div
      ref={surfaceRef}
      className={cn(className, tilt && "glass-tilt")}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <span aria-hidden className="glass-glare-layer">
        <span ref={glareRef} className="glass-glare" />
      </span>
      {children}
    </div>
  );
}
