"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type CompareCheckProps = {
  itemName: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * "Add to compare" control: empty → soft fill → check reveal.
 * A real, visually hidden checkbox keeps native keyboard and screen-reader
 * behaviour; the visible mark mirrors its state.
 */
export function CompareCheck({
  itemName,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
}: CompareCheckProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const checked = controlledChecked ?? uncontrolledChecked;

  const update = (next: boolean) => {
    if (controlledChecked === undefined) setUncontrolledChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <label
      className={cn(
        "inline-flex h-11 shrink-0 cursor-pointer select-none items-center gap-2.5 rounded-full pl-3 pr-4 text-label font-medium transition-[background-color,color] duration-(--duration-fast) ease-standard",
        checked
          ? "bg-azure/12 text-azure-ink"
          : "glass glass-quiet text-ink-secondary hover:text-ink hover:[--glass-fill:var(--glass-white-strong)]",
        disabled && "pointer-events-none cursor-not-allowed opacity-45",
        className,
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => update(event.target.checked)}
      />
      <span
        aria-hidden
        className={cn(
          "grid size-5 place-items-center rounded-mark ring-1 transition-[background-color,box-shadow] duration-(--duration-fast) ease-standard peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
          checked ? "bg-azure-ink text-white ring-azure-ink" : "bg-surface/70 ring-line-strong",
        )}
      >
        <Check
          className={cn(
            "size-3.5 transition-[opacity,transform] duration-(--duration-base) ease-spring",
            checked ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
          strokeWidth={3}
        />
      </span>
      Compare<span className="sr-only"> {itemName}</span>
    </label>
  );
}
