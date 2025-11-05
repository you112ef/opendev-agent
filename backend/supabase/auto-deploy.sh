#!/bin/bash
# Automated Supabase Deployment via Management API
# This script attempts to deploy everything automatically

set -e

PROJECT_REF="sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
SUPABASE_MGMT_API="https://api.supabase.com/v1"

echo "🚀 Starting Automated Supabase Deployment"
echo "Project: $PROJECT_REF"
echo ""

# Check if access token is provided
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "⚠️  SUPABASE_ACCESS_TOKEN not found"
    echo ""
    echo "To get your access token:"
    echo "1. Go to: https://supabase.com/dashboard/account/tokens"
    echo "2. Create a new access token"
    echo "3. Run: export SUPABASE_ACCESS_TOKEN='your-token'"
    echo "4. Then run this script again"
    echo ""
    echo "Alternatively, you can deploy manually via Dashboard:"
    echo "   See: دليل_النشر_الكامل.md"
    exit 1
fi

echo "✅ Access token found"
echo ""

# Function to deploy SQL migration
deploy_sql() {
    local sql_file="$1"
    echo "📊 Applying SQL migration: $sql_file"
    
    # Read SQL file
    local sql_content=$(cat "$sql_file")
    
    # Use Supabase Management API to execute SQL
    # Note: This requires the project's database password or service role key
    echo "⚠️  SQL execution requires database connection"
    echo "    Please run manually via Dashboard SQL Editor"
    echo "    https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
    echo ""
}

# Function to deploy edge function
deploy_function() {
    local func_name="$1"
    local func_dir="$2"
    
    echo "⚡ Deploying function: $func_name"
    
    if [ ! -d "$func_dir" ]; then
        echo "   ⚠️  Function directory not found: $func_dir"
        return 1
    fi
    
    # Check if using npx supabase
    if command -v npx &> /dev/null; then
        echo "   → Using Supabase CLI..."
        npx supabase functions deploy "$func_name" --project-ref "$PROJECT_REF" || {
            echo "   ⚠️  Failed to deploy via CLI"
            echo "   → Please deploy manually via Dashboard"
            return 1
        }
    else
        echo "   ⚠️  Supabase CLI not available"
        echo "   → Please deploy manually via Dashboard"
        return 1
    fi
}

# Main deployment flow
echo "=== Step 1: Database Migrations ==="
deploy_sql "migrations/001_init_ready.sql"

echo ""
echo "=== Step 2: Edge Functions ==="

FUNCTIONS=(
    "openrouter-models:functions/openrouter-models"
    "openrouter-proxy:functions/openrouter-proxy"
    "validate-api-key:functions/validate-api-key"
    "run-handler:functions/run-handler"
    "task-executor:functions/task-executor"
    "github-pr:functions/github-pr"
    "sandbox-execute:functions/sandbox-execute"
)

for func_info in "${FUNCTIONS[@]}"; do
    IFS=':' read -r func_name func_dir <<< "$func_info"
    deploy_function "$func_name" "$func_dir"
    echo ""
done

echo ""
echo "=== Step 3: Environment Variables ==="
echo "⚠️  Environment variables must be set manually via Dashboard"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
echo ""

echo "✅ Deployment script completed!"
echo ""
echo "📋 Next steps:"
echo "1. Apply SQL migration via Dashboard SQL Editor"
echo "2. Set environment variables via Dashboard"
echo "3. Test the application"
