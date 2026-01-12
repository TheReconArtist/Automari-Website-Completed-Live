# Deployment Guide for Automari.ai

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Custom Domain:**
   - In your Vercel project settings, go to "Domains"
   - Add "automari.ai" and "www.automari.ai"
   - Follow DNS configuration instructions
   - Update your domain's DNS records as shown

### Option 2: Deploy via Vercel CLI

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Link to your domain:**
   ```bash
   vercel domains add automari.ai
   ```

## Pre-Deployment Checklist

✅ Build successful - Verified
✅ All syntax errors fixed
✅ Environment variables configured (if needed)

## Post-Deployment

1. Test all pages:
   - Homepage with shader animation
   - Pricing page
   - How it works
   - Revenue calculator

2. Verify:
   - Shader animation loads correctly
   - 3D text displays properly
   - All buttons and links work
   - Mobile responsiveness

## Environment Variables (if needed)

If you need to add environment variables:
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add any required variables (e.g., NEXT_PUBLIC_SPLINE_SCENE_URL if using Spline)

## Support

If you encounter any issues during deployment, check:
- Vercel build logs
- Browser console for runtime errors
- Network tab for failed requests

