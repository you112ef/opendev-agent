# 🚀 Complete Supabase Deployment Guide

## ✅ Step 1: Database Migrations (CRITICAL)

### Option A: Via Supabase Dashboard (Easiest)

1. **Go to SQL Editor:**
   https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/sql/new

2. **Copy and paste the entire content of `migrations/001_init_ready.sql`**

3. **Click "Run"**

4. **Verify tables were created:**
   - Go to: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/editor
   - You should see: `user_settings`, `runs`, `run_logs`, `agent_status`

## ✅ Step 2: Deploy Edge Functions

### Option A: Via Supabase Dashboard (Recommended)

1. **Go to Edge Functions:**
   https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions

2. **For each function, create and deploy:**

   ```bash
   # Navigate to functions directory
   cd backend/supabase/functions
   
   # Deploy each function manually through Dashboard
   # OR use CLI with access token:
   ```

### Option B: Via CLI (Requires Access Token)

```bash
cd backend/supabase

# Set access token
export SUPABASE_ACCESS_TOKEN="your-access-token"

# Link project (short project ref)
npx supabase link --project-ref e2fc6787340d1be587c2eb26a10146db79f2efdc

# Deploy functions
npx supabase functions deploy openrouter-models
npx supabase functions deploy openrouter-proxy
npx supabase functions deploy validate-api-key
npx supabase functions deploy run-handler
npx supabase functions deploy task-executor
npx supabase functions deploy github-pr
npx supabase functions deploy sandbox-execute
```

## ✅ Step 3: Set Environment Variables

Go to: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/functions

Set these secrets for each function:

- `SUPABASE_URL`: `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: (Get from: Settings → API → service_role key)
- `SUPABASE_ANON_KEY`: (Get from: Settings → API → anon public key)
- `OPENROUTER_API_URL`: `https://openrouter.ai/api/v1`

## 📋 Quick Checklist

- [ ] Database migrations applied
- [ ] Tables created: `user_settings`, `runs`, `run_logs`, `agent_status`
- [ ] RLS policies enabled
- [ ] Realtime enabled
- [ ] Edge Functions deployed (7 functions)
- [ ] Environment variables set

## 🔗 Important Links

- **Project Dashboard:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
- **SQL Editor:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/sql/new
- **Edge Functions:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions
- **API Settings:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
