# D1 binding via wrangler.toml

This Pages project manages bindings **only** through the repo config (not the dashboard UI).

## Steps

1. Cloudflare → **D1** → **castair-db** → **Settings**
2. Copy **Database ID** (UUID)
3. In the repo, open `wrangler.toml` and `wrangler.jsonc`
4. Replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with that UUID in **both** files
5. Commit and push to `main` (or edit on GitHub and commit)
6. Cloudflare will redeploy; the `DB` binding is applied from config

## Verify after deploy

Pages → carstair → Settings → Bindings should list **DB** → castair-db.
