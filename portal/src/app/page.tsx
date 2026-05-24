"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { projects } from "@/data/projects";

const typewriterCategories = [
  "perps",
  "cards",
  "l1",
  "l2",
  "chain",
  "launchpad",
  "staking",
  "restaking",
  "nft",
  "bridge",
  "oracle",
  "wallet",
  "rwa",
  "depin",
  "gamefi",
  "ai",
  "yield",
  "points",
];

const toolCategories = [
  {
    name: "Perps",
    status: "Active",
    description: "Perps calculators for perpetual futures airdrops, trading points, volume rewards, fees, and farming ROI.",
    projects,
  },
  {
    name: "Cards",
    status: "Coming soon",
    description: "Crypto card tools for card rewards, cashback campaigns, spending bonuses, referral rewards, and user quests.",
    projects: [],
  },
  {
    name: "L1",
    status: "Coming soon",
    description: "Layer 1 airdrop calculators for native chain activity, validator rewards, staking, gas usage, and token allocation.",
    projects: [],
  },
  {
    name: "L2",
    status: "Coming soon",
    description: "Layer 2 airdrop tools for rollup points, bridge volume, transaction activity, ecosystem quests, and reward estimates.",
    projects: [],
  },
  {
    name: "Launchpad",
    status: "Coming soon",
    description: "Launchpad calculators for token sale allocations, IDO rewards, whitelist points, vesting, and community campaigns.",
    projects: [],
  },
  {
    name: "Staking",
    status: "Coming soon",
    description: "Staking calculators for APR, reward compounding, lockups, validator incentives, and potential staking airdrops.",
    projects: [],
  },
  {
    name: "Restaking",
    status: "Coming soon",
    description: "Restaking tools for points programs, AVS rewards, liquid restaking tokens, multipliers, and farming strategy ROI.",
    projects: [],
  },
  {
    name: "NFT",
    status: "Coming soon",
    description: "NFT airdrop calculators for holder bonuses, rarity multipliers, collection snapshots, mint costs, and reward tiers.",
    projects: [],
  },
  {
    name: "Bridge",
    status: "Coming soon",
    description: "Bridge airdrop tools for cross-chain volume, transaction count, route activity, fees, and bridge points campaigns.",
    projects: [],
  },
  {
    name: "Oracle",
    status: "Coming soon",
    description: "Oracle project tools for data network rewards, node incentives, points programs, and ecosystem participation tracking.",
    projects: [],
  },
  {
    name: "Wallet",
    status: "Coming soon",
    description: "Wallet airdrop trackers for swaps, bridges, referrals, account age, transaction history, and user activity rewards.",
    projects: [],
  },
  {
    name: "RWA",
    status: "Coming soon",
    description: "RWA calculators for real-world asset protocols, tokenized yield, lending points, collateral rewards, and allocation models.",
    projects: [],
  },
  {
    name: "DePIN",
    status: "Coming soon",
    description: "DePIN reward calculators for node operators, device activity, network points, hardware ROI, and token incentive programs.",
    projects: [],
  },
  {
    name: "GameFi",
    status: "Coming soon",
    description: "GameFi airdrop tools for player points, quest rewards, NFT bonuses, token emissions, and play-to-earn ROI scenarios.",
    projects: [],
  },
  {
    name: "AI",
    status: "Coming soon",
    description: "AI crypto tools for compute networks, agent points, inference rewards, data campaigns, and AI protocol airdrop models.",
    projects: [],
  },
  {
    name: "Yield",
    status: "Coming soon",
    description: "Yield calculators for APY, farming costs, liquidity rewards, vault incentives, stablecoin strategies, and net ROI.",
    projects: [],
  },
];

const benefitToneClass = {
  emerald: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  orange: "border-orange-300/25 bg-orange-300/10 text-orange-200",
  sky: "border-sky-300/25 bg-sky-300/10 text-sky-200",
  violet: "border-violet-300/25 bg-violet-300/10 text-violet-200",
};

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentWord = `${typewriterCategories[wordIndex]} calculator`;
  const typedWord = currentWord.slice(0, letterCount);
  const projectCount = projects.length;
  const projectLabel = projectCount === 1 ? "project" : "projects";

  const featuredProjects = useMemo(() => projects, []);

  useEffect(() => {
    const isWordComplete = letterCount === currentWord.length;
    const isWordEmpty = letterCount === 0;
    const delay = isDeleting ? 46 : isWordComplete ? 900 : 72;

    const timer = window.setTimeout(() => {
      if (!isDeleting && isWordComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isWordEmpty) {
        setIsDeleting(false);
        setWordIndex((index) => (index + 1) % typewriterCategories.length);
        return;
      }

      setLetterCount((count) => count + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [currentWord, isDeleting, letterCount]);

  return (
    <main className="min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link className="flex items-center gap-3" href="/" aria-label="Alpha Tools home">
            <Image src="/alpha-tools-logo.svg" alt="Alpha Tools logo" width={44} height={44} className="h-11 w-11" />
            <span>
              <span className="block text-sm font-semibold text-white">Alpha Tools</span>
              <span className="block text-xs font-medium text-zinc-500">Crypto alpha calculators hub</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <span className="text-xs font-bold uppercase text-zinc-300">
              {projectCount} {projectLabel} loaded
            </span>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-8 py-8 lg:py-10">
          <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-6 lg:p-7">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase text-emerald-300">Crypto calculators and airdrop research</p>
                <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  Alpha Tools helps crypto users estimate potential rewards before spending time, capital, and points.
                </h2>
                <p className="mt-4 max-w-4xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
                  Use Alpha Tools to compare airdrop calculators, points estimators, token allocation scenarios, NFT
                  multipliers, referral bonuses, and farming ROI across perps, cards, L1, L2, launchpad, staking,
                  restaking, NFT, bridge, oracle, DePIN, AI, GameFi, RWA, wallet, and yield projects.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ["For farmers", "Plan campaigns and avoid blind farming."],
                  ["For traders", "Model perps, points, fees, and upside."],
                  ["For researchers", "Track categories and compare project mechanics."],
                ].map(([title, text]) => (
                  <div className="rounded-md border border-white/10 bg-[#0d1016] px-4 py-3" key={title}>
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="pt-10 sm:pt-14 lg:pt-16">
            <h1 className="max-w-none whitespace-nowrap text-[2rem] font-semibold leading-none tracking-normal text-white sm:text-[2.75rem] lg:text-[3.5rem] xl:text-[4rem]">
              Choose a{" "}
              <span className="inline-flex min-w-[20ch] text-emerald-300">
                {typedWord}
                <span className="ml-1 inline-block w-1 animate-pulse bg-emerald-300" aria-hidden="true">
                  &nbsp;
                </span>
              </span>
            </h1>
          </div>

          <div className="columns-1 gap-4 lg:columns-2">
            {toolCategories.map((category, index) => (
              <section
                className="mb-4 inline-block w-full break-inside-avoid rounded-lg border border-white/10 bg-[#0d1016]/95 shadow-2xl shadow-black/30"
                key={category.name}
              >
                <input
                  className="peer category-toggle sr-only"
                  type="checkbox"
                  id={`category-${category.name.toLowerCase()}`}
                  defaultChecked={index === 0}
                />
                <label
                  className="category-label flex cursor-pointer items-center justify-between gap-4 p-4 sm:p-5"
                  htmlFor={`category-${category.name.toLowerCase()}`}
                >
                  <span>
                    <span className="block text-xs font-bold uppercase text-zinc-500">Category</span>
                    <span className="mt-1 block text-2xl font-semibold text-white">{category.name}</span>
                    <span className="mt-2 block max-w-md text-sm leading-6 text-zinc-500">{category.description}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-black uppercase ${
                        category.projects.length > 0 ? "bg-emerald-300 text-[#050505]" : "bg-white/10 text-zinc-400"
                      }`}
                    >
                      {category.status}
                    </span>
                    <span className="category-track relative h-8 w-14 rounded-full border border-white/10 bg-white/10 transition">
                      <span className="category-thumb absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition" />
                    </span>
                  </span>
                </label>

                <div className="grid max-h-0 gap-3 overflow-hidden border-t border-transparent px-4 transition-all duration-300 peer-checked:max-h-[720px] peer-checked:border-white/10 peer-checked:pb-4 sm:px-5 sm:peer-checked:pb-5">
                  {category.projects.length > 0 ? (
                    featuredProjects.map((project) => (
                      <a
                        className="group grid gap-4 rounded-md border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center"
                        href={project.productionUrl}
                        key={project.slug}
                      >
                        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-md border border-white/10 bg-[#050608] p-3">
                          <Image
                            src={project.logoIconUrl}
                            alt={`${project.name} logo`}
                            width={96}
                            height={96}
                            className="h-14 w-14 object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xl font-semibold text-white">{project.shortName}</span>
                          <span className="block text-sm leading-6 text-zinc-400">{project.description}</span>
                          <span className="mt-3 flex flex-wrap gap-2">
                            {project.benefits.map((benefit) => (
                              <span
                                className={`rounded-md border px-2.5 py-1 text-xs font-bold ${benefitToneClass[benefit.tone]}`}
                                key={benefit.label}
                              >
                                {benefit.label}
                              </span>
                            ))}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="justify-self-end text-2xl text-zinc-500 transition group-hover:translate-x-1 group-hover:text-white"
                        >
                          &rarr;
                        </span>
                      </a>
                    ))
                  ) : (
                    <div className="rounded-md border border-dashed border-white/10 bg-white/[0.025] px-4 py-5 text-sm font-semibold text-zinc-500">
                      Projects for this category will be added later.
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
