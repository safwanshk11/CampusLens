"use client";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
const subscribe = (listener: () => void) => {
  const media = window.matchMedia("(min-width: 1024px)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
export function FilterPanel({ children }: { children: ReactNode }) {
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
  const [choice, setChoice] = useState<boolean>();
  const open = choice ?? wide;
  return (
    <details open={open}>
      <summary
        onClick={(event) => {
          event.preventDefault();
          setChoice(!open);
        }}
        className="flex min-h-11 cursor-pointer items-center gap-2 text-control font-medium"
      >
        <SlidersHorizontal aria-hidden className="size-4" />
        Refine your search
        <ChevronDown
          aria-hidden
          className={`ml-auto size-4 ${open ? "rotate-180" : ""}`}
        />
      </summary>
      {children}
    </details>
  );
}
