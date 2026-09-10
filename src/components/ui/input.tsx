import { CircleAlert, type LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "id" | "size"> & {
  /** Required so the label, hint and error can be wired without client-side hooks. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  icon?: LucideIcon;
  hideLabel?: boolean;
  /** `solid` for intelligence-mode forms, `glass` for cinematic surfaces. */
  surface?: "solid" | "glass";
};

export function Input({
  id,
  label,
  hint,
  error,
  icon: Icon,
  hideLabel = false,
  surface = "solid",
  disabled,
  className,
  ...props
}: InputProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className={cn("text-label font-medium text-ink", hideLabel && "sr-only")}>
        {label}
      </label>

      <div
        className={cn(
          "group/input relative flex h-12 items-center gap-2.5 rounded-control px-3.5 transition-[background-color] duration-(--duration-base) ease-standard",
          surface === "solid"
            ? "bg-surface shadow-control ring-1 ring-line hover:ring-line-strong"
            : "glass glass-quiet hover:[--glass-fill:var(--glass-white)] focus-within:[--glass-fill:var(--glass-white-strong)]",
          "focus-within:ring-2 focus-within:ring-focus focus-within:hover:ring-focus",
          error && "ring-2 ring-danger-ink hover:ring-danger-ink focus-within:ring-danger-ink",
          disabled && "opacity-55",
        )}
      >
        {Icon ? (
          <Icon
            aria-hidden
            className="size-4.5 shrink-0 text-ink-tertiary transition-colors group-focus-within/input:text-ink"
            strokeWidth={1.75}
          />
        ) : null}
        <input
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="h-full w-full min-w-0 bg-transparent text-control text-ink outline-none placeholder:text-ink-tertiary disabled:cursor-not-allowed"
          {...props}
        />
      </div>

      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-label text-danger-ink">
          <CircleAlert aria-hidden className="size-3.5 shrink-0" strokeWidth={2} />
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="text-label text-ink-tertiary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
