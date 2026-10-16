# Cloudflare Pages — Castair / Carstair

## Recommended settings

| Setting | Value |
|--------|--------|
| Production branch | `main` |
| Framework preset | Next.js (or None) |
| Build command | `npx @cloudflare/next-on-pages@1` |
| Build output directory | `.vercel/output/static` |
| Root directory | `/` (empty) |
| Node version | `20` |

## Alternative (plain Next build)

If you only need a Node-compatible deploy or are testing compile:

```
npm run build
```

That is `next build` and now succeeds (invalid `experimental.runtime` removed).

## Why the previous build failed

1. `next.config.ts` had `experimental.runtime: "edge"` which is not a valid Next 15 config key.
2. An unused `@ts-expect-error` caused `tsc` to fail the build.

Both are fixed on `main` of this repo.

## After deploy

- Landing: `/`
- Login / demo: `/login`
- Product: `/app`
- Health API: `/api/health`
