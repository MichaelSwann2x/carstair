# Carstair — Product Spec

**Name:** Carstair (fixed)
**Purpose:** CFD / Forex trading journal. LiquidJournal feature set adapted for CFD/forex + MT5. UI density and chrome of Axiom.trade terminal (not memecoin product logic).
**Colour:** MyFundedPerps language — near-black `#050608`, surface `#0c0e12`, accent `#22c55e`.
**Logo:** Loki horned helmet mark (green silhouette).

---

## 1. Non-goals (explicit)

- Not an aviation / RTS product. All aero routes and copy are dead.
- Not a Solana memecoin terminal. Axiom is **layout reference only**.
- Not a clone of LiquidJournal branding or paid AI coach.
- No “demo hangar” / sample organisation flows.

---

## 2. Layout (Axiom density)

On first paint after auth, user is inside a **terminal shell**, not a marketing page.

```
┌─────────────────────────────────────────────────────────────┐
│ Top bar: logo · nav tabs · account · score · P&L            │
├────────┬──────────────────────────────────────┬─────────────┤
│ Left   │ Main workspace (tab content)         │ Right rail  │
│ rail   │ Dashboard | Journal | Analytics |    │ TV mini OR  │
│ tabs   │ Prop | Share | MT5                   │ FF calendar │
│        │                                      │ Share prev  │
└────────┴──────────────────────────────────────┴─────────────┘
```

Rules:
- Dense: 12–13px body, tight padding, 1px borders `#1a1f2a`.
- No large marketing hero inside `/app`.
- Left rail always visible on md+.
- Main area switches by tab; URL `?tab=`.
- Right rail: TradingView widget + Forex Factory calendar + live share preview when on Share.

---

## 3. Feature set (Liquid-shaped, CFD/forex)

### 3.1 Auth
- Sign up primary (name, email, password field UI).
- Log in toggle.
- Continue with Google (session path until real OAuth keys).
- No demo / sample journal button.
- Session: local token + `carstair_user` until server auth is wired.

### 3.2 Dashboard
- Total P&L, W/L, Liquid Score (win rate, PF, avg R, consistency, discipline).
- Last 7 days bar strip (P&L per day).
- Recent trades list.
- Session filter chips: Asia / London / New York / Overlap / All.

### 3.3 Journal
- Add trade: symbol, side, entry, exit, size (lots), PnL, R, grade A+–D, setup, session, emotions (multi), notes.
- Table: sortable, delete, click to select for Share.
- Edit trade (inline or modal).
- Persist in localStorage v2+ (later: D1 / API).
- Empty state: “Add a trade or import MT5 CSV” — no seeded sample.

### 3.4 Analytics
- By session, by symbol, by setup, by grade.
- Liquid Score breakdown.
- P&L calendar (month grid, green/red day cells, click day → trades that day).
- Equity curve (simple SVG from cumulative PnL).

### 3.5 Prop / CFD desk
- User accounts list (add/edit name, firm, type live|prop, balance, equity).
- Firm catalog: Lucid, FTMO, Funding Pips, The5ers, E8, Blue Guardian, Topstep, Apex (extensible).
- Per account: stage (eval / funded / blown), room left (manual % for now).

### 3.6 Share engine
- Select trade → canvas card.
- Formats: story 1080×1920, square 1080, landscape 1920×1080.
- Background: image upload (video/audio accepted for later MediaRecorder).
- Download PNG.
- Green theme default gradient if no image.

### 3.7 MT5
- CSV / TSV / report text import (Symbol, Type, Volume, Profit, Time).
- Writes into journal; score updates.
- Live login UI fields stored locally; live bridge is Phase 3 (broker API / EA).

### 3.8 Widgets
- TradingView embed (EURUSD default, symbol switchable).
- Forex Factory calendar embed or static day list.

---

## 4. Data model

```ts
Trade {
  id, symbol, side: Long|Short,
  entry, exit, size, pnl, rMultiple,
  grade: A+|A|B|C|D,
  setup, session, emotions[], notes,
  openedAt, closedAt, accountId
}
Account {
  id, name, broker, type: live|prop,
  firm?, balance, equity, stage?
}
```

Storage: `localStorage` keys `carstair_trades_v2`, `carstair_accounts_v2` until API.

---

## 5. Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 App Router |
| UI | React 19 + Tailwind 3 |
| Validation | zod |
| Deploy | Cloudflare Pages (`@cloudflare/next-on-pages`) |
| Auth (now) | Client session; Google button path |
| Auth (next) | Google OAuth + email (API routes) |
| DB (next) | Cloudflare D1 |
| Charts | TradingView embed; SVG equity / calendar |
| Share | Canvas 2D PNG |
| Import | Client CSV parser |

No new deps unless required. Ponytail: stdlib first.

---

## 6. Success criteria (Phase 1)

1. `/` is terminal-first or redirects signed-in users to `/app`.
2. `/login` is Sign up / Log in only.
3. `/app` is full-height terminal: left rail + main + right widgets.
4. User can add, delete, list trades; score and analytics update live.
5. P&L calendar renders from real trades.
6. Share downloads a real PNG with optional background.
7. MT5 CSV import appends trades.
8. Zero aviation copy in primary routes.
9. Green Loki logo + MFP palette.

---

## 7. Out of Phase 1 (later)

- Live MT5 EA / broker API
- Real Google OAuth + server accounts
- Video/GIF share (MediaRecorder)
- Chart drawings on trade candles
- AI coach / community / Study Room
- 600+ prop rule engines
