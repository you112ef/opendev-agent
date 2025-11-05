# Supabase Project Quick Reference

## Project Information
- **Project Reference**: `sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc`
- **Project URL**: `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co`
- **Dashboard**: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

## Quick Commands

```bash
# Link project
supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

# Run migrations
supabase db push

# Deploy all functions
./backend/supabase/setup.sh

# Or deploy individually
supabase functions deploy openrouter-models
supabase functions deploy openrouter-proxy
supabase functions deploy validate-api-key
supabase functions deploy run-handler
```

## Environment Variables Needed

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get-from-dashboard>
```

### Edge Functions (Set in Dashboard)
- `SUPABASE_URL`: https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
- `SUPABASE_ANON_KEY`: <from-dashboard>
- `SUPABASE_SERVICE_ROLE_KEY`: <from-dashboard>

## Get API Keys
Visit: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
