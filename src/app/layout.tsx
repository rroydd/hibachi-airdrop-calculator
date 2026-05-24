import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hibachi-airdrop-calculator.vercel.app";
const siteName = "Hibachi Airdrop Calculator";
const siteDescription =
  "Estimate a potential Hibachi crypto airdrop from points, FDV, token allocation, NFT bonus scenarios, and farming costs.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: `${siteName} by Brelgino`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Hibachi airdrop calculator",
    "Hibachi points",
    "crypto airdrop calculator",
    "airdrop estimator",
    "HEAT token",
    "Hibachi NFT bonus",
  ],
  authors: [{ name: "Brelgino", url: "https://x.com/brelgino" }],
  creator: "@brelgino",
  publisher: "@brelgino",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: `${siteName} by Brelgino`,
    description: siteDescription,
    images: [
      {
        url: "/share-preview-example.png",
        width: 1200,
        height: 675,
        alt: "Hibachi Airdrop Calculator share preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hibachi_xyz",
    creator: "@brelgino",
    title: `${siteName} by Brelgino`,
    description: siteDescription,
    images: ["/share-preview-example.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
