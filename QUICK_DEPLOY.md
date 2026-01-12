# ⚡ Quick Deploy - 3 Simple Steps

## Step 1: Push to GitHub

Run this command in your terminal:

```bash
cd /Users/theoasis/automari-website/automari-website-1
./deploy.sh
```

Or manually:
```bash
cd /Users/theoasis/automari-website/automari-website-1
git add .
git commit -m "Production ready - deploy to automari.ai"
git push origin main
```

---

## Step 2: Deploy on Vercel

1. **Go to:** https://vercel.com
2. **Click:** "Add New..." → "Project"
3. **Import:** Your GitHub repository (`automari-website-live`)
4. **Add Environment Variable:**
   - Name: `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`)
   - Value: Your API key
   - Environments: Check all (Production, Preview, Development)
5. **Click:** "Deploy"

Wait 2-3 minutes for deployment to complete.

---

## Step 3: Add Custom Domain

1. In Vercel project → **Settings** → **Domains**
2. **Add:** `automari.ai`
3. **Add:** `www.automari.ai`
4. **Configure DNS** at your domain registrar:
   - Add A record: `@` → `76.76.21.21` (or CNAME: `@` → `cname.vercel-dns.com`)
   - Add CNAME: `www` → `cname.vercel-dns.com`
5. **Wait** 5-60 minutes for DNS propagation

---

## ✅ Done!

Your site will be live at:
- **https://www.Automari.ai**
- **https://automari.ai**

---

**Need more details?** See `DEPLOY_TO_PRODUCTION.md` for complete instructions.

