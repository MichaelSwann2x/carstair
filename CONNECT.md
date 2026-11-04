# Cloudflare Pages — one correct setup

## Settings that work with this repo

| Field | Value |
|--------|--------|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `.vercel/output/static` |
| Root directory | *empty* |
| **Deploy command** | *empty* **(preferred)** |
| Node | 20 |

`npm run build` now runs `@cloudflare/next-on-pages` and writes to `.vercel/output/static`.

## If Deploy command cannot be empty

Set Deploy command to **exactly**:

```text
npx wrangler pages deploy .vercel/output/static --project-name=carstair
```

Do **not** use `npx wrangler deploy` (Workers-only; always fails on Pages).

## After changing settings

Retry deployment once.
