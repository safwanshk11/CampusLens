import { useCallback, useSyncExternalStore } from "react";
import { MEDIA } from "@/lib/motion";

/**
 * Subscribes to a media query without a state-in-effect round trip.
 *
 * `serverSnapshot` is what the server render and hydration assume. Choose the
 * *safer* value: for reduced motion that is `true` (no motion until the client
 * confirms motion is welcome).
 */
export function useMediaQuery(query: string, serverSnapshot: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverSnapshot,
  );
}

/** Central reduced-motion switch for React-driven motion (Lenis, magnetic, tilt, glare). */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(MEDIA.reducedMotion, true);
}

/**
 * True only when pointer-driven effects should run: a fine pointer (mouse or
 * trackpad) and no reduced-motion preference. False on touch devices.
 */
export function usePointerEffects(): boolean {
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useMediaQuery(MEDIA.finePointer, false);
  return finePointer && !reducedMotion;
}
