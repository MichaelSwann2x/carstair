# Carstair Build Plan

Aligned to `docs/SPEC.md`.

## Phase 1 — Terminal journal (this sprint)

**Goal:** Usable product inside `/app` with Axiom density and Liquid core loops.

| Ticket | Deliverable |
|--------|-------------|
| P1-1 | SPEC + BUILD_PLAN committed |
| P1-2 | Expand `src/lib/journal.ts`: full Trade fields, calendar helpers, equity series |
| P1-3 | Rewrite `src/app/app/layout.tsx` + `page.tsx` as three-column terminal |
| P1-4 | Dashboard: score, 7-day bars, recent, session chips |
| P1-5 | Journal: add/edit/delete full form |
| P1-6 | Analytics: session/symbol/setup + P&L calendar + equity SVG |
| P1-7 | Prop desk: CRUD accounts + firm list |
| P1-8 | Share: PNG download + image bg |
| P1-9 | MT5 CSV import |
| P1-10 | Login: signup/login only, green Loki |
| P1-11 | Landing: terminal preview or redirect; no aero |

**Verify:** Add 3 trades → score moves → calendar colours → export PNG → import CSV.

## Phase 2 — Persistence + auth

- D1 schema for users, trades, accounts
- Google OAuth real callback
- API routes for CRUD under `/api/v1/journal/*`
- Migrate localStorage → API when logged in

## Phase 3 — MT5 live + share video

- Investor-password / report pull path or EA webhook
- MediaRecorder short video cards

## Phase 4 — Depth

- Trade chart overlays, pattern cards, multi-account rules engines

---

Phase 1 implementation order: P1-2 → P1-3 → P1-5 → P1-4 → P1-6 → P1-7 → P1-8 → P1-9 → polish P1-10/11.
