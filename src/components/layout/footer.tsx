import Link from "next/link";
import { Wordmark } from "@/components/visual/brand-mark";
import { siteConfig } from "@/config/site";
import { Container } from "./container";
import { currentUser } from "@/server/auth/session";

const YEAR = new Date().getFullYear();

export async function Footer() {
  const user = await currentUser().catch(() => null);
  const footerNav = user ? siteConfig.footerNav : siteConfig.footerNav.map(group => ({ ...group, items: group.items.map(item => ["/discover", "/compare", "/saved"].includes(item.href) ? { ...item, href: `/sign-in?next=${encodeURIComponent(item.href)}` } : item) }));
  return (
    <footer className="relative z-content">
      <Container className="pb-10 pt-(--space-section-compact)">
        <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-6">
            <Wordmark />
            <p className="max-w-measure text-body text-ink-secondary">
              {siteConfig.tagline} Structured college data, honest comparisons and a shortlist that is yours.
            </p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title} className="md:col-span-3">
              <h2 className="eyebrow">{group.title}</h2>
              <ul className="mt-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-10 items-center text-body text-ink-secondary transition-colors duration-(--duration-fast) ease-standard hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-label text-ink-tertiary sm:flex-row sm:justify-between">
          <p>© {YEAR} CampusLens · Technical assignment prototype</p>
          <p>Interface system: PRISM v0.1</p>
        </div>
      </Container>
    </footer>
  );
}
