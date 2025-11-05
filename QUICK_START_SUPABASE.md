# Quick Start Guide with Project Reference

## Project Reference
```
sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
```

## Setup Steps

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link Project
```bash
cd backend/supabase
supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
```

Or use the automated script:
```bash
chmod +x backend/supabase/setup.sh
./backend/supabase/setup.sh
```

### 4. Run Migrations
```bash
supabase db push
```

### 5. Deploy Edge Functions
```bash
supabase functions deploy openrouter-models
supabase functions deploy openrouter-proxy
supabase functions deploy validate-api-key
supabase functions deploy run-handler
```

### 6. Get Project URL
Your Supabase project URL will be:
```
https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
```

Or get it from: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api

### 7. Configure Frontend
Update `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 8. Configure Edge Functions
In Supabase Dashboard > Edge Functions > Settings, add:
- `SUPABASE_URL`: https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
- `SUPABASE_ANON_KEY`: <your-anon-key>
- `SUPABASE_SERVICE_ROLE_KEY`: <your-service-role-key>

## Verify Setup

1. Check database tables:
   ```bash
   supabase db diff
   ```

2. List deployed functions:
   ```bash
   supabase functions list
   ```

3. Test Edge Function:
   ```bash
   curl https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co/functions/v1/openrouter-models
   ```

## Dashboard Access
- Project Dashboard: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
- API Settings: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
- Database: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/editor
- Edge Functions: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions
