# 🚀 SIMPLE GO-LIVE INSTRUCTIONS
## Copy and paste these commands exactly

---

## STEP 1: Commit Your Changes
Open Terminal and paste these commands ONE AT A TIME:

```bash
cd /Users/theoasis/automari-website/automari-website-1
```

```bash
git commit -m "Ready for production - AI site complete"
```

---

## STEP 2: Set Up AI (Choose ONE Option)

### Option A: Use Anthropic Claude (RECOMMENDED - Best quality)

1. Go to: https://console.anthropic.com/
2. Sign up or log in
3. Click "API Keys" in left menu
4. Click "Create Key"
5. Copy the key (looks like: `sk-ant-...`)
6. In Terminal, paste this (replace YOUR_KEY_HERE with the actual key):

```bash
echo 'ANTHROPIC_API_KEY=YOUR_KEY_HERE' >> .env.local
```

**OR**

### Option B: Use OpenAI (Alternative)

1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key
5. In Terminal, paste this (replace YOUR_KEY_HERE):

```bash
echo 'OPENAI_API_KEY=YOUR_KEY_HERE' >> .env.local
```

**Note:** You only need ONE key. Don't do both options.

---

## STEP 3: Deploy to Vercel (EASIEST - Free)

### 3a. Push to GitHub first

```bash
git push origin main
```

(If it asks for username/password, use a Personal Access Token)

### 3b. Deploy on Vercel

1. Go to: https://vercel.com/
2. Click "Sign Up" (use GitHub account)
3. Click "Add New" → "Project"
4. Import your GitHub repository (automari-website-1)
5. Under "Environment Variables", click "Add"
6. Add your API key:
   - Name: `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`)
   - Value: (paste your key from Step 2)
7. Click "Deploy"
8. Wait 2-3 minutes
9. Your site is LIVE! 🎉

---

## STEP 4: Test Your Site

1. Open the URL Vercel gives you (looks like: `your-site.vercel.app`)
2. Click "Find Your Pain Points" button
3. Fill out the survey
4. Click the chat bubble in bottom right corner
5. Ask the AI: "What can you do for my business?"
6. If it responds, you're done! ✅

---

## That's It! 

If anything breaks, just copy the error message and ask for help.

