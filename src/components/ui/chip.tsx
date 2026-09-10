import { Check, type LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ChipProps = ComponentPropsWithoutRef<"button"> & {
  selected?: boolean;
  icon?: LucideIcon;
};

/**
 * Toggleable filter chip. Selected state is unmistakable: solid ink fill, inverted
 * text and a check mark — never a subtle opacity shift. Exposed as `aria-pressed`.
 */
export function Chip({ selected = false, icon: Icon, className, children, type = "button", ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-label font-medium transition-[background-color,color,transform] duration-(--duration-fast) ease-standard motion-safe:active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 pointer-coarse:h-11",
        selected
          ? "bg-ink text-white shadow-control"
          : "glass glass-quiet text-ink-secondary hover:text-ink hover:[--glass-fill:var(--glass-white-strong)]",
        className,
      )}
      {...props}
    >
      {selected ? (
        <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
      ) : Icon ? (
        <Icon aria-hidden className="size-3.5" strokeWidth={1.75} />
      ) : null}
      {children}
    </button>
  );
}
