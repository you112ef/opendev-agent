# Project Structure

```
/
├── frontend/                    # Next.js frontend
│   ├── components/             # React components
│   │   ├── ApiKeyInputForm.tsx
│   │   ├── ModelSelector.tsx    # NEW: OpenRouter model selector
│   │   ├── TaskCreationWizard.tsx
│   │   ├── AgentStatusDashboard.tsx
│   │   └── RealTimeLogViewer.tsx # UPDATED: Uses Supabase Realtime
│   ├── lib/
│   │   ├── supabaseClient.ts   # NEW: Supabase client
│   │   ├── api.ts              # UPDATED: Uses Supabase Functions
│   │   └── store.ts            # UPDATED: Added model selection
│   ├── pages/
│   │   ├── index.tsx           # UPDATED: Added Supabase integration
│   │   └── settings.tsx        # NEW: API key management page
│   └── package.json            # UPDATED: Added Supabase dependencies
│
├── backend/
│   ├── supabase/               # NEW: Supabase backend
│   │   ├── functions/
│   │   │   ├── openrouter-models/    # Edge Function: Model discovery
│   │   │   ├── openrouter-proxy/     # Edge Function: Chat completions
│   │   │   ├── validate-api-key/     # Edge Function: API key validation
│   │   │   └── run-handler/          # Edge Function: Task management
│   │   └── migrations/
│   │       └── 001_init.sql          # Database schema
│   └── agent_logic/            # Legacy Python code (can be migrated later)
│
└── docs/
    ├── SUPABASE_SETUP.md       # Setup instructions
    └── DEPLOYMENT_SUPABASE.md  # Deployment guide
```

## Key Changes

### Frontend
1. **Supabase Integration**: Added `@supabase/supabase-js` for client SDK
2. **Model Selector**: New component to select OpenRouter models
3. **Settings Page**: Dedicated page for API key management
4. **Realtime Updates**: Uses Supabase Realtime instead of polling
5. **API Client**: Updated to use Supabase Edge Functions

### Backend
1. **Supabase Edge Functions**: Replaced FastAPI with Deno Edge Functions
2. **Database Schema**: PostgreSQL schema with RLS policies
3. **Realtime**: Enabled for runs, logs, and agent status

## Migration Path

The project now uses Supabase as the backend instead of FastAPI. The Python backend code (`backend/agent_logic/`) can be:
- Migrated to Supabase Edge Functions (Deno/TypeScript)
- Kept as-is for local development
- Used as reference for Edge Function implementation

## Next Steps

1. Deploy Supabase project
2. Run database migrations
3. Deploy Edge Functions
4. Configure environment variables
5. Deploy frontend to Vercel
