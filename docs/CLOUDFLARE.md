# Cloudflare Pages — Castair / Carstair

## Build succeeded path (use this)

| Setting | Value |
|--------|--------|
| Production branch | `main` |
| **Build command** | `npx @cloudflare/next-on-pages@1` |
| **Build output directory** | `.vercel/output/static` |
| Root directory | `/` (empty) |
| Node version | `20` |
| **Deploy command** | *(leave empty)* — Pages auto-deploys the output directory |

## Do not use

- Deploy command: `npx wrangler deploy` — that looks for `.open-next/worker.js` (Workers/OpenNext). This app is **Pages + next-on-pages**.
- If you must set a deploy command, use:

```bash
npx wrangler pages deploy .vercel/output/static --project-name=carstair
```

## Why the last deploy failed

`next-on-pages` finished successfully and wrote assets to `.vercel/output/static`.  
Then the project ran `npx wrangler deploy`, which expects a Workers entry at `.open-next/worker.js`. That file does not exist for this stack.

## Fix in Cloudflare dashboard

1. Open the Pages project → **Settings** → **Builds & deployments**
2. **Build command:** `npx @cloudflare/next-on-pages@1`
3. **Build output directory:** `.vercel/output/static`
4. **Deploy command:** clear it (empty)
5. Save → Retry deployment
