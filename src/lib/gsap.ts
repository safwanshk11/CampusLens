import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, EASE_NAMES } from "@/config/design";
import { gsapEase } from "@/lib/motion";

/**
 * Single registration point for GSAP. Client components import `gsap`,
 * `ScrollTrigger` and `useGSAP` from here so plugins and PRISM eases are
 * always registered before first use. Client components are also rendered on
 * the server, where there is no window and nothing to register.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
  for (const name of EASE_NAMES) {
    CustomEase.create(gsapEase(name), EASE[name].join(","));
  }
}

export { gsap, ScrollTrigger, useGSAP };
