#!/bin/bash

# Render Deployment Preparation Script
# This script checks if your project is ready for Render deployment

echo "🚀 Render Deployment Preparation Check"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required files exist
echo -e "\n📁 Checking required files..."

files=("render.yaml" "package.json" "client/package.json" "server/package.json" ".env.example")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "✅ $file exists"
    else
        echo -e "❌ $file missing"
    fi
done

# Check if environment variables are documented
echo -e "\n🔧 Checking environment configuration..."
if grep -q "MONGO_URI" .env.example; then
    echo -e "✅ MONGO_URI documented in .env.example"
else
    echo -e "❌ MONGO_URI not found in .env.example"
fi

# Check build scripts
echo -e "\n🏗️ Checking build configuration..."
if grep -q "render-postbuild" package.json; then
    echo -e "✅ render-postbuild script configured"
else
    echo -e "❌ render-postbuild script missing"
fi

# Check if client can build
echo -e "\n⚛️ Checking React build..."
if [ -d "client/node_modules" ]; then
    echo -e "✅ Client dependencies installed"
else
    echo -e "⚠️ Client dependencies not installed (run: npm run install:client)"
fi

# Check if server dependencies exist
echo -e "\n🖥️ Checking server configuration..."
if [ -d "server/node_modules" ]; then
    echo -e "✅ Server dependencies installed"
else
    echo -e "⚠️ Server dependencies not installed (run: npm run install:server)"
fi

# Check git status
echo -e "\n📚 Checking git status..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "✅ Git repository initialized"

    # Check if there are uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "✅ All changes committed"
    else
        echo -e "⚠️ Uncommitted changes detected"
        echo -e "   Run: git add . && git commit -m \"Prepare for deployment\""
    fi

    # Check if remote origin exists
    if git remote get-url origin > /dev/null 2>&1; then
        echo -e "✅ GitHub remote configured"
    else
        echo -e "❌ GitHub remote not configured"
        echo -e "   Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    fi
else
    echo -e "❌ Not a git repository"
    echo -e "   Run: git init"
fi

# Summary
echo -e "\n📋 Summary"
echo -e "=========="
echo -e "📖 Read the deployment guide: RENDER_DEPLOYMENT_GUIDE.md"
echo -e "✅ Use the checklist: RENDER_DEPLOYMENT_CHECKLIST.md"
echo -e "🔗 Render Dashboard: https://dashboard.render.com"
echo -e "🗄️ MongoDB Atlas: https://cloud.mongodb.com"
echo -e ""
echo -e "🚀 Ready to deploy? Run: git push origin main"
echo -e "   Then connect your GitHub repo to Render!"