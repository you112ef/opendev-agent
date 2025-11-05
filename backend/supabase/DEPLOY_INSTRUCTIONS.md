# 🚀 Supabase Deployment Guide

## Option 1: Using Supabase Dashboard (Recommended)

### Step 1: Apply Database Migrations

1. Go to: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/sql/new
2. Copy the contents of `migrations/001_init_ready.sql`
3. Paste and execute in SQL Editor

### Step 2: Deploy Edge Functions

Use the Supabase CLI or Dashboard:

```bash
cd backend/supabase

# Login first
npx supabase login

# Link project
npx supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

# Deploy functions
npx supabase functions deploy openrouter-models
npx supabase functions deploy openrouter-proxy
npx supabase functions deploy validate-api-key
npx supabase functions deploy run-handler
npx supabase functions deploy task-executor
npx supabase functions deploy github-pr
npx supabase functions deploy sandbox-execute
```

### Step 3: Set Environment Variables

In Supabase Dashboard → Project Settings → Edge Functions:

- `SUPABASE_URL`: https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY`: (from API settings)
- `SUPABASE_ANON_KEY`: (from API settings)
- `OPENROUTER_API_URL`: https://openrouter.ai/api/v1

## Option 2: Automated Deployment Script

Run `./setup.sh` after logging in:

```bash
cd backend/supabase
npx supabase login
./setup.sh
```
