# Cloudflare Pages — Castair / Carstair

## Correct dashboard settings (copy exactly)

| Field | Value |
|--------|--------|
| Framework preset | **None** |
| Build command | `npx @cloudflare/next-on-pages@1` |
| Build output directory | `.vercel/output/static` |
| Root directory | *(empty)* |
| **Deploy command** | **EMPTY — leave blank** |
| Node version | `20` |

## Why deploy failed (auth error 10000)

The **build finished successfully**.  
A **Deploy command** of `npx wrangler pages deploy ...` then ran Wrangler with `CLOUDFLARE_API_TOKEN`. That token does not have permission to create/update the Pages project, so Cloudflare returned:

```
Authentication error [code: 10000]
```

You do **not** need a deploy command when the project is connected to GitHub. Cloudflare Pages uploads the **Build output directory** automatically after a successful build.

## What to do now

1. Cloudflare dashboard → your **Pages** project `carstair`
2. **Settings** → **Builds & deployments** → **Build configurations** → Edit
3. Set Build command and Output directory as in the table above
4. **Clear the Deploy command** (delete whatever is there)
5. Save → **Deployments** → Retry deployment

## Optional: if you insist on a deploy command

Create an API token at https://dash.cloudflare.com/profile/api-tokens with:

- Account → **Cloudflare Pages** → **Edit**
- Account → **Account Settings** → **Read** (sometimes required)

Set it as `CLOUDFLARE_API_TOKEN` in Pages → Settings → Environment variables, then:

```bash
npx wrangler pages deploy .vercel/output/static --project-name=carstair
```

Prefer the empty deploy command path — fewer moving parts.
