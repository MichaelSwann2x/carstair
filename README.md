# Carstair

CFD & Forex trading journal. LiquidJournal-shaped features. Axiom-density terminal UI. MyFunded green + Loki crown mark.

## Spec & plan

- [docs/SPEC.md](docs/SPEC.md) — product, layout, data, stack, success criteria
- [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md) — phases

## Phase 1 (shipped on main)

Terminal at `/app` after Sign up:

- Dashboard (score, 7-day bars, session filter, recent)
- Journal (add with emotions/notes/entry/exit/lots, delete, table)
- Analytics (equity SVG, P&L calendar, by session/setup)
- Prop/CFD desk (accounts + firm list)
- Share (PNG download, image background, story/square/landscape)
- MT5 CSV import
- Right rail: TradingView + score

## Run / deploy

```bash
npm install && npm run dev
npm run pages:build && npm run pages:deploy
```
