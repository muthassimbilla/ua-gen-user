#!/bin/bash

# Deploy fix for IP change infinite loading issue
# This script applies the database fixes and redeploys the application

echo "🔧 Applying IP change infinite loading fix..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

echo "📊 Applying database fixes..."

# Apply the IP change fix SQL script
if [ -f "scripts/26_fix_ip_change_infinite_loading.sql" ]; then
    echo "Running IP change fix SQL script..."
    supabase db reset --linked
    echo "✅ Database fixes applied successfully"
else
    echo "❌ Error: IP change fix SQL script not found"
    exit 1
fi

echo "🚀 Building and deploying..."

# Build the application
echo "Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful"
    echo ""
    echo "🎉 IP change infinite loading fix has been applied!"
    echo ""
    echo "What was fixed:"
    echo "• Improved IP change handling in auth-client.ts"
    echo "• Added timeout mechanisms to prevent infinite loading"
    echo "• Enhanced middleware IP change logic"
    echo "• Created robust database functions for IP migration"
    echo "• Added fallback mechanisms for failed IP migrations"
    echo ""
    echo "The application should now handle IP changes gracefully without getting stuck in loading state."
else
    echo "❌ Deployment failed"
    exit 1
fi
