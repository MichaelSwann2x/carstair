# Carstair

**CFD & Forex trading journal**

Name stays Carstair. Product is a LiquidJournal-style journal for CFD/forex with Axiom-density terminal layout and MyFundedPerps colour language (near-black + neon green).

## Stack surface

- Landing: terminal shell on first paint (left rail, PnL, trade list, TradingView mini, Forex Factory mini, share card)
- Auth: **Sign up** primary · Google · email · Log in toggle · **no demo**
- App: Dashboard · Journal · Analytics · Prop/CFD desk · Share cards · MT5 CSV
- Logo: Loki crown (horned helmet)
- Palette: `#050608` canvas, `#22c55e` green

## Run

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run pages:build && npm run pages:deploy
```

Aviation / RTS / aircraft routes under `/app/*` and `/api/v1/aircraft` etc. are legacy dead code; primary UX is `/`, `/login`, `/app` journal only. They can be deleted in a cleanup pass.
