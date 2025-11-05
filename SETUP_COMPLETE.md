# ✅ Complete Setup Instructions

## 🎯 One-Command Setup

```bash
# Run complete setup script
./deploy-all.sh
```

## 📋 Manual Setup Steps

### 1. Supabase Setup

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
cd backend/supabase
supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

# Run migration (copy SQL from migrations/001_init.sql to Supabase SQL Editor)
# OR use: supabase db push

# Deploy functions
./setup.sh
```

### 2. Environment Variables

**Supabase Dashboard > Settings > Functions:**
```
SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
SUPABASE_ANON_KEY=<from-api-settings>
SUPABASE_SERVICE_ROLE_KEY=<from-api-settings>
```

**Vercel Dashboard:**
```
NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-api-settings>
```

### 3. Deploy to Vercel

1. Go to: https://vercel.com/new
2. Import: `you112ef/opendev-agent`
3. Root Directory: `frontend`
4. Add environment variables
5. Deploy

## ✅ Verification

After deployment, verify:
- [ ] All models load in ModelSelector
- [ ] Task creation works
- [ ] Real-time updates work
- [ ] Code generation works
- [ ] PR creation works

## 🔗 Quick Links

- Dashboard: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
- API Settings: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
- Functions: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions
