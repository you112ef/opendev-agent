# Supabase Project Configuration

## Project Reference
```
sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
```

## Project URL
```
https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
```

## Quick Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
cd backend/supabase
supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

# Run migrations
supabase db push

# Deploy functions
supabase functions deploy openrouter-models
supabase functions deploy openrouter-proxy
supabase functions deploy validate-api-key
supabase functions deploy run-handler
```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-dashboard>
```

### Edge Functions (Set in Dashboard)
- `SUPABASE_URL`: https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
- `SUPABASE_ANON_KEY`: <from-dashboard>
- `SUPABASE_SERVICE_ROLE_KEY`: <from-dashboard>

## Dashboard Links
- [Project Dashboard](https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc)
- [API Settings](https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api)
- [Database Editor](https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/editor)
- [Edge Functions](https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions)
