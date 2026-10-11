# CARSTAIR

Intelligence infrastructure for indices, FX, commodities and futures.

## Cloudflare deploy (important)

Build **must** produce `.open-next` before deploy.

| Setting | Value |
|---------|--------|
| **Build command** | `npm run build` |
| **Deploy command** | `npx wrangler deploy` or `npm run deploy` |

`npm run build` runs `opennextjs-cloudflare build` (Next build + OpenNext packaging).

Do **not** use plain `next build` as the only build step — deploy will fail with "Could not find compiled Open Next config".

### Custom domain
Cloudflare dashboard → Workers → carstair → Custom Domains → add your domain.

## Local
```bash
npm install
npm run dev
```

## Contact
COO: Michael Manyewe — michaelmanyewe18@gmail.com

Educational only. Not financial advice.
