"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/components/motion/reduced-motion";
import { smoothScrollControls } from "@/components/motion/smooth-scroll";
import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/visual/brand-mark";
import { DURATION, EASE } from "@/config/design";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";

const BAR_OFFSET = 3.5;

/**
 * Two bars that rotate into an X. The trigger shows the closed state; the close
 * button inside the sheet mounts closed and animates to open, so the icon appears
 * to morph in place rather than swap.
 */
function MenuGlyph({ open, morphOnMount = false }: { open: boolean; morphOnMount?: boolean }) {
  const transition = { duration: DURATION.base, ease: EASE.cinematic };
  const top = { closed: { y: -BAR_OFFSET, rotate: 0 }, open: { y: 0, rotate: 45 } };
  const bottom = { closed: { y: BAR_OFFSET, rotate: 0 }, open: { y: 0, rotate: -45 } };
  const state = open ? "open" : "closed";

  return (
    <span aria-hidden className="relative block h-3 w-4.5">
      <m.span
        className="absolute inset-x-0 top-1/2 -mt-px h-0.5 rounded-full bg-current"
        variants={top}
        initial={morphOnMount ? "closed" : false}
        animate={state}
        exit="closed"
        transition={transition}
      />
      <m.span
        className="absolute inset-x-0 top-1/2 -mt-px h-0.5 rounded-full bg-current"
        variants={bottom}
        initial={morphOnMount ? "closed" : false}
        animate={state}
        exit="closed"
        transition={transition}
      />
    </span>
  );
}

type MobileMenuProps = {
  primary: readonly NavItem[];
  saved: NavItem;
  signIn: NavItem;
  className?: string;
};

export function MobileMenu({ primary, saved, signIn, className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)", false);
  // If the viewport grows past the mobile breakpoint, the sheet closes itself.
  const visible = open && !isDesktop;
  const links = [...primary, saved];

  // Freeze the Lenis-driven page scroll behind the sheet. Radix locks native
  // scroll, but Lenis scrolls programmatically and would ignore that lock.
  useEffect(() => {
    if (!visible) return;
    smoothScrollControls.stop();
    return () => smoothScrollControls.start();
  }, [visible]);

  const close = () => setOpen(false);

  return (
    <Dialog.Root open={visible} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        className={cn(
          "grid size-11 place-items-center rounded-full text-ink transition-colors duration-(--duration-fast) ease-standard hover:bg-ink/5",
          className,
        )}
      >
        <MenuGlyph open={false} />
      </Dialog.Trigger>

      <AnimatePresence>
        {visible ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-overlay bg-canvas/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.base, ease: EASE.standard }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <m.div
                data-lenis-prevent
                className="glass glass-hero fixed inset-x-3 top-3 z-overlay flex max-h-[calc(100dvh-1.5rem)] origin-top flex-col overflow-y-auto rounded-panel p-2 pb-6 outline-none"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.985, transition: { duration: DURATION.fast, ease: EASE.exit } }}
                transition={{ duration: DURATION.slow, ease: EASE.entrance }}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>

                <div className="flex h-(--nav-height) items-center justify-between pl-1.5 pr-0.5">
                  <Link href="/" onClick={close} aria-label="CampusLens home" className="flex h-11 items-center px-2">
                    <Wordmark />
                  </Link>
                  <Dialog.Close
                    aria-label="Close menu"
                    className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-(--duration-fast) ease-standard hover:bg-ink/5"
                  >
                    <MenuGlyph open morphOnMount />
                  </Dialog.Close>
                </div>

                <nav aria-label="Mobile" className="mt-6 px-4">
                  <ul>
                    {links.map((item, index) => (
                      <m.li
                        key={item.href}
                        className="border-b border-line last:border-b-0"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + index * 0.05, duration: DURATION.slow, ease: EASE.entrance }}
                      >
                        <Link
                          href={item.href}
                          onClick={close}
                          className="flex min-h-16 items-center justify-between gap-4 py-3 text-ink"
                        >
                          <span className="flex items-baseline gap-4">
                            <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
                            <span className="text-display-page font-medium">{item.label}</span>
                          </span>
                          <ArrowUpRight aria-hidden className="size-5 text-ink-tertiary" strokeWidth={1.75} />
                        </Link>
                      </m.li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8 px-4">
                  <ButtonLink href={signIn.href} onClick={close} size="lg" className="w-full">
                    {signIn.label}
                  </ButtonLink>
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
