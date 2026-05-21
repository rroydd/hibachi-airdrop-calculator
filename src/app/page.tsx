"use client";

import { useEffect, useMemo, useState } from "react";
import NextImage from "next/image";
import { calculateAirdrop, parseNumber, type FarmCostMode } from "@/lib/calculator";
import { compactNumber, numberWithCommas, percentage, preciseNumber, usd, usdCompact } from "@/lib/format";

const TOTAL_POINTS_MIN = 52_500_000;
const TOTAL_POINTS_MAX = 70_000_000;
const TOTAL_POINTS_STEP = 100_000;
const BASE_DISTRIBUTED_POINTS = 52_500_000;
const WEEKLY_POINTS_DISTRIBUTION = 1_000_000;
const BASE_DISTRIBUTION_UTC = "2026-05-18T00:00:00.000Z";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const REFERRAL_LINK = "https://hibachi.xyz/r/brelgino";
const PUBLIC_SITE_URL = "https://hibachi.xyz/r/brelgino";
const X_LINK = "https://x.com/hibachi_xyz";
const CREATOR_LINK = "https://x.com/brelgino";
const CRYPTORANK_LINK = "https://cryptorank.io";
const MODULARIUM_LINK = "https://modularium.art/profile/hibachi";
const FLAME_NINJAS_OPENSEA_LINK = "https://opensea.io/collection/hibachi-flame-ninjas";

const scenarioPresets = [
  { label: "Base", fdv: 100, allocation: 12.5 },
  { label: "Hot", fdv: 500, allocation: 15 },
  { label: "Monster", fdv: 1000, allocation: 20 },
];

const nftCollections = [
  "No NFT",
  "Flame Ninjas",
  "Hidden 225",
  "Legendary / OG 25",
] as const;

const nftScenarios = ["Conservative", "Base Case", "Aggressive", "Custom"] as const;
const nftBonusModes = ["+% to airdrop", "Fixed token amount"] as const;

type NftCollection = (typeof nftCollections)[number];
type NftScenario = (typeof nftScenarios)[number];
type NftBonusMode = (typeof nftBonusModes)[number];

const NFT_PERCENT_PRESETS: Record<Exclude<NftScenario, "Custom">, Record<NftCollection, number>> = {
  Conservative: {
    "No NFT": 0,
    "Flame Ninjas": 1,
    "Hidden 225": 3,
    "Legendary / OG 25": 8,
  },
  "Base Case": {
    "No NFT": 0,
    "Flame Ninjas": 2,
    "Hidden 225": 5,
    "Legendary / OG 25": 15,
  },
  Aggressive: {
    "No NFT": 0,
    "Flame Ninjas": 4,
    "Hidden 225": 10,
    "Legendary / OG 25": 30,
  },
};

const NFT_FIXED_TOKEN_PRESETS: Record<Exclude<NftScenario, "Custom">, Record<NftCollection, number>> = {
  Conservative: {
    "No NFT": 0,
    "Flame Ninjas": 1_000,
    "Hidden 225": 5_000,
    "Legendary / OG 25": 25_000,
  },
  "Base Case": {
    "No NFT": 0,
    "Flame Ninjas": 2_500,
    "Hidden 225": 10_000,
    "Legendary / OG 25": 50_000,
  },
  Aggressive: {
    "No NFT": 0,
    "Flame Ninjas": 5_000,
    "Hidden 225": 25_000,
    "Legendary / OG 25": 100_000,
  },
};

const DEFAULT_NFT_SCENARIO: Exclude<NftScenario, "Custom"> = "Base Case";

function getDistributionState(now = new Date()) {
  const baseTime = new Date(BASE_DISTRIBUTION_UTC).getTime();
  const elapsedWeeks = Math.max(0, Math.floor((now.getTime() - baseTime) / WEEK_MS));
  const currentTotalPoints = BASE_DISTRIBUTED_POINTS + elapsedWeeks * WEEKLY_POINTS_DISTRIBUTION;
  const nextDistribution = new Date(baseTime + (elapsedWeeks + 1) * WEEK_MS);
  const remainingMs = Math.max(0, nextDistribution.getTime() - now.getTime());

  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs / (60 * 60 * 1000)) % 24);
  const minutes = Math.floor((remainingMs / (60 * 1000)) % 60);
  const seconds = Math.floor((remainingMs / 1000) % 60);

  return {
    currentTotalPoints,
    nextDistribution,
    countdown: `${days}d ${hours}h ${minutes}m ${seconds}s`,
  };
}

type NumericInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  helper?: string;
  onChange: (value: number) => void;
};

type SliderFieldProps = {
  label: string;
  valueLabel: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

function NumericInput({ label, value, min = 0, max, step = 1, prefix, suffix, helper, onChange }: NumericInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const displayValue = isFocused && value === 0 ? "" : String(Number.isFinite(value) ? value : 0);

  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-orange-50">
        {label}
        {helper ? <span className="text-xs font-normal text-orange-200/65">{helper}</span> : null}
      </span>
      <div className="flex items-center rounded-lg border border-orange-300/15 bg-zinc-950/75 px-3 shadow-inner shadow-black/30 transition focus-within:border-orange-300/80 focus-within:ring-2 focus-within:ring-orange-500/20">
        {prefix ? <span className="mr-2 text-sm text-orange-200/60">{prefix}</span> : null}
        <input
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-white outline-none placeholder:text-zinc-600"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          type="number"
          value={displayValue}
          onBlur={() => {
            setIsFocused(false);
            if (!Number.isFinite(value)) {
              onChange(0);
            }
          }}
          onChange={(event) => onChange(parseNumber(event.target.value))}
          onFocus={() => setIsFocused(true)}
        />
        {suffix ? <span className="ml-2 whitespace-nowrap text-sm text-orange-200/60">{suffix}</span> : null}
      </div>
    </label>
  );
}

function SliderField({ label, valueLabel, minLabel, maxLabel, value, min, max, step, onChange }: SliderFieldProps) {
  return (
    <div className="rounded-xl border border-orange-300/15 bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-orange-50">{label}</span>
        <span className="rounded-md border border-orange-300/20 bg-orange-500/10 px-2.5 py-1 text-sm font-semibold text-orange-100">
          {valueLabel}
        </span>
      </div>
      <input
        aria-label={`${label} slider`}
        className="w-full"
        max={max}
        min={min}
        step={step}
        type="range"
        value={Math.min(max, Math.max(min, value))}
        onChange={(event) => onChange(parseNumber(event.target.value))}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-orange-100/55">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function SegmentedButtonGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-1 rounded-lg bg-black/35 p-1 sm:grid-flow-col sm:auto-cols-fr">
      {options.map((option) => (
        <button
          className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
            value === option ? "bg-orange-400 text-zinc-950" : "text-zinc-300 hover:bg-orange-500/15 hover:text-white"
          }`}
          key={option}
          type="button"
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ResultRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-orange-200/10 py-3 last:border-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className={highlight ? "text-right text-base font-semibold text-orange-200" : "text-right text-sm font-medium text-white"}>
        {value}
      </span>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-28 flex-col justify-between rounded-xl border border-orange-300/15 bg-zinc-950/55 p-4">
      <p className="max-w-[8rem] text-xs font-semibold uppercase leading-4 text-orange-200/60">{label}</p>
      <p className="mt-3 text-lg font-semibold leading-snug text-white">{value}</p>
    </div>
  );
}

function BrandLockup() {
  return (
    <NextImage
      className="h-auto w-[150px] sm:w-[172px]"
      src="/hibachi-lockup-clean.png"
      alt="Hibachi"
      width={902}
      height={192}
      priority
    />
  );
}

function ReferralCta({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`cta-ember relative overflow-hidden rounded-2xl border border-orange-300/30 bg-gradient-to-r from-red-600/35 via-orange-500/25 to-yellow-300/20 p-5 sm:p-6 ${compact ? "h-full" : ""}`}>
      <div className={`flex gap-4 ${compact ? "h-full flex-col items-center justify-center text-center" : "flex-col sm:flex-row sm:items-center sm:justify-between"}`}>
        {compact ? (
          <NextImage
            className="h-auto w-[210px]"
            src="/hibachi-lockup-clean.png"
            alt="Hibachi"
            width={902}
            height={192}
          />
        ) : null}
        <div>
          <h2 className="text-xl font-semibold text-white">New here? Start farming with bonus rewards.</h2>
          <p className="mt-1 text-sm text-orange-50/75">
            Register through this link to get a{" "}
            <span className="font-bold text-yellow-200">30% points boost</span> and{" "}
            <span className="font-bold text-yellow-200">5% fee discount</span>.
          </p>
        </div>
        <a
          className={`cta-button inline-flex items-center justify-center rounded-lg bg-white text-sm font-semibold text-zinc-950 shadow-lg shadow-red-950/30 transition hover:bg-yellow-100 ${compact ? "px-8 py-4 text-base" : "px-5 py-3"}`}
          href={REFERRAL_LINK}
          target="_blank"
          rel="noreferrer"
        >
          Create your account
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  const [distributionState, setDistributionState] = useState(() => getDistributionState());
  const [totalPoints, setTotalPoints] = useState(() => getDistributionState().currentTotalPoints);
  const [userPoints, setUserPoints] = useState(12_500);
  const [fdvMillions, setFdvMillions] = useState(100);
  const [airdropPercentage, setAirdropPercentage] = useState(25);
  const [farmCostEnabled, setFarmCostEnabled] = useState(false);
  const [farmCostUsd, setFarmCostUsd] = useState(0);
  const [farmCostMode, setFarmCostMode] = useState<FarmCostMode>("subtract");
  const [copyStatus, setCopyStatus] = useState("Copy Result");
  const [imageStatus, setImageStatus] = useState("Copy Image");
  const [includeNftBonus, setIncludeNftBonus] = useState(false);
  const [nftCollection, setNftCollection] = useState<NftCollection>("No NFT");
  const [nftBonusMode, setNftBonusMode] = useState<NftBonusMode>("+% to airdrop");
  const [nftScenario, setNftScenario] = useState<NftScenario>(DEFAULT_NFT_SCENARIO);
  const [customNftPercent, setCustomNftPercent] = useState(10);
  const [customNftFixedTokens, setCustomNftFixedTokens] = useState(2_500);

  useEffect(() => {
    const updateDistribution = () => {
      const nextState = getDistributionState();
      setDistributionState(nextState);
      setTotalPoints((current) => (current < nextState.currentTotalPoints ? nextState.currentTotalPoints : current));
    };

    updateDistribution();
    const interval = window.setInterval(updateDistribution, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const result = useMemo(
    () =>
      calculateAirdrop({
        totalPoints,
        userPoints,
        fdvMillions,
        airdropPercentage,
        farmCostEnabled,
        farmCostUsd,
        farmCostMode,
      }),
    [airdropPercentage, farmCostEnabled, farmCostMode, farmCostUsd, fdvMillions, totalPoints, userPoints],
  );

  const activeCost = farmCostEnabled ? Math.max(0, farmCostUsd) : 0;
  const percentPreset = nftScenario === "Custom" ? customNftPercent : NFT_PERCENT_PRESETS[nftScenario][nftCollection];
  const fixedTokenPreset =
    nftScenario === "Custom" ? customNftFixedTokens : NFT_FIXED_TOKEN_PRESETS[nftScenario][nftCollection];
  const selectedNftPercent = Math.max(0, percentPreset);
  const selectedFixedNftTokens = Math.max(0, fixedTokenPreset);
  const nftBonusPercent = includeNftBonus && nftBonusMode === "+% to airdrop" ? selectedNftPercent : 0;
  const fixedNftTokens = includeNftBonus && nftBonusMode === "Fixed token amount" ? selectedFixedNftTokens : 0;
  const nftBonusUsd =
    includeNftBonus && nftBonusMode === "+% to airdrop"
      ? result.estimatedAirdropUsd * (nftBonusPercent / 100)
      : fixedNftTokens * result.tokenPrice;
  const extraTokensFromNft =
    includeNftBonus && nftBonusMode === "+% to airdrop"
      ? result.tokenPrice > 0
        ? nftBonusUsd / result.tokenPrice
        : 0
      : fixedNftTokens;
  const finalAirdropUsd = result.estimatedAirdropUsd + nftBonusUsd;
  const finalTokens = result.estimatedTokens + extraTokensFromNft;
  const netProfitAfterFarmCost = finalAirdropUsd - activeCost;
  const journeyProfit = netProfitAfterFarmCost;
  const roiPercent = activeCost > 0 ? (journeyProfit / activeCost) * 100 : 0;
  const breakEvenPoints = result.pointValueUsd > 0 && activeCost > 0 ? activeCost / result.pointValueUsd : 0;
  const nftBonusValueText =
    nftBonusMode === "+% to airdrop"
      ? `${selectedNftPercent.toLocaleString("en-US")}%`
      : `${numberWithCommas.format(selectedFixedNftTokens)} tokens`;
  const resultSummary = `Hibachi airdrop scenario
Points: ${numberWithCommas.format(userPoints)}
NFT: ${includeNftBonus ? nftCollection : "No NFT"}
NFT bonus mode: ${includeNftBonus ? nftBonusMode : "Off"}
NFT bonus value: ${includeNftBonus ? nftBonusValueText : "0"}
Final estimated airdrop: ${usd.format(finalAirdropUsd)}
Final estimated tokens: ${preciseNumber.format(finalTokens)} HEAT
Calculate yours: ${REFERRAL_LINK}`;
  const shareText = `My estimated @hibachi_xyz airdrop: ${usd.format(finalAirdropUsd)}

${numberWithCommas.format(userPoints)} points · calculated with ${PUBLIC_SITE_URL}`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  function applyNftScenario(nextScenario: NftScenario) {
    setNftScenario(nextScenario);
    if (nextScenario !== "Custom") {
      setCustomNftPercent(NFT_PERCENT_PRESETS[nextScenario][nftCollection]);
      setCustomNftFixedTokens(NFT_FIXED_TOKEN_PRESETS[nextScenario][nftCollection]);
    }
  }

  function applyNftCollection(nextCollection: NftCollection) {
    setNftCollection(nextCollection);
    if (nftScenario !== "Custom") {
      setCustomNftPercent(NFT_PERCENT_PRESETS[nftScenario][nextCollection]);
      setCustomNftFixedTokens(NFT_FIXED_TOKEN_PRESETS[nftScenario][nextCollection]);
    }
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(resultSummary);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus("Copy Result"), 1600);
    } catch {
      setCopyStatus("Copy failed");
      window.setTimeout(() => setCopyStatus("Copy Result"), 1600);
    }
  }

  async function copyResultImage() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 675;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas is not supported");
      }

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#190706");
      gradient.addColorStop(0.48, "#7f1d1d");
      gradient.addColorStop(1, "#fb923c");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const glow = ctx.createRadialGradient(900, 120, 20, 900, 120, 520);
      glow.addColorStop(0, "rgba(250, 204, 21, 0.42)");
      glow.addColorStop(1, "rgba(250, 204, 21, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 0, 0, 0.44)";
      ctx.roundRect(76, 70, 1048, 535, 34);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 237, 213, 0.24)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = "/hibachi-lockup-clean.png";
      });
      ctx.drawImage(logo, 105, 102, 320, 68);

      ctx.fillStyle = "#fff7ed";
      ctx.font = "700 44px Arial";
      ctx.fillText("Airdrop Calculator", 105, 222);
      ctx.fillStyle = "rgba(255, 247, 237, 0.68)";
      ctx.font = "500 24px Arial";
      ctx.fillText("created by @brelgino", 105, 258);

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 76px Arial";
      ctx.fillText(usd.format(finalAirdropUsd), 105, 322);
      ctx.fillStyle = "rgba(255, 247, 237, 0.72)";
      ctx.font = "500 26px Arial";
      ctx.fillText("Final estimated airdrop value", 105, 365);

      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.roundRect(105, 420, 990, 105, 22);
      ctx.fill();
      ctx.fillStyle = "#fed7aa";
      ctx.font = "700 30px Arial";
      ctx.fillText(`${numberWithCommas.format(userPoints)} points`, 132, 485);
      ctx.fillText(`${includeNftBonus ? nftCollection : "No NFT"}`, 432, 485);
      ctx.fillText(`${compactNumber.format(finalTokens)} HEAT`, 705, 485);

      ctx.fillStyle = "#fff7ed";
      ctx.font = "600 24px Arial";
      ctx.fillText("Calculate yours with 30% point boost and 5% fee discount", 105, 575);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob || !navigator.clipboard || typeof ClipboardItem === "undefined") {
        throw new Error("Clipboard image copy is not supported");
      }

      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setImageStatus("Image copied");
      window.setTimeout(() => setImageStatus("Copy Image"), 1800);
    } catch {
      setImageStatus("Copy failed");
      window.setTimeout(() => setImageStatus("Copy Image"), 1800);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-56 w-[920px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-red-600/15 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-2xl border border-orange-300/20 bg-zinc-950/70 p-5 shadow-heat backdrop-blur sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-orange-400 to-yellow-300" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center rounded-full border border-orange-300/30 bg-orange-500/15 px-3 py-1 text-xs font-semibold uppercase text-orange-100">
                Hibachi points estimator
              </div>
              <div className="mb-3">
                <BrandLockup />
              </div>
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">Airdrop Calculator</h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-zinc-300">
                Estimate your potential airdrop based on points, FDV, allocation and farming cost.
              </p>
              <p className="mt-2 text-sm text-orange-100/75">
                created by{" "}
                <a className="font-semibold text-orange-200 underline decoration-orange-300/40 underline-offset-4 hover:text-white" href={CREATOR_LINK} target="_blank" rel="noreferrer">
                  @brelgino
                </a>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[460px]">
              <MetricCard label="Distributed Points" value={compactNumber.format(totalPoints)} />
              <MetricCard
                label="Next distribution"
                value={distributionState.nextDistribution.toLocaleString("en-US", {
                  day: "numeric",
                  hour: "2-digit",
                  hour12: false,
                  minute: "2-digit",
                  month: "short",
                  timeZoneName: "short",
                  timeZone: "UTC",
                })}
              />
              <MetricCard label="Countdown" value={distributionState.countdown} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-2xl border border-orange-300/15 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Inputs</h2>
                <p className="mt-1 text-sm text-zinc-400">Tune assumptions and test your farming upside instantly.</p>
              </div>
              <div className="grid w-full grid-cols-3 gap-1 rounded-lg bg-black/35 p-1 sm:w-auto sm:min-w-60">
                {scenarioPresets.map((preset) => (
                  <button
                    className="preset-button rounded-md px-2 py-2 text-xs font-semibold text-orange-100 transition hover:bg-orange-500/15 sm:text-sm"
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setFdvMillions(preset.fdv);
                      setAirdropPercentage(preset.allocation);
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <SliderField
                  label="Total Distributed Points"
                  valueLabel={compactNumber.format(totalPoints)}
                  minLabel={compactNumber.format(TOTAL_POINTS_MIN)}
                  maxLabel={compactNumber.format(TOTAL_POINTS_MAX)}
                  value={totalPoints}
                  min={TOTAL_POINTS_MIN}
                  max={TOTAL_POINTS_MAX}
                  step={TOTAL_POINTS_STEP}
                  onChange={setTotalPoints}
                />
                <div className="mt-2 flex flex-col gap-1 text-xs text-orange-100/60 sm:flex-row sm:items-center sm:justify-between">
                  <span>Auto baseline: {compactNumber.format(distributionState.currentTotalPoints)}</span>
                  <span>+{compactNumber.format(WEEKLY_POINTS_DISTRIBUTION)} every Monday 00:00 UTC</span>
                </div>
              </div>

              <NumericInput label="Your Points" value={userPoints} min={0} step={100} onChange={setUserPoints} />
              <NumericInput label="FDV" value={fdvMillions} min={0} step={1} suffix="Million USD" onChange={setFdvMillions} />

              <div>
                <SliderField
                  label="Airdrop Percentage"
                  valueLabel={`${airdropPercentage}%`}
                  minLabel="0%"
                  maxLabel="100%"
                  value={airdropPercentage}
                  min={0}
                  max={100}
                  step={0.5}
                  onChange={setAirdropPercentage}
                />
              </div>

              <div className="rounded-xl border border-orange-300/15 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-white">Farm Cost</h3>
                    <p className="mt-1 text-sm text-zinc-400">Track the real cost of the journey.</p>
                  </div>
                  <button
                    className={`h-8 w-14 rounded-full p-1 transition ${farmCostEnabled ? "bg-orange-400" : "bg-zinc-700"}`}
                    type="button"
                    aria-label="Toggle farm cost"
                    aria-pressed={farmCostEnabled}
                    onClick={() => setFarmCostEnabled((enabled) => !enabled)}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-zinc-950 transition ${farmCostEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {farmCostEnabled ? (
                  <div className="mt-4 space-y-4">
                    <NumericInput label="Cost" value={farmCostUsd} min={0} step={1} prefix="$" onChange={setFarmCostUsd} />
                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-black/35 p-1">
                      {(["subtract", "external"] as FarmCostMode[]).map((mode) => (
                        <button
                          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                            farmCostMode === mode ? "bg-orange-400 text-zinc-950" : "text-zinc-400 hover:text-white"
                          }`}
                          key={mode}
                          type="button"
                          onClick={() => setFarmCostMode(mode)}
                        >
                          {mode === "subtract" ? "Subtract" : "Display only"}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-orange-300/25 bg-gradient-to-br from-orange-500/10 via-zinc-950/70 to-red-950/30 p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-orange-300/25 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold uppercase text-orange-100">
                        Speculative
                      </span>
                      <span className="rounded-full border border-orange-300/25 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold uppercase text-orange-100">
                        NFT Bonus
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-white">Hibachi NFT Bonus</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      NFT bonus scenarios are speculative. Hibachi has not officially confirmed NFT-based airdrop multipliers or fixed token allocations.
                    </p>
                  </div>
                  <button
                    className={`h-8 w-14 shrink-0 rounded-full p-1 transition ${includeNftBonus ? "bg-orange-400" : "bg-zinc-700"}`}
                    type="button"
                    aria-label="Toggle NFT bonus"
                    aria-pressed={includeNftBonus}
                    onClick={() => setIncludeNftBonus((enabled) => !enabled)}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-zinc-950 transition ${includeNftBonus ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {includeNftBonus ? (
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-orange-50">NFT Collection</span>
                      <select
                        className="w-full rounded-lg border border-orange-300/15 bg-zinc-950/75 px-3 py-3 text-sm text-white outline-none transition focus:border-orange-300/80 focus:ring-2 focus:ring-orange-500/20"
                        value={nftCollection}
                        onChange={(event) => applyNftCollection(event.target.value as NftCollection)}
                      >
                        {nftCollections.map((collection) => (
                          <option key={collection} value={collection}>
                            {collection}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <a
                        className="rounded-lg border border-orange-300/20 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-orange-300/60 hover:bg-orange-500/15"
                        href={MODULARIUM_LINK}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Hibachi on Modularium
                      </a>
                      <a
                        className="rounded-lg border border-orange-300/20 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-orange-300/60 hover:bg-orange-500/15"
                        href={FLAME_NINJAS_OPENSEA_LINK}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Flame Ninjas on OpenSea
                      </a>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full border border-orange-300/25 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold uppercase text-orange-100">
                          Scenario Mode
                        </span>
                      </div>
                      <SegmentedButtonGroup options={nftScenarios} value={nftScenario} onChange={applyNftScenario} />
                    </div>

                    <div>
                      <span className="mb-2 block text-sm font-medium text-orange-50">Bonus calculation mode</span>
                      <SegmentedButtonGroup options={nftBonusModes} value={nftBonusMode} onChange={setNftBonusMode} />
                    </div>

                    {nftBonusMode === "+% to airdrop" ? (
                      <NumericInput
                        label="NFT Bonus Percentage"
                        value={selectedNftPercent}
                        min={0}
                        step={0.5}
                        suffix="%"
                        helper={nftScenario === "Custom" ? "Custom" : nftScenario}
                        onChange={(value) => {
                          setNftScenario("Custom");
                          setCustomNftPercent(value);
                        }}
                      />
                    ) : (
                      <NumericInput
                        label="Fixed NFT Token Amount"
                        value={selectedFixedNftTokens}
                        min={0}
                        step={100}
                        suffix="HEAT"
                        helper={nftScenario === "Custom" ? "Custom" : nftScenario}
                        onChange={(value) => {
                          setNftScenario("Custom");
                          setCustomNftFixedTokens(value);
                        }}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-orange-300/25 bg-gradient-to-br from-zinc-950 via-red-950/35 to-orange-950/45 p-5 shadow-2xl shadow-red-950/40 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-orange-400/15 to-transparent" />
              <p className="relative text-sm font-medium uppercase text-orange-200">Final Estimated Airdrop</p>
              <div className="relative mt-3 text-4xl font-semibold text-white sm:text-5xl">
                {usd.format(finalAirdropUsd)}
              </div>
              <p className="relative mt-3 text-sm text-zinc-400">
                Net profit after farm cost: <span className="font-semibold text-orange-100">{usd.format(netProfitAfterFarmCost)}</span>
              </p>

              <div className="relative mt-6 rounded-xl border border-orange-200/10 bg-black/35 px-4">
                <ResultRow label="Base Airdrop Value" value={usd.format(result.estimatedAirdropUsd)} />
                <ResultRow label="Points" value={numberWithCommas.format(userPoints)} />
                <ResultRow label="Share %" value={percentage(result.userShare)} highlight />
                <ResultRow label="Base Estimated Tokens" value={preciseNumber.format(result.estimatedTokens)} />
                <ResultRow label="NFT Collection" value={includeNftBonus ? nftCollection : "No NFT"} />
                <ResultRow label="NFT Bonus Mode" value={includeNftBonus ? nftBonusMode : "Off"} />
                <ResultRow label="NFT Bonus Value" value={includeNftBonus ? usd.format(nftBonusUsd) : usd.format(0)} highlight={includeNftBonus} />
                <ResultRow label="Extra Tokens from NFT" value={preciseNumber.format(extraTokensFromNft)} />
                <ResultRow label="Final Estimated Airdrop" value={usd.format(finalAirdropUsd)} highlight />
                <ResultRow label="Final Estimated Tokens" value={preciseNumber.format(finalTokens)} highlight />
                <ResultRow label="FDV" value={usdCompact.format(result.fdvUsd)} />
                <ResultRow label="1 Token Price" value={usd.format(result.tokenPrice)} />
                <ResultRow label="1 Point Value" value={usd.format(result.pointValueUsd)} />
                <ResultRow label="Net Profit after farm cost" value={usd.format(netProfitAfterFarmCost)} highlight />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard label="Point EV" value={usd.format(result.pointValueUsd)} />
              <MetricCard label="Break-even pts" value={breakEvenPoints > 0 ? compactNumber.format(breakEvenPoints) : "Add cost"} />
              <MetricCard label="Cost ROI" value={activeCost > 0 ? `${roiPercent.toFixed(1)}%` : "No cost"} />
            </div>

            <div className="rounded-2xl border border-orange-300/15 bg-zinc-950/70 p-5 backdrop-blur sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  className="rounded-lg bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:brightness-110"
                  type="button"
                  onClick={copyResult}
                >
                  {copyStatus}
                </button>
                <a
                  className="rounded-lg border border-orange-300/20 bg-orange-500/10 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-orange-300/60 hover:bg-orange-500/20"
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share on X
                </a>
                <button
                  className="rounded-lg border border-orange-300/20 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:border-orange-300/60 hover:bg-orange-500/15"
                  type="button"
                  onClick={copyResultImage}
                  title="Copies a share image that you can paste into X."
                >
                  {imageStatus}
                </button>
              </div>
            </div>

            {includeNftBonus ? <ReferralCta compact /> : null}
          </div>
        </section>

        {!includeNftBonus ? <ReferralCta /> : null}

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-orange-300/15 bg-zinc-950/65 p-5">
            <p className="text-xs font-semibold uppercase text-orange-200">Farmer lens</p>
            <h3 className="mt-3 text-lg font-semibold text-white">Track EV before you add size</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Watch point value, ROI, and break-even points before scaling volume.
            </p>
          </div>
          <div className="rounded-2xl border border-orange-300/15 bg-zinc-950/65 p-5">
            <p className="text-xs font-semibold uppercase text-orange-200">Project intel</p>
            <h3 className="mt-3 text-lg font-semibold text-white">News and funding block</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Weekly points, active quests, and market updates belong here once an API feed is connected.
            </p>
          </div>
          <div className="rounded-2xl border border-orange-300/15 bg-zinc-950/65 p-5">
            <p className="text-xs font-semibold uppercase text-orange-200">Fast links</p>
            <div className="mt-4 grid gap-2">
              <a className="rounded-lg bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-500/15" href={X_LINK} target="_blank" rel="noreferrer">
                Hibachi on X
              </a>
              <a className="rounded-lg bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-500/15" href={CRYPTORANK_LINK} target="_blank" rel="noreferrer">
                Research market data
              </a>
            </div>
          </div>
        </section>

        <footer className="rounded-2xl border border-orange-300/15 bg-black/30 p-5 text-center text-sm text-zinc-400">
          Dashboard created by{" "}
          <a className="font-semibold text-orange-200 underline decoration-orange-300/40 underline-offset-4 hover:text-white" href={CREATOR_LINK} target="_blank" rel="noreferrer">
            @brelgino
          </a>
        </footer>
      </div>
    </main>
  );
}
