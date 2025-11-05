#!/bin/bash
# Automated Supabase Deployment Script
# This script helps deploy all Edge Functions

set -e

PROJECT_REF="sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc"
FUNCTIONS_DIR="functions"

echo "🚀 Starting Supabase Deployment"
echo "Project: $PROJECT_REF"
echo ""

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo ""
    echo "Or use the Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/$PROJECT_REF/functions"
    exit 1
fi

# Check for access token
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "⚠️  SUPABASE_ACCESS_TOKEN not set"
    echo ""
    echo "Please set it:"
    echo "   export SUPABASE_ACCESS_TOKEN='your-token'"
    echo ""
    echo "Or deploy manually via Dashboard:"
    echo "   https://supabase.com/dashboard/project/$PROJECT_REF/functions"
    exit 1
fi

# Link project
echo "🔗 Linking project..."
npx supabase link --project-ref "$PROJECT_REF" || {
    echo "⚠️  Failed to link. Trying with short ref..."
    SHORT_REF=$(echo "$PROJECT_REF" | cut -d'_' -f2)
    npx supabase link --project-ref "$SHORT_REF"
}

# Deploy all functions
FUNCTIONS=(
    "openrouter-models"
    "openrouter-proxy"
    "validate-api-key"
    "run-handler"
    "task-executor"
    "github-pr"
    "sandbox-execute"
)

echo ""
echo "⚡ Deploying Edge Functions..."
echo ""

for func in "${FUNCTIONS[@]}"; do
    if [ -d "$FUNCTIONS_DIR/$func" ]; then
        echo "  → Deploying $func..."
        npx supabase functions deploy "$func" || {
            echo "    ⚠️  Failed to deploy $func"
        }
    else
        echo "  ⚠️  Function $func not found, skipping..."
    fi
done

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Dashboard:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
echo ""
echo "2. Apply database migrations:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
