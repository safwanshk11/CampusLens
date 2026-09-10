import type { NavGroup, NavItem } from "@/types/navigation";

type SiteConfig = {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly primaryNav: readonly NavItem[];
  readonly accountNav: {
    readonly saved: NavItem;
    readonly signIn: NavItem;
  };
  readonly footerNav: readonly NavGroup[];
};

export const siteConfig = {
  name: "CampusLens",
  tagline: "See your options clearly.",
  description:
    "Discover colleges, understand them through structured data, compare them side by side and build a shortlist you trust.",
  primaryNav: [
    { label: "Discover", href: "/discover", description: "Search and filter colleges" },
    { label: "Compare", href: "/compare", description: "Line colleges up side by side" },
  ],
  accountNav: {
    saved: { label: "Saved", href: "/saved", description: "Your private shortlist" },
    signIn: { label: "Sign in", href: "/sign-in" },
  },
  footerNav: [
    {
      title: "Product",
      items: [
        { label: "Discover", href: "/discover" },
        { label: "Compare", href: "/compare" },
        { label: "Saved", href: "/saved" },
      ],
    },
    {
      title: "Project",
      items: [
        { label: "PRISM design system", href: "/design-system" },
        { label: "Service health", href: "/api/health" },
      ],
    },
  ],
} as const satisfies SiteConfig;
