# CARSTAIR

## Cloudflare settings (REQUIRED — copy exactly)

| Setting | Value |
|---------|--------|
| **Build command** | `npx opennextjs-cloudflare build` |
| **Deploy command** | `npx wrangler deploy` |
| **Root directory** | `/` |

Do **NOT** set Build command to `npm run build`.

Why: OpenNext runs `next build` internally. If `npm run build` is also OpenNext, it recurses forever and times out.

- `npm run build` → `next build` only (used by OpenNext)
- Cloudflare build step → `npx opennextjs-cloudflare build` (runs Next + packages for Workers)
- Deploy → `npx wrangler deploy`

### Custom domain
Workers → carstair → Custom Domains → add your domain.

### Local
```bash
npm install
npm run dev
npm run opennext   # production OpenNext build
npm run deploy     # needs CF login
```

Contact: COO Michael Manyewe — michaelmanyewe18@gmail.com

Educational only. Not financial advice.
