# CARSTAIR

Intelligence infrastructure for indices, FX, commodities and futures.

## Cloudflare Workers (OpenNext) — required settings

In the Cloudflare dashboard for this Worker/project:

| Setting | Value |
|---------|--------|
| **Build command** | `npm run build` |
| **Deploy command** | `npx wrangler deploy` |
| **Root directory** | `/` (repo root) |
| **Node version** | 20 or 22 |

`npm run build` runs **`opennextjs-cloudflare build`**, which produces `.open-next/`.
Deploy then uploads that output. Do **not** set build to plain `next build` only.

### After deploy
Workers → **carstair** → **Custom Domains** → add your domain.

### Local
```bash
npm install
npm run dev          # development
npm run preview      # production-like on Workers runtime
npm run deploy       # build + deploy (needs CF auth)
```

## Product
- Limited QUIN assistant (credit-gated)
- 50+ model previews (delayed)
- GEX / IV walls for futures, indices, FX, commodities
- Tiers: Free / Silver $19 / Gold $37 / Platinum $68 / Onyx $170
- Wellness break reminder
- Contact: COO Michael Manyewe — michaelmanyewe18@gmail.com

Educational tools only. Not financial advice.
