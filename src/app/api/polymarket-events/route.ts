import { NextResponse } from "next/server";

export const runtime = "edge";

const GAMMA_API_URL = "https://gamma-api.polymarket.com";
const REFERENCED_EVENT_SLUG = "will-hibachi-launch-a-token-by";
const POLYMARKET_REFERRAL_QUERY = "?r=join";
const REVALIDATE_SECONDS = 300;

type GammaEvent = {
  id?: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  active?: boolean;
  closed?: boolean;
  endDate?: string;
  volume?: number | string;
  markets?: GammaMarket[];
};

type GammaMarket = {
  id?: string;
  slug?: string;
  question?: string;
  groupItemTitle?: string;
  outcomes?: string | string[];
  outcomePrices?: string | string[];
  active?: boolean;
  closed?: boolean;
};

type GammaSearchResponse = {
  events?: GammaEvent[] | null;
};

type HibachiPolymarketMarket = {
  id: string;
  label: string;
  yesProbabilityPercent: number | null;
  status: "open" | "closed" | "unknown";
};

type HibachiPolymarketEvent = {
  id: string;
  title: string;
  slug: string;
  href: string;
  volumeUsd: number | null;
  endsAt: string | null;
  status: "open" | "closed" | "unknown";
  markets: HibachiPolymarketMarket[];
};

const fallbackEvent: HibachiPolymarketEvent = {
  id: REFERENCED_EVENT_SLUG,
  title: "Will Hibachi launch a token by ___?",
  slug: REFERENCED_EVENT_SLUG,
  href: `https://polymarket.com/event/${REFERENCED_EVENT_SLUG}${POLYMARKET_REFERRAL_QUERY}`,
  volumeUsd: null,
  endsAt: null,
  status: "unknown",
  markets: [
    {
      id: "will-hibachi-launch-a-token-by-december-31-2026",
      label: "December 31, 2026",
      yesProbabilityPercent: null,
      status: "unknown",
    },
  ],
};

function isHibachiEvent(event: GammaEvent) {
  const searchableText = [event.title, event.subtitle, event.description, event.slug].filter(Boolean).join(" ");
  return /\bhibachi\b/i.test(searchableText);
}

function parseStringArray(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function toDisplayMarkets(markets: GammaMarket[] | undefined) {
  const displayMarkets = (markets || [])
    .map((market): HibachiPolymarketMarket | null => {
      const label = market.groupItemTitle?.trim() || market.question?.trim();
      if (!label) {
        return null;
      }

      const outcomes = parseStringArray(market.outcomes);
      const outcomePrices = parseStringArray(market.outcomePrices);
      const yesIndex = outcomes.findIndex((outcome) => outcome.toLowerCase() === "yes");
      const yesPrice = Number(outcomePrices[yesIndex]);

      return {
        id: market.id || market.slug || label,
        label,
        yesProbabilityPercent: Number.isFinite(yesPrice) ? yesPrice * 100 : null,
        status: market.closed ? "closed" : market.active ? "open" : "unknown",
      };
    })
    .filter((market): market is HibachiPolymarketMarket => market !== null);

  const openMarkets = displayMarkets.filter((market) => market.status !== "closed");
  return (openMarkets.length > 0 ? openMarkets : displayMarkets).sort((left, right) => {
    const leftDate = Date.parse(left.label);
    const rightDate = Date.parse(right.label);

    return Number.isNaN(leftDate) || Number.isNaN(rightDate) ? 0 : leftDate - rightDate;
  });
}

function toDisplayEvent(event: GammaEvent): HibachiPolymarketEvent | null {
  const slug = event.slug?.trim();
  const title = event.title?.trim();

  if (!slug || !title) {
    return null;
  }

  const volume = typeof event.volume === "number" ? event.volume : Number(event.volume);

  return {
    id: event.id || slug,
    title,
    slug,
    href: `https://polymarket.com/event/${encodeURIComponent(slug)}${POLYMARKET_REFERRAL_QUERY}`,
    volumeUsd: Number.isFinite(volume) ? volume : null,
    endsAt: event.endDate || null,
    status: event.closed ? "closed" : event.active ? "open" : "unknown",
    markets: toDisplayMarkets(event.markets),
  };
}

async function fetchGammaJson<T>(url: URL) {
  const response = await fetch(url.toString(), {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Polymarket Gamma API returned ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function GET() {
  const searchUrl = new URL("/public-search", GAMMA_API_URL);
  searchUrl.search = new URLSearchParams({
    q: "hibachi",
    limit_per_type: "20",
    search_tags: "false",
    search_profiles: "false",
    optimized: "true",
  }).toString();

  const referencedEventUrl = new URL(`/events/slug/${REFERENCED_EVENT_SLUG}`, GAMMA_API_URL);
  const [searchResult, referencedEventResult] = await Promise.allSettled([
    fetchGammaJson<GammaSearchResponse>(searchUrl),
    fetchGammaJson<GammaEvent>(referencedEventUrl),
  ]);

  const fetchedEvents: GammaEvent[] = [];
  let isConnected = false;

  if (referencedEventResult.status === "fulfilled") {
    fetchedEvents.push(referencedEventResult.value);
    isConnected = true;
  }

  if (searchResult.status === "fulfilled") {
    fetchedEvents.push(...(searchResult.value.events || []).filter(isHibachiEvent));
    isConnected = true;
  }

  const uniqueEvents = new Map<string, HibachiPolymarketEvent>();
  fetchedEvents.forEach((event) => {
    const displayEvent = toDisplayEvent(event);

    if (displayEvent) {
      const currentEvent = uniqueEvents.get(displayEvent.slug);

      if (!currentEvent || displayEvent.markets.length >= currentEvent.markets.length) {
        uniqueEvents.set(displayEvent.slug, displayEvent);
      }
    }
  });

  const events = uniqueEvents.size > 0 ? Array.from(uniqueEvents.values()) : [fallbackEvent];

  return NextResponse.json({
    events,
    updatedAt: new Date().toISOString(),
    source: isConnected ? "live" : "fallback",
  });
}
