#!/bin/bash
# Deploy to Vercel with token
# Token will be deleted after use

VERCEL_TOKEN="aV21tPpniLRVrDVMqmojvphD"
SUPABASE_URL="https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co"

echo "🚀 Deploying to Vercel..."

cd /workspace

# Add environment variables
echo "📝 Adding environment variables..."
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --token "$VERCEL_TOKEN" --yes 2>&1

# Deploy
echo ""
echo "🚀 Deploying..."
vercel --prod --token "$VERCEL_TOKEN" --yes 2>&1

echo ""
echo "✅ Deployment complete!"
