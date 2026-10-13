# CARSTAIR v3

Charts · Models · Papers · World (Reddit) · Board

**Removed:** Nico, subscriptions, synthetic GEX.

## Cloudflare environment variables

```
AUTH_SECRET=long-random-string
NEXT_PUBLIC_APP_URL=https://carstair.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
```

Google redirect URI: `https://carstair.com/api/auth/google/callback`  
Reddit redirect URI: `https://carstair.com/api/reddit/callback`

## Deploy

- Build: `npx opennextjs-cloudflare build`
- Deploy: `npx wrangler deploy`

## Notes

- Accounts are session-sandboxed (JWT cookie). User models/notes only load for that userId.
- Papers are SSRN abstract links (no hosted PDFs).
- TradingView: public chart widget; set TV username in Profile. Private custom indicators need TradingView while logged into their product.
- In-memory store resets on cold starts — wire Cloudflare KV/D1 for durable multi-user production.
