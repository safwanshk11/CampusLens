import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  /** Provide when the mark stands alone and must be announced. */
  title?: string;
};

/**
 * CampusLens mark: an open lens ring that reads as a "C", three rising columns
 * for campus, and a single glint at the top-left — where PRISM's light source sits.
 */
export function BrandMark({ className, title }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-7 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d="M24.43 8.93A11 11 0 1 0 24.43 23.07" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <rect x="10.6" y="15.2" width="2.6" height="6.3" rx="1.3" className="fill-current" />
      <rect x="14.7" y="11.4" width="2.6" height="10.1" rx="1.3" className="fill-current" />
      <rect x="18.8" y="13.6" width="2.6" height="7.9" rx="1.3" className="fill-azure" />
      <circle cx="8.22" cy="8.22" r="1.5" className="fill-ice" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-ink", className)}>
      <BrandMark />
      <span className="text-lg font-semibold tracking-heading">
        Campus<span className="type-serif-accent">Lens</span>
      </span>
    </span>
  );
}
