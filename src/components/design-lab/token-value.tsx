"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const subscribeNever = () => () => {};

/**
 * Reads a CSS custom property's live computed value, so the lab never duplicates
 * a token value that globals.css already owns.
 */
export function TokenValue({ token, className }: { token: `--${string}`; className?: string }) {
  const value = useSyncExternalStore(
    subscribeNever,
    () => getComputedStyle(document.documentElement).getPropertyValue(token).trim(),
    () => "",
  );

  return (
    <code className={cn("font-mono text-micro break-all text-ink-tertiary", className)}>
      {token}
      {value ? `: ${value}` : ""}
    </code>
  );
}
