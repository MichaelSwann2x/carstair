# Cloudflare Pages settings (required)

| Field | Value |
|--------|--------|
| Framework preset | None |
| **Build command** | `npx @cloudflare/next-on-pages@1` |
| **Build output directory** | `.vercel/output/static` |
| Root directory | *empty* |
| **Deploy command** | *empty* |
| Node | 20 |

Do **not** set Build command to `npm run build` when using the adapter.
`npm run build` is plain `next build` (needed so the adapter does not recurse).

Deploy command must stay empty, or use:
`npx wrangler pages deploy .vercel/output/static --project-name=carstair`

Never use `npx wrangler deploy`.
