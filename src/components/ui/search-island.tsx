import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassBezel } from "./glass-surface";

type SearchIslandProps = {
  id?: string;
  className?: string;
  /** Extra attributes for the glass shell (e.g. choreography hooks). */
  shellProps?: Record<`data-${string}`, string>;
};

/**
 * PRISM's signature surface: Glass 3 shell → optical gap → frosted input core →
 * circular action. A plain GET form, so it works before JavaScript loads.
 *
 * On hover or focus: the edge catches light, the core clarifies, the glare
 * brightens and follows the pointer, and the action shifts forward.
 * In Phase 0 it submits to the /discover placeholder.
 */
export function SearchIsland({ id = "campus-search", className, shellProps }: SearchIslandProps) {
  return (
    <form action="/discover" method="get" role="search" aria-label="Search colleges" className={cn("w-full", className)}>
      <GlassBezel
        level="hero"
        radius="island"
        interactive
        className="glass-responsive"
        coreClassName="flex items-center gap-2 p-1.5 pl-5 sm:gap-3 sm:p-2 sm:pl-6"
        {...shellProps}
      >
        <label htmlFor={id} className="sr-only">
          Search colleges, courses or cities
        </label>
        <Search aria-hidden className="size-5 shrink-0 text-ink-tertiary" strokeWidth={1.75} />
        <input
          id={id}
          name="q"
          type="search"
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Search colleges, courses, cities…"
          className="h-13 min-w-0 flex-1 bg-transparent text-body-lg text-ink outline-none placeholder:text-ink-tertiary sm:h-16"
        />
        <button
          type="submit"
          className="edge-light grid size-12 shrink-0 place-items-center rounded-full bg-ink text-white shadow-control transition-[transform,background-color] duration-(--duration-base) ease-spring [--edge:var(--specular-button)] hover:bg-ink/90 motion-safe:hover:translate-x-0.5 motion-safe:active:scale-95 sm:size-14"
        >
          <span className="sr-only">Search</span>
          <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
        </button>
      </GlassBezel>
    </form>
  );
}
