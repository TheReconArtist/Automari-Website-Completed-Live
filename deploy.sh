#!/bin/bash

# Deployment Script for Automari.ai
# This script prepares and pushes your code to GitHub for Vercel deployment

set -e  # Exit on error

echo "🚀 Automari.ai Deployment Script"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized."
    exit 1
fi

echo "📦 Step 1: Testing build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""

echo "📝 Step 2: Checking git status..."
git status --short

echo ""
read -p "Continue with commit and push? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo "📤 Step 3: Committing changes..."
git add .
git commit -m "Production deployment - ready for automari.ai" || echo "No changes to commit"

echo "🚀 Step 4: Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Code pushed to GitHub."
    echo ""
    echo "📋 Next Steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Import your GitHub repository"
    echo "3. Add environment variables (ANTHROPIC_API_KEY or OPENAI_API_KEY)"
    echo "4. Deploy!"
    echo "5. Add custom domain: automari.ai and www.automari.ai"
    echo ""
    echo "📖 See DEPLOY_TO_PRODUCTION.md for detailed instructions."
else
    echo "❌ Push failed. Please check your git configuration and try again."
    exit 1
fi

