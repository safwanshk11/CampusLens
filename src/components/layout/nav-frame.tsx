"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/visual/brand-mark";
import { NAV } from "@/config/design";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";
import { MobileMenu } from "./mobile-menu";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

// React re-renders only when this boolean flips, not on every scroll event.
const getIsScrolled = () => window.scrollY > NAV.scrollThreshold;
const getServerIsScrolled = () => false;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavFrameProps = {
  primary: readonly NavItem[];
  saved: NavItem;
  signIn: NavItem;
};

/**
 * Floating island navigation.
 *
 * At the top of the page it is an open, transparent bar. Past the scroll threshold
 * it morphs into a compact glass island: the brand and actions slide inward and
 * the glass plate fades in. The morph is pure CSS transforms keyed off
 * `data-scrolled` — see `.nav-bar` in globals.css.
 */
export function NavFrame({ primary, saved, signIn }: NavFrameProps) {
  const scrolled = useSyncExternalStore(subscribeToScroll, getIsScrolled, getServerIsScrolled);
  const pathname = usePathname();

  return (
    <header
      data-scrolled={scrolled ? "" : undefined}
      className="nav-frame pointer-events-none fixed inset-x-0 top-0 z-nav px-3 sm:px-5"
    >
      <div className="nav-bar relative mx-auto flex h-(--nav-height) w-full max-w-content items-center justify-between">
        <span aria-hidden className="nav-plate glass glass-elevated absolute inset-y-0 rounded-full" />

        <div className="nav-brand pointer-events-auto relative pl-1.5">
          <Link href="/" aria-label="CampusLens home" className="flex h-11 items-center rounded-full px-2">
            <Wordmark />
          </Link>
        </div>

        <nav aria-label="Primary" className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 md:block">
          <ul className="flex items-center gap-1">
            {primary.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center rounded-full px-4 text-label font-medium text-ink-secondary transition-colors duration-(--duration-fast) ease-standard hover:bg-ink/5 hover:text-ink",
                      active && "bg-surface text-ink shadow-control hover:bg-surface",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nav-actions pointer-events-auto relative flex items-center gap-1 pr-1.5">
          <Link
            href={saved.href}
            aria-current={isActive(pathname, saved.href) ? "page" : undefined}
            className="hidden h-10 items-center gap-2 rounded-full px-3.5 text-label font-medium text-ink-secondary transition-colors duration-(--duration-fast) ease-standard hover:bg-ink/5 hover:text-ink md:flex"
          >
            <Bookmark aria-hidden className="size-4" strokeWidth={1.75} />
            {saved.label}
          </Link>
          <ButtonLink href={signIn.href} size="sm" className="hidden md:inline-flex">
            {signIn.label}
          </ButtonLink>
          <MobileMenu primary={primary} saved={saved} signIn={signIn} className="md:hidden" />
        </div>
      </div>
    </header>
  );
}
