#!/bin/bash
# Supabase Project Setup Script
# Project Reference: sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

set -e

PROJECT_REF="sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc"

echo "🚀 Setting up Supabase project: $PROJECT_REF"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "📝 Checking Supabase login..."
supabase login || echo "⚠️  Please login manually: supabase login"

# Link project
echo "🔗 Linking project..."
supabase link --project-ref "$PROJECT_REF"

# Run migrations
echo "📊 Running database migrations..."
supabase db push

# Deploy Edge Functions
echo "⚡ Deploying Edge Functions..."

echo "  → Deploying openrouter-models..."
supabase functions deploy openrouter-models

echo "  → Deploying openrouter-proxy..."
supabase functions deploy openrouter-proxy

echo "  → Deploying validate-api-key..."
supabase functions deploy validate-api-key

echo "  → Deploying run-handler..."
supabase functions deploy run-handler

echo "  → Deploying github-pr..."
supabase functions deploy github-pr

echo "  → Deploying sandbox-execute..."
supabase functions deploy sandbox-execute

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get your project URL and keys from: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
echo "2. Update frontend/.env.local with:"
echo "   NEXT_PUBLIC_SUPABASE_URL=https://$PROJECT_REF.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
echo "3. Configure Edge Functions environment variables in Supabase Dashboard"
