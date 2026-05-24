import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteName = "Alpha Tools";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-tools-tau.vercel.app";
const siteDescription =
  "Alpha Tools is a crypto research hub with airdrop calculators, points estimators, farming ROI tools, and project trackers for perps, crypto cards, L1, L2, launchpad, NFT, DePIN, AI, and yield ecosystems.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "crypto tools",
    "airdrop calculator",
    "crypto airdrop checker",
    "points calculator",
    "perps airdrop calculator",
    "crypto cards calculator",
    "L2 airdrop tools",
    "farming ROI calculator",
    "Nado calculator",
    "Hibachi calculator",
    "Alpha Tools",
  ],
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Alpha Tools crypto calculators hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
