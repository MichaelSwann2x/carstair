# Cloudflare Pages — Carstair

## Exact dashboard settings (required)

Go to: **Cloudflare Dashboard → Workers & Pages → your project → Settings → Builds & deployments → Edit**

| Field | Value |
|--------|--------|
| Framework preset | **None** |
| Build command | `npx @cloudflare/next-on-pages@1` |
| Build output directory | `.vercel/output/static` |
| Root directory | *(leave empty)* |
| **Deploy command** | **LEAVE COMPLETELY EMPTY** |
| Node version | `20` |

### Critical

- Do **not** put `npx wrangler deploy` in Deploy command. That is a Workers command and will always fail on a Pages project.
- Do **not** put `npx wrangler pages deploy ...` either when the project is Git-connected. Cloudflare uploads the Build output directory automatically after a successful build.
- If Deploy command is not empty, every deploy will fail even when the build succeeds.

## After changing settings

1. Save the build configuration.
2. Go to **Deployments** → **Retry deployment** (or push any commit).
3. Wait for the build. You should see the adapter run and then a successful deployment with no deploy-command step.

## Why the last two deploys failed

Log line:

```
Executing user deploy command: npx wrangler deploy
✘ [ERROR] It looks like you've run a Workers-specific command in a Pages project.
```

The build itself completed (including `/orderflow`). Only the deploy step failed because of the wrong command still set in the dashboard.

## Local check

```bash
npm install
npx @cloudflare/next-on-pages@1
# output lands in .vercel/output/static
```
