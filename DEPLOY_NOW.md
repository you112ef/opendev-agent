# 🚀 Complete Deployment Instructions for sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

## Project Info
- **Project Reference:** sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
- **Supabase URL:** https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co

## ⚡ Quick Deploy (Copy-Paste Method)

### Step 1: Database Migration (5 minutes)

1. **Open SQL Editor:**
   ```
   https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/sql/new
   ```

2. **Copy entire content from:**
   ```
   backend/supabase/migrations/001_init_ready.sql
   ```

3. **Paste and click "Run"**

4. **Verify tables created:**
   - Go to: Table Editor
   - Should see: `user_settings`, `runs`, `run_logs`, `agent_status`

### Step 2: Deploy Edge Functions (10 minutes)

1. **Open Functions:**
   ```
   https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions
   ```

2. **For each function, create and deploy:**

   **Function 1: openrouter-models**
   - Click "Create Function"
   - Name: `openrouter-models`
   - Runtime: Deno
   - Copy code from: `backend/supabase/functions/openrouter-models/index.ts`
   - Paste and Deploy

   **Function 2: openrouter-proxy**
   - Name: `openrouter-proxy`
   - Code: `backend/supabase/functions/openrouter-proxy/index.ts`

   **Function 3: validate-api-key**
   - Name: `validate-api-key`
   - Code: `backend/supabase/functions/validate-api-key/index.ts`

   **Function 4: run-handler**
   - Name: `run-handler`
   - Code: `backend/supabase/functions/run-handler/index.ts`

   **Function 5: task-executor**
   - Name: `task-executor`
   - Code: `backend/supabase/functions/task-executor/index.ts`

   **Function 6: github-pr**
   - Name: `github-pr`
   - Code: `backend/supabase/functions/github-pr/index.ts`

   **Function 7: sandbox-execute**
   - Name: `sandbox-execute`
   - Code: `backend/supabase/functions/sandbox-execute/index.ts`

### Step 3: Environment Variables (2 minutes)

1. **Open Settings:**
   ```
   https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/functions
   ```

2. **For each function, add these secrets:**

   - `SUPABASE_URL` = `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (Get from: Settings → API → service_role key)
   - `SUPABASE_ANON_KEY` = (Get from: Settings → API → anon public key)
   - `OPENROUTER_API_URL` = `https://openrouter.ai/api/v1`

## ✅ Verification

After deployment:

1. **Test Functions:**
   - Go to Functions → openrouter-models → Invoke
   - Should return list of models

2. **Test Database:**
   - Go to Table Editor
   - Check all 4 tables exist

3. **Test Frontend:**
   - Visit: https://frontend-5h9xeldmb-bades-projects-40452333.vercel.app
   - Should connect to Supabase

## 📋 Checklist

- [ ] Database migration applied
- [ ] All 7 functions deployed
- [ ] Environment variables set
- [ ] Functions tested
- [ ] Frontend connected

## 🎯 Total Time: ~17 minutes

All code is ready in the repository. Just copy-paste!
