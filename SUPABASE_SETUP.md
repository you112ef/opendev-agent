# Supabase Setup Guide
# Capy-Inspired AI Engineer Platform

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Get your project URL and API keys from Project Settings > API

## Database Setup

1. Go to SQL Editor in Supabase Dashboard
2. Run the migration file: `backend/supabase/migrations/001_init.sql`
3. This will create:
   - `user_settings` table
   - `runs` table
   - `run_logs` table
   - `agent_status` table
   - Row Level Security (RLS) policies
   - Realtime subscriptions

## Edge Functions Setup

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Deploy Edge Functions:
   ```bash
   supabase functions deploy openrouter-models
   supabase functions deploy openrouter-proxy
   supabase functions deploy validate-api-key
   supabase functions deploy run-handler
   ```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Edge Functions
Set these in Supabase Dashboard > Project Settings > Edge Functions:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Authentication

The platform supports:
- GitHub OAuth (configured in Supabase Dashboard > Authentication > Providers)
- Email/Password authentication
- Anonymous sessions (for MVP testing)

## Realtime

Realtime is automatically enabled for:
- `runs` table (task status updates)
- `run_logs` table (live log streaming)
- `agent_status` table (agent progress updates)

## Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- API keys are stored encrypted in `user_settings` table
- Edge Functions validate authentication before processing requests

## Testing

1. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Navigate to http://localhost:3000
3. Enter your OpenRouter API key
4. Create a task and watch real-time updates
