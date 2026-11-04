# Carstair

Retail CFD orderflow + multi-tool platform.

- Free 15-minute delayed practice feed
- Footprint-style charts, volume/delta profiles
- Markets: Ind&Com, Forex, Energy, Majors, PrecMet, Ind&Com3, Exotic, Cryptocurrencies
- 50+ model previews
- Journal / prop desk routes still present

## Cloudflare Pages (one-shot)

**Read [CONNECT.md](./CONNECT.md) before connecting the repo.**

Exact settings:

| Field | Value |
|--------|--------|
| Build command | `npx @cloudflare/next-on-pages@1` |
| Build output directory | `.vercel/output/static` |
| Root directory | *empty* |
| Deploy command | *empty* |
| Node | 20 |

Wrong Root directory → `Failed: root directory not found`  
Wrong Deploy command → Workers vs Pages error

## Local

```bash
npm install
npm run dev
# http://localhost:3000
# http://localhost:3000/orderflow
```

## Stack

Next.js 15 · React 19 · Tailwind · TypeScript · `@cloudflare/next-on-pages`
