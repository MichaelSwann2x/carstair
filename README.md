# Carstair / Castair

**Aircraft Quality Control · Return-to-Service · Aviation Safety Inspector Platform**

Live Next.js app (frontend + API routes). Offline-first Castair CMMS, external connectors (Trax, AMOS, …), agentic AD/SB / visual / airworthiness tools. Human-in-the-loop on every RTS decision.

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

Or:

```bash
npm run deploy
```

If your project currently runs only `npm run build`, that also works after this fix (plain `next build`).

## Product

- `/` — landing
- `/login` — demo tenant or provision organisation
- `/app` — aircraft CRM view
- `/app/work-packages` — work packages
- `/app/agents` — AD/SB Monitor, Closed-Loop Visual, Explainable Airworthiness
- `/app/connectors` — native offline CMMS or Trax / AMOS / etc.
- `/app/approvals` — human approval queue

## Security

Per-tenant browser sandbox for demo. Production: encrypted tenant isolation. No agent auto-signs RTS.
