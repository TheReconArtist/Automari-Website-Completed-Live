# 🚀 SUPER SIMPLE SETUP - Copy & Paste Only

---

## STEP 1: Get OpenAI Key (2 minutes)

1. Go to: **https://platform.openai.com/api-keys**
2. Click **"Sign Up"** or **"Log In"** (use Google account = fastest)
3. Click **"Create new secret key"**
4. Click **"Create secret key"** button
5. **COPY THE KEY** (it starts with `sk-`)
   - Paste it in Notes app so you don't lose it!

---

## STEP 2: Save Your Key (30 seconds)

**Open Terminal** (press Command + Space, type "Terminal", press Enter)

**Copy and paste this ONE line** (replace `YOUR_KEY_HERE` with the key you copied):

```bash
echo 'OPENAI_API_KEY=YOUR_KEY_HERE' > /Users/theoasis/automari-website/automari-website-1/.env.local
```

Press Enter.

**Example:** If your key was `sk-abc123xyz`, you'd paste:
```bash
echo 'OPENAI_API_KEY=sk-abc123xyz' > /Users/theoasis/automari-website/automari-website-1/.env.local
```

---

## STEP 3: Start Your Website (1 minute)

**In Terminal, copy and paste this:**

```bash
cd /Users/theoasis/automari-website/automari-website-1 && npm run dev
```

Press Enter.

**Wait 20 seconds** - you'll see: `✓ Ready on http://localhost:3000`

---

## STEP 4: View Your Site (10 seconds)

1. Open your web browser (Chrome, Safari, etc.)
2. Type this in the address bar: **http://localhost:3000**
3. Press Enter
4. **YOUR SITE IS LIVE!** 🎉

---

## THAT'S IT! 

If you see errors, copy the error message and tell me.

---

## To Stop the Server Later:

In Terminal, press: **Ctrl + C**

