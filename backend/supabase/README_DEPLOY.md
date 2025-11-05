# 🚀 Automated Deployment - All Functions Ready

This directory contains all Edge Functions ready for deployment.

## 📋 Quick Deploy Instructions

### Option 1: Via Supabase Dashboard (Easiest - 10 minutes)

1. **Go to:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions

2. **For each function below, click "Create Function" and paste the code:**

#### Function 1: `openrouter-models`
- File: `functions/openrouter-models/index.ts`
- Purpose: Fetch all OpenRouter models

#### Function 2: `openrouter-proxy`
- File: `functions/openrouter-proxy/index.ts`
- Purpose: Proxy chat completions to OpenRouter

#### Function 3: `validate-api-key`
- File: `functions/validate-api-key/index.ts`
- Purpose: Validate user OpenRouter API keys

#### Function 4: `run-handler`
- File: `functions/run-handler/index.ts`
- Purpose: Handle task creation and retrieval

#### Function 5: `task-executor`
- File: `functions/task-executor/index.ts`
- Purpose: Execute AI tasks (Architect, Coder, Debugger)

#### Function 6: `github-pr`
- File: `functions/github-pr/index.ts`
- Purpose: Create GitHub Pull Requests

#### Function 7: `sandbox-execute`
- File: `functions/sandbox-execute/index.ts`
- Purpose: Execute code in isolated sandbox

### Option 2: Via CLI (Requires Access Token)

```bash
cd backend/supabase

# Set access token
export SUPABASE_ACCESS_TOKEN="your-access-token"

# Link project
npx supabase link --project-ref e2fc6787340d1be587c2eb26a10146db79f2efdc

# Deploy all
./deploy-all.sh
```

## 🔑 Environment Variables Required

Set these in Dashboard → Settings → Edge Functions:

- `SUPABASE_URL`: `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: (from API Settings)
- `SUPABASE_ANON_KEY`: (from API Settings)
- `OPENROUTER_API_URL`: `https://openrouter.ai/api/v1`

## ✅ Database Migrations

Don't forget to apply database migrations:
- File: `migrations/001_init_ready.sql`
- Via: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/sql/new
