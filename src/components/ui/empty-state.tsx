import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  /** A clear way forward. Empty states should never be dead ends. */
  action?: ReactNode;
  titleAs?: "h1" | "h2" | "h3";
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, titleAs: Title = "h3", className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      {/* A small spatial object: three glass tiles layered in depth, lit from the top-left. */}
      <div aria-hidden className="relative mb-8 h-24 w-32">
        <span className="glass glass-quiet absolute bottom-0 left-2 h-16 w-20 -rotate-8 rounded-tile" />
        <span className="glass glass-quiet absolute bottom-1 right-2 h-16 w-20 rotate-6 rounded-tile" />
        <span className="glass glass-elevated absolute left-1/2 top-0 grid h-20 w-22 -translate-x-1/2 place-items-center rounded-tile">
          <Icon className="size-7 text-ink" strokeWidth={1.5} />
        </span>
      </div>
      <Title className="text-xl font-medium tracking-heading text-ink">{title}</Title>
      <p className="mt-2 max-w-measure text-body text-pretty text-ink-secondary">{description}</p>
      {action ? <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
