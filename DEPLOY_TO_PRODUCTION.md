# 🚀 Complete Deployment Guide - Automari.ai to Production

## Overview
This guide will take you from your current codebase to a fully deployed website at **www.Automari.ai** on Vercel.

---

## STEP 1: Prepare Your Code

### 1.1 Clean Up Repository
The repository is already prepared. Build artifacts (`.next/`) and environment files (`.env.local`) are excluded from git.

### 1.2 Verify Build Works
✅ Build test completed successfully - your code is ready to deploy!

---

## STEP 2: Commit and Push to GitHub

### 2.1 Stage Your Changes
```bash
cd /Users/theoasis/automari-website/automari-website-1
git add .
```

### 2.2 Commit Your Changes
```bash
git commit -m "Production ready - deploy to automari.ai"
```

### 2.3 Push to GitHub
```bash
git push origin main
```

**Note:** If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys for GitHub

---

## STEP 3: Deploy to Vercel

### 3.1 Sign Up / Login to Vercel
1. Go to: **https://vercel.com**
2. Click **"Sign Up"** (or **"Log In"** if you already have an account)
3. Choose **"Continue with GitHub"** (recommended - easiest)

### 3.2 Import Your Project
1. Once logged in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"automari-website-live"** (or your repo name)
4. Click **"Import"**

### 3.3 Configure Project Settings
Vercel will auto-detect Next.js settings. Verify:
- **Framework Preset:** Next.js
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 3.4 Add Environment Variables
**IMPORTANT:** Add at least ONE AI API key for the chatbot to work.

Click **"Environment Variables"** and add ONE of the following:

**Option A: Anthropic Claude (Recommended - Best Quality)**
- **Name:** `ANTHROPIC_API_KEY`
- **Value:** Your Anthropic API key (starts with `sk-ant-...`)
- **Environments:** Production, Preview, Development (check all)

**Option B: OpenAI**
- **Name:** `OPENAI_API_KEY`
- **Value:** Your OpenAI API key (starts with `sk-...`)
- **Environments:** Production, Preview, Development (check all)

**Option C: Groq (Fastest)**
- **Name:** `GROQ_API_KEY`
- **Value:** Your Groq API key
- **Environments:** Production, Preview, Development (check all)

**How to Get API Keys:**
- **Anthropic:** https://console.anthropic.com/ → API Keys → Create Key
- **OpenAI:** https://platform.openai.com/api-keys → Create new secret key
- **Groq:** https://console.groq.com/ → API Keys → Create API Key

### 3.5 Deploy
1. Click **"Deploy"** button
2. Wait 2-3 minutes for the build to complete
3. You'll see a success message with a URL like: `automari-website-live.vercel.app`

---

## STEP 4: Configure Custom Domain (www.Automari.ai)

### 4.1 Add Domain in Vercel
1. In your Vercel project dashboard, click **"Settings"** tab
2. Click **"Domains"** in the left sidebar
3. Click **"Add Domain"**
4. Enter: `automari.ai`
5. Click **"Add"**
6. Repeat for: `www.automari.ai`

### 4.2 Configure DNS Records
Vercel will show you the DNS records you need to add. You'll need to add these to your domain registrar (where you bought automari.ai).

**Typical DNS Configuration:**
1. Go to your domain registrar (e.g., Namecheap, GoDaddy, Google Domains, etc.)
2. Find DNS settings / DNS management
3. Add these records:

**For automari.ai (apex domain):**
- **Type:** A
- **Name:** @ (or leave blank)
- **Value:** `76.76.21.21` (Vercel's IP - check Vercel dashboard for current IP)

**OR use CNAME (if your registrar supports it):**
- **Type:** CNAME
- **Name:** @ (or leave blank)
- **Value:** `cname.vercel-dns.com`

**For www.automari.ai:**
- **Type:** CNAME
- **Name:** www
- **Value:** `cname.vercel-dns.com`

### 4.3 Verify Domain
1. After adding DNS records, go back to Vercel
2. Click **"Refresh"** next to your domain
3. Wait 5-60 minutes for DNS propagation
4. Once verified, you'll see a green checkmark ✅

**Note:** DNS changes can take up to 24-48 hours to fully propagate, but usually work within 1-2 hours.

---

## STEP 5: Verify Deployment

### 5.1 Test Your Site
Visit these URLs and verify they work:
- ✅ https://automari.ai
- ✅ https://www.automari.ai
- ✅ https://automari.ai/pricing
- ✅ https://automari.ai/how-it-works
- ✅ https://automari.ai/revenue-calculator

### 5.2 Test Key Features
1. **Homepage:** Should load with shader animations
2. **Chatbot:** Click the chat bubble in bottom right, ask a question
3. **Navigation:** All links should work
4. **Mobile:** Test on mobile device or browser dev tools

### 5.3 Check for Errors
- Open browser console (F12) - should have no errors
- Check Network tab - all resources should load (200 status)
- Test chatbot - should respond to messages

---

## STEP 6: Post-Deployment Checklist

- [ ] Site loads at www.Automari.ai
- [ ] All pages accessible
- [ ] Chatbot responds to messages
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificate active (https://)
- [ ] Domain redirects work (automari.ai → www.automari.ai)

---

## Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible (18.18+)

### Domain Not Working
- Verify DNS records are correct
- Wait longer for DNS propagation (up to 48 hours)
- Check domain registrar settings
- Verify domain is added in Vercel dashboard

### Chatbot Not Working
- Verify environment variable is set in Vercel
- Check API key is valid and has credits
- Check browser console for errors
- Verify API route is accessible: `/api/ai`

### Site Shows Old Version
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check Vercel deployment logs
- Verify latest commit is deployed
- Force redeploy in Vercel dashboard

---

## Quick Reference Commands

```bash
# Navigate to project
cd /Users/theoasis/automari-website/automari-website-1

# Test build locally
npm run build

# Start local dev server
npm run dev

# Git commands
git add .
git commit -m "Your message"
git push origin main

# Check git status
git status
```

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Support:** https://vercel.com/support

---

## Success! 🎉

Once all steps are complete, your website will be live at:
- **https://www.Automari.ai**
- **https://automari.ai** (redirects to www)

Your site is now production-ready and accessible worldwide!

