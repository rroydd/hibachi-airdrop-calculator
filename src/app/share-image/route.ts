import React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

const SHARE_BACKGROUNDS = [
  "anime-anime-girls-one-piece-nico-robin-wallpaper-preview.jpg",
  "anime-one-piece-blackbeard-marshall-d-teach-wallpaper-preview.jpg",
  "anime-one-piece-brook-one-piece-franky-one-piece-wallpaper-preview (1).jpg",
  "anime-one-piece-brook-one-piece-franky-one-piece-wallpaper-preview.jpg",
  "anime-one-piece-brook-one-piece-minimalist-wallpaper-preview.jpg",
  "anime-one-piece-gol-d-roger-wallpaper-preview.jpg",
  "anime-one-piece-monkey-d-luffy-portgas-d-ace-wallpaper-preview.jpg",
  "anime-one-piece-monkey-d-luffy-shanks-one-piece-wallpaper-preview.jpg",
  "anime-one-piece-monkey-d-luffy-wallpaper-preview (1).jpg",
  "anime-one-piece-monkey-d-luffy-wallpaper-preview.jpg",
  "anime-one-piece-monkey-d-luffy-zoro-roronoa-wallpaper-preview.jpg",
  "anime-one-piece-portgas-d-ace-wallpaper-preview.jpg",
  "anime-one-piece-sanji-one-piece-wallpaper-preview.jpg",
  "anime-one-piece-skull-skull-and-bones-wallpaper-preview.jpg",
  "anime-one-piece-thousand-sunny-wallpaper-preview.jpg",
  "anime-one-piece-tony-tony-chopper-wallpaper-preview.jpg",
  "anime-one-piece-wallpaper-preview.jpg",
  "anime-one-piece-wallpaper-thumb.jpg",
  "anime-one-piece-zoro-roronoa-wallpaper-preview.jpg",
  "blue-one-piece-kids-children-hands-sad-luffy-crying-straw-hat-1920x1080-anime-one-piece-hd-art-wallpaper-preview.jpg",
  "boa-hancock-shichibukai-blue-eyes-black-hair-anime-girls-hd-wallpaper-preview.jpg",
  "monkey-d-luffy-one-piece-gear-5th-hd-wallpaper-preview.jpg",
  "one-piece-1024x768-anime-one-piece-hd-art-wallpaper-preview.jpg",
  "one-piece-anime-monkey-d-luffy-wallpaper-preview.jpg",
  "one-piece-anime-nico-robin-wallpaper-thumb.jpg",
  "one-piece-anime-wallpaper-preview.jpg",
  "one-piece-buggy-one-piece-shanks-one-piece-hd-wallpaper-preview.jpg",
  "one-piece-edward-newgate-gol-d-roger-hd-wallpaper-preview.jpg",
  "one-piece-edward-newgate-gol-d-roger-kozuki-oden-hd-wallpaper-preview.jpg",
  "one-piece-monkey-d-luffy-1920x1080-anime-one-piece-hd-art-wallpaper-preview.jpg",
  "one-piece-monkey-d-luffy-anime-boys-anime-wallpaper-preview.jpg",
  "one-piece-monkey-d-luffy-gear-fourth-snakeman-wallpaper-preview.jpg",
  "one-piece-monkey-d-luffy-hd-wallpaper-preview.jpg",
  "one-piece-monkey-d-luffy-portgas-d-ace-sea-wallpaper-preview.jpg",
  "one-piece-nakamas-anime-monkey-d-luffy-wallpaper-preview.jpg",
  "one-piece-nami-1024x768-anime-one-piece-hd-art-wallpaper-preview.jpg",
  "one-piece-nami-1716x1176-anime-one-piece-hd-art-wallpaper-preview.jpg",
  "one-piece-nami-one-piece-hd-wallpaper-preview.jpg",
  "one-piece-nico-robin-nami-luffy-chopper-brook-franky-usopp-mugiwara-1500x843-anime-one-piece-hd-art-wallpaper-preview.jpg",
  "one-piece-nico-robin-roronoa-zoro-anime-wallpaper-preview.jpg",
  "one-piece-portgas-d-ace-anime-wallpaper-preview.jpg",
  "one-piece-roronoa-zoro-swordsman-sword-katana-hd-wallpaper-preview.jpg",
  "one-piece-roronoa-zoro-tony-tony-chopper-usopp-wallpaper-preview.jpg",
  "one-piece-shanks-one-piece-hd-wallpaper-preview.jpg",
  "one-piece-wallpaper-preview.jpg",
  "one-piece-zoro-1920x1080-anime-one-piece-hd-art-wallpaper-preview.jpg",
  "roronoa-zoro-one-piece-hd-wallpaper-preview.jpg",
  "yamato-one-piece-bunny-girl-hd-wallpaper-preview.jpg",
];

function safeText(value: string | null, fallback: string) {
  return value && value.trim() ? value.trim().slice(0, 48) : fallback;
}

function shareBackgroundUrl(request: Request, value: string | null) {
  const parsed = Number.parseInt(value ?? "", 10);
  const index = Number.isFinite(parsed) ? Math.abs(parsed) % SHARE_BACKGROUNDS.length : Math.floor(Math.random() * SHARE_BACKGROUNDS.length);
  return new URL(`/share-backgrounds/${encodeURIComponent(SHARE_BACKGROUNDS[index])}`, request.url).toString();
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = safeText(searchParams.get("amount"), "$0.00");
  const points = safeText(searchParams.get("points"), "0 points");
  const nft = safeText(searchParams.get("nft"), "No NFT");
  const tokens = safeText(searchParams.get("tokens"), "0 HEAT");
  const backgroundUrl = shareBackgroundUrl(request, searchParams.get("bg"));
  const logoUrl = new URL("/hibachi-lockup-clean.png", request.url).toString();

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "1200px",
          height: "675px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#190706",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "70px 76px",
        },
      },
      React.createElement("img", {
        src: backgroundUrl,
        style: {
          position: "absolute",
          left: "0px",
          top: "0px",
          width: "1200px",
          height: "675px",
          objectFit: "cover",
          opacity: 0.74,
        },
      }),
      React.createElement("div", {
        style: {
          position: "absolute",
          left: "0px",
          top: "0px",
          width: "1200px",
          height: "675px",
          background: "linear-gradient(90deg, rgba(25,7,6,0.92) 0%, rgba(25,7,6,0.72) 46%, rgba(25,7,6,0.45) 100%)",
        },
      }),
      React.createElement(
        "div",
        {
          style: {
            width: "1048px",
            height: "535px",
            display: "flex",
            position: "relative",
            flexDirection: "column",
            border: "2px solid rgba(255, 237, 213, 0.24)",
            borderRadius: "34px",
            background: "rgba(0, 0, 0, 0.66)",
            padding: "42px 50px",
            boxShadow: "0 30px 90px rgba(0,0,0,0.46)",
          },
        },
        React.createElement(
          "div",
          { style: { display: "flex", alignItems: "center", height: "60px" } },
          React.createElement("img", {
            src: logoUrl,
            style: {
              width: "282px",
              height: "60px",
              objectFit: "contain",
            },
          }),
        ),
        React.createElement("div", { style: { marginTop: "22px", fontSize: "40px", fontWeight: 800, lineHeight: 1.05 } }, "Airdrop Calculator"),
        React.createElement("div", { style: { marginTop: "18px", color: "rgba(255, 247, 237, 0.72)", fontSize: "25px", fontWeight: 600, lineHeight: 1 } }, "created by @brelgino"),
        React.createElement("div", { style: { marginTop: "38px", fontSize: "62px", fontWeight: 900, lineHeight: 1.08 } }, amount),
        React.createElement("div", { style: { marginTop: "30px", color: "rgba(255, 247, 237, 0.72)", fontSize: "28px", fontWeight: 600, lineHeight: 1 } }, "Final estimated airdrop value"),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "28px",
              marginTop: "48px",
              borderRadius: "22px",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "26px 28px",
              color: "#fed7aa",
              fontSize: "30px",
              fontWeight: 800,
            },
          },
          React.createElement("div", { style: { width: "30%" } }, points),
          React.createElement("div", { style: { width: "30%", textAlign: "center" } }, nft),
          React.createElement("div", { style: { width: "30%", textAlign: "right" } }, tokens),
        ),
        React.createElement(
          "div",
          { style: { marginTop: "34px", fontSize: "25px", fontWeight: 800, color: "#fff7ed" } },
          "Calculate yours with 30% point boost and 5% fee discount",
        ),
      ),
    ),
    {
      width: 1200,
      height: 675,
    },
  );
}
