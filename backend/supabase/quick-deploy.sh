# 🚀 Quick Deploy Script
# Run this after setting up Supabase CLI

PROJECT_REF="sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc"

echo "🚀 Starting Production Deployment..."
echo "Project: $PROJECT_REF"
echo ""

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "Install: npm install -g supabase"
    exit 1
fi

# Check login
echo "🔐 Checking Supabase login..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Please login:"
    supabase login
fi

# Link project
echo "🔗 Linking project..."
cd backend/supabase
supabase link --project-ref "$PROJECT_REF" || {
    echo "⚠️  Project already linked or error occurred"
    echo "Continuing..."
}

# Deploy functions
echo ""
echo "⚡ Deploying Edge Functions..."
echo ""

functions=(
    "openrouter-models"
    "openrouter-proxy"
    "validate-api-key"
    "run-handler"
    "task-executor"
    "github-pr"
    "sandbox-execute"
)

for func in "${functions[@]}"; do
    echo "  → Deploying $func..."
    supabase functions deploy "$func" || {
        echo "    ❌ Failed to deploy $func"
    }
done

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Set environment variables in Supabase Dashboard"
echo "2. Run database migration in SQL Editor"
echo "3. Deploy frontend to Vercel"
echo ""
echo "See PRODUCTION_DEPLOYMENT.md for detailed instructions"
