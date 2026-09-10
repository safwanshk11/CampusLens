import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know PRISM's custom theme keys. Without this, a class such as
 * `text-display-hero` is mistaken for a text *colour* and silently dropped when it
 * appears next to `text-ink`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display-hero", "display-section", "display-page", "body-lg", "body", "control", "label", "micro"],
      radius: ["mark", "control", "tile", "card", "island", "panel"],
      shadow: ["glass-1", "glass-2", "floating", "modal", "control"],
      font: ["sans", "display", "mono"],
      ease: ["standard", "entrance", "exit", "spring", "cinematic"],
      container: ["narrow", "content", "wide"],
      tracking: ["display", "heading", "label"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
