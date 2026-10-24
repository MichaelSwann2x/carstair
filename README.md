# Carstair

**Forex & CFD Trading Journal · MetaTrader 5 · Shareable PnL Cards**

Dark terminal journal (LiquidJournal + Axiom layout, Lucid-dark palette, Eye of Sauron logo).

## Features (shipped)

- **Login** — Google button, email signup/login, sample journal (no account)
- **Dashboard** — Total P&L, Liquid Score, win/loss, account summary, recent trades
- **Journal** — Full trade table (symbol, side, PnL, R, grade, setup, session); localStorage persistence
- **Analytics** — By session, by symbol, Liquid Score breakdown (win rate, PF, avg R, consistency, discipline)
- **Prop / CFD desk** — Your accounts + Lucid, FTMO, Funding Pips, The5ers, E8, Blue Guardian
- **Share cards** — Client-side canvas PNG generator; story / square / landscape; image background upload; download
- **MT5** — CSV/report import (Symbol, Type, Volume, Profit); connection UI stub for live bridge

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 → **Open journal** or **Sign in** → lands on `/app`.

## Deploy (Cloudflare Pages)

```bash
npm run pages:build
npm run pages:deploy
```

Build command: `npx @cloudflare/next-on-pages@1`  
Output: `.vercel/output/static`  
Node 20+

## Notes

- Google OAuth route is currently a client demo path (real OAuth needs Google Client ID env + callback). Email/demo work fully client-side for deploy.
- Live MT5 requires broker API / MetaQuotes server connector; CSV import is production-ready today.
- Video/audio backgrounds are accepted in the file picker; PNG export uses image backgrounds. Video export can be added with MediaRecorder later.

Carstair parameters remain fixed.
