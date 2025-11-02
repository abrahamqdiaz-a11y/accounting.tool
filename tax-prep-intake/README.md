# Tax Prep Client Intake System

A professional internal staff tool for capturing client information during phone calls and walk-in visits at tax preparation offices.

## Features

✅ **Fast Data Entry**
- Auto-formatted phone numbers
- Auto-capitalized names
- Tab-through navigation
- Keyboard shortcuts (Cmd/Ctrl + Enter to submit)

✅ **Smart Form**
- Duplicate detection warnings
- Email validation
- Conditional fields (referral source)
- Character counters

✅ **Integration Ready**
- Posts to Make.com webhook
- Sends welcome emails automatically
- Creates Google Drive folders
- Updates CRM spreadsheet

✅ **User Experience**
- Recent clients tracker
- Success/error toast notifications
- Offline backup to localStorage
- Mobile responsive

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Webhook URL

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Make.com webhook URL:

```env
VITE_WEBHOOK_URL=https://hook.us1.make.com/your-actual-webhook-url
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Test the Form

Fill out all required fields and submit. Check:
- Make.com scenario executes
- CRM sheet gets updated
- Google Drive folders created
- Welcome email sent

---

## Deployment to Netlify

### Option A: Deploy from GitHub (Recommended)

1. **Push to GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/tax-prep-intake.git
git push -u origin main
```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and choose your repository
   - Build settings (auto-detected):
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Add Environment Variables:**
   - Go to Site settings → Environment variables
   - Add: `VITE_WEBHOOK_URL` = your Make.com webhook URL
   - Click "Deploy site"

4. **Custom Domain (Optional):**
   - Go to Domain management
   - Add custom domain: `staff.yourcompany.com`
   - Configure DNS:
     ```
     Type: CNAME
     Name: staff
     Value: your-site.netlify.app
     ```

### Option B: Direct Deploy from Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## Environment Variables

Required in Netlify:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_WEBHOOK_URL` | Make.com webhook URL | `https://hook.us1.make.com/abc123...` |

---

## Customization

### Update Staff Names

Edit `src/types/index.ts`:

```typescript
export const STAFF_MEMBERS = [
  'Unassigned',
  'Your Name',
  'Another Staff',
  'Team Member',
] as const
```

### Update Service Types

Edit `src/types/index.ts`:

```typescript
export const SERVICE_TYPES = [
  'Your Service 1',
  'Your Service 2',
  // ...
] as const
```

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Change these hex values
    600: '#2563eb',
    700: '#1d4ed8',
    // ...
  },
}
```

### Update CRM Link

Edit `src/App.tsx`, line 8:

```typescript
const handleViewCRM = () => {
  window.open('https://docs.google.com/spreadsheets/d/YOUR_ACTUAL_SHEET_ID', '_blank')
}
```

---

## Webhook Payload

The form sends this JSON to your webhook:

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "5551234567",
  "service_type": "Personal Tax Return",
  "source": "Phone Call",
  "referred_by": "Jane Doe",
  "notes": "Urgent - deadline approaching",
  "assigned_to": "Sarah Johnson",
  "timestamp": "2025-10-29T09:30:00.000Z",
  "submitted_by": "staff_user",
  "form_version": "staff_v1"
}
```

---

## Security

### Password Protection (Optional)

To add password protection:

1. Uncomment the redirect rules in `netlify.toml`
2. Or use Netlify's built-in password protection:
   - Site settings → Access control
   - Enable "Password Protection"
   - Set password: `TAXPREP2025`

### HTTPS

- Automatically enabled by Netlify
- Free SSL certificate
- Force HTTPS redirect enabled

---

## Troubleshooting

### Webhook Not Triggering

**Check:**
1. Environment variable set correctly in Netlify
2. Make.com scenario is "ON" (not paused)
3. Webhook URL doesn't have trailing slash

**Debug:**
Open browser console (F12) and look for:
```
Submitting to webhook: https://hook...
Payload: {...}
```

### CORS Error

In Make.com:
1. Go to webhook settings
2. Enable "CORS"
3. Add your Netlify domain to allowed origins

### Build Fails

Check that Node version is 18:
```toml
[build.environment]
  NODE_VERSION = "18"
```

### Form Data Not Saving

Check localStorage in browser DevTools:
- Application tab → Local Storage
- Look for `pendingSubmissions` and `recentClients`

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Sonner** - Toast notifications
- **Lucide React** - Icons

---

## License

MIT

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Make.com scenario logs
3. Check browser console for errors
4. Contact IT support

---

Made with ❤️ for tax preparation professionals
