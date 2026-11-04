# One-shot Cloudflare Pages connect (do this once)

You are about to **delete / disconnect** the old project and create a fresh Pages project.
Follow these settings exactly on the **first** connect. Do not change them later unless told.

## Create the new Pages project

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select repo: **MichaelSwann2x/carstair**
3. Branch: **main**

## Build settings (copy exactly)

| Field | Value |
|--------|--------|
| Project name | `carstair` (or whatever you want) |
| Production branch | `main` |
| Framework preset | **None** |
| **Build command** | `npx @cloudflare/next-on-pages@1` |
| **Build output directory** | `.vercel/output/static` |
| **Root directory** | **leave empty** (do not type `/` or any path) |
| **Deploy command** | **leave empty** |
| Environment variables | none required for the orderflow UI |
| Node version | `20` (Compatibility flags / Node version setting) |

### Critical rules

- **Root directory must be empty.**  
  If you type anything (even `/`), you get: `Failed: root directory not found`.
- **Deploy command must be empty.**  
  If you put `npx wrangler deploy` you get the Workers vs Pages error.
- Build command must be the adapter, **not** plain `npm run build`.

## After first successful deploy

1. Open the `*.pages.dev` URL Cloudflare gives you.
2. Check `/` (landing) and `/orderflow` (free delayed footprint).
3. Attach custom domain `carstair.com` only **after** the pages.dev URL works.

## If you already have a broken project

1. Delete or disconnect it completely.
2. Create a **new** Pages project with the table above.
3. Do not re-use old build settings.

## Local verify (optional)

```bash
npm install
npx @cloudflare/next-on-pages@1
# should create .vercel/output/static
```
