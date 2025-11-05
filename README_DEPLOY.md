# 🚀 Production Deployment Guide

## Quick Start

### 1. Database Setup
Run `backend/supabase/migrations/001_init_ready.sql` in Supabase SQL Editor

### 2. Deploy Functions
```bash
cd backend/supabase
./quick-deploy.sh
```

### 3. Environment Variables
Set in Supabase Dashboard > Functions > Settings

### 4. Deploy Frontend
Deploy to Vercel with environment variables

See PRODUCTION_DEPLOYMENT.md for details.
