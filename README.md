# CARSTAIR

Intelligence infrastructure for indices, FX, commodities and futures.

## Philosophy
Simple. Forward-thinking. Human.

## Stack
- Next.js 15 + React 19
- OpenNext + Cloudflare Workers
- TypeScript, Tailwind
- Credit system, GEX/IV tool, limited QUIN

## Tiers
| Tier | Price | Daily credits |
|------|-------|---------------|
| Free | $0 | 3 |
| Silver | $19 | 25 |
| Gold | $37 | 60 |
| Platinum | $68 | 150 |
| Onyx | $170 | 500 |

## Local
```bash
npm install
npm run dev
```

## Cloudflare deploy
This project is configured for **OpenNext on Cloudflare Workers**.

1. Connect the GitHub repo in Cloudflare (Workers / Pages).
2. Build command: `npm run build` (or leave default).
3. Deploy command should use: `npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy`
   - Or set deploy to: `npm run deploy`
4. Ensure Node compatibility is enabled (already in `wrangler.jsonc`).
5. Attach your custom domain in Cloudflare dashboard → Workers → carstair → Custom Domains.

### Important
- Next 14 is EOL for OpenNext — project is on **Next 15.3.3**.
- First deploy may install `@opennextjs/cloudflare` automatically.
- After deploy, map your domain under the Worker settings.

## Contact
COO: Michael Manyewe — michaelmanyewe18@gmail.com

Educational use only. Not financial advice.
