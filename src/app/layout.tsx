import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import { HERO } from "@/config/design";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/env";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f7fb",
  colorScheme: "light",
};

/**
 * Runs before first paint. Marks the document as JS-capable so the hero can hide
 * its staged elements without a flash, and schedules a failsafe that reveals them
 * if the choreography never boots (slow network, script error).
 */
const MOTION_BOOTSTRAP = `(function(){var d=document.documentElement;d.setAttribute("data-js","");setTimeout(function(){d.setAttribute("data-hero-ready","")},${HERO.failsafeMs});})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The bootstrap script adds attributes to <html> before hydration.
      suppressHydrationWarning
      className={cn(geist.variable, geistMono.variable, instrumentSerif.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
