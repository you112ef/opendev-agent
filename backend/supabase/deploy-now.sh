#!/bin/bash
# Complete Supabase Deployment Script
# Project: sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

set -e

PROJECT_REF="sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

echo "🚀 Starting Complete Supabase Deployment"
echo "Project: $PROJECT_REF"
echo ""

# Check if we can use Supabase CLI
if command -v npx &> /dev/null; then
    echo "✅ npx available"
    
    # Try to link project
    echo "🔗 Attempting to link project..."
    cd /workspace/backend/supabase
    
    # Try linking with short ref
    SHORT_REF=$(echo "$PROJECT_REF" | cut -d'_' -f2)
    echo "Trying short ref: $SHORT_REF"
    
    # Check if already linked
    if [ -f ".supabase/config.toml" ]; then
        echo "✅ Project already linked"
    else
        echo "⚠️  Project not linked. Attempting auto-link..."
        # Try to link (will fail without token, but let's try)
        npx supabase link --project-ref "$SHORT_REF" 2>&1 || echo "⚠️  Link requires authentication"
    fi
    
    # Try to deploy functions if linked
    if [ -f ".supabase/config.toml" ]; then
        echo ""
        echo "⚡ Deploying Edge Functions..."
        
        FUNCTIONS=(
            "openrouter-models"
            "openrouter-proxy"
            "validate-api-key"
            "run-handler"
            "task-executor"
            "github-pr"
            "sandbox-execute"
        )
        
        for func in "${FUNCTIONS[@]}"; do
            if [ -d "functions/$func" ]; then
                echo "  → Deploying $func..."
                npx supabase functions deploy "$func" 2>&1 || {
                    echo "    ⚠️  Failed - requires authentication"
                }
            fi
        done
    else
        echo "⚠️  Cannot deploy functions without project link"
    fi
else
    echo "⚠️  npx not available"
fi

echo ""
echo "📋 Deployment Summary:"
echo ""
echo "✅ Code files are ready"
echo "⚠️  Manual deployment required via Dashboard:"
echo ""
echo "1. Database Migration:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo "   Copy: backend/supabase/migrations/001_init_ready.sql"
echo ""
echo "2. Edge Functions:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/functions"
echo ""
echo "3. Environment Variables:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
