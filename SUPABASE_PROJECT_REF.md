# Supabase Project: sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

## 📍 Project Information

**Project Reference:** `sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc`

**Project URL:** `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co`

## 🔗 Quick Links

- [Dashboard](https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc)
- [API Settings](https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api)
- [Database Editor](https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/editor)
- [Edge Functions](https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions)
- [Authentication](https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/auth/providers)

## ⚡ Quick Setup

```bash
# Link project
cd backend/supabase
supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

# Run migrations
supabase db push

# Deploy all functions
./setup.sh
```

## 🔑 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get-from-dashboard>
```

### Vercel Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Supabase Edge Functions (Dashboard)
```
SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

## 📋 Setup Checklist

- [ ] Link project: `supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc`
- [ ] Run migration: `supabase db push`
- [ ] Deploy functions: `./backend/supabase/setup.sh`
- [ ] Get API keys from Dashboard
- [ ] Configure GitHub OAuth
- [ ] Set Edge Functions environment variables
- [ ] Configure frontend environment variables

## 🎯 Current Status

✅ Project reference configured in:
- `backend/supabase/config.toml`
- `backend/supabase/setup.sh`
- `frontend/.env.example`
- All documentation files

✅ Ready for deployment!
