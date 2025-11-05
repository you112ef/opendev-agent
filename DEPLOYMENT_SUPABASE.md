# Deployment Guide - Vercel + Supabase

## Quick Start

### 1. Supabase Setup

1. Create account at https://supabase.com
2. Create new project
3. Run migration: `backend/supabase/migrations/001_init.sql`
4. Deploy Edge Functions:
   ```bash
   supabase functions deploy openrouter-models
   supabase functions deploy openrouter-proxy
   supabase functions deploy validate-api-key
   supabase functions deploy run-handler
   ```

### 2. Vercel Deployment

1. Push code to GitHub repository
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically

### 3. Configuration

#### Frontend (Vercel)
- Framework: Next.js
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/.next`
- Install Command: `cd frontend && npm install`

#### Backend (Supabase)
- Edge Functions auto-deploy on push
- Database migrations run manually via SQL Editor
- Realtime enabled by default

## Environment Variables

### Required for Frontend
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Required for Edge Functions
Set in Supabase Dashboard:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Architecture

```
Frontend (Vercel)
  ↓ HTTPS
Supabase Edge Functions
  ↓
Supabase PostgreSQL
  ↓ Realtime
Frontend (Live Updates)
```

## Features

✅ Automatic deployment on git push
✅ Serverless scaling
✅ Real-time updates via Supabase Realtime
✅ Secure API key storage
✅ Row Level Security (RLS)
✅ GitHub OAuth integration

## Monitoring

- Vercel Analytics: Built-in dashboard
- Supabase Logs: Dashboard > Logs
- Edge Function Logs: Dashboard > Edge Functions > Logs

## Troubleshooting

### Edge Functions not working
- Check environment variables in Supabase Dashboard
- Verify function deployment: `supabase functions list`
- Check logs: `supabase functions logs <function-name>`

### Realtime not updating
- Verify Realtime is enabled in Supabase Dashboard
- Check RLS policies allow reads
- Verify client is authenticated

### API key validation fails
- Check OpenRouter API key is valid
- Verify Edge Function has correct headers
- Check Supabase logs for errors
