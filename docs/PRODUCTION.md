# Castair production checklist

## Landing
- Hero: “Inspect. Sign. Release.”
- Kimpton-style animated sky (planes + clouds) — no video file
- Workflow section: 6 steps, auto-advancing, keyboard/clickable

## Durable data (D1)
1. Create a D1 database in Cloudflare dashboard: `castair-db`
2. Apply `schema/d1.sql`
3. Bind in Pages project:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "castair-db"
   database_id = "<id>"
   ```
4. Until bound, the edge in-memory store is used (single-isolate; cold starts reset).

## Auth
- Demo + provision APIs are live (isolated demo tenants).
- Password/OAuth: set `AUTH_SECRET` and wire Auth.js or Clerk; map claims to roles `inspector` | `certifying_staff` | `admin` | `viewer`.
- Role checks are already enforced on RII, RTS release, and certifying approvals.

## R2 evidence
1. Create bucket `castair-evidence`
2. Bind as `EVIDENCE`
3. `/api/v1/evidence` currently stores base64 in isolate memory as fallback; replace put/get with R2 when bound.

## Offline
- Client outbox: `src/lib/offline/outbox.ts`
- Conflict-sensitive ops (signatures, findings) are not auto-flushed — require UI review.

## PDF
- `src/lib/pdf/simple.ts` generates downloadable PDF for RTS text packages.

## Playwright
```bash
npm run test:e2e
```
