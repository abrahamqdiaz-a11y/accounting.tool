# 🚀 Deployment Guide - Staff Intake Tool

## Prerequisites

✅ GitHub account  
✅ Netlify account (free tier works)  
✅ Make.com webhook URL ready  

---

## Step 1: Get Make.com Webhook URL

1. Go to Make.com
2. Open your "Client Intake Pipeline" scenario
3. Click the **Webhook module** (first module)
4. Click **"Create a webhook"** if you haven't already
5. **Copy the webhook URL** - it looks like:
   ```
   https://hook.us1.make.com/abc123xyz456...
   ```
6. Keep this handy - you'll need it in Step 4

---

## Step 2: Push to GitHub

Open terminal in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Tax prep staff intake tool"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tax-prep-intake.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Netlify

### 3.1 Connect Repository

1. Go to https://app.netlify.com
2. Click **"Add new site"**
3. Choose **"Import an existing project"**
4. Select **"GitHub"**
5. Authorize Netlify to access your GitHub
6. Search for `tax-prep-intake`
7. Click your repository

### 3.2 Configure Build Settings

Netlify should auto-detect these settings:

```
Build command: npm run build
Publish directory: dist
```

**If not auto-detected**, enter them manually.

### 3.3 Add Environment Variables

**IMPORTANT:** Before deploying, add your webhook URL:

1. Click **"Show advanced"**
2. Click **"Add environment variables"**
3. Add this variable:
   - **Key:** `VITE_WEBHOOK_URL`
   - **Value:** `https://hook.us1.make.com/your-actual-webhook-url`
4. Click **"Add"**

### 3.4 Deploy!

Click **"Deploy site"**

⏱️ First build takes 2-3 minutes.

Watch the deploy log. If successful, you'll see:
```
✅ Site is live!
```

---

## Step 4: Test Your Deployment

### 4.1 Visit Your Site

1. Netlify gives you a URL like: `https://random-name-123456.netlify.app`
2. Click the URL to visit your site
3. You should see the intake form!

### 4.2 Submit Test Data

Fill out the form:
- **Name:** Test Client
- **Email:** test@example.com
- **Phone:** (555) 123-4567
- **Service Type:** Personal Tax Return
- **Source:** Phone Call

Click **"Create Client & Send Welcome Email"**

### 4.3 Verify Automation

Check these:

✅ **Make.com:**
- Go to your scenario
- Check execution history
- Should show a successful run with test data

✅ **Google Sheets CRM:**
- Open your CRM Master sheet
- Verify "Test Client" appears

✅ **Google Drive:**
- Check `/CLIENTS/` folder
- Should see `Test Client - 2025` folder with subfolders

✅ **Email:**
- Check test email inbox
- Should have welcome email with upload link

---

## Step 5: Custom Domain (Optional)

### 5.1 Change Site Name

1. Go to **Site settings** → **General** → **Site details**
2. Click **"Change site name"**
3. Enter: `your-company-intake` or `staff-yourcompany`
4. Your URL becomes: `https://staff-yourcompany.netlify.app`

### 5.2 Use Your Own Domain

**If you own a domain** (e.g., yourcompany.com):

1. Go to **Domain management** → **Add custom domain**
2. Enter: `staff.yourcompany.com`
3. Netlify provides DNS instructions:
   ```
   Type: CNAME
   Name: staff
   Value: your-site.netlify.app
   ```
4. Add these DNS records in your domain registrar (GoDaddy, Namecheap, etc.)
5. Wait 24 hours for SSL certificate

---

## Step 6: Security (Optional)

### Password Protection

To require a password to access the form:

1. Go to **Site settings** → **Access control**
2. Enable **"Password protection"**
3. Set password: `TAXPREP2025` (or choose your own)
4. Click **"Save"**

Now staff need the password to access the form.

---

## Step 7: Share with Staff

### 7.1 Create Bookmarks

Send this email to your team:

---

**Subject:** New Client Intake System - Start Using Today

Hi Team,

We've launched a new internal tool to streamline client intake!

**📌 BOOKMARK THIS URL:**
https://your-site-url.netlify.app

**🔑 Password (if enabled):**
TAXPREP2025

**✅ WHEN TO USE:**
- Phone calls: Type info while talking to client
- Walk-ins: Enter data at front desk
- Referrals: Capture referred client info

**⚡ BENEFITS:**
- Auto-sends welcome email with upload link
- Creates Google Drive folders automatically
- Updates CRM in real-time
- No more manual data entry!

**💡 TIPS:**
- Press Tab to move between fields quickly
- Phone numbers auto-format as you type
- Names auto-capitalize
- Form auto-saves recent submissions

**📺 Quick Demo Video:**
[Record a 2-minute screen recording showing how to use it]

**❓ QUESTIONS?**
Reply to this email or contact IT support.

Let's make client intake faster and more efficient!

---

### 7.2 Training Checklist

Print this for staff desks:

```
┌─────────────────────────────────────────┐
│    STAFF INTAKE FORM QUICK GUIDE        │
├─────────────────────────────────────────┤
│                                         │
│  URL: staff.yourcompany.com             │
│  Password: TAXPREP2025                  │
│                                         │
│  ✅ REQUIRED FIELDS:                    │
│  • Full Name                            │
│  • Email                                │
│  • Phone                                │
│  • Service Type                         │
│  • How they reached us                  │
│                                         │
│  ⚡ KEYBOARD SHORTCUTS:                 │
│  • Tab - Next field                     │
│  • Cmd/Ctrl + Enter - Submit            │
│                                         │
│  📝 NOTES FIELD:                        │
│  Use for urgency, special requests,     │
│  or follow-up reminders                 │
│                                         │
│  ✅ AFTER SUBMIT:                       │
│  • Form resets automatically            │
│  • Client gets welcome email            │
│  • Folders created in Drive             │
│  • CRM updated instantly                │
│                                         │
│  🆘 TROUBLESHOOT:                       │
│  • Form won't submit? Check internet    │
│  • Email not sent? Check Make.com       │
│  • Questions? Call IT extension 5555    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Troubleshooting

### Form Submits But Nothing Happens

**Check:**
1. Open browser console (F12) → Console tab
2. Look for errors
3. Check if webhook URL is set: Look for "Submitting to webhook: https://hook..."

**Fix:**
- Environment variable might be wrong
- Go to Netlify → Site settings → Environment variables
- Verify `VITE_WEBHOOK_URL` is correct
- Re-deploy: Deploys → Trigger deploy → Deploy site

### Make.com Scenario Not Triggering

**Check:**
1. Is scenario "ON" in Make.com?
2. Does webhook have CORS enabled?
3. Check execution history for errors

**Fix:**
- Turn scenario ON
- In webhook settings, enable CORS
- Add your Netlify domain to allowed origins

### "Build Failed" in Netlify

**Check deploy log** for specific error.

**Common fixes:**
- Node version too old? Set to 18 in build settings
- Missing dependencies? Check package.json
- Environment variables missing? Add them before deploying

### Form Fields Not Saving

**Check:**
- Browser console for JavaScript errors
- localStorage in DevTools → Application → Local Storage

---

## Updating the Form

### To Make Changes:

1. Edit files locally
2. Commit changes:
   ```bash
   git add .
   git commit -m "Updated form fields"
   git push
   ```
3. Netlify auto-deploys on every push!
4. Check deploy status in Netlify dashboard

### Common Changes:

**Update staff names:**
- Edit `src/types/index.ts` → `STAFF_MEMBERS` array

**Change service types:**
- Edit `src/types/index.ts` → `SERVICE_TYPES` array

**Update CRM link:**
- Edit `src/App.tsx` → line 8 → replace Google Sheets URL

**Change colors:**
- Edit `tailwind.config.js` → `colors.primary` values

---

## Maintenance

### Weekly Checks:
- ✅ Test form submission
- ✅ Verify emails sending
- ✅ Check Make.com operations quota
- ✅ Review recent submissions list

### Monthly:
- ✅ Clear old localStorage backups
- ✅ Review and update service types if needed
- ✅ Check for any failed submissions in Make.com logs

### Quarterly:
- ✅ Update staff names list
- ✅ Review feedback from staff
- ✅ Consider adding new features

---

## Getting Help

**Netlify Issues:**
https://answers.netlify.com

**Make.com Issues:**
https://www.make.com/en/help

**Form Questions:**
Check README.md in project folder

---

🎉 **Congratulations!** Your staff intake tool is live and ready to streamline client onboarding!
