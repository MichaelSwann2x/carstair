# Carstair

**Forex & CFD Trading Journal · MetaTrader 5 · Shareable PnL Cards**

Dark terminal-style journal inspired by LiquidJournal and Axiom.trade, re-skinned for forex/CFD with Lucid Trading colour language and an Eye of Sauron mark.

## What changed

- Purpose shifted from aviation RTS to forex/CFD journaling
- Logo: Eye of Sauron
- Palette: near-black canvas (#0a0b0f), cyan/sky accents (#0ea5e9 / #22d3ee), high-contrast data
- Layout density modelled on Axiom terminal (left rail, live P&L, dense trade list)
- First-class MT5 path (CSV/report import + connection stub)
- Share engine direction: downloadable PnL cards/videos with photo, video, audio or link backgrounds for TikTok / X / Instagram

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Cloudflare Pages

**Build command:** `npx @cloudflare/next-on-pages@1`  
**Build output directory:** `.vercel/output/static`  
**Root directory:** `/`  
**Node version:** 20+

```bash
npm run pages:build && npm run pages:deploy
```

## Product surface (current)

- `/` — new landing (dashboard mock, feature grid, share highlight)
- `/login` — existing auth entry (demo / provision)
- Further journal, share-canvas and live MT5 bridge tickets still open

## Next tickets

1. Client-side PnL card generator (canvas + optional video) with media background upload
2. Trade log + session filters + Liquid Score
3. MT5 CSV/report import + broker connection UI
4. Prop/CFD desk (Lucid, FTMO, FundingPips rules)
5. Analytics and pattern detectors

Carstair parameters remain fixed. Provenance on every claim.
