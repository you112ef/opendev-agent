# 🚀 Complete Setup & Deployment Guide
# Project: sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

## ✅ Step 1: Supabase Setup

### 1.1 Install Supabase CLI
```bash
npm install -g supabase
```

### 1.2 Login to Supabase
```bash
supabase login
```

### 1.3 Link Project
```bash
cd backend/supabase
supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
```

### 1.4 Run Database Migration
```bash
# Copy migration SQL
cat migrations/001_init.sql

# Then run in Supabase Dashboard > SQL Editor
# OR use CLI:
supabase db push
```

### 1.5 Deploy All Edge Functions
```bash
./setup.sh
```

OR manually:
```bash
supabase functions deploy openrouter-models
supabase functions deploy openrouter-proxy
supabase functions deploy validate-api-key
supabase functions deploy run-handler
supabase functions deploy task-executor
supabase functions deploy github-pr
supabase functions deploy sandbox-execute
```

### 1.6 Configure Environment Variables (Supabase Dashboard)

Go to: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/functions

Add these environment variables:
```
SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## ✅ Step 2: Get Supabase Keys

1. Go to: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
2. Copy:
   - `Project URL`: https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   - `anon public` key
   - `service_role` key (for Edge Functions)

## ✅ Step 3: Vercel Deployment

### 3.1 Via Dashboard (Recommended)

1. Go to: https://vercel.com/new
2. Import: `you112ef/opendev-agent`
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Next.js (auto-detected)
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
5. Deploy

### 3.2 Via CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod
```

## ✅ Step 4: Configure GitHub OAuth

1. Go to: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/auth/providers
2. Enable GitHub provider
3. Add GitHub OAuth App credentials:
   - Client ID
   - Client Secret
4. Set Redirect URL: `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co/auth/v1/callback`

## ✅ Step 5: Verify All Models

The `openrouter-models` function fetches ALL available models from OpenRouter API without any exclusion.

To verify:
1. Call: `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co/functions/v1/openrouter-models`
2. Should return all models from OpenRouter

## 📋 Verification Checklist

- [ ] Supabase project linked
- [ ] Database migration run
- [ ] All 7 Edge Functions deployed
- [ ] Environment variables configured
- [ ] Vercel deployed with env vars
- [ ] GitHub OAuth configured
- [ ] All OpenRouter models accessible

## 🎯 Testing

1. Open your Vercel URL
2. Enter OpenRouter API key
3. Check ModelSelector - should show ALL models
4. Create a task
5. Verify real-time updates
6. Test PR creation

## 🔗 Important Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
- **API Settings:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
- **Edge Functions:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions
