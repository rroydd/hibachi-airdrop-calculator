import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alpha Tools",
    short_name: "Alpha Tools",
    description: "Crypto calculators, airdrop tools, farming ROI models, and project trackers.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#34d399",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
