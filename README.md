# v0-mini-pms-dashboard

Next.js hospitality platform foundation for short-term rentals. The app started as a `v0` front-end demo and now includes:

- Yagán-branded landing page with interactive animations
- API-backed PMS flows
- Postgres-ready persistence
- optional Supabase Auth with protected routes & login modal
- Sprint 1 multi-tenant schema, roles, and onboarding scaffolding
- Sprint 2 tenant-aware PMS data mapping with legacy fallback

## Current Architecture

- App Router UI in `app/pms/*`
- Node runtime API routes in `app/api/pms/*`
- PMS domain logic in `lib/pms/*`
- Auth/session helpers in `lib/auth/*` and `lib/supabase/*`
- Local JSON fallback store in `data/pms.json`
- Postgres-backed repository adapter
- Supabase migration in `supabase/migrations/202606110001_sprint1_foundation.sql`

## Modes

### 1. Demo mode

When Supabase auth env vars are missing:

- the app stays publicly accessible
- PMS data still uses the current repository layer
- this is useful for local UI work and lightweight demos

### 2. Protected mode

When Supabase auth env vars are configured:

- `/` and `/pms` require login
- authenticated users are sent through workspace onboarding
- API routes require an authenticated, ready workspace
- PMS reads and writes against the active organization/property scope
- the first workspace auto-seeds units and reservations when tenant tables are empty
- Next.js `proxy.ts` refreshes Supabase sessions server-side

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
POSTGRES_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

Supported database aliases remain available:

- `DATABASE_URL`
- `POSTGRES_URL_NON_POOLING`
- `SUPABASE_DB_URL`
- `NEON_DATABASE_URL`

## Sprint 1 Setup

### 1. Configure Supabase Auth

Per the current Supabase SSR guidance, install `@supabase/ssr` and `@supabase/supabase-js`, store sessions in cookies, and refresh them through a Next.js proxy layer.

### 2. Apply the SQL migration

Run:

- `supabase/migrations/202606110001_sprint1_foundation.sql`

This creates:

- `profiles`
- `organizations`
- `memberships`
- `properties`
- `units`
- `guests`
- `reservations`
- `tasks`
- `audit_logs`
- RLS policies and role helpers
- `bootstrap_workspace(...)` onboarding function

### 3. Create your first workspace

After login, open `/setup` and create:

- your organization
- the first property
- the default owner membership

## Storage

The PMS repository supports two storage paths:

1. **Postgres mode** when a database URL is configured
2. **File mode** when no database URL exists

Inside Postgres mode, the repository supports two execution paths:

1. **Workspace path** for authenticated tenants using `organizations`, `properties`, `units`, `guests`, and `reservations`
2. **Legacy path** for non-scoped/demo consumers still using the original flat `rooms` / `reservations` tables

The API exposes the active mode through:

- `x-pms-storage`
- `x-pms-storage-config`

## Development

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

### Working with `main` Branch

All development happens on the **`main`** branch:

```bash
# Make changes
git checkout main
# ... edit files ...

# Commit and push
git commit -m "type: description"
git push origin main

# Vercel automatically deploys on push to main
```

## Deployment

- The repo is connected to `v0`: [Continue working on v0](https://v0.app/chat/projects/prj_8uIUIQh4qo3x6jYlfNI5767J5gLV)
- Merges to `main` deploy to Vercel
- For protected mode in production, set the Supabase env vars in Vercel
- For persistent PMS writes in production, set a Postgres URL

## Current Scope

Implemented:

- dashboard, calendar, reservations, reports, and responsive sidebar
- API-backed reservation create/delete flows
- validation for email, dates, capacity, and overlapping stays
- Postgres-ready persistence layer with file fallback
- protected auth shell and workspace onboarding
- multi-tenant Sprint 1 schema and roles
- tenant-aware reservation CRUD mapped to workspace tables
- workspace auto-seeding from legacy/demo inventory on first run

Still missing:

- payments, folios, invoices, and accounting workflow
- owner portals and advanced staff permissions
- OTA/channel sync
- housekeeping automation, guest messaging, and audit tooling UI
