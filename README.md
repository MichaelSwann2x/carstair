# CARSTAIR

## Cloudflare Pages / Workers settings (required)

Your last deploy failed because **only** `npx wrangler deploy` ran — no OpenNext build, so `.open-next` was missing.

### Option A (recommended) — two steps

| Field | Value |
|-------|--------|
| **Build command** | `npx opennextjs-cloudflare build` |
| **Deploy command** | `npx wrangler deploy` |
| **Root directory** | `/` (repo root) |

### Option B — single deploy command

| Field | Value |
|-------|--------|
| **Build command** | *(leave empty or `echo skip`)* |
| **Deploy command** | `npx opennextjs-cloudflare build && npx wrangler deploy` |

**Do not** set Build command to `npm run build` only if Deploy is plain `wrangler deploy` — that produces `.next` but **not** `.open-next`.

`package.json` keeps `"build": "next build"` so OpenNext can call it internally without recursion.

## Env vars

```
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=https://your-domain.com
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
```
