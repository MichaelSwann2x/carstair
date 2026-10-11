# CARSTAIR

Intelligence infrastructure for indices, FX, commodities and futures.

## Philosophy
Simple. Forward-thinking. Human.  
Closed research systems. Delayed quant previews. Limited QUIN assistant. Realistic GEX & IV walls you can run on any contract.

## Stack
- Next.js 14 (App Router) — dynamic, server + client
- TypeScript
- Tailwind (dark Start Labs aesthetic)
- Credit system (daily limits by tier)
- Synthetic educational GEX / IV generator
- Limited QUIN-style assistant
- Wellness break reminder

## Tiers
| Tier     | Price  | Daily credits |
|----------|--------|---------------|
| Free     | $0     | 3             |
| Silver   | $19    | 25            |
| Gold     | $37    | 60            |
| Platinum | $68    | 150           |
| Onyx     | $170   | 500           |

## Run locally
```bash
npm install
npm run dev
```

## Security notes
- Security headers enabled (X-Frame-Options, nosniff, etc.)
- Credit logic runs server-side
- No real institutional data is claimed
- Stripe checkout buttons are placeholders — add your Stripe secret key and price IDs to activate live payments

## Stripe
1. Create products/prices in Stripe for Silver/Gold/Platinum/Onyx.
2. Add `STRIPE_SECRET_KEY` and price IDs to `.env.local`.
3. Implement `/api/stripe/checkout` using the official Stripe Node SDK.

Educational use only. Not financial advice.
