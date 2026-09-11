import { siteConfig } from "@/config/site";
import { NavFrame } from "./nav-frame";
import { currentUser } from "@/server/auth/session";

/**
 * Server entry point for the global navigation. Link data comes from site config;
 * the scroll-reactive frame and the mobile sheet are client islands.
 */
export async function Navigation() {
  // Public browsing stays available during a database outage.
  const user = await currentUser().catch(() => null);
  return (
    <NavFrame
      primary={siteConfig.primaryNav}
      saved={siteConfig.accountNav.saved}
      signIn={user ? { href: "/account", label: "My account" } : siteConfig.accountNav.signIn}
    />
  );
}
