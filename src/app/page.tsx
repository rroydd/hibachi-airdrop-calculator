import type { Metadata } from "next";
import Home from "./ClientHome";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hibachi-airdrop-calculator.vercel.app";
const siteName = "Hibachi Airdrop Calculator";
const siteDescription =
  "Estimate a potential Hibachi crypto airdrop from points, FDV, token allocation, NFT bonus scenarios, and farming costs.";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildImageUrl(searchParams: SearchParams) {
  const amount = firstValue(searchParams.amount);
  const points = firstValue(searchParams.points);
  const tokens = firstValue(searchParams.tokens);
  const nft = firstValue(searchParams.nft);

  if (!amount || !points || !tokens) {
    return `${siteUrl}/share-preview-example.png`;
  }

  const params = new URLSearchParams({
    amount,
    points,
    tokens,
    nft: nft || "No NFT",
  });

  return `${siteUrl}/share-image?${params.toString()}`;
}

function buildSharePageUrl(searchParams: SearchParams) {
  const amount = firstValue(searchParams.amount);
  const points = firstValue(searchParams.points);
  const tokens = firstValue(searchParams.tokens);
  const nft = firstValue(searchParams.nft);

  if (!amount || !points || !tokens) {
    return siteUrl;
  }

  const params = new URLSearchParams({
    amount,
    points,
    tokens,
    nft: nft || "No NFT",
  });

  return `${siteUrl}/?${params.toString()}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const imageUrl = buildImageUrl(params);
  const sharePageUrl = buildSharePageUrl(params);
  const amount = firstValue(params.amount);
  const points = firstValue(params.points);
  const title = amount ? `My Hibachi airdrop estimate: ${amount}` : `${siteName} by Brelgino`;
  const description =
    amount && points
      ? `${points} calculated with ${siteName}.`
      : siteDescription;

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: sharePageUrl,
      siteName,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: "Hibachi Airdrop Calculator result preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@hibachi_xyz",
      creator: "@brelgino",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function Page() {
  return <Home />;
}
