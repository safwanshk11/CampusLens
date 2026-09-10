import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const SIZE = {
  /** Reading-width pages: auth, placeholders, long-form text. */
  narrow: "max-w-narrow",
  /** Default for product and marketing content (1280px). */
  content: "max-w-content",
  /** Editorial compositions that need more air (1440px). */
  wide: "max-w-wide",
} as const;

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: keyof typeof SIZE;
};

export function Container({ size = "content", className, ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", SIZE[size], className)} {...props} />;
}
