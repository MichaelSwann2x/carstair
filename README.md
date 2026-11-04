# Carstair

**Multi-tool platform for retail CFD & orderflow analysis.**

Free 15-minute delayed feed (dxFeed-style) for practice and learning. Footprint-style charts, volume/delta profiles, market categories, 50+ model previews, journal, prop desk, and more.

Live at [carstair.com](https://carstair.com).

## Core tools

- **/orderflow** — Retail CFD orderflow workspace (DeepCharts-inspired, free delayed practice feed)
- Journal + Liquid Score + shareable PnL cards
- Prop / CFD desk
- MT5 import
- 50+ trading model previews

## Markets (orderflow)

Ind&Com · Forex · Energy · Majors · PrecMet · Ind&Com3 · Exotic · Cryptocurrencies

## Free delayed feed

15-minute delayed data is included for practice, learning the tools, and non-live use only. Clearly labelled in the UI. Not for live trading decisions.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000  
Orderflow: http://localhost:3000/orderflow

## Deploy (Cloudflare Pages)

```bash
npm run pages:build
npm run pages:deploy
```

## Stack

Next.js 15 · React 19 · Tailwind · TypeScript

Open source. Free for retail use.
