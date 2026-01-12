# Email Setup for Business Assessment Form

This guide explains how to enable email delivery for form submissions to `contactautomari@gmail.com`.

---

## Quick Setup (5 minutes)

### Step 1: Get a Resend API Key

1. Go to [resend.com](https://resend.com) and create a free account
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Name it "Automari Website" and copy the key (starts with `re_`)

### Step 2: Add Environment Variable

**For Local Development:**

Create a file called `.env.local` in your project root:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**For Vercel (Production):**

1. Go to your [Vercel Dashboard](https://vercel.com)
2. Select your project → **Settings** → **Environment Variables**
3. Add:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your API key from Step 1
4. Click **Save** and **Redeploy**

### Step 3: Test It

1. Restart your dev server: `npm run dev`
2. Fill out the Business Assessment form on your site
3. Check `contactautomari@gmail.com` for the email (within 1 minute)
4. Check terminal logs for `[Survey API] Email sent successfully`

---

## Resend Free Tier

- **3,000 emails/month** free
- No credit card required
- Emails sent from `assessments@resend.dev` (Resend's shared domain)
- For custom domain (e.g., `assessments@automari.ai`), add your domain in Resend dashboard

---

## Troubleshooting

### Email not arriving?

1. **Check spam/junk folder** in Gmail
2. **Check server logs** for errors:
   ```
   [Survey API] Email send failed: ...
   ```
3. **Verify API key** is set correctly:
   ```bash
   echo $RESEND_API_KEY  # Should show your key
   ```

### "RESEND_API_KEY not configured" in logs?

- The environment variable isn't being loaded
- Make sure `.env.local` exists in project root
- Restart the dev server after adding the variable

### Rate limited?

- Resend free tier: 100 emails/day, 3,000/month
- Upgrade at resend.com/pricing if needed

---

## API Response Codes

| Code | Meaning |
|------|---------|
| 200 + `success: true` | Email sent successfully |
| 400 | Missing required fields (company, industry, size) |
| 500 | Email failed to send (check logs) |

---

## File Locations

| File | Purpose |
|------|---------|
| `app/api/survey/route.ts` | API endpoint that sends email |
| `app/page.tsx` | Form UI and submit handler |
| `.env.local` | Local environment variables |

---

## Security Notes

- API key is only used server-side (never exposed to browser)
- Form data is validated and sanitized before sending
- No sensitive data logged in production
- Resend handles SPF/DKIM for deliverability
