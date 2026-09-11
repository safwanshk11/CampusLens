"use client";
import { useState, type ReactNode } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
export function FilterPanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <details open={open}>
      <summary
        onClick={(event) => {
          event.preventDefault();
          setOpen(!open);
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
