# Carstair

**Carstair Wi-Fi Tracker** — sole public surface.

Path: `/program/tracker` (and `/` redirects there).

Orange & white dashboard modelled on the United FleetRadar Starlink layout. All metrics zeroed (pre-rollout).

- Flight number search (returns pre-rollout message)
- Fleet completion 0%
- 0 aircraft installed
- Daily flights 0%
- Base / hub percentages all 0%
- No orderflow, no journal, no sign-in / sign-up

## Cloudflare Pages

Build command: `npx @cloudflare/next-on-pages@1`  
Build output directory: `.vercel/output/static`  
Root directory: empty  
Node: 20

## Local

```bash
npm install
npm run dev
# http://localhost:3000  →  /program/tracker
```

## Stack

Next.js 15 · React 19 · Tailwind · TypeScript · `@cloudflare/next-on-pages`
