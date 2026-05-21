import React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

function safeText(value: string | null, fallback: string) {
  return value && value.trim() ? value.trim().slice(0, 48) : fallback;
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = safeText(searchParams.get("amount"), "$0.00");
  const points = safeText(searchParams.get("points"), "0 points");
  const nft = safeText(searchParams.get("nft"), "No NFT");
  const tokens = safeText(searchParams.get("tokens"), "0 HEAT");

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "1200px",
          height: "675px",
          display: "flex",
          background: "linear-gradient(135deg, #190706 0%, #7f1d1d 48%, #fb923c 100%)",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "70px 76px",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            width: "1048px",
            height: "535px",
            display: "flex",
            flexDirection: "column",
            border: "2px solid rgba(255, 237, 213, 0.24)",
            borderRadius: "34px",
            background: "rgba(0, 0, 0, 0.44)",
            padding: "42px 50px",
          },
        },
        React.createElement(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "18px" } },
          React.createElement("div", {
            style: {
              width: "54px",
              height: "54px",
              borderRadius: "16px 16px 28px 28px",
              background: "linear-gradient(180deg, #facc15 0%, #fb923c 45%, #e11d48 100%)",
              transform: "rotate(12deg)",
            },
          }),
          React.createElement("div", { style: { fontSize: "54px", fontWeight: 800, letterSpacing: "0" } }, "HIBACHI"),
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
