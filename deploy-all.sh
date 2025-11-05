#!/bin/bash
# Complete Deployment Script
# Project: sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

set -e

PROJECT_REF="sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc"
PROJECT_URL="https://${PROJECT_REF}.supabase.co"

echo "🚀 Complete Setup & Deployment"
echo "Project: $PROJECT_REF"
echo ""

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Check if logged in
echo "🔐 Checking Supabase login..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Please login to Supabase:"
    supabase login
fi

# Link project
echo "🔗 Linking project..."
cd backend/supabase
supabase link --project-ref "$PROJECT_REF" || echo "⚠️  Project already linked"

# Run migrations
echo "📊 Running database migrations..."
supabase db push || echo "⚠️  Migrations may already be applied"

# Deploy all functions
echo "⚡ Deploying Edge Functions..."
echo ""

echo "  → openrouter-models (ALL models)"
supabase functions deploy openrouter-models

echo "  → openrouter-proxy"
supabase functions deploy openrouter-proxy

echo "  → validate-api-key"
supabase functions deploy validate-api-key

echo "  → run-handler"
supabase functions deploy run-handler

echo "  → task-executor"
supabase functions deploy task-executor

echo "  → github-pr"
supabase functions deploy github-pr

echo "  → sandbox-execute"
supabase functions deploy sandbox-execute

echo ""
echo "✅ All functions deployed!"
echo ""
echo "📝 Next Steps:"
echo "1. Set environment variables in Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
echo ""
echo "2. Get API keys from:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
echo ""
echo "3. Configure Vercel:"
echo "   NEXT_PUBLIC_SUPABASE_URL=$PROJECT_URL"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>"
echo ""
echo "4. Configure GitHub OAuth:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/auth/providers"
