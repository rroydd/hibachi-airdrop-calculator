const siteUrl = "https://hibachi-airdrop-calculator.vercel.app";

export function GET() {
  return new Response(
    `# Hibachi Airdrop Calculator

Hibachi Airdrop Calculator is a public, free, client-side calculator for estimating speculative Hibachi and $HEAT airdrop outcomes.

Primary URL: ${siteUrl}

Useful pages and machine-readable resources:
- Homepage: ${siteUrl}
- Dynamic share image endpoint: ${siteUrl}/share-image
- Sitemap: ${siteUrl}/sitemap.xml
- Robots: ${siteUrl}/robots.txt

What the app does:
- Estimates potential $HEAT value from Hibachi points, FDV, token allocation, and airdrop percentage assumptions.
- Includes NFT bonus scenario controls and optional farm cost handling.
- Generates share text and share images for X/Twitter from the user's current calculator inputs.
- Provides a referral entry point for users who want to create a Hibachi account.

Important disclaimer:
This is an independent speculative tool. It is not official Hibachi tokenomics, financial advice, or a promise of an airdrop. All calculations, NFT bonuses, FDV, and token estimates are hypothetical.
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
