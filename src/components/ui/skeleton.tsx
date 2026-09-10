import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** A frosted placeholder with a slow light sweep. The sweep stops for reduced motion. */
export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div aria-hidden className={cn("skeleton", className)} {...props} />;
}

/** Loading contract for a future college result card. */
export function CollegeCardSkeleton({ className }: { className?: string }) {
  return (
    <div role="status" className={cn("glass glass-quiet rounded-card p-5", className)}>
      <span className="sr-only">Loading college</span>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2.5">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <Skeleton className="size-11 rounded-full" />
      </div>
      <div className="mt-7 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <Skeleton className="mt-7 h-11 w-full rounded-full" />
    </div>
  );
}
