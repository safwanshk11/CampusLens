import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "glass" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "group/button relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-tight " +
  "transition-[background-color,color,transform,opacity] duration-(--duration-fast) ease-standard " +
  "motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "edge-light bg-ink text-white shadow-control [--edge:var(--specular-button)] hover:bg-ink/90",
  glass: "glass glass-quiet text-ink hover:[--glass-fill:var(--glass-white-strong)]",
  secondary: "bg-surface text-ink shadow-control ring-1 ring-line hover:ring-line-strong",
  ghost: "text-ink-secondary hover:bg-ink/5 hover:text-ink",
  danger: "bg-danger/10 text-danger-ink ring-1 ring-danger/30 hover:bg-danger/15",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-label pointer-coarse:h-11",
  md: "h-11 px-5 text-control",
  lg: "h-13 px-6 text-control",
};

/** With an icon capsule the trailing padding tightens so the capsule sits concentric. */
const SIZE_WITH_CAPSULE: Record<ButtonSize, string> = {
  sm: "pl-4 pr-1",
  md: "pl-5 pr-1.5",
  lg: "pl-6 pr-1.5",
};

const CAPSULE_SIZE: Record<ButtonSize, string> = {
  sm: "size-7",
  md: "size-8",
  lg: "size-10",
};

const CAPSULE_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-white text-ink",
  glass: "bg-ink text-white",
  secondary: "bg-ink text-white",
  ghost: "bg-ink/5 text-ink",
  danger: "bg-danger-ink text-white",
};

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders a nested icon capsule at the trailing edge. */
  icon?: LucideIcon;
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  icon,
  className,
}: ButtonStyleProps & { className?: string }): string {
  return cn(BASE, VARIANT[variant], SIZE[size], icon && SIZE_WITH_CAPSULE[size], className);
}

function ButtonContent({
  children,
  icon: Icon,
  variant,
  size,
}: {
  children: ReactNode;
  icon?: LucideIcon;
  variant: ButtonVariant;
  size: ButtonSize;
}) {
  if (!Icon) return <>{children}</>;

  return (
    <>
      <span className="pr-1">{children}</span>
      <span
        aria-hidden
        className={cn(
          "grid place-items-center rounded-full transition-transform duration-(--duration-base) ease-spring motion-safe:group-hover/button:translate-x-0.5",
          CAPSULE_SIZE[size],
          CAPSULE_VARIANT[variant],
        )}
      >
        <Icon
          className="size-4 transition-transform duration-(--duration-base) ease-spring motion-safe:group-hover/button:rotate-45"
          strokeWidth={2}
        />
      </span>
    </>
  );
}

export type ButtonProps = ComponentPropsWithoutRef<"button"> & ButtonStyleProps;

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClassName({ variant, size, icon, className })} {...props}>
      <ButtonContent icon={icon} variant={variant} size={size}>
        {children}
      </ButtonContent>
    </button>
  );
}

export type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & ButtonStyleProps;

export function ButtonLink({ variant = "primary", size = "md", icon, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClassName({ variant, size, icon, className })} {...props}>
      <ButtonContent icon={icon} variant={variant} size={size}>
        {children}
      </ButtonContent>
    </Link>
  );
}
