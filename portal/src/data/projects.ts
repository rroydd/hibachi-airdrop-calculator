export type ProjectStatus = "live" | "draft";

export type Project = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  benefits: {
    label: string;
    tone: "emerald" | "orange" | "sky" | "violet";
  }[];
  status: ProjectStatus;
  accent: string;
  logoUrl: string;
  logoIconUrl: string;
  localUrl: string;
  productionUrl: string;
  referralUrl: string;
  docsUrl: string;
};

export const projects: Project[] = [
  {
    slug: "hibachi",
    name: "Hibachi",
    shortName: "Hibachi",
    category: "Airdrop Calculator",
    description: "See how your Hibachi activity can convert into clearer upside scenarios before you farm harder.",
    benefits: [
      { label: "points reward estimate", tone: "orange" },
      { label: "NFT bonus scenarios", tone: "violet" },
      { label: "farming cost and ROI", tone: "emerald" },
    ],
    status: "live",
    accent: "#fb923c",
    logoUrl: "/logos/hibachi-lockup-clean.png",
    logoIconUrl: "/logos/hibachi-icon.png",
    localUrl: "http://localhost:3000",
    productionUrl: "https://hibachi-airdrop-calculator.vercel.app/",
    referralUrl: "https://hibachi.xyz/r/brelgino",
    docsUrl: "https://hibachi.xyz/",
  },
  {
    slug: "nado",
    name: "Nado",
    shortName: "Nado",
    category: "Airdrop Calculator",
    description: "Model your Nado position and understand which inputs can move your possible allocation the most.",
    benefits: [
      { label: "points value model", tone: "emerald" },
      { label: "Templars NFT multipliers", tone: "violet" },
      { label: "$INK allocation range", tone: "sky" },
    ],
    status: "draft",
    accent: "#34d399",
    logoUrl: "/logos/nado-logo.avif",
    logoIconUrl: "/logos/nado-icon.svg",
    localUrl: "http://localhost:3001",
    productionUrl: "https://nado-point-calculator.vercel.app/",
    referralUrl: "https://app.nado.xyz?join=oIxX08E",
    docsUrl: "https://docs.nado.xyz/",
  },
];
