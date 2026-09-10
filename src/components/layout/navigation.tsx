import { siteConfig } from "@/config/site";
import { NavFrame } from "./nav-frame";

/**
 * Server entry point for the global navigation. Link data comes from site config;
 * the scroll-reactive frame and the mobile sheet are client islands.
 */
export function Navigation() {
  return (
    <NavFrame
      primary={siteConfig.primaryNav}
      saved={siteConfig.accountNav.saved}
      signIn={siteConfig.accountNav.signIn}
    />
  );
}
