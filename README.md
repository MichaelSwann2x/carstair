# CARSTAIR v2

Multi-page trading workspace — Gotham glossy UI, TradingView charts, Nico AI, standard auth.

## Cloudflare deploy

| Setting | Value |
|---------|--------|
| **Build command** | `npx opennextjs-cloudflare build` |
| **Deploy command** | `npx wrangler deploy` |

Do **not** set build to `npm run build` only if you need OpenNext packaging — OpenNext calls `next build` internally.

## Routes
- `/` marketing
- `/signup` `/login` standard accounts
- `/pricing` tier details
- `/app` overview
- `/app/charts` TradingView free widget
- `/app/nico` Nico AI (credits in side panel)
- `/app/models` tier-gated catalogue
- `/app/billing` plans

## Contact
COO Michael Manyewe — michaelmanyewe18@gmail.com

Educational only. Not financial advice.
