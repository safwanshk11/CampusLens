"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SaveButtonProps = {
  /** Used in the accessible name, e.g. "Save Northfield Institute". */
  itemName: string;
  saved?: boolean;
  defaultSaved?: boolean;
  onSavedChange?: (saved: boolean) => void;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Save toggle: outline heart → brief compression → filled heart.
 * A stable label plus `aria-pressed` is the correct toggle-button pattern;
 * the label does not flip between "Save" and "Unsave".
 * Presentation only in Phase 0 — persistence arrives with authentication.
 */
export function SaveButton({
  itemName,
  saved: controlledSaved,
  defaultSaved = false,
  onSavedChange,
  size = "md",
  className,
}: SaveButtonProps) {
  const [uncontrolledSaved, setUncontrolledSaved] = useState(defaultSaved);
  const saved = controlledSaved ?? uncontrolledSaved;

  const toggle = () => {
    const next = !saved;
    if (controlledSaved === undefined) setUncontrolledSaved(next);
    onSavedChange?.(next);
  };

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`Save ${itemName}`}
      onClick={toggle}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full transition-[background-color,color] duration-(--duration-fast) ease-standard",
        size === "md" ? "size-11" : "size-9 pointer-coarse:size-11",
        saved
          ? "bg-danger/12 text-danger-ink"
          : "glass glass-quiet text-ink-secondary hover:text-ink hover:[--glass-fill:var(--glass-white-strong)]",
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn("size-4.5", saved ? "fill-current motion-safe:animate-press" : "fill-transparent")}
        strokeWidth={1.75}
      />
    </button>
  );
}
