import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const VARIANT = {
  glass: "glass glass-quiet text-ink hover:[--glass-fill:var(--glass-white-strong)]",
  ghost: "text-ink-secondary hover:bg-ink/5 hover:text-ink",
  solid: "bg-ink text-white hover:bg-ink/90",
} as const;

const SIZE = {
  sm: { button: "size-9 pointer-coarse:size-11", icon: "size-4" },
  md: { button: "size-11", icon: "size-4.5" },
} as const;

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  icon: LucideIcon;
  /** Accessible name. Required: an icon alone is not a label. */
  label: string;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
};

export function IconButton({
  icon: Icon,
  label,
  variant = "glass",
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-(--duration-fast) ease-standard motion-safe:active:scale-95 disabled:pointer-events-none disabled:opacity-45",
        SIZE[size].button,
        VARIANT[variant],
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className={SIZE[size].icon} strokeWidth={1.75} />
    </button>
  );
}
